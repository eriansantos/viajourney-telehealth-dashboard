import { B, F } from "../../lib/brand.js";

export default function Pill({ children, type="success" }) {
  const m={ success:[B.posBg,B.pos], warning:[B.warnBg,B.warn], danger:[B.negBg,B.neg], info:[B.infoBg,B.info], neutral:[B.bg,B.t3] };
  const [bg,color]=m[type]||m.success;
  return <span style={{ display:"inline-flex", alignItems:"center", fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:20, background:bg, color, fontFamily:F }}>{children}</span>;
}
