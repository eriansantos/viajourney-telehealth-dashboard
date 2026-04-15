import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Bar } from "react-chartjs-2";
import { B, F } from "../lib/brand.js";
import { co } from "../lib/chartOptions.js";
import { apiGet } from "../lib/api.js";
import KpiCard from "../components/atoms/KpiCard.jsx";
import Card from "../components/atoms/Card.jsx";
import Grid from "../components/atoms/Grid.jsx";
import SecHeader from "../components/atoms/SecHeader.jsx";

export default function VAccess() {
  const { getToken } = useAuth();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiGet("/api/elation/speed-to-care", getToken)
      .then((res) => { if (!cancelled) { setData(res); setLoading(false); } })
      .catch((err) => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  const avgLead       = data?.avgLeadTimeHours != null
    ? data.avgLeadTimeHours >= 24
      ? `${Math.round(data.avgLeadTimeHours / 24)}d`
      : `${data.avgLeadTimeHours}h`
    : "—";
  const sameDayRate   = data?.sameDayRate    ?? "—";
  const cancelRate    = data?.cancellationRate ?? "—";
  const noShowRate    = data?.noShowRate     ?? "—";
  const avgDuration   = data?.avgDuration    ?? "—";
  const dist          = data?.leadTimeDistribution ?? {};
  const distLabels    = Object.keys(dist);
  const distValues    = Object.values(dist);

  return (
    <div>
      <SecHeader tag="Module 3 · Priority · Elation API" title="Access & Speed-to-Care" />

      {error && (
        <div style={{ padding:"10px 14px", marginBottom:12, borderRadius:8, background:B.negBg, color:B.neg, fontSize:12, fontFamily:F }}>
          Error loading data: {error}
        </div>
      )}

      <Grid cols={4}>
        <KpiCard label="Avg booking lead time"  value={loading ? "…" : avgLead}                              subunit="scheduled vs created"     accent={B.ch.t} />
        <KpiCard label="Same-day bookings"      value={loading ? "…" : sameDayRate} unit={loading ? "" : "%"} subunit="booked & seen same day"    accent={B.ch.g} />
        <KpiCard label="Cancellation rate"      value={loading ? "…" : cancelRate}  unit={loading ? "" : "%"} subunit="of total appointments"     accent={B.ch.a} />
        <KpiCard label="No-show rate"           value={loading ? "…" : noShowRate}  unit={loading ? "" : "%"} subunit="Not Seen"                  accent={B.ch.r} />
      </Grid>

      <Grid cols={2} mb={12}>
        <KpiCard label="Avg appointment duration" value={loading ? "…" : avgDuration} unit={loading ? "" : "min"} subunit="scheduled duration" accent={B.ch.t} />
        <KpiCard label="Total appointments"       value={loading ? "…" : (data?.total ?? "—")}                    subunit="in selected period"  accent={B.g700} />
      </Grid>

      <Card title="Booking lead time distribution" source="Elation API — live">
        {loading ? (
          <div style={{ height:220, display:"flex", alignItems:"center", justifyContent:"center", color:B.t3, fontSize:12, fontFamily:F }}>Loading...</div>
        ) : (
          <div style={{ height:220 }}>
            <Bar
              data={{ labels: distLabels, datasets:[{ data: distValues, backgroundColor:[B.ch.g, B.ch.t, B.ch.a, B.ch.r], borderRadius:5 }] }}
              options={co()}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
