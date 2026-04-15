import { B, F } from "../../lib/brand.js";

export default function Bar2({ label, value, color }) {
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
