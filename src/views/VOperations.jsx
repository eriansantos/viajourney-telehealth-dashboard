import { Line } from "react-chartjs-2";
import { B } from "../lib/brand.js";
import { co } from "../lib/chartOptions.js";
import { D } from "../lib/mockData.js";
import KpiCard from "../components/atoms/KpiCard.jsx";
import Card from "../components/atoms/Card.jsx";
import Lgnd from "../components/atoms/Lgnd.jsx";
import Grid from "../components/atoms/Grid.jsx";
import SecHeader from "../components/atoms/SecHeader.jsx";

export default function VOperations() {
  return (
    <div>
      <SecHeader tag="Module 10 · Priority · RingCentral + GoHighLevel" title="Operations & Support Load" desc="Prevent clinician burnout and operational bottlenecks." />
      <Grid cols={3}>
        <KpiCard label="Messages per visit"    value="2.3"  subunit="Avg async messages"          accent={B.ch.g} />
        <KpiCard label="Calls per visit"       value="0.8"  trend="↓ Below 1.0 target"            accent={B.ch.a} />
        <KpiCard label="Follow-up completion"  value="87"   unit="%" trend="↑ +3pts vs last month" accent={B.ch.t} />
        <KpiCard label="Avg response time"     value="14"   unit="min" trend="↓ −4min vs last month" accent={B.ch.g} />
        <KpiCard label="No-show rate"          value="4.8"  unit="%" trend="↓ −0.6pts MTD"        accent={B.ch.r} />
        <KpiCard label="Cancellation rate"     value="7.2"  unit="%" subunit="Within range"        accent={B.ch.a} />
      </Grid>
      <Card title="Support load — 8 weeks" source="RingCentral + GoHighLevel">
        <Lgnd items={[{label:"Calls / visit",color:B.ch.a},{label:"Messages / visit",color:B.ch.g}]} />
        <div style={{ height:230 }}><Line data={D.ops} options={co()} /></div>
      </Card>
    </div>
  );
}
