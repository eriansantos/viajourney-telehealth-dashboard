import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Bar, Doughnut } from "react-chartjs-2";
import { B, F } from "../lib/brand.js";
import { co, coD } from "../lib/chartOptions.js";
import { apiGet } from "../lib/api.js";
import KpiCard from "../components/atoms/KpiCard.jsx";
import Card from "../components/atoms/Card.jsx";
import Lgnd from "../components/atoms/Lgnd.jsx";
import Grid from "../components/atoms/Grid.jsx";
import Two from "../components/atoms/Two.jsx";
import SecHeader from "../components/atoms/SecHeader.jsx";
import Tbl from "../components/atoms/Tbl.jsx";

// ─── Module 8: Language, Access & Equity ────────────────────────────────────
export const LANG_COLORS = { Portuguese: B.ch.g, English: B.ch.t, Spanish: B.ch.a, Other: B.ch.s };
export const langColor = (l) => {
  if (!l) return B.ch.s;
  const lo = l.toLowerCase();
  if (lo.includes("portuguese")) return B.ch.g;
  if (lo.includes("english"))    return B.ch.t;
  if (lo.includes("spanish"))    return B.ch.a;
  return B.ch.s;
};
export const langShort = (l) => {
  if (!l) return "Other";
  const lo = l.toLowerCase();
  if (lo.includes("portuguese")) return "Portuguese";
  if (lo.includes("english"))    return "English";
  if (lo.includes("spanish"))    return "Spanish";
  return l.split(";")[0].split("(")[0].trim();
};

export default function VLanguage() {
  const { getToken } = useAuth();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiGet("/api/elation/language-equity", getToken)
      .then((res) => { if (!cancelled) { setData(res); setLoading(false); } })
      .catch((err) => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  const summary    = data?.summary ?? [];
  const summaryRaw = data?.summaryRaw ?? [];
  const byLangRaw  = data?.byLanguageRaw ?? {};
  const total      = data?.total ?? 0;

  // Donut — todos os idiomas reais
  const langLabelsRaw = Object.keys(byLangRaw);
  const langLabels    = langLabelsRaw.map(l => langShort(l));
  const langValues    = Object.values(byLangRaw);
  const langColors    = langLabelsRaw.map(l => langColor(l));

  // Bar lead time — todos os idiomas reais
  const leadLabelsRaw = summaryRaw.map(s => s.lang);
  const leadLabels    = leadLabelsRaw.map(l => langShort(l));
  const leadValues    = summaryRaw.map(s => s.avgLeadTimeDays ?? 0);
  const leadColors    = leadLabelsRaw.map(l => langColor(l));

  return (
    <div>
      <SecHeader tag="Module 8 · Elation API" title="Language, Access & Equity" />

      {error && (
        <div style={{ padding:"10px 14px", marginBottom:12, borderRadius:8, background:B.negBg, color:B.neg, fontSize:12, fontFamily:F }}>
          Error loading data: {error}
        </div>
      )}

      <Grid cols={4} mb={12}>
        {["Portuguese","English","Spanish","Other"].map(l => {
          const s = summary.find(x => x.lang === l);
          return (
            <KpiCard key={l} label={`${l} visits`}
              value={loading ? "…" : (s?.pct ?? 0)} unit={loading ? "" : "%"}
              subunit={loading ? "" : `${s?.visits ?? 0} appointments`}
              accent={LANG_COLORS[l]} />
          );
        })}
      </Grid>

      <Two>
        <Card title="Visit distribution by language" source="Elation API — live">
          {loading ? (
            <div style={{height:210,display:"flex",alignItems:"center",justifyContent:"center",color:B.t3,fontSize:12,fontFamily:F}}>Loading...</div>
          ) : (
            <>
              <Lgnd items={langLabels.map((l,i) => ({ label:`${langShort(l)} ${langValues[i]}`, color:langColors[i] }))} />
              <div style={{height:210,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={{position:"relative",width:170,height:170}}>
                  <Doughnut
                    data={{ labels:langLabels, datasets:[{ data:langValues.length ? langValues : [1], backgroundColor:langValues.length ? langColors : [B.border], borderWidth:2, borderColor:"#fff" }] }}
                    options={coD()}
                  />
                  <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",pointerEvents:"none"}}>
                    <div style={{fontSize:20,fontWeight:700,color:B.t1,fontFamily:F}}>{total}</div>
                    <div style={{fontSize:10,color:B.t3,marginTop:1,fontFamily:F}}>Total</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Card>

        <Card title="Lead time by language (days)" source="Elation API — live">
          {loading ? (
            <div style={{height:220,display:"flex",alignItems:"center",justifyContent:"center",color:B.t3,fontSize:12,fontFamily:F}}>Loading...</div>
          ) : (
            <div style={{height:220}}>
              <Bar
                data={{ labels:leadLabels, datasets:[{ data:leadValues, backgroundColor:leadColors, borderRadius:5 }] }}
                options={co()}
              />
            </div>
          )}
        </Card>
      </Two>

      <Card title="Access equity by language" source="Elation API — live">
        {loading ? (
          <div style={{padding:"20px",color:B.t3,fontSize:12,fontFamily:F}}>Loading...</div>
        ) : (
          <Tbl
            headers={["Language","Visits","% of total","Avg lead time (days)","No-show rate"]}
            rows={summaryRaw.map(s => [
              langShort(s.lang),
              s.visits,
              `${s.pct}%`,
              s.avgLeadTimeDays != null ? `${s.avgLeadTimeDays}d` : "—",
              `${s.noShowRate}%`,
            ])}
          />
        )}
      </Card>
    </div>
  );
}
