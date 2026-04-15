import { Bar, Line } from "react-chartjs-2";
import { B } from "../lib/brand.js";
import { co, coS } from "../lib/chartOptions.js";
import { D } from "../lib/mockData.js";
import Hero from "../components/Hero.jsx";
import KpiCard from "../components/atoms/KpiCard.jsx";
import Card from "../components/atoms/Card.jsx";
import Lgnd from "../components/atoms/Lgnd.jsx";
import Grid from "../components/atoms/Grid.jsx";
import Two from "../components/atoms/Two.jsx";

export default function VOverview() {
  return (
    <div>
      <Hero />
      <Grid cols={5} mb={12}>
        <KpiCard label="Median time-to-care"  value="1.8"   unit="h"   trend="↓ −22min vs last week"    accent={B.ch.t} />
        <KpiCard label="7-day ER/UC use"      value="6.2"   unit="%"   trend="↓ −0.8pts"                accent={B.ch.a} />
        <KpiCard label="New members"          value="24"    trend="↑ +6 vs last week"             accent={B.ch.g} />
        <KpiCard label="Revenue this week"    value="$18.4" unit="k"   trend="↑ +8% vs last week"        accent={B.g700} />
        <KpiCard label="Re-contact rate"      value="9.1"   unit="%"   trend="↓ −1.2pts vs last month"   accent={B.ch.a} />
      </Grid>
      <Two>
        <Card title="Visit trend — last 8 weeks" source="Elation API">
          <Lgnd items={[{label:"Member",color:B.ch.g},{label:"Concierge",color:B.ch.t},{label:"One-time",color:B.ch.a}]} />
          <div style={{ height:188 }}><Bar data={D.visits} options={coS()} /></div>
        </Card>
        <Card title="Membership growth — 6 months" source="Hint API">
          <div style={{ height:212 }}><Line data={D.members} options={co()} /></div>
        </Card>
      </Two>
    </div>
  );
}
