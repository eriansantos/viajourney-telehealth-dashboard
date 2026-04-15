import { B, F } from "../../lib/brand.js";

export default function Card({ title, source, children, style }) {
  return (
    <div style={{ background:B.white, borderRadius:10, border:`1px solid ${B.border}`, padding:"16px 18px", boxShadow:"0 1px 2px rgba(0,0,0,0.04)", ...style }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <span style={{ fontSize:13, fontWeight:600, color:B.t1, fontFamily:F, letterSpacing:"-0.01em" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}
