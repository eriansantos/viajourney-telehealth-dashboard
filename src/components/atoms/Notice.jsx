import { B, F } from "../../lib/brand.js";

export default function Notice({ type="info", children }) {
  const m={ info:[B.infoBg,B.info], warning:[B.warnBg,B.warn], success:[B.posBg,B.pos] };
  const [bg,color]=m[type]||m.info;
  return (
    <div style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"10px 14px", borderRadius:8, background:bg, border:`1px solid ${color}25`, marginBottom:14 }}>
      <div style={{ width:6, height:6, borderRadius:"50%", background:color, flexShrink:0, marginTop:4 }} />
      <span style={{ fontSize:12, color, lineHeight:1.6, fontFamily:F, fontWeight:500 }}>{children}</span>
    </div>
  );
}
