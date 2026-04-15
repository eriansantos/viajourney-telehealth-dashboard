import { B, F } from "../../lib/brand.js";

export default function Tbl({ headers, rows }) {
  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%", fontSize:12, borderCollapse:"collapse" }}>
        <thead><tr style={{ background:B.bg }}>{headers.map((h,i)=><th key={i} style={{ fontSize:10,fontWeight:600,color:B.t3,textAlign:"left",padding:"8px 12px",borderBottom:`1px solid ${B.border}`,textTransform:"uppercase",letterSpacing:"0.05em",fontFamily:F,whiteSpace:"nowrap" }}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((row,i)=><tr key={i} onMouseEnter={e=>e.currentTarget.style.background=B.g50} onMouseLeave={e=>e.currentTarget.style.background="transparent"} style={{ transition:"background 0.1s" }}>{row.map((cell,j)=><td key={j} style={{ padding:"9px 12px",borderBottom:i<rows.length-1?`1px solid ${B.border}`:"none",color:j===0?B.t1:B.t2,fontWeight:j===0?600:400,fontFamily:F,whiteSpace:"nowrap" }}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
