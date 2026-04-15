import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Bar } from "react-chartjs-2";
import { apiGet } from "../lib/api.js";
import { B, F } from "../lib/brand.js";
import Hero from "../components/Hero.jsx";
import Card from "../components/atoms/Card.jsx";
import Grid from "../components/atoms/Grid.jsx";
import Two from "../components/atoms/Two.jsx";

// ── Mini chart options (bare — no axes, no labels) ─────────────────────────
const CM = {
  responsive: true, maintainAspectRatio: false,
  animation: { duration: 700 },
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  scales: { x: { display: false }, y: { display: false } },
};

// ── Atoms ──────────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10, marginTop:6 }}>
      <span style={{ fontSize:10, fontWeight:700, color:B.t3, letterSpacing:"0.07em", textTransform:"uppercase", fontFamily:F, whiteSpace:"nowrap" }}>{children}</span>
      <div style={{ flex:1, height:1, background:B.border }} />
    </div>
  );
}


// Big primary KPI number
function KPI({ value, unit, label, color, dim }) {
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:"flex", alignItems:"baseline", gap:4 }}>
        <span style={{ fontSize:36, fontWeight:700, letterSpacing:"-0.03em", lineHeight:1, fontFamily:F, color: dim ? B.t4 : (color ?? B.t1) }}>
          {value}
        </span>
        {unit && <span style={{ fontSize:13, color: dim ? B.t4 : B.t3, fontFamily:F }}>{unit}</span>}
      </div>
      {label && <div style={{ fontSize:11, color: dim ? B.t4 : B.t3, fontFamily:F, marginTop:4 }}>{label}</div>}
    </div>
  );
}

// Horizontal progress bar row
function PBar({ label, value, unit="%", color, dim }) {
  const pct = Math.min(parseFloat(value) || 0, 100);
  return (
    <div style={{ marginBottom:9 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
        <span style={{ fontSize:11, color: dim ? B.t4 : B.t3, fontFamily:F }}>{label}</span>
        <span style={{ fontSize:11, fontWeight:600, color: dim ? B.t4 : B.t2, fontFamily:F }}>{value}{unit}</span>
      </div>
      <div style={{ height:5, background:B.border, borderRadius:3, overflow:"hidden" }}>
        <div style={{ width:`${pct}%`, height:"100%", background: dim ? B.border : (color ?? B.ch.g), borderRadius:3, transition:"width 0.8s ease" }} />
      </div>
    </div>
  );
}

// Mini language bar
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

// Metric row (pending placeholders)
function Metric({ label, value, unit }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid ${B.border}` }}>
      <span style={{ fontSize:11, color:B.t4, fontFamily:F }}>{label}</span>
      <span style={{ fontSize:12, fontWeight:700, color:B.t4, fontFamily:F }}>{value}{unit ? <span style={{ fontSize:10, fontWeight:400, marginLeft:2 }}>{unit}</span> : null}</span>
    </div>
  );
}

const LANG_COLORS = { Portuguese: B.ch.g, English: B.ch.t, Spanish: B.ch.a, Other: B.ch.s };
const spinner = (h=90) => (
  <div style={{ height:h, display:"flex", alignItems:"center", justifyContent:"center", color:B.t3, fontSize:12, fontFamily:F }}>Loading…</div>
);

// ── Main component ─────────────────────────────────────────────────────────
const REFRESH_MS = 10_000; // 10 segundos

export default function VOverview() {
  const { getToken } = useAuth();
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [countdown, setCountdown] = useState(REFRESH_MS / 1000);
  const cancelledRef = useRef(false);

  const fetchAll = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    setError(null);
    try {
      const [visitVolume, speedToCare, languageEquity, clinicianPerf, compliance] =
        await Promise.all([
          apiGet("/api/elation/visit-volume",         getToken),
          apiGet("/api/elation/speed-to-care",        getToken),
          apiGet("/api/elation/language-equity",       getToken),
          apiGet("/api/elation/clinician-performance", getToken),
          apiGet("/api/elation/compliance",            getToken),
        ]);
      if (!cancelledRef.current) {
        setData({ visitVolume, speedToCare, languageEquity, clinicianPerf, compliance });
        setLastUpdated(new Date());
        setLoading(false);
        setCountdown(REFRESH_MS / 1000);
      }
    } catch (e) {
      if (!cancelledRef.current) { setError(e.message); setLoading(false); }
    }
  }, [getToken]);

  // ── Fetch inicial + intervalo de 10s ──────────────────────────────────────
  useEffect(() => {
    cancelledRef.current = false;
    fetchAll(true);
    const interval = setInterval(() => fetchAll(false), REFRESH_MS);
    return () => { cancelledRef.current = true; clearInterval(interval); };
  }, [fetchAll]);

  // ── Countdown visual (decrementa a cada 1s) ───────────────────────────────
  useEffect(() => {
    const tick = setInterval(() => {
      setCountdown(c => (c <= 1 ? REFRESH_MS / 1000 : c - 1));
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  // ── Derived values ──────────────────────────────────────────────────────
  const vv = data?.visitVolume;
  const sc = data?.speedToCare;
  const le = data?.languageEquity;
  const cp = data?.clinicianPerf;
  const cm = data?.compliance;

  const totalAppts  = vv?.total ?? "—";
  const inPerson    = vv?.byMode?.IN_PERSON ?? 0;
  const video       = vv?.byMode?.VIDEO ?? 0;
  const modeTotal   = inPerson + video || 1;
  const videoPct    = vv ? Math.round((video / modeTotal) * 100) : "—";
  const repeatRate  = vv?.repeatRate ?? "—";

  const avgLeadRaw  = sc?.avgLeadTimeHours;
  const avgLead     = avgLeadRaw != null ? (avgLeadRaw >= 24 ? `${Math.round(avgLeadRaw / 24)}d` : `${avgLeadRaw}h`) : "—";
  const sameDayRate = sc?.sameDayRate     ?? "—";
  const noShowRate  = sc?.noShowRate      ?? "—";
  const cancelRate  = sc?.cancellationRate ?? "—";
  const avgDuration = sc?.avgDuration     ?? "—";

  const langSummary = le?.summary ?? [];

  const physicians  = (cp?.byPhysician ?? []).filter(p => p.is_active);
  const activePh    = physicians.length || "—";
  const avgVisits   = cp?.avgVisits ?? "—";
  const topPh       = [...physicians].sort((a, b) => b.stats.total - a.stats.total)[0];

  const docRate    = cm?.docRate    ?? "—";
  const signedRate = cm?.signedRate ?? "—";
  const outliers   = cm?.outlierCount ?? "—";

  // ── Visit volume — day-of-week chart ─────────────────────────────────────
  const DAY_ORDER  = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const DAY_SHORT  = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const byDay      = vv?.byDayOfWeek || {};
  const dayLabels  = DAY_ORDER.filter(d => byDay[d] != null).map((d,i) => DAY_SHORT[DAY_ORDER.indexOf(d)]);
  const dayValues  = DAY_ORDER.filter(d => byDay[d] != null).map(d => byDay[d]);
  const peakDIdx   = dayValues.length ? dayValues.indexOf(Math.max(...dayValues)) : -1;
  const dayColors  = dayValues.map((_, i) => i === peakDIdx ? B.ch.g : B.g200);

  // ── Appointments by hour chart ────────────────────────────────────────────
  const hourEntries = Object.entries(vv?.byHour || {}).sort((a, b) => +a[0] - +b[0]);
  const hourLabels  = hourEntries.map(([h]) => { const n=parseInt(h); return n===0?"12a":n<12?`${n}a`:n===12?"12p":`${n-12}p`; });
  const hourValues  = hourEntries.map(([, v]) => v);
  const peakHIdx    = hourValues.length ? hourValues.indexOf(Math.max(...hourValues)) : -1;
  const hourColors  = hourValues.map((_, i) => i === peakHIdx ? B.ch.t : B.g200);

  // ── Clinician chart ───────────────────────────────────────────────────────
  const topPhysicians = [...physicians].sort((a,b) => b.stats.total - a.stats.total).slice(0,6);
  const phLabels      = topPhysicians.map(p => p.name.split(" ").at(-1));
  const phValues      = topPhysicians.map(p => p.stats.total);
  const phColors      = phValues.map((_, i) => i===0 ? B.ch.g : B.g200);

  // ── Hero ─────────────────────────────────────────────────────────────────
  const L = loading ? "…" : undefined;
  const heroKpis = [
    { label:"Total appointments", value: L ?? totalAppts,  unit: undefined    },
    { label:"Same-day rate",      value: L ?? sameDayRate, unit: L ? "" : "%" },
    { label:"Active members",     value: "—",              unit: undefined    },
    { label:"Satisfaction",       value: "—",              unit: "/5"         },
  ];

  // ── Formata hora da última atualização ───────────────────────────────────
  const updatedStr = lastUpdated
    ? lastUpdated.toLocaleTimeString("pt-BR", { hour:"2-digit", minute:"2-digit", second:"2-digit" })
    : null;

  return (
    <div>
      <Hero kpis={heroKpis} />

      {/* ── Barra de status de atualização ─────────────────────────────────── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:10, marginBottom:10 }}>
        {updatedStr && (
          <span style={{ fontSize:10, color:B.t4, fontFamily:F }}>
            Atualizado às {updatedStr}
          </span>
        )}
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <div style={{ position:"relative", width:28, height:4, background:B.border, borderRadius:2, overflow:"hidden" }}>
            <div style={{
              position:"absolute", left:0, top:0, height:"100%", borderRadius:2,
              background: B.ch.g,
              width:`${(countdown / (REFRESH_MS / 1000)) * 100}%`,
              transition:"width 1s linear",
            }} />
          </div>
          <span style={{ fontSize:10, color:B.t4, fontFamily:F, width:14 }}>{countdown}s</span>
        </div>
      </div>

      {error && (
        <div style={{ padding:"10px 14px", marginBottom:12, borderRadius:8, background:B.negBg, color:B.neg, fontSize:12, fontFamily:F }}>
          Error: {error}
        </div>
      )}

      <Grid cols={3} mb={12}>

        {/* Visit Volume */}
        <Card title="Visit Volume">
          {loading ? spinner(180) : <>
            <KPI value={totalAppts} label="total appointments" color={B.ch.g} />
            {dayValues.length > 0 && (
              <div style={{ height:80, marginBottom:10 }}>
                <Bar data={{ labels:dayLabels, datasets:[{ data:dayValues, backgroundColor:dayColors, borderRadius:4 }] }} options={CM} />
              </div>
            )}
            <div style={{ display:"flex", gap:16, marginTop:4 }}>
              <span style={{ fontSize:11, color:B.t3, fontFamily:F }}>Video <b style={{color:B.t1}}>{videoPct}%</b></span>
              <span style={{ fontSize:11, color:B.t3, fontFamily:F }}>Repeat <b style={{color:B.t1}}>{repeatRate}%</b></span>
            </div>
          </>}
        </Card>

        {/* Access & Speed */}
        <Card title="Access & Speed">
          {loading ? spinner(180) : <>
            <KPI value={sameDayRate} unit="%" label="same-day rate" color={B.ch.g} />
            <PBar label="Same-day"    value={sameDayRate} color={B.ch.g} />
            <PBar label="No-show"     value={noShowRate}  color={B.ch.r} />
            <PBar label="Cancellation" value={cancelRate}  color={B.ch.a} />
            <div style={{ marginTop:8, fontSize:11, color:B.t3, fontFamily:F }}>
              Avg lead <b style={{color:B.t1}}>{avgLead}</b> · Duration <b style={{color:B.t1}}>{avgDuration}min</b>
            </div>
          </>}
        </Card>

        {/* Language & Equity */}
        <Card title="Language & Equity">
          {loading ? spinner(180) : (() => {
            const top = langSummary.filter(s => s.visits > 0).sort((a,b)=>b.pct-a.pct)[0];
            return <>
              <KPI value={top?.pct ?? "—"} unit={top ? "%" : ""} label={top ? `${top.lang} (primary)` : "no data"} color={LANG_COLORS[top?.lang]} />
              <div style={{ paddingTop:4 }}>
                {langSummary.filter(s => s.visits > 0).map(s => (
                  <LangBar key={s.lang} lang={s.lang} pct={s.pct} color={LANG_COLORS[s.lang] ?? B.ch.s} />
                ))}
              </div>
            </>;
          })()}
        </Card>

        {/* Clinician Performance */}
        <Card title="Clinician Performance">
          {loading ? spinner(180) : <>
            <KPI value={activePh} label="active clinicians" color={B.ch.g} />
            {phValues.length > 0 && (
              <div style={{ height:80, marginBottom:10 }}>
                <Bar data={{ labels:phLabels, datasets:[{ data:phValues, backgroundColor:phColors, borderRadius:4 }] }} options={CM} />
              </div>
            )}
            <div style={{ fontSize:11, color:B.t3, fontFamily:F }}>
              Avg <b style={{color:B.t1}}>{avgVisits}</b> visits/clinician
              {topPh && <> · Top: <b style={{color:B.ch.g}}>{topPh.name.split(" ").at(-1)}</b></>}
            </div>
          </>}
        </Card>

        {/* Compliance & Risk */}
        <Card title="Compliance & Risk">
          {loading ? spinner(180) : <>
            <KPI value={docRate} unit="%" label="documentation rate" color={docRate >= 90 ? B.ch.g : B.ch.a} />
            <PBar label="Documented" value={docRate}    color={B.ch.g} />
            <PBar label="Signed"     value={signedRate} color={B.ch.t} />
            <div style={{ marginTop:8, fontSize:11, color:B.t3, fontFamily:F }}>
              Outlier flags:&nbsp;
              <b style={{ color: outliers > 0 ? B.ch.a : B.ch.g }}>{outliers}</b>
            </div>
          </>}
        </Card>

      </Grid>

      {/* ── Hour & Day trend charts ────────────────────────────────────────── */}
      <SectionLabel>Appointment Trends</SectionLabel>
      <Two mb={12}>
        <Card title="By hour of day">
          {loading || hourValues.length === 0 ? spinner(160) : (
            <div style={{ height:160 }}>
              <Bar data={{ labels:hourLabels, datasets:[{ data:hourValues, backgroundColor:hourColors, borderRadius:4 }] }}
                   options={{ ...CM, scales:{ x:{ display:true, grid:{display:false}, border:{display:false}, ticks:{color:B.t4,font:{size:10,family:F}} }, y:{display:false} } }} />
            </div>
          )}
        </Card>
        <Card title="By day of week">
          {loading || dayValues.length === 0 ? spinner(160) : (
            <div style={{ height:160 }}>
              <Bar data={{ labels:dayLabels, datasets:[{ data:dayValues, backgroundColor:dayColors, borderRadius:4 }] }}
                   options={{ ...CM, scales:{ x:{ display:true, grid:{display:false}, border:{display:false}, ticks:{color:B.t4,font:{size:10,family:F}} }, y:{display:false} } }} />
            </div>
          )}
        </Card>
      </Two>

      {/* ── Pending ───────────────────────────────────────────────────────── */}
      <SectionLabel>Coming Soon</SectionLabel>
      <Grid cols={3} mb={0}>

        <Card title="Clinical Outcomes">
          <KPI value="—" label="ER / UC avoidance rate" dim />
          <Metric label="Resolved at 7 days"  value="—" unit="%" />
          <Metric label="Worsening rate"       value="—" unit="%" />
          <Metric label="Re-visit same issue"  value="—" unit="%" />
        </Card>

        <Card title="Patient Experience">
          <KPI value="—" unit="/5" label="satisfaction score (48h)" dim />
          <Metric label="Would recommend"   value="—" unit="%" />
          <Metric label="Complaints / 100"  value="—" />
          <Metric label="Repeat usage rate" value="—" unit="%" />
        </Card>

        <Card title="Membership">
          <KPI value="—" label="active members" dim />
          <Metric label="New members (MTD)"    value="—" />
          <Metric label="Monthly churn"        value="—" unit="%" />
          <Metric label="Avg tenure"           value="—" unit="mo" />
        </Card>

        <Card title="Revenue">
          <KPI value="—" label="revenue MTD" dim />
          <Metric label="Revenue per patient" value="—" />
          <Metric label="Failed payment rate" value="—" unit="%" />
          <Metric label="Refund rate"         value="—" unit="%" />
        </Card>

        <Card title="Operations & Support">
          <KPI value="—" unit="min" label="avg response time" dim />
          <Metric label="Follow-up completion" value="—" unit="%" />
          <Metric label="Messages per visit"   value="—" />
          <Metric label="Calls per visit"      value="—" />
        </Card>

        <Card title="Growth & Funnel">
          <KPI value="—" label="total leads MTD" dim />
          <Metric label="Lead → booked"      value="—" unit="%" />
          <Metric label="Lead → member"      value="—" unit="%" />
          <Metric label="Self-schedule rate" value="—" unit="%" />
        </Card>

        <Card title="B2B / Employer">
          <KPI value="—" label="active contracts" dim />
          <Metric label="Covered lives"    value="—" />
          <Metric label="ER avoidance avg" value="—" unit="%" />
          <Metric label="Avg satisfaction" value="—" unit="/5" />
        </Card>

      </Grid>
    </div>
  );
}
