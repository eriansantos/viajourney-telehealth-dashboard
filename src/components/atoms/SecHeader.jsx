import { B, F } from "../../lib/brand.js";

export default function SecHeader({ title }) {
  return (
    <div style={{ marginBottom:18 }}>
      <h2 style={{ fontSize:18, fontWeight:700, color:B.t1, margin:0, fontFamily:F, letterSpacing:"-0.02em" }}>{title}</h2>
    </div>
  );
}
