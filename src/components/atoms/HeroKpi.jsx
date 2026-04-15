import { F } from "../../lib/brand.js";

export default function HeroKpi({ label, value, unit, trend }) {
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
