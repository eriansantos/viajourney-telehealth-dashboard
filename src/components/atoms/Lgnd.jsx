import { B, F } from "../../lib/brand.js";

export default function Lgnd({ items }) {
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:12, marginBottom:10 }}>
      {items.map(({label,color})=>(
        <span key={label} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:B.t2, fontFamily:F, fontWeight:500 }}>
          <span style={{ width:10, height:10, borderRadius:3, background:color }} />{label}
        </span>
      ))}
    </div>
  );
}
