import { B } from "../lib/brand.js";
import KpiCard from "../components/atoms/KpiCard.jsx";
import Card from "../components/atoms/Card.jsx";
import Pill from "../components/atoms/Pill.jsx";
import Bar2 from "../components/atoms/Bar2.jsx";
import Grid from "../components/atoms/Grid.jsx";
import Two from "../components/atoms/Two.jsx";
import SecHeader from "../components/atoms/SecHeader.jsx";
import Tbl from "../components/atoms/Tbl.jsx";

export default function VB2B() {
  return (
    <div>
      <SecHeader tag="Module 11" title="B2B / Employer Dashboards" desc="Sell and retain employer contracts with data-driven impact reports." />
      <Grid cols={4} mb={12}>
        <KpiCard label="Active employer contracts" value="3"    trend="+ 1 in pipeline"            accent={B.ch.g} />
        <KpiCard label="Total covered lives"       value="284"  trend="↑ +42 this quarter"         accent={B.ch.t} />
        <KpiCard label="Avg visits / 100 members"  value="24.6" subunit="per month"                accent={B.ch.a} />
        <KpiCard label="Avg ER/UC avoidance"       value="76"   unit="%" trend="↑ +4pts vs Q4"     accent={B.ch.g} />
      </Grid>
      <Card title="Employer contract summary" style={{marginBottom:12}}>
        <Tbl
          headers={["Employer","Covered lives","Visits/100","Time-to-care","ER avoidance","Satisfaction","Est. cost savings"]}
          rows={[
            ["BrazilianUS Corp","120","26.4","1.6h","79%","4.8/5",<Pill type="success">$38k/mo</Pill>],
            ["LKR Construction","96","23.8","1.9h","74%","4.6/5",<Pill type="success">$28k/mo</Pill>],
            ["SunState LLC","68","22.1","2.0h","72%","4.5/5",<Pill type="success">$19k/mo</Pill>],
          ]}
        />
      </Card>
      <Two>
        <Card title="ER/UC avoidance by employer">
          <div style={{paddingTop:6}}>
            <Bar2 label="BrazilianUS Corp" value={79} color={B.ch.g} />
            <Bar2 label="LKR Construction" value={74} color={B.ch.t} />
            <Bar2 label="SunState LLC"     value={72} color={B.ch.a} />
            <Bar2 label="Portfolio avg"    value={76} color={B.g700} />
          </div>
        </Card>
        <Card title="Impact metrics for B2B deck">
          <div style={{paddingTop:4}}>
            <Bar2 label="ER visits avoided (est.)" value={76} color={B.ch.g} />
            <Bar2 label="Same-day access"           value={91} color={B.ch.t} />
            <Bar2 label="Employee satisfaction"     value={94} color={B.ch.g} />
            <Bar2 label="Renewal intent"            value={88} color={B.g700} />
          </div>
        </Card>
      </Two>
    </div>
  );
}
