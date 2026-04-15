import { B, F } from "./brand.js";

// ─── Chart options ──────────────────────────────────────────────────────────
export const co = (ov={}) => ({
  responsive:true, maintainAspectRatio:false,
  plugins:{
    legend:{display:false},
    tooltip:{ backgroundColor:B.g900, titleColor:"#fff", bodyColor:B.g300, cornerRadius:8, padding:10, boxPadding:4, titleFont:{family:F,size:12,weight:"600"}, bodyFont:{family:F,size:11} },
  },
  scales:{
    x:{ grid:{display:false}, border:{display:false}, ticks:{color:B.t4,font:{size:11,family:F}} },
    y:{ grid:{color:"#EFF2EF"}, border:{display:false}, ticks:{color:B.t4,font:{size:11,family:F}} },
  },
  ...ov,
});
export const coS = () => ({ ...co(), scales:{ ...co().scales, x:{...co().scales.x,stacked:true}, y:{...co().scales.y,stacked:true} } });
export const coP = (min=60) => ({ ...co(), scales:{ ...co().scales, y:{...co().scales.y,min,max:100,ticks:{...co().scales.y.ticks,callback:v=>v+"%"}} } });
export const coD = () => ({ responsive:true, maintainAspectRatio:false, cutout:"70%", plugins:{ legend:{display:false}, tooltip:{ backgroundColor:B.g900,titleColor:"#fff",bodyColor:B.g300,cornerRadius:8,padding:10 } } });
