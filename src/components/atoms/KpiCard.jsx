import { useState } from "react";
import { B, F } from "../../lib/brand.js";

export default function KpiCard({ label, value, unit, subunit, trend, trendBad, accent }) {
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
