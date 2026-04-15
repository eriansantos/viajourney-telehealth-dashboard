/**
 * Via Journey Telehealth — Clinical Dashboard v5.0
 *
 * Fixes: full-viewport layout, Inter font, no colored icons, clean proportional typography
 *
 * npm install chart.js react-chartjs-2
 */

import { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Tooltip, Legend as ChartJSLegend, Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Tooltip, ChartJSLegend, Filler
);

import { B, F } from "./lib/brand.js";
import Sidebar, { LEAVES } from "./components/Sidebar.jsx";

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
      <Sidebar active={active} onSelect={go} clock={clock} />

      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", height:"100vh", overflow:"hidden", minWidth:0 }}>

        {/* Topbar */}
        <header style={{ height:48, background:B.white, borderBottom:`1px solid ${B.border}`, display:"flex", alignItems:"center", padding:"0 24px", justifyContent:"space-between", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:14, fontWeight:600, color:B.t1, fontFamily:F, letterSpacing:"-0.01em" }}>{leaf.label}</span>
            </div>
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 10px", border:`1px solid ${B.border}`, borderRadius:8, background:B.bg }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#22C55E" }} />
            <span style={{ fontSize:11, fontWeight:500, color:B.t2, fontFamily:F }}>Live</span>
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
