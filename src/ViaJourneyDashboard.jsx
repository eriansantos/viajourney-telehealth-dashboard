/**
 * Via Journey Telehealth — Clinical Dashboard v5.0
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

const REFRESH_S = 60;

export default function ViaJourneyDashboard() {
  const [active,setActive]           = useState("overview");
  const [clock,setClock]             = useState("");
  const [countdown,setCountdown]     = useState(REFRESH_S);
  const [lastRefresh,setLastRefresh] = useState(null);
  const [refreshKey,setRefreshKey]   = useState(0);
  const mainRef      = useRef(null);
  const initialised  = useRef(false);

  // Clock — atualiza a cada 30s
  useEffect(()=>{
    const tick=()=>setClock(new Date().toLocaleString("en-US",{
      weekday:"short",month:"short",day:"numeric",
      hour:"2-digit",minute:"2-digit",hour12:true,
    }));
    tick();
    const id=setInterval(tick,30000);
    return ()=>clearInterval(id);
  },[]);

  // Countdown tick (1s)
  useEffect(()=>{
    setLastRefresh(new Date());
    const id=setInterval(()=>setCountdown(c=>c<=1 ? REFRESH_S : c-1),1000);
    return ()=>clearInterval(id);
  },[]);

  // Detecta reset do countdown → dispara refresh na view ativa
  useEffect(()=>{
    if(!initialised.current){ initialised.current=true; return; }
    if(countdown===REFRESH_S){
      setLastRefresh(new Date());
      setRefreshKey(k=>k+1);
    }
  },[countdown]);

  const go   = id=>{ setActive(id); if(mainRef.current) mainRef.current.scrollTop=0; };
  const leaf = LEAVES.find(v=>v.id===active)||LEAVES[0];
  const View = leaf.component;

  return (
    <div style={{ display:"flex", width:"100vw", height:"100vh", overflow:"hidden", fontFamily:F, background:B.bg }}>

      {/* Sidebar */}
      <Sidebar active={active} onSelect={go} clock={clock} />

      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", height:"100vh", overflow:"hidden", minWidth:0 }}>

        {/* Topbar */}
        <header style={{ height:48, background:B.white, borderBottom:`3px solid ${B.primary}`, display:"flex", alignItems:"center", padding:"0 24px", justifyContent:"space-between", flexShrink:0 }}>

          {/* Breadcrumb */}
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:10, fontWeight:600, color:B.t4, letterSpacing:"0.08em", textTransform:"uppercase", fontFamily:F }}>{leaf.section}</span>
            <span style={{ fontSize:11, color:B.t4 }}>›</span>
            <span style={{ fontSize:13, fontWeight:600, color:B.t1, fontFamily:F, letterSpacing:"-0.01em" }}>{leaf.label}</span>
          </div>

          {/* Right */}
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>

            {/* Clock */}
            <span style={{ fontSize:11, color:B.t4, fontFamily:F }}>{clock}</span>

            {/* Refresh pill */}
            <div style={{ display:"flex", alignItems:"center", gap:6, background:B.bg, border:`1px solid ${B.border}`, borderRadius:8, padding:"3px 10px" }}>
              <div style={{ position:"relative", width:44, height:3, background:B.borderM, borderRadius:2, overflow:"hidden" }}>
                <div style={{
                  position:"absolute", left:0, top:0, height:"100%", borderRadius:2,
                  background:B.primary,
                  width:`${(countdown/REFRESH_S)*100}%`,
                  transition:"width 1s linear",
                }}/>
              </div>
              <span style={{ fontSize:10, color:B.t4, fontFamily:F, minWidth:22, textAlign:"right" }}>{countdown}s</span>
            </div>

            {/* Live badge */}
            <div style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 10px", border:`1px solid ${B.border}`, borderRadius:8, background:B.bg }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#22C55E" }} />
              <span style={{ fontSize:11, fontWeight:500, color:B.t2, fontFamily:F }}>Live</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main ref={mainRef} style={{ flex:1, overflowY:"auto", overflowX:"hidden", padding:"24px 28px" }}>
          <View key={`${active}-${refreshKey}`} />
        </main>
      </div>
    </div>
  );
}
