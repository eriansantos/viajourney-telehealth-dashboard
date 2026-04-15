export default function Grid({ children, cols=4, mb=14 }) {
  return <div style={{ display:"grid", gridTemplateColumns:`repeat(auto-fit,minmax(${cols<=3?190:148}px,1fr))`, gap:10, marginBottom:mb }}>{children}</div>;
}
