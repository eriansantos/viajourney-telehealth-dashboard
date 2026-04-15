import { B, F } from "../../lib/brand.js";

export default function Soon({ title, desc, sources }) {
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
