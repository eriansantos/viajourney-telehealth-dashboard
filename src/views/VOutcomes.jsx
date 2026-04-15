import { Bar } from "react-chartjs-2";
import { B } from "../lib/brand.js";
import { coP } from "../lib/chartOptions.js";
import { D } from "../lib/mockData.js";
import KpiCard from "../components/atoms/KpiCard.jsx";
import Card from "../components/atoms/Card.jsx";
import Pill from "../components/atoms/Pill.jsx";
import Bar2 from "../components/atoms/Bar2.jsx";
import Grid from "../components/atoms/Grid.jsx";
import Two from "../components/atoms/Two.jsx";
import SecHeader from "../components/atoms/SecHeader.jsx";
import Tbl from "../components/atoms/Tbl.jsx";

export default function VOutcomes() {
  return (
    <div>
      <SecHeader tag="Module 4 · Priority · Patient Form" title="Clinical Outcome Proxies" desc="Prove clinical value without overclaiming. Collected via automated post-visit surveys." />
      <Grid cols={3}>
        <KpiCard label="Would have gone to ER"    value="68"  unit="%" subunit="ER/UC avoidance proxy"   accent={B.ch.t} />
        <KpiCard label="Actually went to ER (7d)" value="6.2" unit="%" trend="↓ −0.8pts MTD"             accent={B.ch.t} />
        <KpiCard label="Improved at 48h"          value="82"  unit="%" trend="↑ +4pts vs last month"     accent={B.ch.g} />
        <KpiCard label="Resolved at 7 days"       value="91"  unit="%"                                   accent={B.ch.t} />
        <KpiCard label="Worsening rate"           value="3.4" unit="%" trend="↓ Within target"           accent={B.ch.a} />
        <KpiCard label="Re-visit same issue (7d)" value="9.1" unit="%" trend="↓ −1.2pts vs last month"   accent={B.ch.a} />
      </Grid>
      <Two>
        <Card title="ER/UC avoidance — monthly" source="Patient form"><div style={{ height:200 }}><Bar data={D.erAvoid} options={coP(60)} /></div></Card>
        <Card title="Symptom resolution" source="Patient form">
          <div style={{ paddingTop:6 }}>
            <Bar2 label="Improved at 48h"      value={82} color={B.ch.g} />
            <Bar2 label="Resolved at 7 days"   value={91} color={B.ch.g} />
            <Bar2 label="Escalated to outside" value={8}  color={B.ch.r} />
            <Bar2 label="Worsening rate"       value={3}  color={B.ch.a} />
          </div>
        </Card>
      </Two>
      <Card title="Post-visit survey — pending deployment">
        <Tbl headers={["Question","Trigger","Response type","Status"]} rows={[["Would you have gone to ER/UC without Via Journey?","Post-visit","Yes / No",<Pill type="warning">Pending</Pill>],["How are you feeling 48 hours after the visit?","48h auto","Scale 1–5",<Pill type="warning">Pending</Pill>],["Is your issue resolved at 7 days?","7d auto","Yes / No / Escalated",<Pill type="warning">Pending</Pill>],["Did you visit ER or UC within 7 days?","7d auto","Yes/No + facility",<Pill type="warning">Pending</Pill>]]} />
      </Card>
    </div>
  );
}
