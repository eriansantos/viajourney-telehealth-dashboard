import { useClerk, useUser } from "@clerk/clerk-react";
import { B, F } from "../lib/brand.js";

export default function UserFooter({ clock }) {
  const { signOut } = useClerk();
  const { user } = useUser();
  const fullName = user?.fullName || user?.firstName || user?.emailAddresses?.[0]?.emailAddress || "";
  const initials = fullName.split(" ").filter(Boolean).slice(0,2).map((w) => w[0].toUpperCase()).join("");
  return (
    <div style={{ padding:"10px 14px", borderTop:`1px solid ${B.border}`, flexShrink:0 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:8, background:B.bg }}>
        <div style={{ width:28, height:28, borderRadius:"50%", background:B.g500, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#fff", fontFamily:F, flexShrink:0 }}>{initials || "?"}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:12, fontWeight:600, color:B.t1, fontFamily:F, lineHeight:1.2 }}>{fullName || "—"}</div>
          <div style={{ fontSize:10, color:B.t3, fontFamily:F }}>Admin</div>
        </div>
        <button
          onClick={() => signOut()}
          title="Sign out"
          style={{ flexShrink:0, background:"none", border:`1px solid ${B.border}`, borderRadius:6, padding:"4px 7px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={B.t3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
      <div style={{ display:"flex", alignItems:"center", marginTop:8, padding:"0 2px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#22C55E" }} />
          <span style={{ fontSize:10, color:B.t3, fontFamily:F }}>{clock}</span>
        </div>
      </div>
    </div>
  );
}
