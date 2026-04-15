import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { apiGet } from "../lib/api.js";
import { B, F } from "../lib/brand.js";
import Hero from "../components/Hero.jsx";
import KpiCard from "../components/atoms/KpiCard.jsx";
import Card from "../components/atoms/Card.jsx";
import Grid from "../components/atoms/Grid.jsx";
import Pill from "../components/atoms/Pill.jsx";
import Tbl from "../components/atoms/Tbl.jsx";

export default function VOverview() {
  const { getToken } = useAuth();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    // Fetch all 5 live endpoints in parallel
    Promise.all([
      apiGet("/api/elation/visit-volume",          getToken),
      apiGet("/api/elation/speed-to-care",         getToken),
      apiGet("/api/elation/language-equity",        getToken),
      apiGet("/api/elation/clinician-performance",  getToken),
      apiGet("/api/elation/compliance",             getToken),
    ])
      .then(([visitVolume, speedToCare, languageEquity, clinicianPerf, compliance]) => {
        if (!cancelled) {
          setData({ visitVolume, speedToCare, languageEquity, clinicianPerf, compliance });
          setLoading(false);
        }
      })
      .catch((e) => { if (!cancelled) { setError(e.message); setLoading(false); } });

    return () => { cancelled = true; };
  }, [getToken]);

  // ── Derived metrics ──────────────────────────────────────────────────────────
  const vv  = data?.visitVolume;
  const sc  = data?.speedToCare;
  const le  = data?.languageEquity;
  const cp  = data?.clinicianPerf;
  const co  = data?.compliance;

  const totalAppts   = vv?.total ?? "—";
  const activePh     = (cp?.byPhysician ?? []).filter(p => p.is_active).length || "—";
  const sameDayRate  = sc?.sameDayRate  != null ? sc.sameDayRate  : "—";
  const outlierFlags = co?.outlierCount != null ? co.outlierCount : "—";

  const avgLeadRaw   = sc?.avgLeadTimeHours;
  const avgLead      = avgLeadRaw != null
    ? avgLeadRaw >= 24 ? `${Math.round(avgLeadRaw / 24)}d` : `${avgLeadRaw}h`
    : "—";

  const inPerson  = vv?.byMode?.IN_PERSON ?? 0;
  const video     = vv?.byMode?.VIDEO     ?? 0;
  const modeTotal = inPerson + video || 1;
  const videoPct  = vv ? Math.round((video / modeTotal) * 100) : "—";

  const topLang = le?.summary?.find(s => s.visits > 0)?.lang ?? "—";
  const noShow  = sc?.noShowRate  != null ? sc.noShowRate  : "—";
  const signed  = co?.signedRate  != null ? co.signedRate  : "—";
  const repeat  = vv?.repeatRate  != null ? vv.repeatRate  : "—";

  const L = loading ? "…" : undefined; // shorthand for loading state

  // ── Hero KPIs (4 live metrics) ───────────────────────────────────────────────
  const heroKpis = [
    { label: "Total appointments", value: L ?? totalAppts, unit: undefined,    trend: "Elation — live" },
    { label: "Same-day bookings",  value: L ?? sameDayRate, unit: L ? "" : "%", trend: "booked & seen same day" },
    { label: "Active clinicians",  value: L ?? activePh,   unit: undefined,    trend: "in practice" },
    { label: "Open outlier flags", value: L ?? outlierFlags, unit: undefined,  trend: "compliance alerts" },
  ];

  // ── Module status table ──────────────────────────────────────────────────────
  const modules = [
    { name: "Visit Volume & Utilization", source: "Elation",    live: true,  metric: totalAppts !== "—" ? `${totalAppts} appointments` : "—" },
    { name: "Access & Speed-to-Care",     source: "Elation",    live: true,  metric: avgLead !== "—" ? `${avgLead} avg lead time` : "—" },
    { name: "Language & Equity",          source: "Elation",    live: true,  metric: topLang !== "—" ? `Top: ${topLang}` : "—" },
    { name: "Clinician Performance",      source: "Elation",    live: true,  metric: activePh !== "—" ? `${activePh} active clinicians` : "—" },
    { name: "Compliance & Risk",          source: "Elation",    live: true,  metric: outlierFlags !== "—" ? `${outlierFlags} outlier flags` : "—" },
    { name: "Clinical Outcomes",          source: "Patient forms", live: false, metric: "Awaiting GHL integration" },
    { name: "Patient Experience",         source: "Patient forms", live: false, metric: "Awaiting GHL integration" },
    { name: "Membership & Retention",     source: "Hint API",   live: false, metric: "Awaiting Hint credentials" },
    { name: "Revenue & Financial",        source: "Hint API",   live: false, metric: "Awaiting Hint credentials" },
    { name: "Operations & Support",       source: "RingCentral + GHL", live: false, metric: "Awaiting integration" },
    { name: "Growth & Funnel",            source: "GoHighLevel", live: false, metric: "Awaiting GHL integration" },
    { name: "B2B / Employer",             source: "Elation + Forms", live: false, metric: "Awaiting integration" },
  ];

  return (
    <div>
      <Hero kpis={heroKpis} />

      {error && (
        <div style={{ padding:"10px 14px", marginBottom:12, borderRadius:8, background:B.negBg, color:B.neg, fontSize:12, fontFamily:F }}>
          Error loading data: {error}
        </div>
      )}

      {/* At a glance — 6 live metrics from 5 endpoints */}
      <Grid cols={3} mb={12}>
        <KpiCard label="Avg booking lead time" value={L ?? avgLead}    subunit="scheduled vs created"   accent={B.ch.t} />
        <KpiCard label="Telehealth (video)"    value={L ?? videoPct}   unit={loading ? "" : "%"} subunit="of all appointments" accent={B.ch.g} />
        <KpiCard label="Top language"          value={L ?? topLang}    subunit="by visit volume"        accent={B.ch.g} />
        <KpiCard label="No-show rate"          value={L ?? noShow}     unit={loading ? "" : "%"} subunit="Not Seen"           accent={B.ch.r} />
        <KpiCard label="Notes signed"          value={L ?? signed}     unit={loading ? "" : "%"} subunit="visit notes"        accent={B.ch.t} />
        <KpiCard label="Repeat visit rate"     value={L ?? repeat}     unit={loading ? "" : "%"} subunit="patients 2+ visits" accent={B.ch.a} />
      </Grid>

      {/* Module integration status */}
      <Card title="Integration status — all modules" source="Elation API — live">
        <Tbl
          headers={["Module", "Data source", "Key metric", "Status"]}
          rows={modules.map(m => [
            m.name,
            m.source,
            loading && m.live ? "…" : m.metric,
            m.live
              ? <Pill type="success">Live</Pill>
              : <Pill type="neutral">Pending</Pill>,
          ])}
        />
      </Card>
    </div>
  );
}
