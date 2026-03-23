/**
 * Via Journey Telehealth — Clinical Dashboard v5.0
 *
 * Fixes: full-viewport layout, Inter font, no colored icons, clean proportional typography
 *
 * npm install chart.js react-chartjs-2
 */

import { useState, useEffect, useRef } from "react";
import { useClerk, useAuth } from "@clerk/clerk-react";
import { apiGet } from "./lib/api.js";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Tooltip, Legend as ChartJSLegend, Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Tooltip, ChartJSLegend, Filler
);

// ─── Brand palette ──────────────────────────────────────────────────────────
const B = {
  g900: "#0A3520", g800: "#0D4A28", g700: "#145C32",
  g600: "#1B7A3E", g500: "#2E9E58", g400: "#4CC87A",
  g300: "#7DDFA0", g200: "#B8F0CE", g100: "#E0F7EA", g50: "#F2FBF5",
  white:  "#FFFFFF",
  bg:     "#F4F6F4",
  sbg:    "#FFFFFF",
  border: "#E4EAE4",
  borderM:"#C8D4C8",
  t1: "#0F1F0F",
  t2: "#3D5040",
  t3: "#7A927A",
  t4: "#B0C2B0",
  pos:   "#1B7A3E", posBg: "#E6F7ED",
  warn:  "#92560A", warnBg:"#FEF3C7",
  neg:   "#B91C1C", negBg: "#FEF2F2",
  info:  "#1447A0", infoBg:"#EBF3FF",
  ch: { g:"#2E9E58", t:"#0B8A7A", a:"#D97706", r:"#DC2626", s:"#94A3B8" },
};

const F = "'Inter', system-ui, sans-serif";

// ─── Chart options ──────────────────────────────────────────────────────────
const co = (ov={}) => ({
  responsive:true, maintainAspectRatio:false,
  plugins:{
    legend:{display:false},
    tooltip:{ backgroundColor:B.g900, titleColor:"#fff", bodyColor:B.g300, cornerRadius:8, padding:10, boxPadding:4, titleFont:{family:F,size:12,weight:"600"}, bodyFont:{family:F,size:11} },
  },
  scales:{
    x:{ grid:{display:false}, border:{display:false}, ticks:{color:B.t4,font:{size:11,family:F}} },
    y:{ grid:{color:"#EFF2EF"}, border:{display:false}, ticks:{color:B.t4,font:{size:11,family:F}} },
  },
  ...ov,
});
const coS = () => ({ ...co(), scales:{ ...co().scales, x:{...co().scales.x,stacked:true}, y:{...co().scales.y,stacked:true} } });
const coP = (min=60) => ({ ...co(), scales:{ ...co().scales, y:{...co().scales.y,min,max:100,ticks:{...co().scales.y.ticks,callback:v=>v+"%"}} } });
const coD = () => ({ responsive:true, maintainAspectRatio:false, cutout:"70%", plugins:{ legend:{display:false}, tooltip:{ backgroundColor:B.g900,titleColor:"#fff",bodyColor:B.g300,cornerRadius:8,padding:10 } } });

// ─── Data ───────────────────────────────────────────────────────────────────
const WK=["W1","W2","W3","W4","W5","W6","W7","W8"];
const MO=["Oct","Nov","Dec","Jan","Feb","Mar"];
const D={
  visits:    {labels:WK,datasets:[{label:"Member",   data:[98,102,108,112,118,124,130,107],backgroundColor:B.ch.g,stack:"v",borderRadius:3},{label:"Concierge",data:[38,40,42,44,46,48,50,44],backgroundColor:B.ch.t,stack:"v",borderRadius:3},{label:"One-time", data:[22,24,26,28,30,32,33,33],backgroundColor:B.ch.a,stack:"v",borderRadius:3}]},
  members:   {labels:MO,datasets:[{label:"Active",data:[254,268,280,291,301,312],borderColor:B.ch.g,backgroundColor:"rgba(46,158,88,0.07)",fill:true,tension:0.4,pointRadius:4,pointBackgroundColor:B.ch.g,pointBorderColor:"#fff",pointBorderWidth:2}]},
  vtypes:    {labels:["Member","Concierge","One-time"],datasets:[{data:[58,24,18],backgroundColor:[B.ch.g,B.ch.t,B.ch.a],borderWidth:0,hoverOffset:6}]},
  peak:      {labels:["8am","9am","10am","11am","12pm","1pm","2pm","3pm","4pm","5pm","6pm"],datasets:[{data:[12,28,34,31,26,24,29,32,27,18,8],backgroundColor:["#E4EAE4","#E4EAE4",B.ch.g,"#E4EAE4","#E4EAE4","#E4EAE4","#E4EAE4",B.ch.g,"#E4EAE4","#E4EAE4","#E4EAE4"],borderRadius:5}]},
  speed:     {labels:["VJ → appt","VJ → clinician","Urgent Care","ER","PCP appt"],datasets:[{data:[1.8,0.37,1.1,4.2,72],backgroundColor:[B.ch.g,B.ch.t,B.ch.a,B.ch.r,"#CBD5E0"],borderRadius:5}]},
  access:    {labels:WK,datasets:[{label:"Same day",data:[86,87,88,90,91,90,92,91],borderColor:B.ch.t,tension:0.4,pointRadius:3,pointBackgroundColor:B.ch.t,pointBorderColor:"#fff",pointBorderWidth:2},{label:"Within 24h",data:[96,96,97,97,98,98,98,98],borderColor:B.ch.g,tension:0.4,pointRadius:3,pointBackgroundColor:B.ch.g,pointBorderColor:"#fff",pointBorderWidth:2}]},
  erAvoid:   {labels:MO,datasets:[{data:[72,74,75,76,77,78],backgroundColor:B.ch.g,borderRadius:5}]},
  mGrow:     {labels:MO,datasets:[{label:"New",data:[28,31,30,34,36,38],backgroundColor:B.ch.g,borderRadius:4,stack:"g"},{label:"Cancelled",data:[-8,-9,-7,-10,-9,-7],backgroundColor:B.ch.r,borderRadius:4,stack:"g"}]},
  sat:       {labels:["1★","2★","3★","4★","5★"],datasets:[{data:[1,2,4,12,81],backgroundColor:[B.ch.r,B.ch.a,"#CBD5E0",B.ch.t,B.ch.g],borderRadius:4}]},
  ops:       {labels:WK,datasets:[{label:"Calls/visit",data:[1.1,1.0,0.9,0.9,0.8,0.8,0.8,0.8],borderColor:B.ch.a,tension:0.4,pointRadius:3,pointBackgroundColor:B.ch.a,pointBorderColor:"#fff",pointBorderWidth:2},{label:"Msgs/visit",data:[2.8,2.7,2.6,2.5,2.4,2.3,2.3,2.3],borderColor:B.ch.g,tension:0.4,pointRadius:3,pointBackgroundColor:B.ch.g,pointBorderColor:"#fff",pointBorderWidth:2}]},
  // Module 1 – Growth & Funnel
  leadSrc:   {labels:["Website","WhatsApp","Referral","Employer","Ads","Other"],datasets:[{data:[38,26,18,10,6,2],backgroundColor:[B.ch.g,B.ch.t,B.ch.a,B.g700,B.ch.s,B.t4],borderRadius:5}]},
  convTrend: {labels:MO,datasets:[{label:"Lead→Member %",data:[4.2,4.8,5.1,5.6,6.0,6.4],borderColor:B.ch.g,backgroundColor:"rgba(46,158,88,0.07)",fill:true,tension:0.4,pointRadius:3,pointBackgroundColor:B.ch.g,pointBorderColor:"#fff",pointBorderWidth:2},{label:"Lead→Booked %",data:[28,30,31,33,35,37],borderColor:B.ch.t,tension:0.4,pointRadius:3,pointBackgroundColor:B.ch.t,pointBorderColor:"#fff",pointBorderWidth:2}]},
  // Module 6 – Revenue
  revPlan:   {labels:["Standard Member","Concierge","One-time","Employer"],datasets:[{data:[44,28,18,10],backgroundColor:[B.ch.g,B.ch.t,B.ch.a,B.g700],borderWidth:0,hoverOffset:6}]},
  revTrend:  {labels:MO,datasets:[{label:"Revenue",data:[52400,58200,63800,69100,74300,81600],borderColor:B.ch.g,backgroundColor:"rgba(46,158,88,0.07)",fill:true,tension:0.4,pointRadius:4,pointBackgroundColor:B.ch.g,pointBorderColor:"#fff",pointBorderWidth:2}]},
  // Module 8 – Language
  langVis:   {labels:["Portuguese","English","Spanish","Other"],datasets:[{data:[54,28,15,3],backgroundColor:[B.ch.g,B.ch.t,B.ch.a,B.ch.s],borderWidth:0,hoverOffset:6}]},
  langTime:  {labels:["Portuguese","English","Spanish","Other"],datasets:[{label:"Median time-to-care (h)",data:[1.7,1.9,2.1,2.4],backgroundColor:[B.ch.g,B.ch.t,B.ch.a,B.ch.s],borderRadius:5}]},
  // Module 9 – Clinician
  clinicVis: {labels:MO,datasets:[{label:"Dr. Melo",data:[142,158,164,170,178,188],borderColor:B.ch.g,tension:0.4,pointRadius:3,pointBackgroundColor:B.ch.g,pointBorderColor:"#fff",pointBorderWidth:2},{label:"Dr. Santos",data:[98,104,112,118,124,130],borderColor:B.ch.t,tension:0.4,pointRadius:3,pointBackgroundColor:B.ch.t,pointBorderColor:"#fff",pointBorderWidth:2},{label:"NP Rivera",data:[76,80,84,88,92,94],borderColor:B.ch.a,tension:0.4,pointRadius:3,pointBackgroundColor:B.ch.a,pointBorderColor:"#fff",pointBorderWidth:2}]},
};

// ─── Atoms ──────────────────────────────────────────────────────────────────

function HeroKpi({ label, value, unit, trend }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.13)", borderRadius:10, padding:"14px 18px", border:"1px solid rgba(255,255,255,0.18)" }}>
      <p style={{ fontSize:11, fontWeight:600, color:"rgba(255,255,255,0.6)", margin:"0 0 6px", letterSpacing:"0.05em", textTransform:"uppercase", fontFamily:F }}>{label}</p>
      <div style={{ display:"flex", alignItems:"baseline", gap:3 }}>
        <span style={{ fontSize:26, fontWeight:700, color:"#fff", fontFamily:F, letterSpacing:"-0.02em", lineHeight:1 }}>{value}</span>
        {unit && <span style={{ fontSize:13, color:"rgba(255,255,255,0.65)", fontFamily:F }}>{unit}</span>}
      </div>
      {trend && <p style={{ fontSize:11, fontWeight:500, color:"rgba(255,255,255,0.75)", margin:"5px 0 0", fontFamily:F }}>{trend}</p>}
    </div>
  );
}

function KpiCard({ label, value, unit, subunit, trend, trendBad, accent }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:B.white, borderRadius:10, border:`1px solid ${hov?B.borderM:B.border}`, padding:"14px 16px", position:"relative", overflow:"hidden", boxShadow:hov?"0 4px 14px rgba(27,122,62,0.07)":"0 1px 2px rgba(0,0,0,0.04)", transform:hov?"translateY(-1px)":"none", transition:"all 0.15s" }}
    >
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:accent||B.ch.g, borderRadius:"10px 10px 0 0" }} />
      <p style={{ fontSize:10, fontWeight:600, color:B.t3, margin:"2px 0 7px", letterSpacing:"0.05em", textTransform:"uppercase", fontFamily:F }}>{label}</p>
      <div style={{ display:"flex", alignItems:"baseline", gap:3 }}>
        <span style={{ fontSize:24, fontWeight:700, color:B.t1, lineHeight:1, fontFamily:F, letterSpacing:"-0.02em" }}>{value}</span>
        {unit && <span style={{ fontSize:12, color:B.t2, fontFamily:F, fontWeight:500 }}>{unit}</span>}
      </div>
      {subunit && <p style={{ fontSize:11, color:B.t3, margin:"2px 0 0", fontFamily:F }}>{subunit}</p>}
      {trend && <p style={{ fontSize:11, fontWeight:600, color:trendBad?B.neg:B.pos, margin:"5px 0 0", fontFamily:F }}>{trend}</p>}
    </div>
  );
}

function Card({ title, source, children, style }) {
  return (
    <div style={{ background:B.white, borderRadius:10, border:`1px solid ${B.border}`, padding:"16px 18px", boxShadow:"0 1px 2px rgba(0,0,0,0.04)", ...style }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <span style={{ fontSize:13, fontWeight:600, color:B.t1, fontFamily:F, letterSpacing:"-0.01em" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function Pill({ children, type="success" }) {
  const m={ success:[B.posBg,B.pos], warning:[B.warnBg,B.warn], danger:[B.negBg,B.neg], info:[B.infoBg,B.info], neutral:[B.bg,B.t3] };
  const [bg,color]=m[type]||m.success;
  return <span style={{ display:"inline-flex", alignItems:"center", fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:20, background:bg, color, fontFamily:F }}>{children}</span>;
}

function Bar2({ label, value, color }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
      <span style={{ fontSize:12, color:B.t2, width:160, flexShrink:0, fontFamily:F }}>{label}</span>
      <div style={{ flex:1, height:6, background:B.bg, borderRadius:3, overflow:"hidden" }}>
        <div style={{ width:`${value}%`, height:"100%", background:color||B.ch.g, borderRadius:3, transition:"width 1s ease" }} />
      </div>
      <span style={{ fontSize:12, fontWeight:600, color:B.t1, width:32, textAlign:"right", fontFamily:F }}>{value}%</span>
    </div>
  );
}

function Notice({ type="info", children }) {
  const m={ info:[B.infoBg,B.info], warning:[B.warnBg,B.warn], success:[B.posBg,B.pos] };
  const [bg,color]=m[type]||m.info;
  return (
    <div style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"10px 14px", borderRadius:8, background:bg, border:`1px solid ${color}25`, marginBottom:14 }}>
      <div style={{ width:6, height:6, borderRadius:"50%", background:color, flexShrink:0, marginTop:4 }} />
      <span style={{ fontSize:12, color, lineHeight:1.6, fontFamily:F, fontWeight:500 }}>{children}</span>
    </div>
  );
}

function SecHeader({ title }) {
  return (
    <div style={{ marginBottom:18 }}>
      <h2 style={{ fontSize:18, fontWeight:700, color:B.t1, margin:0, fontFamily:F, letterSpacing:"-0.02em" }}>{title}</h2>
    </div>
  );
}

function Tbl({ headers, rows }) {
  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%", fontSize:12, borderCollapse:"collapse" }}>
        <thead><tr style={{ background:B.bg }}>{headers.map((h,i)=><th key={i} style={{ fontSize:10,fontWeight:600,color:B.t3,textAlign:"left",padding:"8px 12px",borderBottom:`1px solid ${B.border}`,textTransform:"uppercase",letterSpacing:"0.05em",fontFamily:F,whiteSpace:"nowrap" }}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((row,i)=><tr key={i} onMouseEnter={e=>e.currentTarget.style.background=B.g50} onMouseLeave={e=>e.currentTarget.style.background="transparent"} style={{ transition:"background 0.1s" }}>{row.map((cell,j)=><td key={j} style={{ padding:"9px 12px",borderBottom:i<rows.length-1?`1px solid ${B.border}`:"none",color:j===0?B.t1:B.t2,fontWeight:j===0?600:400,fontFamily:F,whiteSpace:"nowrap" }}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function Lgnd({ items }) {
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:12, marginBottom:10 }}>
      {items.map(({label,color})=>(
        <span key={label} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:B.t2, fontFamily:F, fontWeight:500 }}>
          <span style={{ width:10, height:10, borderRadius:3, background:color }} />{label}
        </span>
      ))}
    </div>
  );
}

function Grid({ children, cols=4, mb=14 }) {
  return <div style={{ display:"grid", gridTemplateColumns:`repeat(auto-fit,minmax(${cols<=3?190:148}px,1fr))`, gap:10, marginBottom:mb }}>{children}</div>;
}
function Two({ children, mb=12, align }) {
  return <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:mb, alignItems:align||"stretch" }}>{children}</div>;
}
function Soon({ title, desc, sources }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"56px 24px", textAlign:"center", background:B.white, borderRadius:10, border:`1.5px dashed ${B.borderM}` }}>
      <div style={{ width:40, height:40, borderRadius:8, background:B.g100, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={B.g600} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
      </div>
      <p style={{ fontSize:13, fontWeight:600, color:B.t1, margin:"0 0 6px", fontFamily:F }}>{title}</p>
      <p style={{ fontSize:12, color:B.t2, maxWidth:340, lineHeight:1.65, margin:"0 0 16px", fontFamily:F }}>{desc}</p>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"center" }}>
        {sources.map(s=><span key={s} style={{ fontSize:10, fontWeight:500, padding:"3px 9px", borderRadius:20, border:`1px solid ${B.border}`, color:B.t3, background:B.bg, fontFamily:F }}>{s}</span>)}
      </div>
    </div>
  );
}

// ─── Hero banner ─────────────────────────────────────────────────────────────
function Hero() {
  const day = new Date().toLocaleDateString("en-US",{ weekday:"long", month:"long", day:"numeric" });
  return (
    <div style={{ background:`linear-gradient(135deg, ${B.g800} 0%, ${B.g600} 60%, ${B.g500} 100%)`, borderRadius:12, padding:"20px 24px 18px", marginBottom:16, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:-50, right:-50, width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.04)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:-30, right:120, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.03)", pointerEvents:"none" }} />
      <p style={{ fontSize:12, color:"rgba(255,255,255,0.55)", margin:"0 0 2px", fontFamily:F, fontWeight:500 }}>{day}</p>
      <h1 style={{ fontSize:20, fontWeight:700, color:"#fff", margin:"0 0 16px", fontFamily:F, letterSpacing:"-0.02em" }}>Good morning, Dr. Andre</h1>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
        <HeroKpi label="Visits this week"  value="184"   trend="↑ +12% vs last week" />
        <HeroKpi label="ER/UC avoidance"   value="78"    unit="%" trend="↑ +3pts vs last month" />
        <HeroKpi label="Active members"    value="312"   trend="↑ +21 this week" />
        <HeroKpi label="Satisfaction"      value="4.7"   unit="/5" trend="↑ Top decile" />
      </div>
    </div>
  );
}

// ─── Views ───────────────────────────────────────────────────────────────────
function VOverview() {
  return (
    <div>
      <Hero />
      <Grid cols={5} mb={12}>
        <KpiCard label="Median time-to-care"  value="1.8"   unit="h"   trend="↓ −22min vs last week"    accent={B.ch.t} />
        <KpiCard label="7-day ER/UC use"      value="6.2"   unit="%"   trend="↓ −0.8pts"                accent={B.ch.a} />
        <KpiCard label="New members"          value="24"    trend="↑ +6 vs last week"             accent={B.ch.g} />
        <KpiCard label="Revenue this week"    value="$18.4" unit="k"   trend="↑ +8% vs last week"        accent={B.g700} />
        <KpiCard label="Re-contact rate"      value="9.1"   unit="%"   trend="↓ −1.2pts vs last month"   accent={B.ch.a} />
      </Grid>
      <Two>
        <Card title="Visit trend — last 8 weeks" source="Elation API">
          <Lgnd items={[{label:"Member",color:B.ch.g},{label:"Concierge",color:B.ch.t},{label:"One-time",color:B.ch.a}]} />
          <div style={{ height:188 }}><Bar data={D.visits} options={coS()} /></div>
        </Card>
        <Card title="Membership growth — 6 months" source="Hint API">
          <div style={{ height:212 }}><Line data={D.members} options={co()} /></div>
        </Card>
      </Two>
    </div>
  );
}

function VVisits() {
  const { getToken } = useAuth();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    apiGet("/api/elation/visit-volume", getToken)
      .then((res) => { if (!cancelled) { setData(res); setLoading(false); } })
      .catch((err) => { if (!cancelled) { setError(err.message); setLoading(false); } });

    return () => { cancelled = true; };
  }, [getToken]);

  const total       = data?.total ?? "—";
  const physicians  = data?.byPhysician ?? [];
  const activePh    = physicians.filter((p) => p.is_active).length;
  const perClinician = activePh > 0 ? Math.round(data.total / activePh) : "—";
  const inPerson    = data?.byMode?.IN_PERSON ?? 0;
  const video       = data?.byMode?.VIDEO ?? 0;
  const modeTotal   = inPerson + video || 1;
  const videoPct    = Math.round((video / modeTotal) * 100);

  return (
    <div>
      <SecHeader tag="Module 2 · Priority · Elation API" title="Visit Volume & Utilization" desc="Are you using clinician capacity efficiently?" />

      {error && (
        <div style={{ padding:"10px 14px", marginBottom:12, borderRadius:8, background:B.negBg, color:B.neg, fontSize:12, fontFamily:F }}>
          Erro ao carregar dados: {error}
        </div>
      )}

      <Grid>
        <KpiCard label="Total appointments"    value={loading ? "…" : total}        trend={loading ? "" : "Elation live"} accent={B.ch.g} />
        <KpiCard label="Visits per clinician"  value={loading ? "…" : perClinician} subunit="per active clinician"        accent={B.ch.t} />
        <KpiCard label="Telehealth (video)"    value={loading ? "…" : `${videoPct}`} unit="%"                              accent={B.ch.a} />
        <KpiCard label="Active clinicians"     value={loading ? "…" : activePh}     subunit="in practice"                 accent={B.g700} />
      </Grid>

      <Two>
        <Card title="Appointments by mode" source="Elation API — live">
          {loading ? (
            <div style={{ height:210, display:"flex", alignItems:"center", justifyContent:"center", color:B.t3, fontSize:12, fontFamily:F }}>Loading...</div>
          ) : (
            <>
              <Lgnd items={[{label:`In-person ${inPerson}`,color:B.ch.g},{label:`Video ${video}`,color:B.ch.t}]} />
              <div style={{ height:210, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ position:"relative", width:180, height:180 }}>
                  <Doughnut data={{ labels:["In-person","Video"], datasets:[{ data:[inPerson||1, video||0], backgroundColor:[B.ch.g, B.ch.t], borderWidth:2, borderColor:"#fff" }] }} options={coD()} />
                  <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center", pointerEvents:"none" }}>
                    <div style={{ fontSize:20, fontWeight:700, color:B.t1, fontFamily:F }}>{total}</div>
                    <div style={{ fontSize:10, color:B.t3, marginTop:1, fontFamily:F }}>Total</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Card>

        <Card title="Appointments by status" source="Elation API — live">
          {loading ? (
            <div style={{ height:234, display:"flex", alignItems:"center", justifyContent:"center", color:B.t3, fontSize:12, fontFamily:F }}>Loading...</div>
          ) : (
            <div style={{ height:234 }}>
              <Bar
                data={{
                  labels: Object.keys(data?.byStatus || {}),
                  datasets:[{ data: Object.values(data?.byStatus || {}), backgroundColor: B.ch.g, borderRadius:4 }],
                }}
                options={co()}
              />
            </div>
          )}
        </Card>
      </Two>

      <Card title="Active clinicians" source="Elation API — live">
        {loading ? (
          <div style={{ padding:12, color:B.t3, fontSize:12, fontFamily:F }}>Loading...</div>
        ) : (
          <Tbl
            headers={["Clinician","Credentials","Active","Total appointments","Status"]}
            rows={physicians.map((ph) => [
              ph.name,
              ph.credentials || "—",
              ph.is_active ? "Yes" : "No",
              ph.stats.total,
              <Pill type={ph.is_active ? "success" : "neutral"}>{ph.is_active ? "Active" : "Inactive"}</Pill>,
            ])}
          />
        )}
      </Card>
    </div>
  );
}

function VAccess() {
  return (
    <div>
      <SecHeader tag="Module 3 · Priority · B2B Differentiator" title="Access & Speed-to-Care" desc="Via Journey's strongest competitive differentiator — critical for employer contracts." />
      <Grid>
        <KpiCard label="Median: request → appt"      value="1.8"  unit="h"   trend="↑ vs ER avg: 4.2h"    accent={B.ch.t} />
        <KpiCard label="Median: request → clinician" value="22"   unit="min" trend="↑ vs UC avg: 68min"   accent={B.ch.t} />
        <KpiCard label="Seen same day"               value="91"   unit="%"   trend="↑ +2pts vs last month" accent={B.ch.g} />
        <KpiCard label="Seen within 24h"             value="98"   unit="%"   trend="↑ Best-in-class"       accent={B.ch.g} />
      </Grid>
      <Card title="Speed-to-care vs industry benchmarks (hours)" source="Elation API + benchmarks" style={{ marginBottom:12 }}>
        <div style={{ height:230 }}><Bar data={D.speed} options={co()} /></div>
      </Card>
      <Card title="Same-day & 24h access — 8-week trend" source="Elation API">
        <Lgnd items={[{label:"Same day %",color:B.ch.t},{label:"Within 24h %",color:B.ch.g}]} />
        <div style={{ height:188 }}><Line data={D.access} options={coP(80)} /></div>
      </Card>
    </div>
  );
}

function VOutcomes() {
  return (
    <div>
      <SecHeader tag="Module 4 · Priority · Patient Form" title="Clinical Outcome Proxies" desc="Prove clinical value without overclaiming. Collected via automated post-visit surveys." />
      <Grid cols={3}>
        <KpiCard label="Would have gone to ER"    value="68"  unit="%" subunit="ER/UC avoidance proxy"   accent={B.ch.t} />
        <KpiCard label="Actually went to ER (7d)" value="6.2" unit="%" trend="↓ −0.8pts MTD"             accent={B.ch.t} />
        <KpiCard label="Improved at 48h"          value="82"  unit="%" trend="↑ +4pts vs last month"     accent={B.ch.g} />
        <KpiCard label="Resolved at 7 days"       value="91"  unit="%"                                   accent={B.ch.t} />
        <KpiCard label="Worsening rate"           value="3.4" unit="%" trend="↓ Within target"           accent={B.ch.a} />
        <KpiCard label="Re-visit same issue (7d)" value="9.1" unit="%" trend="↓ −1.2pts vs last month"   accent={B.ch.a} />
      </Grid>
      <Two>
        <Card title="ER/UC avoidance — monthly" source="Patient form"><div style={{ height:200 }}><Bar data={D.erAvoid} options={coP(60)} /></div></Card>
        <Card title="Symptom resolution" source="Patient form">
          <div style={{ paddingTop:6 }}>
            <Bar2 label="Improved at 48h"      value={82} color={B.ch.g} />
            <Bar2 label="Resolved at 7 days"   value={91} color={B.ch.g} />
            <Bar2 label="Escalated to outside" value={8}  color={B.ch.r} />
            <Bar2 label="Worsening rate"       value={3}  color={B.ch.a} />
          </div>
        </Card>
      </Two>
      <Card title="Post-visit survey — pending deployment">
        <Tbl headers={["Question","Trigger","Response type","Status"]} rows={[["Would you have gone to ER/UC without Via Journey?","Post-visit","Yes / No",<Pill type="warning">Pending</Pill>],["How are you feeling 48 hours after the visit?","48h auto","Scale 1–5",<Pill type="warning">Pending</Pill>],["Is your issue resolved at 7 days?","7d auto","Yes / No / Escalated",<Pill type="warning">Pending</Pill>],["Did you visit ER or UC within 7 days?","7d auto","Yes/No + facility",<Pill type="warning">Pending</Pill>]]} />
      </Card>
    </div>
  );
}

function VMembership() {
  return (
    <div>
      <SecHeader tag="Module 5 · Priority · Hint API" title="Membership & Retention" desc="Predict revenue stability and identify churn risk early." />
      <Grid cols={3}>
        <KpiCard label="Active members"          value="312"  trend="↑ +21 this week"         accent={B.ch.g} />
        <KpiCard label="New members (MTD)"       value="38"   trend="↑ +26% vs last month"    accent={B.ch.t} />
        <KpiCard label="Cancellations (MTD)"     value="7"    trend="↓ −3 vs last month"      trendBad accent={B.ch.r} />
        <KpiCard label="Monthly churn"           value="2.2"  unit="%" trend="↓ Below 3% target" accent={B.ch.t} />
        <KpiCard label="Avg membership duration" value="8.4"  unit="mo" trend="↑ +0.6mo vs Q4" accent={B.ch.g} />
        <KpiCard label="Annualized churn"        value="24"   unit="%" subunit="Target: below 28%" accent={B.ch.t} />
      </Grid>
      <Two>
        <Card title="Net member growth — 6 months" source="Hint API">
          <Lgnd items={[{label:"New members",color:B.ch.g},{label:"Cancellations",color:B.ch.r}]} />
          <div style={{ height:200 }}><Bar data={D.mGrow} options={coS()} /></div>
        </Card>
        <Card title="Retention cohort" source="Hint API">
          <div style={{ paddingTop:8 }}>
            <Bar2 label="Retained at 1 month"   value={96} color={B.g700} />
            <Bar2 label="Retained at 3 months"  value={88} color={B.g600} />
            <Bar2 label="Retained at 6 months"  value={79} color={B.g500} />
            <Bar2 label="Retained at 12 months" value={66} color={B.g400} />
          </div>
        </Card>
      </Two>
      <Card title="Members by plan type" source="Hint API">
        <Tbl headers={["Plan","Active","New (MTD)","Cancelled (MTD)","Churn","Status"]} rows={[["Standard Member","198","22","4","2.0%",<Pill type="success">Healthy</Pill>],["Concierge Plan","86","12","2","2.3%",<Pill type="success">Healthy</Pill>],["Employer / Partner","28","4","1","3.6%",<Pill type="warning">Monitor</Pill>]]} />
      </Card>
    </div>
  );
}

function VExperience() {
  return (
    <div>
      <SecHeader tag="Module 7 · Priority · Patient Form" title="Patient Experience" desc="Drive retention, referrals, and brand protection." />
      <Grid cols={3} mb={12}>
        <KpiCard label="Satisfaction (48h)"      value="4.7" unit="/5" accent={B.ch.t} />
        <KpiCard label="Satisfaction (7d)"       value="4.8" unit="/5" accent={B.ch.t} />
        <KpiCard label="% very satisfied"        value="84"  unit="%"  accent={B.ch.g} />
        <KpiCard label="Would recommend"         value="91"  unit="%"  accent={B.ch.t} />
        <KpiCard label="Complaints / 100 visits" value="1.4"           accent={B.ch.a} />
        <KpiCard label="Repeat usage rate"       value="38"  unit="%"  accent={B.ch.g} />
      </Grid>
      <Two align="start">
        <Card title="Satisfaction distribution">
          <div style={{ paddingTop:6 }}>
            {[["5★", 81, B.ch.g], ["4★", 12, B.ch.t], ["3★", 4, B.ch.s], ["2★", 2, B.ch.a], ["1★", 1, B.ch.r]].map(([label, value, color]) => (
              <div key={label} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <span style={{ fontSize:12, color:B.t2, fontFamily:F, width:24, textAlign:"right", flexShrink:0 }}>{label}</span>
                <div style={{ flex:1, background:B.bg, borderRadius:4, height:14, overflow:"hidden" }}>
                  <div style={{ width:`${value}%`, background:color, height:"100%", borderRadius:4, transition:"width 0.4s" }} />
                </div>
                <span style={{ fontSize:12, fontWeight:600, color:B.t1, fontFamily:F, width:30, flexShrink:0 }}>{value}%</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Top complaint reasons">
          <div style={{ paddingTop:6 }}>
            <Bar2 label="Wait time"         value={38} color={B.ch.a} />
            <Bar2 label="Follow-up unclear" value={29} color={B.ch.a} />
            <Bar2 label="Tech / platform"   value={18} color={B.ch.t} />
            <Bar2 label="Other"             value={15} color={B.t4} />
          </div>
        </Card>
      </Two>
    </div>
  );
}

function VOperations() {
  return (
    <div>
      <SecHeader tag="Module 10 · Priority · RingCentral + GoHighLevel" title="Operations & Support Load" desc="Prevent clinician burnout and operational bottlenecks." />
      <Grid cols={3}>
        <KpiCard label="Messages per visit"    value="2.3"  subunit="Avg async messages"          accent={B.ch.g} />
        <KpiCard label="Calls per visit"       value="0.8"  trend="↓ Below 1.0 target"            accent={B.ch.a} />
        <KpiCard label="Follow-up completion"  value="87"   unit="%" trend="↑ +3pts vs last month" accent={B.ch.t} />
        <KpiCard label="Avg response time"     value="14"   unit="min" trend="↓ −4min vs last month" accent={B.ch.g} />
        <KpiCard label="No-show rate"          value="4.8"  unit="%" trend="↓ −0.6pts MTD"        accent={B.ch.r} />
        <KpiCard label="Cancellation rate"     value="7.2"  unit="%" subunit="Within range"        accent={B.ch.a} />
      </Grid>
      <Card title="Support load — 8 weeks" source="RingCentral + GoHighLevel">
        <Lgnd items={[{label:"Calls / visit",color:B.ch.a},{label:"Messages / visit",color:B.ch.g}]} />
        <div style={{ height:230 }}><Line data={D.ops} options={co()} /></div>
      </Card>
    </div>
  );
}

// ─── Module 1: Growth & Funnel ───────────────────────────────────────────────
function VGrowth() {
  return (
    <div>
      <SecHeader tag="Module 1 · GoHighLevel CRM" title="Growth & Funnel" desc="Are people finding you, booking, and converting?" />
      <Grid cols={4} mb={12}>
        <KpiCard label="Total leads (MTD)"        value="312"  trend="↑ +18% vs last month"    accent={B.ch.g} />
        <KpiCard label="Lead → booked"            value="37"   unit="%" trend="↑ +2pts vs last month" accent={B.ch.t} />
        <KpiCard label="Lead → paid visit"        value="22"   unit="%" trend="↑ +1.4pts"           accent={B.ch.a} />
        <KpiCard label="Lead → member"            value="6.4"  unit="%" trend="↑ Best month"         accent={B.g700} />
      </Grid>
      <Grid cols={3} mb={12}>
        <KpiCard label="Avg cost per lead"        value="$18"  subunit="Paid channels only"      accent={B.ch.t} />
        <KpiCard label="Booking abandonment"      value="14"   unit="%" trend="↓ −3pts vs last month" accent={B.ch.a} />
        <KpiCard label="Self-schedule rate"       value="68"   unit="%" trend="↑ +5pts"           accent={B.ch.g} />
      </Grid>
      <Two>
        <Card title="Leads by source" source="GoHighLevel API">
          <Lgnd items={[{label:"Website",color:B.ch.g},{label:"WhatsApp",color:B.ch.t},{label:"Referral",color:B.ch.a},{label:"Employer",color:B.g700}]} />
          <div style={{height:210}}><Bar data={D.leadSrc} options={co()} /></div>
        </Card>
        <Card title="Conversion rate trend — 6 months" source="GoHighLevel API">
          <Lgnd items={[{label:"Lead → Member %",color:B.ch.g},{label:"Lead → Booked %",color:B.ch.t}]} />
          <div style={{height:210}}><Line data={D.convTrend} options={co()} /></div>
        </Card>
      </Two>
      <Card title="Conversion by language & state" source="GoHighLevel API">
        <Tbl
          headers={["Segment","Leads","Booked %","Paid Visit %","Member %","Status"]}
          rows={[
            ["Portuguese speakers","168","42%","26%","7.8%",<Pill type="success">Best</Pill>],
            ["English speakers","88","34%","20%","5.2%",<Pill type="success">On track</Pill>],
            ["Spanish speakers","46","28%","15%","3.1%",<Pill type="warning">Monitor</Pill>],
            ["Florida","196","39%","24%","7.1%",<Pill type="success">On track</Pill>],
            ["Texas","72","32%","18%","4.8%",<Pill type="success">On track</Pill>],
            ["Other states","44","26%","14%","2.9%",<Pill type="warning">Monitor</Pill>],
          ]}
        />
      </Card>
    </div>
  );
}

// ─── Module 6: Revenue & Financial Health ───────────────────────────────────
function VRevenue() {
  return (
    <div>
      <SecHeader tag="Module 6 · Elation + Hint API" title="Revenue & Financial Health" desc="Know if growth is profitable." />
      <Grid cols={4} mb={12}>
        <KpiCard label="Revenue (MTD)"          value="$81.6" unit="k" trend="↑ +10% vs last month" accent={B.ch.g} />
        <KpiCard label="Revenue per patient"    value="$218"  trend="↑ +$14 vs last month"          accent={B.ch.t} />
        <KpiCard label="Revenue per clinician"  value="$27.2" unit="k/mo" subunit="per clinician"   accent={B.g700} />
        <KpiCard label="Failed payment rate"    value="3.1"   unit="%" trend="↓ −0.4pts"            accent={B.ch.a} />
      </Grid>
      <Grid cols={3} mb={12}>
        <KpiCard label="Recovery after retry"   value="72"    unit="%" trend="↑ +2pts"              accent={B.ch.g} />
        <KpiCard label="Refund rate"            value="0.8"   unit="%" trend="↓ Below 1% target"    accent={B.ch.t} />
        <KpiCard label="Chargeback rate"        value="0.2"   unit="%" trend="↓ Excellent"          accent={B.ch.t} />
      </Grid>
      <Two>
        <Card title="Revenue by plan type" source="Hint API">
          <Lgnd items={[{label:"Standard Member 44%",color:B.ch.g},{label:"Concierge 28%",color:B.ch.t},{label:"One-time 18%",color:B.ch.a},{label:"Employer 10%",color:B.g700}]} />
          <div style={{height:200,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{position:"relative",width:180,height:180}}>
              <Doughnut data={D.revPlan} options={coD()} />
              <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",pointerEvents:"none"}}>
                <div style={{fontSize:16,fontWeight:700,color:B.t1,fontFamily:F}}>$81.6k</div>
                <div style={{fontSize:10,color:B.t3,marginTop:1,fontFamily:F}}>MTD</div>
              </div>
            </div>
          </div>
        </Card>
        <Card title="Revenue trend — 6 months" source="Elation + Hint API">
          <div style={{height:220}}><Line data={D.revTrend} options={co({scales:{...co().scales,y:{...co().scales.y,ticks:{...co().scales.y.ticks,callback:v=>"$"+(v/1000).toFixed(0)+"k"}}}})} /></div>
        </Card>
      </Two>
      <Card title="Revenue by plan — detail" source="Elation + Hint API">
        <Tbl
          headers={["Plan","Revenue MTD","Revenue/patient","Patients","Failed payments","Status"]}
          rows={[
            ["Standard Member ($59/mo)","$35,904","$59","198 active",<Pill type="success">1.5%</Pill>,<Pill type="success">Healthy</Pill>],
            ["Concierge ($85/mo)","$22,848","$85","86 active",<Pill type="success">2.3%</Pill>,<Pill type="success">Healthy</Pill>],
            ["One-time visits","$14,688","$218","28 visits",<Pill type="neutral">N/A</Pill>,<Pill type="success">Healthy</Pill>],
            ["Employer / B2B","$8,160","$190","28 covered",<Pill type="warning">5.8%</Pill>,<Pill type="warning">Monitor</Pill>],
          ]}
        />
      </Card>
    </div>
  );
}

// ─── Module 8: Language, Access & Equity ────────────────────────────────────
function VLanguage() {
  return (
    <div>
      <SecHeader tag="Module 8 · Elation API" title="Language, Access & Equity" desc="Via Journey's unique differentiation — Brazilian Portuguese-first telehealth in the US." />
      <Grid cols={4} mb={12}>
        <KpiCard label="Portuguese visits"   value="54"   unit="%" subunit="of total volume"    accent={B.ch.g} />
        <KpiCard label="English visits"      value="28"   unit="%" trend="Stable"               accent={B.ch.t} />
        <KpiCard label="Spanish visits"      value="15"   unit="%" trend="↑ Growing segment"    accent={B.ch.a} />
        <KpiCard label="Intake completion"   value="94"   unit="%" trend="↑ +3pts vs last month" accent={B.ch.g} />
      </Grid>
      <Two>
        <Card title="Visit distribution by language" source="Elation API">
          <Lgnd items={[{label:"Portuguese 54%",color:B.ch.g},{label:"English 28%",color:B.ch.t},{label:"Spanish 15%",color:B.ch.a},{label:"Other 3%",color:B.ch.s}]} />
          <div style={{height:200,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{position:"relative",width:180,height:180}}>
              <Doughnut data={D.langVis} options={coD()} />
              <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",pointerEvents:"none"}}>
                <div style={{fontSize:16,fontWeight:700,color:B.t1,fontFamily:F}}>736</div>
                <div style={{fontSize:10,color:B.t3,marginTop:1,fontFamily:F}}>visits MTD</div>
              </div>
            </div>
          </div>
        </Card>
        <Card title="Median time-to-care by language (hours)" source="Elation API">
          <div style={{height:220}}><Bar data={D.langTime} options={co()} /></div>
        </Card>
      </Two>
      <Card title="Access & outcome equity by language" source="Elation API">
        <Tbl
          headers={["Language","Visits MTD","Intake completion","No-show rate","Time-to-care","ER/UC avoidance","Outcome"]}
          rows={[
            ["Portuguese","397","96%","3.8%","1.7h","80%",<Pill type="success">Excellent</Pill>],
            ["English","206","93%","5.2%","1.9h","76%",<Pill type="success">Good</Pill>],
            ["Spanish","110","89%","7.4%","2.1h","71%",<Pill type="warning">Monitor</Pill>],
            ["Other","23","84%","9.1%","2.4h","68%",<Pill type="warning">Monitor</Pill>],
          ]}
        />
      </Card>
    </div>
  );
}

// ─── Module 9: Clinician Performance ────────────────────────────────────────
function VClinician() {
  return (
    <div>
      <SecHeader tag="Module 9 · Elation API · Internal" title="Clinician Performance" desc="Quality and consistency coaching — internal use only, not punitive." />
      <Grid cols={4} mb={12}>
        <KpiCard label="Total clinicians"      value="3"    subunit="Active this month"         accent={B.ch.g} />
        <KpiCard label="Avg visits/clinician"  value="92"   subunit="per month"                 accent={B.ch.t} />
        <KpiCard label="Avg re-contact rate"   value="9.1"  unit="%" trend="↓ Below 10% target" accent={B.ch.a} />
        <KpiCard label="Avg satisfaction"      value="4.7"  unit="/5" trend="↑ Top decile"      accent={B.ch.g} />
      </Grid>
      <Card title="Visit volume per clinician — 6 months" source="Elation API" style={{marginBottom:12}}>
        <Lgnd items={[{label:"Dr. Melo",color:B.ch.g},{label:"Dr. Santos",color:B.ch.t},{label:"NP Rivera",color:B.ch.a}]} />
        <div style={{height:220}}><Line data={D.clinicVis} options={co()} /></div>
      </Card>
      <Card title="Clinician performance matrix" source="Elation API">
        <Tbl
          headers={["Clinician","Visits/mo","Re-contact %","ER escalation %","Antibiotic rate","Satisfaction","Flag"]}
          rows={[
            ["Dr. Andre Melo","188","8.2%","1.1%","12%","4.8/5",<Pill type="success">Optimal</Pill>],
            ["Dr. C. Santos","130","9.8%","1.4%","15%","4.6/5",<Pill type="success">Good</Pill>],
            ["NP M. Rivera","94","10.4%","2.1%","18%","4.5/5",<Pill type="warning">Coach</Pill>],
          ]}
        />
      </Card>
      <Card title="Quality metrics breakdown" source="Elation API" style={{marginTop:12}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,paddingTop:4}}>
          <div>
            <p style={{fontSize:12,fontWeight:600,color:B.t2,margin:"0 0 10px",fontFamily:F}}>Re-contact rate by clinician</p>
            <Bar2 label="Dr. Melo"    value={8}  color={B.ch.g} />
            <Bar2 label="Dr. Santos"  value={10} color={B.ch.t} />
            <Bar2 label="NP Rivera"   value={10} color={B.ch.a} />
          </div>
          <div>
            <p style={{fontSize:12,fontWeight:600,color:B.t2,margin:"0 0 10px",fontFamily:F}}>Patient satisfaction by clinician</p>
            <Bar2 label="Dr. Melo"    value={96} color={B.ch.g} />
            <Bar2 label="Dr. Santos"  value={92} color={B.ch.t} />
            <Bar2 label="NP Rivera"   value={90} color={B.ch.a} />
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Module 11: B2B / Employer Dashboards ───────────────────────────────────
function VB2B() {
  return (
    <div>
      <SecHeader tag="Module 11 · Elation + Forms" title="B2B / Employer Dashboards" desc="Sell and retain employer contracts with data-driven impact reports." />
      <Grid cols={4} mb={12}>
        <KpiCard label="Active employer contracts" value="3"    trend="+ 1 in pipeline"            accent={B.ch.g} />
        <KpiCard label="Total covered lives"       value="284"  trend="↑ +42 this quarter"         accent={B.ch.t} />
        <KpiCard label="Avg visits / 100 members"  value="24.6" subunit="per month"                accent={B.ch.a} />
        <KpiCard label="Avg ER/UC avoidance"       value="76"   unit="%" trend="↑ +4pts vs Q4"     accent={B.ch.g} />
      </Grid>
      <Card title="Employer contract summary" source="Elation API + Patient Forms" style={{marginBottom:12}}>
        <Tbl
          headers={["Employer","Covered lives","Visits/100","Time-to-care","ER avoidance","Satisfaction","Est. cost savings"]}
          rows={[
            ["BrazilianUS Corp","120","26.4","1.6h","79%","4.8/5",<Pill type="success">$38k/mo</Pill>],
            ["LKR Construction","96","23.8","1.9h","74%","4.6/5",<Pill type="success">$28k/mo</Pill>],
            ["SunState LLC","68","22.1","2.0h","72%","4.5/5",<Pill type="success">$19k/mo</Pill>],
          ]}
        />
      </Card>
      <Two>
        <Card title="ER/UC avoidance by employer" source="Elation API">
          <div style={{paddingTop:6}}>
            <Bar2 label="BrazilianUS Corp" value={79} color={B.ch.g} />
            <Bar2 label="LKR Construction" value={74} color={B.ch.t} />
            <Bar2 label="SunState LLC"     value={72} color={B.ch.a} />
            <Bar2 label="Portfolio avg"    value={76} color={B.g700} />
          </div>
        </Card>
        <Card title="Impact metrics for B2B deck">
          <div style={{paddingTop:4}}>
            <Bar2 label="ER visits avoided (est.)" value={76} color={B.ch.g} />
            <Bar2 label="Same-day access"           value={91} color={B.ch.t} />
            <Bar2 label="Employee satisfaction"     value={94} color={B.ch.g} />
            <Bar2 label="Renewal intent"            value={88} color={B.g700} />
          </div>
        </Card>
      </Two>
    </div>
  );
}

// ─── Module 12: Compliance & Risk ───────────────────────────────────────────
function VCompliance() {
  return (
    <div>
      <SecHeader tag="Module 12 · Elation API · HIPAA" title="Compliance & Risk" desc="Sleep at night. HIPAA audit readiness and outlier detection." />
      <Grid cols={4} mb={12}>
        <KpiCard label="Consent completion"      value="99.1"  unit="%" trend="↑ Above 99% threshold" accent={B.ch.g} />
        <KpiCard label="Follow-up docs rate"     value="96.4"  unit="%" trend="↑ +1.2pts MTD"         accent={B.ch.t} />
        <KpiCard label="Audit trail complete"    value="100"   unit="%" trend="↑ Full coverage"        accent={B.ch.g} />
        <KpiCard label="Open outlier flags"      value="2"     trend="↓ Below threshold"              accent={B.ch.a} />
      </Grid>
      <Two>
        <Card title="Compliance scorecard" source="Elation API">
          <div style={{paddingTop:6}}>
            <Bar2 label="Telehealth consent %"    value={99} color={B.ch.g} />
            <Bar2 label="Follow-up documented %"  value={96} color={B.ch.g} />
            <Bar2 label="Audit trail complete %"  value={100} color={B.g700} />
            <Bar2 label="State coverage match %"  value={100} color={B.g700} />
          </div>
        </Card>
        <Card title="State licensure vs visit volume" source="Elation API">
          <Tbl
            headers={["State","Visits MTD","Clinicians licensed","Coverage"]}
            rows={[
              ["Florida","412","3",<Pill type="success">Covered</Pill>],
              ["Texas","178","2",<Pill type="success">Covered</Pill>],
              ["New York","96","1",<Pill type="warning">Monitor</Pill>],
              ["California","50","1",<Pill type="warning">Monitor</Pill>],
            ]}
          />
        </Card>
      </Two>
      <Card title="Outlier detection & flags" source="Elation API" style={{marginTop:12}}>
        <Tbl
          headers={["Flag","Type","Clinician","Date","Status","Action"]}
          rows={[
            ["High re-contact (>15%)","Clinical outlier","NP Rivera","Mar 14","Open",<Pill type="warning">Review</Pill>],
            ["Missing follow-up note","Documentation","Dr. Santos","Mar 10","Open",<Pill type="warning">Complete</Pill>],
            ["Consent not recorded","Compliance","—","Mar 8","Resolved",<Pill type="success">Closed</Pill>],
            ["State coverage gap (GA)","Licensure","—","Mar 1","Resolved",<Pill type="success">Closed</Pill>],
          ]}
        />
      </Card>
    </div>
  );
}

// ─── User footer ─────────────────────────────────────────────────────────────
function UserFooter({ clock }) {
  const { signOut } = useClerk();
  return (
    <div style={{ padding:"10px 14px", borderTop:`1px solid ${B.border}`, flexShrink:0 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:8, background:B.bg }}>
        <div style={{ width:28, height:28, borderRadius:"50%", background:B.g500, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#fff", fontFamily:F, flexShrink:0 }}>AM</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:12, fontWeight:600, color:B.t1, fontFamily:F, lineHeight:1.2 }}>Dr. Andre Melo</div>
          <div style={{ fontSize:10, color:B.t3, fontFamily:F }}>Admin</div>
        </div>
        <button
          onClick={() => signOut()}
          title="Sign out"
          style={{ flexShrink:0, background:"none", border:`1px solid ${B.border}`, borderRadius:6, padding:"4px 7px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={B.t3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
      <div style={{ display:"flex", alignItems:"center", marginTop:8, padding:"0 2px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#22C55E" }} />
          <span style={{ fontSize:10, color:B.t3, fontFamily:F }}>{clock}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Nav tree ────────────────────────────────────────────────────────────────
const NAV = [
  { group:"Clinical", items:[
    { id:"overview",  label:"Overview",     leaf:true,  component:VOverview },
    { id:"clinical-g",label:"Clinical",     leaf:false, subs:[
      { id:"visits",     label:"Visit Volume",       priority:true,  component:VVisits },
      { id:"access",     label:"Access & Speed",     priority:true,  component:VAccess },
      { id:"outcomes",   label:"Clinical Outcomes",  priority:true,  component:VOutcomes },
      { id:"experience", label:"Patient Experience", priority:true,  component:VExperience },
    ]},
    { id:"members-g", label:"Members & Revenue", leaf:false, subs:[
      { id:"membership", label:"Membership",  priority:true,  component:VMembership },
      { id:"revenue",    label:"Revenue",     priority:false, component:VRevenue },
    ]},
    { id:"ops-g",     label:"Operations",   leaf:false, subs:[
      { id:"operations", label:"Support Load",      priority:true,  component:VOperations },
      { id:"clinician",  label:"Clinician",         priority:false, component:VClinician },
      { id:"compliance", label:"Compliance & Risk", priority:false, component:VCompliance },
    ]},
  ]},
  { group:"Growth", items:[
    { id:"growth-g",  label:"Growth & B2B", leaf:false, subs:[
      { id:"growth",   label:"Growth & Funnel",   priority:false, component:VGrowth },
      { id:"b2b",      label:"B2B / Employer",    priority:false, component:VB2B },
      { id:"language", label:"Language & Equity", priority:false, component:VLanguage },
    ]},
  ]},
];

function allLeaves(nav) {
  const out=[];
  nav.forEach(g=>g.items.forEach(item=>{ if(item.leaf) out.push(item); else item.subs.forEach(s=>out.push(s)); }));
  return out;
}
const LEAVES = allLeaves(NAV);

// ─── Sidebar items ────────────────────────────────────────────────────────────
function SubItem({ item, active, onClick }) {
  const [hov,setHov]=useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", padding:"5px 12px 5px 28px", background:active?B.g50:hov?"#F9FBF9":"transparent", border:"none", cursor:"pointer", textAlign:"left", borderLeft:active?`2px solid ${B.g500}`:"2px solid transparent", transition:"all 0.1s" }}>
      <span style={{ fontSize:12, fontWeight:active?600:400, color:active?B.g700:B.t2, fontFamily:F }}>{item.label}</span>
    </button>
  );
}

function NavGroup({ item, activeId, onSelect, initOpen }) {
  const hasActive = item.subs?.some(s=>s.id===activeId);
  const [open,setOpen] = useState(initOpen||hasActive);
  useEffect(()=>{ if(hasActive) setOpen(true); },[hasActive]);

  if (item.leaf) {
    const active = item.id === activeId;
    return (
      <button onClick={()=>onSelect(item.id)}
        style={{ display:"flex", alignItems:"center", gap:7, width:"100%", padding:"6px 14px", background:active?B.g50:"transparent", border:"none", cursor:"pointer", textAlign:"left", borderLeft:active?`2px solid ${B.g500}`:"2px solid transparent", transition:"all 0.1s" }}
        onMouseEnter={e=>{if(!active)e.currentTarget.style.background="#F9FBF9"}} onMouseLeave={e=>{if(!active)e.currentTarget.style.background="transparent"}}>
        <span style={{ fontSize:13, fontWeight:active?600:500, color:active?B.g700:B.t1, fontFamily:F }}>{item.label}</span>
      </button>
    );
  }

  return (
    <div>
      <button onClick={()=>setOpen(o=>!o)}
        style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", padding:"6px 14px", background:"transparent", border:"none", cursor:"pointer", transition:"background 0.1s" }}
        onMouseEnter={e=>e.currentTarget.style.background="#F9FBF9"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
        <span style={{ fontSize:13, fontWeight:500, color:B.t1, fontFamily:F }}>{item.label}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform:open?"rotate(180deg)":"none", transition:"transform 0.18s", flexShrink:0 }}>
          <path d="M2 4l4 4 4-4" stroke={B.t3} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && item.subs.map(s=><SubItem key={s.id} item={s} active={activeId===s.id} onClick={()=>onSelect(s.id)} />)}
    </div>
  );
}

// ─── Root ────────────────────────────────────────────────────────────────────
export default function ViaJourneyDashboard() {
  const [active,setActive] = useState("overview");
  const [clock,setClock]   = useState("");
  const mainRef = useRef(null);

  useEffect(()=>{
    const tick=()=>setClock(new Date().toLocaleString("en-US",{weekday:"short",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}));
    tick();
    const id=setInterval(tick,30000);
    return ()=>clearInterval(id);
  },[]);

  const go = id => { setActive(id); if(mainRef.current) mainRef.current.scrollTop=0; };
  const leaf = LEAVES.find(v=>v.id===active) || LEAVES[0];
  const View = leaf.component;

  return (
    <div style={{ display:"flex", width:"100vw", height:"100vh", overflow:"hidden", fontFamily:F, background:B.bg }}>

      {/* Sidebar */}
      <aside style={{ width:220, flexShrink:0, background:B.sbg, borderRight:`1px solid ${B.border}`, display:"flex", flexDirection:"column", height:"100vh", overflowY:"auto" }}>

        {/* Logo */}
        <div style={{ padding:"16px 14px 14px", borderBottom:`1px solid ${B.border}`, flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:`linear-gradient(135deg,${B.g700},${B.g500})`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ color:"#fff", fontSize:12, fontWeight:700, fontFamily:F }}>VJ</span>
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:B.t1, fontFamily:F, letterSpacing:"-0.01em", lineHeight:1.2 }}>Via Journey</div>
              <div style={{ fontSize:10, color:B.t3, fontFamily:F, marginTop:1 }}>Clinical Dashboard</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"8px 0" }}>
          {NAV.map((sec,si)=>(
            <div key={si} style={{ marginBottom:2 }}>
              <div style={{ padding:"8px 14px 4px", fontSize:10, fontWeight:600, color:B.t4, letterSpacing:"0.07em", textTransform:"uppercase", fontFamily:F }}>{sec.group}</div>
              {sec.items.map(item=><NavGroup key={item.id} item={item} activeId={active} onSelect={go} initOpen={true} />)}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <UserFooter clock={clock} />
      </aside>

      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", height:"100vh", overflow:"hidden", minWidth:0 }}>

        {/* Topbar */}
        <header style={{ height:48, background:B.white, borderBottom:`1px solid ${B.border}`, display:"flex", alignItems:"center", padding:"0 24px", justifyContent:"space-between", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:14, fontWeight:600, color:B.t1, fontFamily:F, letterSpacing:"-0.01em" }}>{leaf.label}</span>
            </div>
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 10px", border:`1px solid ${B.border}`, borderRadius:8, background:B.bg }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#22C55E" }} />
            <span style={{ fontSize:11, fontWeight:500, color:B.t2, fontFamily:F }}>Week of Mar 9–13, 2026</span>
          </div>
        </header>

        {/* Content */}
        <main ref={mainRef} style={{ flex:1, overflowY:"auto", overflowX:"hidden", padding:"24px 28px" }}>
          <View />
        </main>
      </div>
    </div>
  );
}
