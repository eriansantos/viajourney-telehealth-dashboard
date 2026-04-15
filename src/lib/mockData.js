import { B } from "./brand.js";

// ─── Data ───────────────────────────────────────────────────────────────────
export const WK=["W1","W2","W3","W4","W5","W6","W7","W8"];
export const MO=["Oct","Nov","Dec","Jan","Feb","Mar"];
export const D={
  visits:    {labels:WK,datasets:[{label:"Member",   data:[98,102,108,112,118,124,130,107],backgroundColor:B.ch.g,stack:"v",borderRadius:3},{label:"Concierge",data:[38,40,42,44,46,48,50,44],backgroundColor:B.ch.t,stack:"v",borderRadius:3},{label:"One-time", data:[22,24,26,28,30,32,33,33],backgroundColor:B.ch.a,stack:"v",borderRadius:3}]},
  members:   {labels:MO,datasets:[{label:"Active",data:[254,268,280,291,301,312],borderColor:B.ch.g,backgroundColor:"rgba(46,158,88,0.07)",fill:true,tension:0.4,pointRadius:4,pointBackgroundColor:B.ch.g,pointBorderColor:"#fff",pointBorderWidth:2}]},
  vtypes:    {labels:["Member","Concierge","One-time"],datasets:[{data:[58,24,18],backgroundColor:[B.ch.g,B.ch.t,B.ch.a],borderWidth:0,hoverOffset:6}]},
  peak:      {labels:["8am","9am","10am","11am","12pm","1pm","2pm","3pm","4pm","5pm","6pm"],datasets:[{data:[12,28,34,31,26,24,29,32,27,18,8],backgroundColor:["#E4EAE4","#E4EAE4",B.ch.g,"#E4EAE4","#E4EAE4","#E4EAE4","#E4EAE4",B.ch.g,"#E4EAE4","#E4EAE4","#E4EAE4"],borderRadius:5}]},
  speed:     {labels:["VJ → appt","VJ → clinician","Urgent Care","ER","PCP appt"],datasets:[{data:[1.8,0.37,1.1,4.2,72],backgroundColor:[B.ch.g,B.ch.t,B.ch.a,B.ch.r,"#CBD5E0"],borderRadius:5}]},
  access:    {labels:WK,datasets:[{label:"Same day",data:[86,87,88,90,91,90,92,91],borderColor:B.ch.t,tension:0.4,pointRadius:3,pointBackgroundColor:B.ch.t,pointBorderColor:"#fff",pointBorderWidth:2},{label:"Within 24h",data:[96,96,97,97,98,98,98,98],borderColor:B.ch.g,tension:0.4,pointRadius:3,pointBackgroundColor:B.ch.g,pointBorderColor:"#fff",pointBorderWidth:2}]},
  erAvoid:   {labels:MO,datasets:[{data:[72,74,75,76,77,78],backgroundColor:B.ch.g,borderRadius:5}]},
  mGrow:     {labels:MO,datasets:[{label:"New",data:[28,31,30,34,36,38],backgroundColor:B.ch.g,borderRadius:4,stack:"g"},{label:"Cancelled",data:[-8,-9,-7,-10,-9,-7],backgroundColor:B.ch.r,borderRadius:4,stack:"g"}]},
  sat:       {labels:["1★","2★","3★","4★","5★"],datasets:[{data:[1,2,4,12,81],backgroundColor:[B.ch.r,B.ch.a,"#CBD5E0",B.ch.t,B.ch.g],borderRadius:4}]},
  ops:       {labels:WK,datasets:[{label:"Calls/visit",data:[1.1,1.0,0.9,0.9,0.8,0.8,0.8,0.8],borderColor:B.ch.a,tension:0.4,pointRadius:3,pointBackgroundColor:B.ch.a,pointBorderColor:"#fff",pointBorderWidth:2},{label:"Msgs/visit",data:[2.8,2.7,2.6,2.5,2.4,2.3,2.3,2.3],borderColor:B.ch.g,tension:0.4,pointRadius:3,pointBackgroundColor:B.ch.g,pointBorderColor:"#fff",pointBorderWidth:2}]},
  // Module 1 – Growth & Funnel
  leadSrc:   {labels:["Website","WhatsApp","Referral","Employer","Ads","Other"],datasets:[{data:[38,26,18,10,6,2],backgroundColor:[B.ch.g,B.ch.t,B.ch.a,B.g700,B.ch.s,B.t4],borderRadius:5}]},
  convTrend: {labels:MO,datasets:[{label:"Lead→Member %",data:[4.2,4.8,5.1,5.6,6.0,6.4],borderColor:B.ch.g,backgroundColor:"rgba(46,158,88,0.07)",fill:true,tension:0.4,pointRadius:3,pointBackgroundColor:B.ch.g,pointBorderColor:"#fff",pointBorderWidth:2},{label:"Lead→Booked %",data:[28,30,31,33,35,37],borderColor:B.ch.t,tension:0.4,pointRadius:3,pointBackgroundColor:B.ch.t,pointBorderColor:"#fff",pointBorderWidth:2}]},
  // Module 6 – Revenue
  revPlan:   {labels:["Standard Member","Concierge","One-time","Employer"],datasets:[{data:[44,28,18,10],backgroundColor:[B.ch.g,B.ch.t,B.ch.a,B.g700],borderWidth:0,hoverOffset:6}]},
  revTrend:  {labels:MO,datasets:[{label:"Revenue",data:[52400,58200,63800,69100,74300,81600],borderColor:B.ch.g,backgroundColor:"rgba(46,158,88,0.07)",fill:true,tension:0.4,pointRadius:4,pointBackgroundColor:B.ch.g,pointBorderColor:"#fff",pointBorderWidth:2}]},
  // Module 8 – Language
  langVis:   {labels:["Portuguese","English","Spanish","Other"],datasets:[{data:[54,28,15,3],backgroundColor:[B.ch.g,B.ch.t,B.ch.a,B.ch.s],borderWidth:0,hoverOffset:6}]},
  langTime:  {labels:["Portuguese","English","Spanish","Other"],datasets:[{label:"Median time-to-care (h)",data:[1.7,1.9,2.1,2.4],backgroundColor:[B.ch.g,B.ch.t,B.ch.a,B.ch.s],borderRadius:5}]},
  // Module 9 – Clinician
  clinicVis: {labels:MO,datasets:[{label:"Dr. Melo",data:[142,158,164,170,178,188],borderColor:B.ch.g,tension:0.4,pointRadius:3,pointBackgroundColor:B.ch.g,pointBorderColor:"#fff",pointBorderWidth:2},{label:"Dr. Santos",data:[98,104,112,118,124,130],borderColor:B.ch.t,tension:0.4,pointRadius:3,pointBackgroundColor:B.ch.t,pointBorderColor:"#fff",pointBorderWidth:2},{label:"NP Rivera",data:[76,80,84,88,92,94],borderColor:B.ch.a,tension:0.4,pointRadius:3,pointBackgroundColor:B.ch.a,pointBorderColor:"#fff",pointBorderWidth:2}]},
};
