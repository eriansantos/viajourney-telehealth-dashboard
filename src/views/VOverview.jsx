import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Bar } from "react-chartjs-2";
import { apiGet } from "../lib/api.js";
import { B, F } from "../lib/brand.js";
import { co } from "../lib/chartOptions.js";
import Hero from "../components/Hero.jsx";
import Card from "../components/atoms/Card.jsx";
import Grid from "../components/atoms/Grid.jsx";
import Two from "../components/atoms/Two.jsx";

// ── Inline metric row inside a domain card ────────────────────────────────────
function Metric({ label, value, unit, accent }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 0", borderBottom:`1px solid ${B.border}` }}>
      <span style={{ fontSize:12, color:B.t2, fontFamily:F }}>{label}</span>
      <span style={{ fontSize:14, fontWeight:700, color: accent ?? B.t1, fontFamily:F, letterSpacing:"-0.01em" }}>
        {value}{unit ? <span style={{ fontSize:11, fontWeight:500, color:B.t3, marginLeft:2 }}>{unit}</span> : null}
      </span>
    </div>
  );
}

// ── Language mini bar ─────────────────────────────────────────────────────────
function LangBar({ lang, pct, color }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
      <span style={{ fontSize:11, color:B.t2, fontFamily:F, width:80, flexShrink:0 }}>{lang}</span>
      <div style={{ flex:1, height:5, background:B.bg, borderRadius:3, overflow:"hidden" }}>
        <div style={{ width:`${pct}%`, height:"100%", background:color, borderRadius:3, transition:"width 0.8s ease" }} />
      </div>
      <span style={{ fontSize:11, fontWeight:600, color:B.t1, fontFamily:F, width:28, textAlign:"right" }}>{pct}%</span>
    </div>
  );
}

const LANG_COLORS = { Portuguese: B.ch.g, English: B.ch.t, Spanish: B.ch.a, Other: B.ch.s };

export default function VOverview() {
  const { getToken } = useAuth();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      apiGet("/api/elation/visit-volume",         getToken),
      apiGet("/api/elation/speed-to-care",        getToken),
      apiGet("/api/elation/language-equity",       getToken),
      apiGet("/api/elation/clinician-performance", getToken),
      apiGet("/api/elation/compliance",            getToken),
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

  // ── Derived metrics ───────────────────────────────────────────────────────────
  const vv = data?.visitVolume;
  const sc = data?.speedToCare;
  const le = data?.languageEquity;
  const cp = data?.clinicianPerf;
  const cm = data?.compliance;

  const totalAppts  = vv?.total ?? "—";
  const physicians  = (cp?.byPhysician ?? []).filter(p => p.is_active);
  const activePh    = physicians.length || "—";
  const topPh       = [...physicians].sort((a, b) => b.stats.total - a.stats.total)[0];
  const avgVisits   = cp?.avgVisits ?? "—";

  const avgLeadRaw  = sc?.avgLeadTimeHours;
  const avgLead     = avgLeadRaw != null
    ? avgLeadRaw >= 24 ? `${Math.round(avgLeadRaw / 24)}d` : `${avgLeadRaw}h`
    : "—";
  const sameDayRate = sc?.sameDayRate     ?? "—";
  const noShowRate  = sc?.noShowRate      ?? "—";
  const cancelRate  = sc?.cancellationRate ?? "—";
  const avgDuration = sc?.avgDuration     ?? "—";

  const inPerson  = vv?.byMode?.IN_PERSON ?? 0;
  const video     = vv?.byMode?.VIDEO     ?? 0;
  const modeTotal = inPerson + video || 1;
  const videoPct  = vv ? Math.round((video / modeTotal) * 100) : "—";
  const repeatRate = vv?.repeatRate ?? "—";
  const peakHour   = vv?.peakHour  ?? "—";
  const peakDay    = vv?.peakDay   ?? "—";

  const langSummary = le?.summary ?? [];

  const docRate    = cm?.docRate    ?? "—";
  const signedRate = cm?.signedRate ?? "—";
  const outliers   = cm?.outlierCount ?? "—";

  // ── Peak hour chart ───────────────────────────────────────────────────────────
  const hourEntries = Object.entries(vv?.byHour || {}).sort((a, b) => +a[0] - +b[0]);
  const hourLabels  = hourEntries.map(([h]) => {
    const n = parseInt(h);
    return n === 0 ? "12 AM" : n < 12 ? `${n} AM` : n === 12 ? "12 PM" : `${n-12} PM`;
  });
  const hourValues  = hourEntries.map(([, v]) => v);
  const peakIdx     = hourValues.indexOf(Math.max(...hourValues));
  const hourColors  = hourValues.map((_, i) => i === peakIdx ? B.ch.g : B.border);

  // ── Peak day chart ────────────────────────────────────────────────────────────
  const DAY_ORDER = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const byDay     = vv?.byDayOfWeek || {};
  const dayLabels = DAY_ORDER.filter(d => byDay[d] != null);
  const dayValues = dayLabels.map(d => byDay[d]);
  const peakDIdx  = dayValues.indexOf(Math.max(...dayValues));
  const dayColors = dayValues.map((_, i) => i === peakDIdx ? B.ch.t : B.border);

  const L = loading ? "…" : undefined;

  // ── Hero KPIs ─────────────────────────────────────────────────────────────────
  const heroKpis = [
    { label:"Total appointments",  value: L ?? totalAppts,  unit: undefined,     trend:"Elation — live" },
    { label:"Same-day bookings",   value: L ?? sameDayRate, unit: L ? "" : "%",  trend:"booked & seen same day" },
    { label:"Active clinicians",   value: L ?? activePh,    unit: undefined,     trend:"in practice" },
    { label:"Open outlier flags",  value: L ?? outliers,    unit: undefined,     trend:"compliance alerts" },
  ];

  const spinner = (h = 120) => (
    <div style={{ height:h, display:"flex", alignItems:"center", justifyContent:"center", color:B.t3, fontSize:12, fontFamily:F }}>
      Loading…
    </div>
  );

  return (
    <div>
      <Hero kpis={heroKpis} />

      {error && (
        <div style={{ padding:"10px 14px", marginBottom:12, borderRadius:8, background:B.negBg, color:B.neg, fontSize:12, fontFamily:F }}>
          Error: {error}
        </div>
      )}

      {/* ── 4 domain snapshot cards ─────────────────────────────────────────── */}
      <Grid cols={4} mb={12}>

        {/* Access & Speed */}
        <Card title="Access & Speed">
          {loading ? spinner() : <>
            <Metric label="Avg lead time"     value={avgLead}                                  accent={B.ch.t} />
            <Metric label="Same-day rate"     value={sameDayRate}     unit="%"                 accent={B.ch.g} />
            <Metric label="Avg duration"      value={avgDuration}     unit="min"               accent={B.t1}   />
            <Metric label="Cancellation"      value={cancelRate}      unit="%"                 accent={B.ch.a} />
            <Metric label="No-show rate"      value={noShowRate}      unit="%"                 accent={B.ch.r} />
          </>}
        </Card>

        {/* Visit Volume */}
        <Card title="Visit Volume">
          {loading ? spinner() : <>
            <Metric label="Total appointments" value={totalAppts}                              accent={B.ch.g} />
            <Metric label="Telehealth (video)" value={videoPct}       unit="%"                accent={B.ch.t} />
            <Metric label="Repeat visit rate"  value={repeatRate}     unit="%"                accent={B.ch.a} />
            <Metric label="Peak hour"          value={peakHour}                               accent={B.t1}   />
            <Metric label="Peak day"           value={peakDay}                                accent={B.t1}   />
          </>}
        </Card>

        {/* Language & Equity */}
        <Card title="Language & Equity">
          {loading ? spinner() : (
            <div style={{ paddingTop:6 }}>
              {langSummary.filter(s => s.visits > 0).map(s => (
                <LangBar key={s.lang} lang={s.lang} pct={s.pct} color={LANG_COLORS[s.lang] ?? B.ch.s} />
              ))}
              {langSummary.every(s => s.visits === 0) && (
                <span style={{ fontSize:12, color:B.t3, fontFamily:F }}>No data</span>
              )}
            </div>
          )}
        </Card>

        {/* Clinician & Compliance */}
        <Card title="Clinicians & Compliance">
          {loading ? spinner() : <>
            <Metric label="Active clinicians"  value={activePh}                               accent={B.ch.g} />
            <Metric label="Avg visits"         value={avgVisits}      unit="/ clinician"      accent={B.t1}   />
            <Metric label="Top performer"      value={topPh?.name?.split(" ").at(-1) ?? "—"}  accent={B.ch.g} />
            <Metric label="Notes signed"       value={signedRate}     unit="%"                accent={B.ch.t} />
            <Metric label="Outlier flags"      value={outliers}       unit={outliers === 1 ? " flag" : " flags"} accent={outliers > 0 ? B.ch.a : B.ch.g} />
          </>}
        </Card>
      </Grid>

      {/* ── Peak charts ─────────────────────────────────────────────────────── */}
      <Two>
        <Card title="Appointments by hour" source="Elation API — live">
          {loading ? spinner(180) : hourValues.length === 0 ? spinner(180) : (
            <div style={{ height:180 }}>
              <Bar
                data={{ labels: hourLabels, datasets:[{ data: hourValues, backgroundColor: hourColors, borderRadius:4 }] }}
                options={co()}
              />
            </div>
          )}
        </Card>

        <Card title="Appointments by day of week" source="Elation API — live">
          {loading ? spinner(180) : dayValues.length === 0 ? spinner(180) : (
            <div style={{ height:180 }}>
              <Bar
                data={{ labels: dayLabels, datasets:[{ data: dayValues, backgroundColor: dayColors, borderRadius:4 }] }}
                options={co()}
              />
            </div>
          )}
        </Card>
      </Two>
    </div>
  );
}
