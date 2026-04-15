import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { B, F } from "../lib/brand.js";
import { apiGet } from "../lib/api.js";
import KpiCard from "../components/atoms/KpiCard.jsx";
import Card from "../components/atoms/Card.jsx";
import Pill from "../components/atoms/Pill.jsx";
import Bar2 from "../components/atoms/Bar2.jsx";
import Grid from "../components/atoms/Grid.jsx";
import Two from "../components/atoms/Two.jsx";
import SecHeader from "../components/atoms/SecHeader.jsx";
import Tbl from "../components/atoms/Tbl.jsx";

export default function VCompliance() {
  const { getToken } = useAuth();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiGet("/api/elation/compliance", getToken)
      .then((d) => { if (!cancelled) { setData(d); setLoading(false); } })
      .catch((e) => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [getToken]);

  const PH_COLORS = [B.ch.g, B.ch.t, B.ch.a, B.g700, B.ch.s];

  const physicians   = (data?.byPhysician ?? []).filter(p => p.is_active);
  const outliers     = data?.outliers     ?? [];
  const docRate      = data?.docRate      ?? null;
  const signedRate   = data?.signedRate   ?? null;
  const totalNotes   = data?.totalNotes   ?? null;
  const outlierCount = data?.outlierCount ?? 0;

  // Scorecard bars — show 0 if null so the bar renders empty (not broken)
  const scorecard = [
    { label: "Follow-up documented %", value: docRate      ?? 0, color: docRate      != null ? (docRate      >= 80 ? B.ch.g : B.ch.a) : B.ch.s },
    { label: "Visit notes signed %",   value: signedRate   ?? 0, color: signedRate   != null ? (signedRate   >= 90 ? B.ch.g : B.ch.a) : B.ch.s },
  ];

  // Clinician table rows
  const phRows = physicians.map((ph, i) => {
    const s        = ph.stats;
    const flagType = s.noShowRate > 20 || s.cancelRate > 15 || (s.docRate != null && s.docRate < 80) ? "warning" : "success";
    const flagLbl  = flagType === "warning" ? "Review" : "OK";
    return [
      <span key={ph.id} style={{ display:"flex", alignItems:"center", gap:6 }}>
        <span style={{ width:8, height:8, borderRadius:"50%", background:PH_COLORS[i % PH_COLORS.length], flexShrink:0 }} />
        {ph.name}
      </span>,
      s.total,
      s.completed,
      `${s.noShowRate}%`,
      `${s.cancelRate}%`,
      s.docRate != null ? `${s.docRate}%` : "—",
      <Pill type={flagType}>{flagLbl}</Pill>,
    ];
  });

  // Outlier table rows
  const outlierRows = outliers.map((o, i) => [
    o.type,
    o.physician,
    `${o.value}${o.unit}`,
    `> ${o.threshold}${o.unit} threshold`,
    <Pill key={i} type="warning">Review</Pill>,
  ]);

  return (
    <div>
      <SecHeader title="Compliance & Risk" />

      {error && (
        <div style={{ padding:"10px 14px", marginBottom:12, borderRadius:8, background:B.negBg, color:B.neg, fontSize:12, fontFamily:F }}>
          Error loading data: {error}
        </div>
      )}

      <Grid cols={4} mb={12}>
        <KpiCard label="Follow-up documented"  value={loading ? "…" : (docRate    != null ? docRate    : "—")} unit={docRate    != null ? "%" : ""} subunit="completed appts" accent={B.ch.g} />
        <KpiCard label="Visit notes signed"    value={loading ? "…" : (signedRate != null ? signedRate : "—")} unit={signedRate != null ? "%" : ""} subunit="of all notes"    accent={B.ch.t} />
        <KpiCard label="Total visit notes"     value={loading ? "…" : (totalNotes != null ? totalNotes : "—")} subunit="in period"                                            accent={B.g700} />
        <KpiCard label="Open outlier flags"    value={loading ? "…" : outlierCount} subunit="active clinicians" accent={outlierCount > 0 ? B.ch.a : B.ch.g} />
      </Grid>

      <Two>
        <Card title="Compliance scorecard" source="Elation API — live">
          {loading ? (
            <div style={{ padding:12, color:B.t3, fontSize:12, fontFamily:F }}>Loading...</div>
          ) : (
            <div style={{ paddingTop:6 }}>
              {scorecard.map(m => (
                <Bar2 key={m.label} label={m.label} value={m.value} color={m.color} />
              ))}
              <p style={{ fontSize:11, color:B.t3, marginTop:12, fontFamily:F, lineHeight:1.6 }}>
                Documentation rate measures completed appointments with a linked visit note.<br />
                Signing rate measures visit notes marked as signed in Elation.
              </p>
            </div>
          )}
        </Card>

        <Card title="Outlier detection & flags" source="Elation API — live">
          {loading ? (
            <div style={{ padding:12, color:B.t3, fontSize:12, fontFamily:F }}>Loading...</div>
          ) : outliers.length === 0 ? (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"32px 0", gap:8 }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={B.ch.g} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>
              </svg>
              <span style={{ fontSize:12, color:B.t3, fontFamily:F }}>No outliers detected in this period</span>
            </div>
          ) : (
            <Tbl
              headers={["Flag type","Clinician","Value","Benchmark","Action"]}
              rows={outlierRows}
            />
          )}
        </Card>
      </Two>

      <Card title="Clinician compliance breakdown" source="Elation API — live" style={{ marginTop:12 }}>
        {loading ? (
          <div style={{ padding:12, color:B.t3, fontSize:12, fontFamily:F }}>Loading...</div>
        ) : physicians.length === 0 ? (
          <div style={{ padding:16, color:B.t3, fontSize:12, fontFamily:F }}>No clinician data available for this period.</div>
        ) : (
          <Tbl
            headers={["Clinician","Total visits","Completed","No-show %","Cancel %","Doc rate","Status"]}
            rows={phRows}
          />
        )}
      </Card>
    </div>
  );
}
