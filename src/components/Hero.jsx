import { useUser } from "@clerk/clerk-react";
import { B, F } from "../lib/brand.js";
import HeroKpi from "./atoms/HeroKpi.jsx";

export default function Hero() {
  const { user } = useUser();
  const firstName = user?.firstName || user?.fullName?.split(" ")[0] || "";
  const day = new Date().toLocaleDateString("en-US",{ weekday:"long", month:"long", day:"numeric" });
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return (
    <div style={{ background:`linear-gradient(135deg, ${B.g800} 0%, ${B.g600} 60%, ${B.g500} 100%)`, borderRadius:12, padding:"20px 24px 18px", marginBottom:16, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:-50, right:-50, width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.04)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:-30, right:120, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.03)", pointerEvents:"none" }} />
      <p style={{ fontSize:12, color:"rgba(255,255,255,0.55)", margin:"0 0 2px", fontFamily:F, fontWeight:500 }}>{day}</p>
      <h1 style={{ fontSize:20, fontWeight:700, color:"#fff", margin:"0 0 16px", fontFamily:F, letterSpacing:"-0.02em" }}>{greeting}{firstName ? `, ${firstName}` : ""}</h1>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
        <HeroKpi label="Visits this week"  value="184"   trend="↑ +12% vs last week" />
        <HeroKpi label="ER/UC avoidance"   value="78"    unit="%" trend="↑ +3pts vs last month" />
        <HeroKpi label="Active members"    value="312"   trend="↑ +21 this week" />
        <HeroKpi label="Satisfaction"      value="4.7"   unit="/5" trend="↑ Top decile" />
      </div>
    </div>
  );
}
