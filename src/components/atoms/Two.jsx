export default function Two({ children, mb=12, align }) {
  return <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:mb, alignItems:align||"stretch" }}>{children}</div>;
}
