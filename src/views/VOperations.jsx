import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Line } from "react-chartjs-2";
import { B, F } from "../lib/brand.js";
import { co } from "../lib/chartOptions.js";
import { D } from "../lib/mockData.js";
import { apiGet } from "../lib/api.js";
import KpiCard from "../components/atoms/KpiCard.jsx";
import Card from "../components/atoms/Card.jsx";
import Lgnd from "../components/atoms/Lgnd.jsx";
import Grid from "../components/atoms/Grid.jsx";
import SecHeader from "../components/atoms/SecHeader.jsx";

export default function VOperations() {
  const { getToken } = useAuth();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiGet("/api/rc/support-load", getToken)
      .then((res) => { if (!cancelled) { setData(res); setLoading(false); } })
      .catch((err) => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  // Se RC configurado usa dados reais, senão usa mock
  const live = data?.configured === true;

  const callsPerVisit    = live ? (data.kpis?.callsPerVisit    ?? "—") : "0.8";
  const msgsPerVisit     = live ? (data.kpis?.msgsPerVisit     ?? "—") : "2.3";
  const avgResponseMin   = live ? (data.kpis?.avgResponseMin   ?? "—") : "14";
  const followUpRate     = live ? (data.kpis?.followUpRate     ?? "—") : "87";
  const noShowRate       = live ? (data.kpis?.noShowRate       ?? "—") : "4.8";
  const cancellationRate = live ? (data.kpis?.cancellationRate ?? "—") : "7.2";

  // Dados do gráfico de tendência
  const trendData = live && data.trend
    ? {
        labels: data.trend.labels,
        datasets: [
          {
            label: "Calls / visit",
            data: data.trend.callsPerVisit,
            borderColor: B.ch.a,
            backgroundColor: B.ch.a + "22",
            tension: 0.4,
            pointRadius: 3,
            spanGaps: true,
          },
          {
            label: "Messages / visit",
            data: data.trend.msgsPerVisit,
            borderColor: B.ch.g,
            backgroundColor: B.ch.g + "22",
            tension: 0.4,
            pointRadius: 3,
            spanGaps: true,
          },
        ],
      }
    : D.ops;

  return (
    <div>
      <SecHeader
        tag="Module 10 · Priority"
        title="Operations & Support Load"
        desc="Prevent clinician burnout and operational bottlenecks."
      />

      {error && (
        <div style={{ padding: "10px 14px", marginBottom: 12, borderRadius: 8, background: B.negBg, color: B.neg, fontSize: 12, fontFamily: F }}>
          Error loading data: {error}
        </div>
      )}

      <Grid cols={3}>
        <KpiCard
          label="Messages per visit"
          value={loading ? "…" : msgsPerVisit}
          subunit="Avg async messages"
          accent={B.ch.g}
        />
        <KpiCard
          label="Calls per visit"
          value={loading ? "…" : callsPerVisit}
          trend={live ? undefined : "↓ Below 1.0 target"}
          accent={B.ch.a}
        />
        <KpiCard
          label="Follow-up completion"
          value={loading ? "…" : followUpRate}
          unit={loading ? "" : "%"}
          trend={live ? undefined : "↑ +3pts vs last month"}
          accent={B.ch.t}
        />
        <KpiCard
          label="Avg response time"
          value={loading ? "…" : avgResponseMin}
          unit={loading ? "" : "min"}
          trend={live ? undefined : "↓ −4min vs last month"}
          accent={B.ch.g}
        />
        <KpiCard
          label="No-show rate"
          value={loading ? "…" : noShowRate}
          unit={loading ? "" : "%"}
          trend={live ? undefined : "↓ −0.6pts MTD"}
          accent={B.ch.r}
        />
        <KpiCard
          label="Cancellation rate"
          value={loading ? "…" : cancellationRate}
          unit={loading ? "" : "%"}
          subunit={live ? undefined : "Within range"}
          accent={B.ch.a}
        />
      </Grid>

      <Card title="Support load — 8 weeks">
        <Lgnd items={[{ label: "Calls / visit", color: B.ch.a }, { label: "Messages / visit", color: B.ch.g }]} />
        {loading ? (
          <div style={{ height: 230, display: "flex", alignItems: "center", justifyContent: "center", color: B.t3, fontSize: 12, fontFamily: F }}>
            Loading…
          </div>
        ) : (
          <div style={{ height: 230 }}>
            <Line data={trendData} options={co()} />
          </div>
        )}
      </Card>
    </div>
  );
}
