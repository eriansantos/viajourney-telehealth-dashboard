import { Bar, Line } from "react-chartjs-2";
import { B } from "../lib/brand.js";
import { co } from "../lib/chartOptions.js";
import { D } from "../lib/mockData.js";
import KpiCard from "../components/atoms/KpiCard.jsx";
import Card from "../components/atoms/Card.jsx";
import Pill from "../components/atoms/Pill.jsx";
import Lgnd from "../components/atoms/Lgnd.jsx";
import Grid from "../components/atoms/Grid.jsx";
import Two from "../components/atoms/Two.jsx";
import SecHeader from "../components/atoms/SecHeader.jsx";
import Tbl from "../components/atoms/Tbl.jsx";

export default function VGrowth() {
  return (
    <div>
      <SecHeader tag="Module 1" title="Growth & Funnel" desc="Are people finding you, booking, and converting?" />
      <Grid cols={4} mb={12}>
        <KpiCard label="Total leads (MTD)"        value="312"  trend="↑ +18% vs last month"    accent={B.ch.g} />
        <KpiCard label="Lead → booked"            value="37"   unit="%" trend="↑ +2pts vs last month" accent={B.ch.t} />
        <KpiCard label="Lead → paid visit"        value="22"   unit="%" trend="↑ +1.4pts"           accent={B.ch.a} />
        <KpiCard label="Lead → member"            value="6.4"  unit="%" trend="↑ Best month"         accent={B.g700} />
      </Grid>
      <Grid cols={3} mb={12}>
        <KpiCard label="Avg cost per lead"        value="$18"  subunit="Paid channels only"      accent={B.ch.t} />
        <KpiCard label="Booking abandonment"      value="14"   unit="%" trend="↓ −3pts vs last month" accent={B.ch.a} />
        <KpiCard label="Self-schedule rate"       value="68"   unit="%" trend="↑ +5pts"           accent={B.ch.g} />
      </Grid>
      <Two>
        <Card title="Leads by source">
          <Lgnd items={[{label:"Website",color:B.ch.g},{label:"WhatsApp",color:B.ch.t},{label:"Referral",color:B.ch.a},{label:"Employer",color:B.g700}]} />
          <div style={{height:210}}><Bar data={D.leadSrc} options={co()} /></div>
        </Card>
        <Card title="Conversion rate trend — 6 months">
          <Lgnd items={[{label:"Lead → Member %",color:B.ch.g},{label:"Lead → Booked %",color:B.ch.t}]} />
          <div style={{height:210}}><Line data={D.convTrend} options={co()} /></div>
        </Card>
      </Two>
      <Card title="Conversion by language & state">
        <Tbl
          headers={["Segment","Leads","Booked %","Paid Visit %","Member %","Status"]}
          rows={[
            ["Portuguese speakers","168","42%","26%","7.8%",<Pill type="success">Best</Pill>],
            ["English speakers","88","34%","20%","5.2%",<Pill type="success">On track</Pill>],
            ["Spanish speakers","46","28%","15%","3.1%",<Pill type="warning">Monitor</Pill>],
            ["Florida","196","39%","24%","7.1%",<Pill type="success">On track</Pill>],
            ["Texas","72","32%","18%","4.8%",<Pill type="success">On track</Pill>],
            ["Other states","44","26%","14%","2.9%",<Pill type="warning">Monitor</Pill>],
          ]}
        />
      </Card>
    </div>
  );
}
