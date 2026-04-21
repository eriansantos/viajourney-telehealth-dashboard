import { Bar } from "react-chartjs-2";
import { B } from "../lib/brand.js";
import { coS } from "../lib/chartOptions.js";
import { D } from "../lib/mockData.js";
import KpiCard from "../components/atoms/KpiCard.jsx";
import Card from "../components/atoms/Card.jsx";
import Pill from "../components/atoms/Pill.jsx";
import Bar2 from "../components/atoms/Bar2.jsx";
import Lgnd from "../components/atoms/Lgnd.jsx";
import Grid from "../components/atoms/Grid.jsx";
import Two from "../components/atoms/Two.jsx";
import SecHeader from "../components/atoms/SecHeader.jsx";
import Tbl from "../components/atoms/Tbl.jsx";

export default function VMembership() {
  return (
    <div>
      <SecHeader tag="Module 5 · Priority" title="Membership & Retention" desc="Predict revenue stability and identify churn risk early." />
      <Grid cols={3}>
        <KpiCard label="Active members"          value="312"  trend="↑ +21 this week"         accent={B.ch.g} />
        <KpiCard label="New members (MTD)"       value="38"   trend="↑ +26% vs last month"    accent={B.ch.t} />
        <KpiCard label="Cancellations (MTD)"     value="7"    trend="↓ −3 vs last month"      trendBad accent={B.ch.r} />
        <KpiCard label="Monthly churn"           value="2.2"  unit="%" trend="↓ Below 3% target" accent={B.ch.t} />
        <KpiCard label="Avg membership duration" value="8.4"  unit="mo" trend="↑ +0.6mo vs Q4" accent={B.ch.g} />
        <KpiCard label="Annualized churn"        value="24"   unit="%" subunit="Target: below 28%" accent={B.ch.t} />
      </Grid>
      <Two>
        <Card title="Net member growth — 6 months">
          <Lgnd items={[{label:"New members",color:B.ch.g},{label:"Cancellations",color:B.ch.r}]} />
          <div style={{ height:200 }}><Bar data={D.mGrow} options={coS()} /></div>
        </Card>
        <Card title="Retention cohort">
          <div style={{ paddingTop:8 }}>
            <Bar2 label="Retained at 1 month"   value={96} color={B.g700} />
            <Bar2 label="Retained at 3 months"  value={88} color={B.g600} />
            <Bar2 label="Retained at 6 months"  value={79} color={B.g500} />
            <Bar2 label="Retained at 12 months" value={66} color={B.g400} />
          </div>
        </Card>
      </Two>
      <Card title="Members by plan type">
        <Tbl headers={["Plan","Active","New (MTD)","Cancelled (MTD)","Churn","Status"]} rows={[["Standard Member","198","22","4","2.0%",<Pill type="success">Healthy</Pill>],["Concierge Plan","86","12","2","2.3%",<Pill type="success">Healthy</Pill>],["Employer / Partner","28","4","1","3.6%",<Pill type="warning">Monitor</Pill>]]} />
      </Card>
    </div>
  );
}
