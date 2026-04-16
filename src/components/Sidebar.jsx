import { useState, useEffect } from "react";
import { B, F } from "../lib/brand.js";
import UserFooter from "./UserFooter.jsx";

// ─── View imports ─────────────────────────────────────────────────────────────
import VOverview   from "../views/VOverview.jsx";
import VVisits     from "../views/VVisits.jsx";
import VAccess     from "../views/VAccess.jsx";
import VOutcomes   from "../views/VOutcomes.jsx";
import VMembership from "../views/VMembership.jsx";
import VExperience from "../views/VExperience.jsx";
import VOperations from "../views/VOperations.jsx";
import VGrowth     from "../views/VGrowth.jsx";
import VRevenue    from "../views/VRevenue.jsx";
import VLanguage   from "../views/VLanguage.jsx";
import VClinician  from "../views/VClinician.jsx";
import VB2B        from "../views/VB2B.jsx";
import VCompliance from "../views/VCompliance.jsx";

// ─── Nav tree ────────────────────────────────────────────────────────────────
const NAV = [
  { group:"Clinical", items:[
    { id:"overview",  label:"Overview",     leaf:true,  component:VOverview },
    { id:"clinical-g",label:"Clinical",     leaf:false, subs:[
      { id:"visits",     label:"Visit Volume",       priority:true,  live:true,  component:VVisits },
      { id:"access",     label:"Access & Speed",     priority:true,  live:true,  component:VAccess },
      { id:"outcomes",   label:"Clinical Outcomes",  priority:true,             component:VOutcomes },
      { id:"experience", label:"Patient Experience", priority:true,             component:VExperience },
    ]},
    { id:"members-g", label:"Members & Revenue", leaf:false, subs:[
      { id:"membership", label:"Membership",  priority:true,  component:VMembership },
      { id:"revenue",    label:"Revenue",     priority:false, component:VRevenue },
    ]},
    { id:"ops-g",     label:"Operations",   leaf:false, subs:[
      { id:"operations", label:"Support Load",      priority:true,  live:true, component:VOperations },
      { id:"clinician",  label:"Clinician",         priority:false, live:true,  component:VClinician },
      { id:"compliance", label:"Compliance & Risk", priority:false, live:true,  component:VCompliance },
    ]},
  ]},
  { group:"Growth", items:[
    { id:"growth-g",  label:"Growth & B2B", leaf:false, subs:[
      { id:"growth",   label:"Growth & Funnel",   priority:false,            component:VGrowth },
      { id:"b2b",      label:"B2B / Employer",    priority:false,            component:VB2B },
      { id:"language", label:"Language & Equity", priority:false, live:true, component:VLanguage },
    ]},
  ]},
];

function allLeaves(nav) {
  const out=[];
  nav.forEach(g=>g.items.forEach(item=>{ if(item.leaf) out.push(item); else item.subs.forEach(s=>out.push(s)); }));
  return out;
}
export const LEAVES = allLeaves(NAV);

// ─── Sidebar items ────────────────────────────────────────────────────────────
function SubItem({ item, active, onClick }) {
  const [hov,setHov]=useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", padding:"5px 12px 5px 28px", background:active?B.g50:hov?"#F9FBF9":"transparent", border:"none", cursor:"pointer", textAlign:"left", borderLeft:active?`2px solid ${B.g500}`:"2px solid transparent", transition:"all 0.1s" }}>
      <span style={{ fontSize:12, fontWeight:active?600:400, color:active?B.g700:B.t2, fontFamily:F }}>{item.label}</span>
      {item.live && (
        <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:9, fontWeight:700, color:B.g600, letterSpacing:"0.04em", fontFamily:F, textTransform:"uppercase", background:B.g100, borderRadius:10, padding:"1px 5px", flexShrink:0 }}>
          <span style={{ width:4, height:4, borderRadius:"50%", background:B.g500, animation:"pulse 2s infinite" }} />
          live
        </span>
      )}
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

export default function Sidebar({ active, onSelect, clock }) {
  return (
    <aside style={{ width:220, flexShrink:0, background:B.sbg, borderRight:`1px solid ${B.border}`, display:"flex", flexDirection:"column", height:"100vh", overflowY:"auto" }}>

      {/* Logo */}
      <div style={{ padding:"14px 16px 12px", borderBottom:`1px solid ${B.border}`, flexShrink:0 }}>
        <img
          src="/logo-h.png"
          alt="ViaJourney Telehealth"
          style={{ height:30, width:"auto", display:"block", objectFit:"contain" }}
        />
        <div style={{ fontSize:9, fontWeight:600, color:B.t4, fontFamily:F, letterSpacing:"0.08em", textTransform:"uppercase", marginTop:5 }}>
          Clinical Dashboard
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"8px 0" }}>
        {NAV.map((sec,si)=>(
          <div key={si} style={{ marginBottom:2 }}>
            <div style={{ padding:"8px 14px 4px", fontSize:10, fontWeight:600, color:B.t4, letterSpacing:"0.07em", textTransform:"uppercase", fontFamily:F }}>{sec.group}</div>
            {sec.items.map(item=><NavGroup key={item.id} item={item} activeId={active} onSelect={onSelect} initOpen={true} />)}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <UserFooter clock={clock} />
    </aside>
  );
}
