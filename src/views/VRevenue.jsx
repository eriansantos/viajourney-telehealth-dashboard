import { Line, Doughnut } from "react-chartjs-2";
import { B, F } from "../lib/brand.js";
import { co, coD } from "../lib/chartOptions.js";
import { D } from "../lib/mockData.js";
import KpiCard from "../components/atoms/KpiCard.jsx";
import Card from "../components/atoms/Card.jsx";
import Pill from "../components/atoms/Pill.jsx";
import Lgnd from "../components/atoms/Lgnd.jsx";
import Grid from "../components/atoms/Grid.jsx";
import Two from "../components/atoms/Two.jsx";
import SecHeader from "../components/atoms/SecHeader.jsx";
import Tbl from "../components/atoms/Tbl.jsx";

export default function VRevenue() {
  return (
    <div>
      <SecHeader tag="Module 6" title="Revenue & Financial Health" desc="Know if growth is profitable." />
      <Grid cols={4} mb={12}>
        <KpiCard label="Revenue (MTD)"          value="$81.6" unit="k" trend="↑ +10% vs last month" accent={B.ch.g} />
        <KpiCard label="Revenue per patient"    value="$218"  trend="↑ +$14 vs last month"          accent={B.ch.t} />
        <KpiCard label="Revenue per clinician"  value="$27.2" unit="k/mo" subunit="per clinician"   accent={B.g700} />
        <KpiCard label="Failed payment rate"    value="3.1"   unit="%" trend="↓ −0.4pts"            accent={B.ch.a} />
      </Grid>
      <Grid cols={3} mb={12}>
        <KpiCard label="Recovery after retry"   value="72"    unit="%" trend="↑ +2pts"              accent={B.ch.g} />
        <KpiCard label="Refund rate"            value="0.8"   unit="%" trend="↓ Below 1% target"    accent={B.ch.t} />
        <KpiCard label="Chargeback rate"        value="0.2"   unit="%" trend="↓ Excellent"          accent={B.ch.t} />
      </Grid>
      <Two>
        <Card title="Revenue by plan type">
          <Lgnd items={[{label:"Standard Member 44%",color:B.ch.g},{label:"Concierge 28%",color:B.ch.t},{label:"One-time 18%",color:B.ch.a},{label:"Employer 10%",color:B.g700}]} />
          <div style={{height:200,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{position:"relative",width:180,height:180}}>
              <Doughnut data={D.revPlan} options={coD()} />
              <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",pointerEvents:"none"}}>
                <div style={{fontSize:16,fontWeight:700,color:B.t1,fontFamily:F}}>$81.6k</div>
                <div style={{fontSize:10,color:B.t3,marginTop:1,fontFamily:F}}>MTD</div>
              </div>
            </div>
          </div>
        </Card>
        <Card title="Revenue trend — 6 months">
          <div style={{height:220}}><Line data={D.revTrend} options={co({scales:{...co().scales,y:{...co().scales.y,ticks:{...co().scales.y.ticks,callback:v=>"$"+(v/1000).toFixed(0)+"k"}}}})} /></div>
        </Card>
      </Two>
      <Card title="Revenue by plan — detail">
        <Tbl
          headers={["Plan","Revenue MTD","Revenue/patient","Patients","Failed payments","Status"]}
          rows={[
            ["Standard Member ($59/mo)","$35,904","$59","198 active",<Pill type="success">1.5%</Pill>,<Pill type="success">Healthy</Pill>],
            ["Concierge ($85/mo)","$22,848","$85","86 active",<Pill type="success">2.3%</Pill>,<Pill type="success">Healthy</Pill>],
            ["One-time visits","$14,688","$218","28 visits",<Pill type="neutral">N/A</Pill>,<Pill type="success">Healthy</Pill>],
            ["Employer / B2B","$8,160","$190","28 covered",<Pill type="warning">5.8%</Pill>,<Pill type="warning">Monitor</Pill>],
          ]}
        />
      </Card>
    </div>
  );
}
