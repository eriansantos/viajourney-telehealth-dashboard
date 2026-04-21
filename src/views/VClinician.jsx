import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Line } from "react-chartjs-2";
import { B, F } from "../lib/brand.js";
import { co } from "../lib/chartOptions.js";
import { apiGet } from "../lib/api.js";
import KpiCard from "../components/atoms/KpiCard.jsx";
import Card from "../components/atoms/Card.jsx";
import Pill from "../components/atoms/Pill.jsx";
import Bar2 from "../components/atoms/Bar2.jsx";
import Lgnd from "../components/atoms/Lgnd.jsx";
import Grid from "../components/atoms/Grid.jsx";
import Two from "../components/atoms/Two.jsx";
import SecHeader from "../components/atoms/SecHeader.jsx";
import Tbl from "../components/atoms/Tbl.jsx";

export default function VClinician() {
  const { getToken } = useAuth();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiGet("/api/elation/clinician-performance", getToken)
      .then((d) => { if (!cancelled) { setData(d); setLoading(false); } })
      .catch((e) => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [getToken]);

  const PH_COLORS  = [B.ch.g, B.ch.t, B.ch.a, B.g700, B.ch.s];

  const physicians = (data?.byPhysician ?? []).filter(p => p.is_active);
  const totalPh    = physicians.length;
  const avgVisits  = data?.avgVisits ?? "—";
  const topPh      = [...physicians].sort((a,b) => b.stats.total - a.stats.total)[0];

  // Monthly trend: collect all months, sort, build dataset per physician
  const allMonths = [...new Set(physicians.flatMap(p => Object.keys(p.stats.byMonth || {})))].sort();
  const trendData = {
    labels: allMonths.map(m => {
      const [y, mo] = m.split("-");
      return new Date(+y, +mo - 1).toLocaleString("en-US", { month:"short", year:"2-digit" });
    }),
    datasets: physicians.map((ph, i) => ({
      label: ph.name,
      data:  allMonths.map(m => ph.stats.byMonth?.[m] ?? 0),
      borderColor:       PH_COLORS[i % PH_COLORS.length],
      backgroundColor:   PH_COLORS[i % PH_COLORS.length],
      tension: 0.4, pointRadius: 3,
      pointBackgroundColor: PH_COLORS[i % PH_COLORS.length],
      pointBorderColor: "#fff", pointBorderWidth: 2,
    })),
  };

  // Performance table rows — metrics pre-calculated by transformer
  const phRows = physicians.map((ph, i) => {
    const s        = ph.stats;
    const compPct  = s.completionRate   ?? 0;
    const flag     = compPct >= 80 ? "success" : compPct >= 60 ? "warning" : "danger";
    const flagLbl  = compPct >= 80 ? "Strong"  : compPct >= 60 ? "Review"  : "Low";
    const abxLabel = s.antibioticRate != null ? `${s.antibioticRate}%` : "No Rx data";
    return [
      <span style={{ display:"flex", alignItems:"center", gap:6 }}>
        <span style={{ width:8, height:8, borderRadius:"50%", background:PH_COLORS[i % PH_COLORS.length], flexShrink:0 }} />
        {ph.name}
      </span>,
      ph.credentials || "—",
      s.total,
      `${compPct}%`,
      `${s.cancellationRate ?? 0}%`,
      `${s.noShowRate ?? 0}%`,
      abxLabel,
      <Pill type={flag}>{flagLbl}</Pill>,
    ];
  });

  const phNames      = physicians.map(p => p.name.split(" ").slice(-1)[0]);
  const compValues   = physicians.map(p => p.stats.completionRate   ?? 0);
  const cancelValues = physicians.map(p => p.stats.cancellationRate ?? 0);

  return (
    <div>
      <SecHeader tag="Module 9 · Internal" title="Clinician Performance" desc="Quality and consistency coaching — internal use only, not punitive." />

      {error && (
        <div style={{ padding:"10px 14px", marginBottom:12, borderRadius:8, background:B.negBg, color:B.neg, fontSize:12, fontFamily:F }}>
          Error loading data: {error}
        </div>
      )}

      <Grid cols={4}>
        <KpiCard label="Active clinicians"    value={loading ? "…" : totalPh}                         subunit="in practice"           accent={B.ch.g} />
        <KpiCard label="Avg visits/clinician" value={loading ? "…" : avgVisits}                       subunit="total period"          accent={B.ch.t} />
        <KpiCard label="Top performer"        value={loading ? "…" : (topPh?.name.split(" ").at(-1) ?? "—")} subunit={`${topPh?.stats.total ?? 0} visits`} accent={B.ch.g} />
        <KpiCard label="Total appointments"   value={loading ? "…" : (data?.total ?? "—")}            subunit="all clinicians"        accent={B.g700} />
      </Grid>

      <Card title="Visit volume per clinician — monthly trend">
        {loading ? (
          <div style={{ height:220, display:"flex", alignItems:"center", justifyContent:"center", color:B.t3, fontSize:12, fontFamily:F }}>Loading...</div>
        ) : allMonths.length === 0 ? (
          <div style={{ height:220, display:"flex", alignItems:"center", justifyContent:"center", color:B.t3, fontSize:12, fontFamily:F }}>No monthly data yet</div>
        ) : (
          <>
            <Lgnd items={physicians.map((ph,i) => ({ label:ph.name, color:PH_COLORS[i % PH_COLORS.length] }))} />
            <div style={{ height:220 }}><Line data={trendData} options={co()} /></div>
          </>
        )}
      </Card>

      <Card title="Clinician performance matrix" style={{ marginTop:12 }}>
        {loading ? (
          <div style={{ padding:12, color:B.t3, fontSize:12, fontFamily:F }}>Loading...</div>
        ) : (
          <Tbl
            headers={["Clinician","Credentials","Total visits","Completion %","Cancellation %","No-show %","Antibiotic Rx %","Status"]}
            rows={phRows}
          />
        )}
      </Card>

      <Two style={{ marginTop:12 }}>
        <Card title="Completion rate by clinician">
          {loading ? (
            <div style={{ padding:12, color:B.t3, fontSize:12, fontFamily:F }}>Loading...</div>
          ) : (
            <div>
              {physicians.map((ph, i) => (
                <Bar2 key={ph.id} label={phNames[i]} value={compValues[i]} color={PH_COLORS[i % PH_COLORS.length]} />
              ))}
            </div>
          )}
        </Card>
        <Card title="Cancellation rate by clinician">
          {loading ? (
            <div style={{ padding:12, color:B.t3, fontSize:12, fontFamily:F }}>Loading...</div>
          ) : (
            <div>
              {physicians.map((ph, i) => (
                <Bar2 key={ph.id} label={phNames[i]} value={cancelValues[i]} color={PH_COLORS[i % PH_COLORS.length]} />
              ))}
            </div>
          )}
        </Card>
      </Two>
    </div>
  );
}
