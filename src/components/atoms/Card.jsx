import { B, F } from "../../lib/brand.js";

export default function Card({ title, source, badge, children, style }) {
  return (
    <div style={{ background:B.white, borderRadius:10, border:`1px solid ${B.border}`, padding:"16px 18px", boxShadow:"0 1px 2px rgba(0,0,0,0.04)", ...style }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12, gap:8 }}>
        <span style={{ fontSize:13, fontWeight:600, color:B.t1, fontFamily:F, letterSpacing:"-0.01em", flex:1, minWidth:0 }}>{title}</span>
        {source && <span style={{ fontSize:10, color:B.t3, fontFamily:F, flexShrink:0 }}>{source}</span>}
        {badge}
      </div>
      {children}
    </div>
  );
}
