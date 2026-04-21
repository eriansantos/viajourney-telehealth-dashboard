import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Bar } from "react-chartjs-2";
import { B, F } from "../lib/brand.js";
import { coS } from "../lib/chartOptions.js";
import { D } from "../lib/mockData.js";
import { apiGet } from "../lib/api.js";
import KpiCard from "../components/atoms/KpiCard.jsx";
import Card from "../components/atoms/Card.jsx";
import Pill from "../components/atoms/Pill.jsx";
import Bar2 from "../components/atoms/Bar2.jsx";
import Lgnd from "../components/atoms/Lgnd.jsx";
import Grid from "../components/atoms/Grid.jsx";
import Two from "../components/atoms/Two.jsx";
import SecHeader from "../components/atoms/SecHeader.jsx";
import Tbl from "../components/atoms/Tbl.jsx";

function fmtTrend(delta, unit = "") {
  if (delta == null) return undefined;
  if (delta === 0) return "= no change";
  const arrow = delta > 0 ? "↑" : "↓";
  return `${arrow} ${delta > 0 ? "+" : ""}${delta}${unit} vs last month`;
}

function statusFromChurn(pct) {
  if (pct == null) return <Pill type="neutral">—</Pill>;
  if (pct < 3)  return <Pill type="success">Healthy</Pill>;
  if (pct < 5)  return <Pill type="warning">Monitor</Pill>;
  return <Pill type="danger">At risk</Pill>;
}

export default function VMembership() {
  const { getToken } = useAuth();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiGet("/api/hint/membership", getToken)
      .then((res) => { if (!cancelled) { setData(res); setLoading(false); } })
      .catch((err) => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  const live = data?.configured === true;
  const k    = live ? (data.kpis || {}) : {};

  // KPI values
  const activeMembers      = live ? (k.activeMembers      ?? "—") : "312";
  const newMTD             = live ? (k.newMTD             ?? "—") : "38";
  const cancelledMTD       = live ? (k.cancelledMTD       ?? "—") : "7";
  const monthlyChurn       = live ? (k.monthlyChurnPct    ?? "—") : "2.2";
  const avgDuration        = live ? (k.avgDurationMonths  ?? "—") : "8.4";
  const annualizedChurn    = live ? (k.annualizedChurnPct ?? "—") : "24";

  // Growth chart
  const growthData = live && data.growth
    ? {
        labels: data.growth.labels,
        datasets: [
          { label: "New",        data: data.growth.newMembers,               backgroundColor: B.ch.g, borderRadius: 4, stack: "g" },
          { label: "Cancelled",  data: data.growth.cancellations.map(n=>-n), backgroundColor: B.ch.r, borderRadius: 4, stack: "g" },
        ],
      }
    : D.mGrow;

  // Retention cohort
  const retention = live ? (data.retention || {}) : { m1: 96, m3: 88, m6: 79, m12: 66 };

  // Table rows
  const byPlanRows = live && Array.isArray(data.byPlan) && data.byPlan.length > 0
    ? data.byPlan.map((p) => [
        p.name,
        String(p.active),
        String(p.newMTD),
        String(p.cancelledMTD),
        `${p.churnPct}%`,
        statusFromChurn(p.churnPct),
      ])
    : [
        ["Standard Member", "198", "22", "4", "2.0%", <Pill type="success">Healthy</Pill>],
        ["Concierge Plan",  "86",  "12", "2", "2.3%", <Pill type="success">Healthy</Pill>],
        ["Employer / Partner", "28", "4", "1", "3.6%", <Pill type="warning">Monitor</Pill>],
      ];

  return (
    <div>
      <SecHeader tag="Module 5 · Priority" title="Membership & Retention" desc="Predict revenue stability and identify churn risk early." />

      {error && (
        <div style={{ padding: "10px 14px", marginBottom: 12, borderRadius: 8, background: B.negBg, color: B.neg, fontSize: 12, fontFamily: F }}>
          Error loading data: {error}
        </div>
      )}

      <Grid cols={3}>
        <KpiCard
          label="Active members"
          value={loading ? "…" : activeMembers}
          trend={live ? undefined : "↑ +21 this week"}
          accent={B.ch.g}
        />
        <KpiCard
          label="New members (MTD)"
          value={loading ? "…" : newMTD}
          trend={live ? fmtTrend(k.deltaNewVsPrev) : "↑ +26% vs last month"}
          accent={B.ch.t}
        />
        <KpiCard
          label="Cancellations (MTD)"
          value={loading ? "…" : cancelledMTD}
          trend={live ? fmtTrend(k.deltaCancelVsPrev) : "↓ −3 vs last month"}
          trendBad={live ? (k.deltaCancelVsPrev > 0) : true}
          accent={B.ch.r}
        />
        <KpiCard
          label="Monthly churn"
          value={loading ? "…" : monthlyChurn}
          unit="%"
          trend={live ? undefined : "↓ Below 3% target"}
          accent={B.ch.t}
        />
        <KpiCard
          label="Avg membership duration"
          value={loading ? "…" : avgDuration}
          unit="mo"
          trend={live ? undefined : "↑ +0.6mo vs Q4"}
          accent={B.ch.g}
        />
        <KpiCard
          label="Annualized churn"
          value={loading ? "…" : annualizedChurn}
          unit="%"
          subunit="Target: below 28%"
          accent={B.ch.t}
        />
      </Grid>

      <Two>
        <Card title="Net member growth — 6 months">
          <Lgnd items={[{label:"New members",color:B.ch.g},{label:"Cancellations",color:B.ch.r}]} />
          {loading ? (
            <div style={{ height:200, display:"flex", alignItems:"center", justifyContent:"center", color:B.t3, fontSize:12, fontFamily:F }}>Loading…</div>
          ) : (
            <div style={{ height:200 }}><Bar data={growthData} options={coS()} /></div>
          )}
        </Card>
        <Card title="Retention cohort">
          <div style={{ paddingTop:8 }}>
            <Bar2 label="Retained at 1 month"   value={retention.m1  ?? 0} color={B.g700} />
            <Bar2 label="Retained at 3 months"  value={retention.m3  ?? 0} color={B.g600} />
            <Bar2 label="Retained at 6 months"  value={retention.m6  ?? 0} color={B.g500} />
            <Bar2 label="Retained at 12 months" value={retention.m12 ?? 0} color={B.g400} />
          </div>
        </Card>
      </Two>

      <Card title="Members by plan type">
        <Tbl headers={["Plan","Active","New (MTD)","Cancelled (MTD)","Churn","Status"]} rows={byPlanRows} />
      </Card>
    </div>
  );
}
