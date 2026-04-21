import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Bar, Doughnut } from "react-chartjs-2";
import { B, F } from "../lib/brand.js";
import { co, coD } from "../lib/chartOptions.js";
import { apiGet } from "../lib/api.js";
import KpiCard from "../components/atoms/KpiCard.jsx";
import Card from "../components/atoms/Card.jsx";
import Pill from "../components/atoms/Pill.jsx";
import Lgnd from "../components/atoms/Lgnd.jsx";
import Grid from "../components/atoms/Grid.jsx";
import Two from "../components/atoms/Two.jsx";
import SecHeader from "../components/atoms/SecHeader.jsx";
import Tbl from "../components/atoms/Tbl.jsx";

export default function VVisits() {
  const { getToken } = useAuth();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    apiGet("/api/elation/visit-volume", getToken)
      .then((res) => { if (!cancelled) { setData(res); setLoading(false); } })
      .catch((err) => { if (!cancelled) { setError(err.message); setLoading(false); } });

    return () => { cancelled = true; };
  }, [getToken]);

  const total        = data?.total ?? "—";
  const physicians   = data?.byPhysician ?? [];
  const activePh     = physicians.filter((p) => p.is_active).length;
  const perClinician = activePh > 0 ? Math.round(data.total / activePh) : "—";
  const inPerson     = data?.byMode?.IN_PERSON ?? 0;
  const video        = data?.byMode?.VIDEO ?? 0;
  const modeTotal    = inPerson + video || 1;
  const videoPct     = Math.round((video / modeTotal) * 100);

  const TYPE_COLORS   = { Member: B.ch.g, Concierge: B.ch.t, "One Time": B.ch.g2 };
  const STATUS_COLORS = {
    "Scheduled":              B.ch.s,   // slate — pendente/neutro
    "Confirmed":              B.ch.t2,  // teal claro — confirmado
    "Checked In":             B.ch.t,   // teal — chegou
    "In Room":                B.g600,   // verde médio
    "In Room - Vitals Taken": B.g600,
    "With Doctor":            B.ch.g,   // verde primário
    "Checked Out":            B.g700,   // verde escuro — concluído
    "Billed":                 B.g800,   // verde muito escuro — faturado
    "Not Seen":               B.ch.a,   // âmbar — atenção
    "Cancelled":              B.ch.r,   // vermelho — negativo
  };
  // Status group donut (Completed / No Access / Pending)
  const GROUP_COLORS = { Completed: B.ch.g, "No Access": B.ch.r, Pending: B.ch.s, Other: B.t3 };
  const GROUP_ORDER  = ["Completed","Pending","No Access","Other"];
  const sgRaw        = data?.byStatusGroup ?? {};
  const sgLabels     = GROUP_ORDER.filter(k => sgRaw[k]);
  const sgValues     = sgLabels.map(k => sgRaw[k]);
  const sgColors     = sgLabels.map(k => GROUP_COLORS[k]);

  // Individual status funnel (workflow order)
  const STATUS_ORDER  = ["Scheduled","Confirmed","Checked In","In Room","In Room - Vitals Taken","With Doctor","Checked Out","Billed","Not Seen","Cancelled"];
  const statusRaw     = data?.byStatus ?? {};
  const funnelLabels  = STATUS_ORDER.filter(s => statusRaw[s]);
  const funnelValues  = funnelLabels.map(s => statusRaw[s]);
  const funnelColors  = funnelLabels.map(s => STATUS_COLORS[s] ?? B.ch.s);

  const typeEntries  = Object.entries(data?.byType ?? {}).sort((a,b) => b[1]-a[1]);
  const typeLabels   = typeEntries.map(([k]) => k);
  const typeValues   = typeEntries.map(([,v]) => v);
  const typeBgColors = typeLabels.map(k => TYPE_COLORS[k] ?? B.ch.s);
  const peakHour     = data?.peakHour ?? "—";
  const peakDay      = data?.peakDay ?? "—";
  const repeatRate   = data?.repeatRate ?? "—";

  // Peak appointments by hour (bar chart)
  const hourLabels   = Object.keys(data?.byHour || {}).map((h) => {
    const n = parseInt(h);
    return n === 0 ? "12 AM" : n < 12 ? `${n} AM` : n === 12 ? "12 PM" : `${n-12} PM`;
  });
  const hourValues   = Object.values(data?.byHour || {});

  // Peak appointments by day of week
  const dayOrder   = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const byDay      = data?.byDayOfWeek || {};
  const dayLabels  = dayOrder.filter((d) => byDay[d] !== undefined);
  const dayValues  = dayLabels.map((d) => byDay[d]);

  return (
    <div>
      <SecHeader title="Visit Volume & Utilization" />

      {error && (
        <div style={{ padding:"10px 14px", marginBottom:12, borderRadius:8, background:B.negBg, color:B.neg, fontSize:12, fontFamily:F }}>
          Error loading data: {error}
        </div>
      )}

      <Grid cols={4}>
        <KpiCard label="Total appointments"   value={loading ? "…" : total}         accent={B.ch.g} />
        <KpiCard label="Visits per clinician" value={loading ? "…" : perClinician}  subunit="per active clinician"        accent={B.ch.t} />
        <KpiCard label="Telehealth (video)"   value={loading ? "…" : `${videoPct}`} unit="%"                              accent={B.ch.a} />
        <KpiCard label="Active clinicians"    value={loading ? "…" : activePh}      subunit="in practice"                 accent={B.g700} />
      </Grid>

      <Grid cols={3}>
        <KpiCard label="Peak hour"         value={loading ? "…" : peakHour}    subunit="most appointments"  accent={B.ch.t} />
        <KpiCard label="Peak day"          value={loading ? "…" : peakDay}     subunit="busiest day"        accent={B.ch.g} />
        <KpiCard label="Repeat visit rate" value={loading ? "…" : repeatRate}  unit="%" subunit="patients with 2+ visits" accent={B.ch.a} />
      </Grid>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:12 }}>
        <Card title="Visits by type">
          {loading ? (
            <div style={{ height:210, display:"flex", alignItems:"center", justifyContent:"center", color:B.t3, fontSize:12, fontFamily:F }}>Loading...</div>
          ) : (
            <>
              <Lgnd items={typeLabels.map((k,i) => ({ label:`${k} ${typeValues[i]}`, color:typeBgColors[i] }))} />
              <div style={{ height:210, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ position:"relative", width:160, height:160 }}>
                  <Doughnut
                    data={{ labels:typeLabels, datasets:[{ data:typeValues.length ? typeValues : [1], backgroundColor:typeValues.length ? typeBgColors : [B.border], borderWidth:2, borderColor:"#fff" }] }}
                    options={coD()}
                  />
                  <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center", pointerEvents:"none" }}>
                    <div style={{ fontSize:20, fontWeight:700, color:B.t1, fontFamily:F }}>{total}</div>
                    <div style={{ fontSize:10, color:B.t3, marginTop:1, fontFamily:F }}>Total</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Card>

        <Card title="Appointments by mode">
          {loading ? (
            <div style={{ height:210, display:"flex", alignItems:"center", justifyContent:"center", color:B.t3, fontSize:12, fontFamily:F }}>Loading...</div>
          ) : (
            <>
              <Lgnd items={[{label:`In-person ${inPerson}`,color:B.ch.g},{label:`Video ${video}`,color:B.ch.t}]} />
              <div style={{ height:210, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ position:"relative", width:160, height:160 }}>
                  <Doughnut data={{ labels:["In-person","Video"], datasets:[{ data: modeTotal > 0 ? [inPerson, video] : [1], backgroundColor: modeTotal > 0 ? [B.ch.g, B.ch.t] : [B.border], borderWidth:2, borderColor:"#fff" }] }} options={coD()} />
                  <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center", pointerEvents:"none" }}>
                    <div style={{ fontSize:20, fontWeight:700, color:B.t1, fontFamily:F }}>{total}</div>
                    <div style={{ fontSize:10, color:B.t3, marginTop:1, fontFamily:F }}>Total</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Card>

        <Card title="Status overview">
          {loading ? (
            <div style={{ height:234, display:"flex", alignItems:"center", justifyContent:"center", color:B.t3, fontSize:12, fontFamily:F }}>Loading...</div>
          ) : (
            <>
              <Lgnd items={sgLabels.map((k,i) => ({ label:`${k} ${sgValues[i]}`, color:sgColors[i] }))} />
              <div style={{ height:200, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ position:"relative", width:160, height:160 }}>
                  <Doughnut
                    data={{ labels:sgLabels, datasets:[{ data:sgValues.length ? sgValues : [1], backgroundColor:sgValues.length ? sgColors : [B.border], borderWidth:2, borderColor:"#fff" }] }}
                    options={coD()}
                  />
                  <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center", pointerEvents:"none" }}>
                    <div style={{ fontSize:20, fontWeight:700, color:B.t1, fontFamily:F }}>{total}</div>
                    <div style={{ fontSize:10, color:B.t3, marginTop:1, fontFamily:F }}>Total</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>

      <Card title="Status funnel">
        {loading ? (
          <div style={{ height:200, display:"flex", alignItems:"center", justifyContent:"center", color:B.t3, fontSize:12, fontFamily:F }}>Loading...</div>
        ) : (
          <div style={{ height:200 }}>
            <Bar
              data={{ labels: funnelLabels, datasets:[{ data: funnelValues, backgroundColor: funnelColors, borderRadius:4 }] }}
              options={co()}
            />
          </div>
        )}
      </Card>

      <Two>
        <Card title="Appointments by hour">
          {loading ? (
            <div style={{ height:200, display:"flex", alignItems:"center", justifyContent:"center", color:B.t3, fontSize:12, fontFamily:F }}>Loading...</div>
          ) : (
            <div style={{ height:200 }}>
              <Bar data={{ labels: hourLabels, datasets:[{ data: hourValues, backgroundColor: B.ch.t, borderRadius:4 }] }} options={co()} />
            </div>
          )}
        </Card>

        <Card title="Appointments by day of week">
          {loading ? (
            <div style={{ height:200, display:"flex", alignItems:"center", justifyContent:"center", color:B.t3, fontSize:12, fontFamily:F }}>Loading...</div>
          ) : (
            <div style={{ height:200 }}>
              <Bar data={{ labels: dayLabels, datasets:[{ data: dayValues, backgroundColor: B.ch.g, borderRadius:4 }] }} options={co()} />
            </div>
          )}
        </Card>
      </Two>

      <Card title="Active clinicians">
        {loading ? (
          <div style={{ padding:12, color:B.t3, fontSize:12, fontFamily:F }}>Loading...</div>
        ) : (
          <Tbl
            headers={["Clinician","Credentials","Active","Total appointments","Status"]}
            rows={physicians.map((ph) => [
              ph.name,
              ph.credentials || "—",
              ph.is_active ? "Yes" : "No",
              ph.stats.total,
              <Pill type={ph.is_active ? "success" : "neutral"}>{ph.is_active ? "Active" : "Inactive"}</Pill>,
            ])}
          />
        )}
      </Card>
    </div>
  );
}
