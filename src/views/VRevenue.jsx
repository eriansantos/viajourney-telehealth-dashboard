import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Line, Doughnut } from "react-chartjs-2";
import { B, F } from "../lib/brand.js";
import { co, coD } from "../lib/chartOptions.js";
import { D } from "../lib/mockData.js";
import { apiGet } from "../lib/api.js";
import KpiCard from "../components/atoms/KpiCard.jsx";
import Card from "../components/atoms/Card.jsx";
import Pill from "../components/atoms/Pill.jsx";
import Lgnd from "../components/atoms/Lgnd.jsx";
import Grid from "../components/atoms/Grid.jsx";
import Two from "../components/atoms/Two.jsx";
import SecHeader from "../components/atoms/SecHeader.jsx";
import Tbl from "../components/atoms/Tbl.jsx";

function fmtK(n) {
  if (n == null || n === "—") return "—";
  return (Number(n) / 1000).toFixed(1);
}
function fmtMoney(n) {
  if (n == null || n === "—") return "—";
  return `$${Math.round(Number(n)).toLocaleString("en-US")}`;
}
function fmtTrendPct(delta) {
  if (delta == null) return undefined;
  if (delta === 0) return "= no change";
  return `${delta > 0 ? "↑ +" : "↓ "}${delta}% vs last month`;
}
function failedPill(pct) {
  if (pct == null) return <Pill type="neutral">—</Pill>;
  if (pct < 3)  return <Pill type="success">{pct}%</Pill>;
  if (pct < 5)  return <Pill type="warning">{pct}%</Pill>;
  return <Pill type="danger">{pct}%</Pill>;
}

const PLAN_COLORS = [B.ch.g, B.ch.t, B.ch.a, B.g700, B.ch.s, B.t4];

export default function VRevenue() {
  const { getToken } = useAuth();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiGet("/api/hint/revenue", getToken)
      .then((res) => { if (!cancelled) { setData(res); setLoading(false); } })
      .catch((err) => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  const live = data?.configured === true;
  const k    = live ? (data.kpis || {}) : {};

  // KPIs
  const revenueMTDk        = live ? fmtK(k.revenueMTD)             : "81.6";
  const revenueMTDFull     = live ? fmtMoney(k.revenueMTD)         : "$81.6k";
  const revenuePerPatient  = live ? fmtMoney(k.revenuePerPatient)  : "$218";
  const revenuePerClinK    = live ? fmtK(k.revenuePerClinician)    : "27.2";
  const failedRate         = live ? (k.failedRate     ?? "—")       : "3.1";
  const recoveryRate       = live ? (k.recoveryRate   ?? "—")       : "72";
  const refundRate         = live ? (k.refundRate     ?? "—")       : "0.8";
  const chargebackRate     = live ? (k.chargebackRate ?? "—")       : "0.2";

  // Doughnut — revenue by plan (percentages)
  const planTotal = live && data.byPlan
    ? data.byPlan.reduce((s, p) => s + (p.revenueMTD || 0), 0) || 1
    : 1;
  const revPlanData = live && Array.isArray(data.byPlan) && data.byPlan.length > 0
    ? {
        labels: data.byPlan.map((p) => p.name),
        datasets: [{
          data:            data.byPlan.map((p) => Math.round((p.revenueMTD / planTotal) * 100)),
          backgroundColor: data.byPlan.map((_, i) => PLAN_COLORS[i % PLAN_COLORS.length]),
          borderWidth:     0,
          hoverOffset:     6,
        }],
      }
    : D.revPlan;

  const revPlanLegend = live && Array.isArray(data.byPlan) && data.byPlan.length > 0
    ? data.byPlan.map((p, i) => ({
        label: `${p.name} ${Math.round((p.revenueMTD / planTotal) * 100)}%`,
        color: PLAN_COLORS[i % PLAN_COLORS.length],
      }))
    : [
        { label: "Standard Member 44%", color: B.ch.g },
        { label: "Concierge 28%",       color: B.ch.t },
        { label: "One-time 18%",        color: B.ch.a },
        { label: "Employer 10%",        color: B.g700 },
      ];

  // Line — 6-month trend
  const trendData = live && data.trend
    ? {
        labels: data.trend.labels,
        datasets: [{
          label:           "Revenue",
          data:            data.trend.revenue,
          borderColor:     B.ch.g,
          backgroundColor: "rgba(46,158,88,0.07)",
          fill:            true,
          tension:         0.4,
          pointRadius:     4,
          pointBackgroundColor: B.ch.g,
          pointBorderColor:    "#fff",
          pointBorderWidth:    2,
        }],
      }
    : D.revTrend;

  // Tabela — revenue by plan detail
  const byPlanRows = live && Array.isArray(data.byPlan) && data.byPlan.length > 0
    ? data.byPlan.map((p) => [
        p.name,
        fmtMoney(p.revenueMTD),
        fmtMoney(p.perPatient),
        `${p.active} active`,
        <Pill type="neutral">N/A</Pill>,
        <Pill type="success">Healthy</Pill>,
      ])
    : [
        ["Standard Member ($59/mo)", "$35,904", "$59",  "198 active", <Pill type="success">1.5%</Pill>, <Pill type="success">Healthy</Pill>],
        ["Concierge ($85/mo)",       "$22,848", "$85",  "86 active",  <Pill type="success">2.3%</Pill>, <Pill type="success">Healthy</Pill>],
        ["One-time visits",          "$14,688", "$218", "28 visits",  <Pill type="neutral">N/A</Pill>,  <Pill type="success">Healthy</Pill>],
        ["Employer / B2B",           "$8,160",  "$190", "28 covered", <Pill type="warning">5.8%</Pill>, <Pill type="warning">Monitor</Pill>],
      ];

  return (
    <div>
      <SecHeader tag="Module 6" title="Revenue & Financial Health" desc="Know if growth is profitable." />

      {error && (
        <div style={{ padding: "10px 14px", marginBottom: 12, borderRadius: 8, background: B.negBg, color: B.neg, fontSize: 12, fontFamily: F }}>
          Error loading data: {error}
        </div>
      )}

      <Grid cols={4} mb={12}>
        <KpiCard
          label="Revenue (MTD)"
          value={loading ? "…" : (live ? `$${revenueMTDk}` : "$81.6")}
          unit={loading ? "" : "k"}
          trend={live ? fmtTrendPct(k.deltaPctVsPrev) : "↑ +10% vs last month"}
          accent={B.ch.g}
        />
        <KpiCard
          label="Revenue per patient"
          value={loading ? "…" : revenuePerPatient}
          trend={live ? undefined : "↑ +$14 vs last month"}
          accent={B.ch.t}
        />
        <KpiCard
          label="Revenue per clinician"
          value={loading ? "…" : (live ? `$${revenuePerClinK}` : "$27.2")}
          unit={loading ? "" : "k/mo"}
          subunit="per clinician"
          accent={B.g700}
        />
        <KpiCard
          label="Failed payment rate"
          value={loading ? "…" : failedRate}
          unit={loading ? "" : "%"}
          trend={live ? undefined : "↓ −0.4pts"}
          accent={B.ch.a}
        />
      </Grid>

      <Grid cols={3} mb={12}>
        <KpiCard
          label="Recovery after retry"
          value={loading ? "…" : recoveryRate}
          unit={loading ? "" : "%"}
          trend={live ? undefined : "↑ +2pts"}
          accent={B.ch.g}
        />
        <KpiCard
          label="Refund rate"
          value={loading ? "…" : refundRate}
          unit={loading ? "" : "%"}
          trend={live ? undefined : "↓ Below 1% target"}
          accent={B.ch.t}
        />
        <KpiCard
          label="Chargeback rate"
          value={loading ? "…" : chargebackRate}
          unit={loading ? "" : "%"}
          trend={live ? undefined : "↓ Excellent"}
          accent={B.ch.t}
        />
      </Grid>

      <Two>
        <Card title="Revenue by plan type">
          <Lgnd items={revPlanLegend} />
          {loading ? (
            <div style={{height:200,display:"flex",alignItems:"center",justifyContent:"center",color:B.t3,fontSize:12,fontFamily:F}}>Loading…</div>
          ) : (
            <div style={{height:200,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{position:"relative",width:180,height:180}}>
                <Doughnut data={revPlanData} options={coD()} />
                <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",pointerEvents:"none"}}>
                  <div style={{fontSize:16,fontWeight:700,color:B.t1,fontFamily:F}}>{live ? revenueMTDFull : "$81.6k"}</div>
                  <div style={{fontSize:10,color:B.t3,marginTop:1,fontFamily:F}}>MTD</div>
                </div>
              </div>
            </div>
          )}
        </Card>
        <Card title="Revenue trend — 6 months">
          {loading ? (
            <div style={{height:220,display:"flex",alignItems:"center",justifyContent:"center",color:B.t3,fontSize:12,fontFamily:F}}>Loading…</div>
          ) : (
            <div style={{height:220}}>
              <Line
                data={trendData}
                options={co({ scales: { ...co().scales, y: { ...co().scales.y, ticks: { ...co().scales.y.ticks, callback: v => "$" + (v/1000).toFixed(0) + "k" } } } })}
              />
            </div>
          )}
        </Card>
      </Two>

      <Card title="Revenue by plan — detail">
        <Tbl
          headers={["Plan","Revenue MTD","Revenue/patient","Patients","Failed payments","Status"]}
          rows={byPlanRows}
        />
      </Card>
    </div>
  );
}
