import { B, F } from "../lib/brand.js";
import KpiCard from "../components/atoms/KpiCard.jsx";
import Card from "../components/atoms/Card.jsx";
import Bar2 from "../components/atoms/Bar2.jsx";
import Grid from "../components/atoms/Grid.jsx";
import Two from "../components/atoms/Two.jsx";
import SecHeader from "../components/atoms/SecHeader.jsx";

export default function VExperience() {
  return (
    <div>
      <SecHeader tag="Module 7 · Priority · Patient Form" title="Patient Experience" desc="Drive retention, referrals, and brand protection." />
      <Grid cols={3} mb={12}>
        <KpiCard label="Satisfaction (48h)"      value="4.7" unit="/5" accent={B.ch.t} />
        <KpiCard label="Satisfaction (7d)"       value="4.8" unit="/5" accent={B.ch.t} />
        <KpiCard label="% very satisfied"        value="84"  unit="%"  accent={B.ch.g} />
        <KpiCard label="Would recommend"         value="91"  unit="%"  accent={B.ch.t} />
        <KpiCard label="Complaints / 100 visits" value="1.4"           accent={B.ch.a} />
        <KpiCard label="Repeat usage rate"       value="38"  unit="%"  accent={B.ch.g} />
      </Grid>
      <Two align="start">
        <Card title="Satisfaction distribution">
          <div style={{ paddingTop:6 }}>
            {[["5★", 81, B.ch.g], ["4★", 12, B.ch.t], ["3★", 4, B.ch.s], ["2★", 2, B.ch.a], ["1★", 1, B.ch.r]].map(([label, value, color]) => (
              <div key={label} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <span style={{ fontSize:12, color:B.t2, fontFamily:F, width:24, textAlign:"right", flexShrink:0 }}>{label}</span>
                <div style={{ flex:1, background:B.bg, borderRadius:4, height:14, overflow:"hidden" }}>
                  <div style={{ width:`${value}%`, background:color, height:"100%", borderRadius:4, transition:"width 0.4s" }} />
                </div>
                <span style={{ fontSize:12, fontWeight:600, color:B.t1, fontFamily:F, width:30, flexShrink:0 }}>{value}%</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Top complaint reasons">
          <div style={{ paddingTop:6 }}>
            <Bar2 label="Wait time"         value={38} color={B.ch.a} />
            <Bar2 label="Follow-up unclear" value={29} color={B.ch.a} />
            <Bar2 label="Tech / platform"   value={18} color={B.ch.t} />
            <Bar2 label="Other"             value={15} color={B.t4} />
          </div>
        </Card>
      </Two>
    </div>
  );
}
