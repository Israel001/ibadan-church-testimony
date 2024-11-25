(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
})((function () { 'use strict';

  const{merge:merge}=window._;const echartSetOption=(e,t,o,r)=>{const{breakpoints:a,resize:n}=window.phoenix.utils,s=t=>{Object.keys(t).forEach((o=>{window.innerWidth>a[o]&&e.setOption(t[o]);}));},i=document.body;e.setOption(merge(o(),t));const c=document.querySelector(".navbar-vertical-toggle");c&&c.addEventListener("navbar.vertical.toggle",(()=>{e.resize(),r&&s(r);})),n((()=>{e.resize(),r&&s(r);})),r&&s(r),i.addEventListener("clickControl",(({detail:{control:a}})=>{"phoenixTheme"===a&&e.setOption(window._.merge(o(),t)),r&&s(r);}));};const echartTabs=document.querySelectorAll("[data-tab-has-echarts]");echartTabs&&echartTabs.forEach((e=>{e.addEventListener("shown.bs.tab",(e=>{const t=e.target,{hash:o}=t,r=o||t.dataset.bsTarget,a=document.getElementById(r.substring(1))?.querySelector("[data-echart-tab]");a&&window.echarts.init(a).resize();}));}));const tooltipFormatter=(e,t="MMM DD")=>{let o="";return e.forEach((e=>{o+=`<div class='ms-1'>\n        <h6 class="text-body-tertiary"><span class="fas fa-circle me-1 fs-10" style="color:${e.borderColor?e.borderColor:e.color}"></span>\n          ${e.seriesName} : ${"object"==typeof e.value?e.value[1]:e.value}\n        </h6>\n      </div>`;})),`<div>\n            <p class='mb-2 text-body-tertiary'>\n              ${window.dayjs(e[0].axisValue).isValid()?window.dayjs(e[0].axisValue).format(t):e[0].axisValue}\n            </p>\n            ${o}\n          </div>`};const handleTooltipPosition=([e,,t,,o])=>{if(window.innerWidth<=540){const r=t.offsetHeight,a={top:e[1]-r-20};return a[e[0]<o.viewSize[0]/2?"left":"right"]=5,a}return null};

  // const contactsBySourceChartInit=()=>{const{getColor:e,getData:t,toggleColor:a}=window.phoenix.utils,o=document.querySelector(".echart-contact-by-source-container"),r=o.querySelector(".echart-contact-by-source"),i=o.querySelector("[data-label]");if(r){const o=t(r,"echarts"),n=window.echarts.init(r),l=[{value:80,name:"Organic Search"},{value:65,name:"Paid Search"},{value:40,name:"Direct Traffic"},{value:220,name:"Social Media"},{value:120,name:"Referrals"},{value:35,name:"Others Campaigns"}],c=l.reduce(((e,t)=>t.value+e),0);i&&(i.innerHTML=c);echartSetOption(n,o,(()=>({color:[e("primary"),e("success"),e("info"),e("info-light"),a(e("danger-lighter"),e("danger-darker")),a(e("warning-light"),e("warning-dark"))],tooltip:{trigger:"item",borderWidth:0,position:(...e)=>handleTooltipPosition(e),extraCssText:"z-index: 1000"},responsive:!0,maintainAspectRatio:!1,series:[{name:"Contacts by Source",type:"pie",radius:["55%","90%"],startAngle:90,avoidLabelOverlap:!1,itemStyle:{borderColor:e("body-bg"),borderWidth:3},label:{show:!1},emphasis:{label:{show:!1}},labelLine:{show:!1},data:l}],grid:{bottom:0,top:0,left:0,right:0,containLabel:!1}})));}};

  const contactsCreatedChartInit=()=>{const{getColor:t,getData:o,getPastDates:e}=window.phoenix.utils,i=document.querySelector(".echart-contacts-created"),r=e(9),a=[24,14,30,24,32,32,18,12,32],n=[36,28,36,39,54,38,22,34,52];if(i){const e=o(i,"echarts"),l=window.echarts.init(i);echartSetOption(l,e,(()=>({color:[t("primary"),t("tertiary-bg")],tooltip:{trigger:"axis",padding:[7,10],backgroundColor:t("body-highlight-bg"),borderColor:t("border-color"),textStyle:{color:t("light-text-emphasis")},borderWidth:1,transitionDuration:0,axisPointer:{type:"none"},formatter:t=>tooltipFormatter(t),extraCssText:"z-index: 1000"},xAxis:{type:"category",axisLabel:{color:t("secondary-color"),formatter:t=>window.dayjs(t).format("D MMM, YY"),fontFamily:"Nunito Sans",fontWeight:600,fontSize:10.24,padding:[0,0,0,20]},splitLine:{show:!0,interval:"10",lineStyle:{color:t("tertiary-bg")}},show:!0,interval:10,data:r,axisLine:{lineStyle:{color:t("tertiary-bg")}},axisTick:!1},yAxis:{axisPointer:{type:"none"},position:"right",axisTick:"none",splitLine:{interval:5,lineStyle:{color:t("secondary-bg")}},axisLine:{show:!1},axisLabel:{fontFamily:"Nunito Sans",fontWeight:700,fontSize:12.8,color:t("body-color"),margin:20,verticalAlign:"top",formatter:t=>`${t.toLocaleString()}`}},series:[{name:"Actual revenue",type:"bar",data:a,barWidth:"4px",barGap:"3",label:{show:!0,position:"top",color:t("body-color"),fontWeight:"bold",fontSize:"10.24px"},z:10,itemStyle:{borderRadius:[2,2,0,0],color:t("tertiary-bg")}},{name:"Projected revenue",type:"bar",barWidth:"4px",data:n,label:{show:!0,position:"top",color:t("primary"),fontWeight:"bold",fontSize:"10.24px"},itemStyle:{borderRadius:[2,2,0,0],color:t("primary")}}],grid:{right:3,left:6,bottom:0,top:"5%",containLabel:!0},animation:!1})),{xs:{series:[{label:{show:!1}},{label:{show:!1}}]}});}};

  const newUsersChartsInit=()=>{const{getColor:o,getData:t,getPastDates:e,rgbaColor:a}=window.phoenix.utils,r=document.querySelector(".echarts-new-users"),i=o=>{const t=window.dayjs(o[0].axisValue),e=window.dayjs(o[0].axisValue).subtract(1,"month"),a=o.map(((o,a)=>({value:o.value,date:a>0?e:t,color:o.color})));let r="";return a.forEach(((o,t)=>{r+=`<h6 class="fs-9 text-body-tertiary ${t>0&&"mb-0"}"><span class="fas fa-circle me-2" style="color:${o.color}"></span>\n      ${o.date.format("MMM DD")} : ${o.value}\n    </h6>`;})),`<div class='ms-1'>\n              ${r}\n            </div>`};if(r){const s=t(r,"echarts"),n=window.echarts.init(r),l=e(12);echartSetOption(n,s,(()=>({tooltip:{trigger:"axis",padding:10,backgroundColor:o("body-highlight-bg"),borderColor:o("border-color"),textStyle:{color:o("light-text-emphasis")},borderWidth:1,transitionDuration:0,axisPointer:{type:"none"},formatter:i,extraCssText:"z-index: 1000"},xAxis:[{type:"category",data:l,show:!0,boundaryGap:!1,axisLine:{show:!1},axisTick:{show:!1},axisLabel:{formatter:o=>window.dayjs(o).format("DD MMM, YY"),showMinLabel:!0,showMaxLabel:!1,color:o("secondary-color"),align:"left",interval:5,fontFamily:"Nunito Sans",fontWeight:600,fontSize:12.8}},{type:"category",position:"bottom",show:!0,data:l,axisLabel:{formatter:o=>window.dayjs(o).format("DD MMM, YY"),interval:130,showMaxLabel:!0,showMinLabel:!1,color:o("secondary-color"),align:"right",fontFamily:"Nunito Sans",fontWeight:600,fontSize:12.8},axisLine:{show:!1},axisTick:{show:!1},splitLine:{show:!1},boundaryGap:!1}],yAxis:{show:!1,type:"value",boundaryGap:!1},series:[{type:"line",data:[220,220,150,150,150,250,250,400,400,400,300,300],lineStyle:{width:2,color:o("info")},areaStyle:{color:{type:"linear",x:0,y:0,x2:0,y2:1,colorStops:[{offset:0,color:a(o("info"),.2)},{offset:1,color:a(o("info"),0)}]}},showSymbol:!1,symbol:"circle",zlevel:1}],grid:{left:0,right:0,top:5,bottom:20}})));}};

  const newLeadsChartsInit=()=>{const{getColor:o,getData:t,getPastDates:a,rgbaColor:e}=window.phoenix.utils,r=document.querySelector(".echarts-new-leads"),i=o=>{const t=window.dayjs(o[0].axisValue),a=window.dayjs(o[0].axisValue).subtract(1,"month"),e=o.map(((o,e)=>({value:o.value,date:e>0?a:t,color:o.color})));let r="";return e.forEach(((o,t)=>{r+=`<h6 class="fs-9 text-body-tertiary ${t>0&&"mb-0"}"><span class="fas fa-circle me-2" style="color:${o.color}"></span>\n      ${o.date.format("MMM DD")} : ${o.value}\n    </h6>`;})),`<div class='ms-1'>\n              ${r}\n            </div>`};if(r){const s=t(r,"echarts"),l=window.echarts.init(r),n=a(11);echartSetOption(l,s,(()=>({tooltip:{trigger:"axis",padding:10,backgroundColor:o("body-highlight-bg"),borderColor:o("border-color"),textStyle:{color:o("light-text-emphasis")},borderWidth:1,transitionDuration:0,axisPointer:{type:"none"},formatter:i,extraCssText:"z-index: 1000"},xAxis:[{type:"category",data:n,show:!0,boundaryGap:!1,axisLine:{show:!1},axisTick:{show:!1},axisLabel:{formatter:o=>window.dayjs(o).format("DD MMM, YY"),showMinLabel:!0,showMaxLabel:!1,color:o("secondary-color"),align:"left",interval:5,fontFamily:"Nunito Sans",fontWeight:600,fontSize:12.8}},{type:"category",position:"bottom",show:!0,data:n,axisLabel:{formatter:o=>window.dayjs(o).format("DD MMM, YY"),interval:130,showMaxLabel:!0,showMinLabel:!1,color:o("secondary-color"),align:"right",fontFamily:"Nunito Sans",fontWeight:600,fontSize:12.8},axisLine:{show:!1},axisTick:{show:!1},splitLine:{show:!1},boundaryGap:!1}],yAxis:{show:!1,type:"value",boundaryGap:!1},series:[{type:"line",data:[100,100,260,250,270,160,190,180,260,200,220],lineStyle:{width:2,color:o("primary")},areaStyle:{color:{type:"linear",x:0,y:0,x2:0,y2:1,colorStops:[{offset:0,color:e(o("primary"),.2)},{offset:1,color:e(o("primary"),0)}]}},showSymbol:!1,symbol:"circle",zlevel:1}],grid:{left:0,right:0,top:5,bottom:20}})));}};

  const addClicksChartInit=()=>{const{getColor:t,getData:o,getPastDates:e,getItemFromStore:i}=window.phoenix.utils,a=document.querySelector(".echart-add-clicks-chart"),r=e(11),l=[2e3,2250,1070,1200,1e3,1450,3100,2900,1800,1450,1700],n=[1100,1200,2700,1700,2100,2e3,2300,1200,2600,2900,1900],s=t=>{const o=window.dayjs(t[0].axisValue),e=window.dayjs(t[0].axisValue).subtract(1,"month"),i=t.map(((t,i)=>({value:t.value,date:i>0?e:o,color:t.color})));let a="";return i.forEach(((t,o)=>{a+=`<h6 class="fs-9 text-body-tertiary ${o>0&&"mb-0"}"><span class="fas fa-circle me-2" style="color:${t.color}"></span>\n      ${t.date.format("MMM DD")} : ${t.value}\n    </h6>`;})),`<div class='ms-1'>\n              ${a}\n            </div>`};if(a){const e=o(a,"echarts"),c=window.echarts.init(a);echartSetOption(c,e,(()=>({tooltip:{trigger:"axis",padding:10,backgroundColor:t("body-highlight-bg"),borderColor:t("border-color"),textStyle:{color:t("light-text-emphasis")},borderWidth:1,transitionDuration:0,axisPointer:{type:"none"},formatter:s,extraCssText:"z-index: 1000"},xAxis:[{type:"category",data:r,axisLabel:{formatter:t=>window.dayjs(t).format("DD MMM, YY"),interval:3,showMinLabel:!0,showMaxLabel:!1,color:t("secondary-color"),align:"left",fontFamily:"Nunito Sans",fontWeight:700,fontSize:12.8,margin:15},axisLine:{show:!0,lineStyle:{color:t("tertiary-bg")}},axisTick:{show:!0,interval:5},boundaryGap:!1},{type:"category",position:"bottom",data:r,axisLabel:{formatter:t=>window.dayjs(t).format("DD MMM, YY"),interval:130,showMaxLabel:!0,showMinLabel:!1,color:t("body-color"),align:"right",fontFamily:"Nunito Sans",fontWeight:700,fontSize:12.8,margin:15},axisLine:{show:!0,lineStyle:{color:t("tertiary-bg")}},axisTick:{show:!0},splitLine:{show:!1},boundaryGap:!1}],yAxis:{axisPointer:{type:"none"},axisTick:"none",splitLine:{show:!0,lineStyle:{color:"dark"===i("phoenixTheme")?t("body-highlight-bg"):t("secondary-bg")}},axisLine:{show:!1},axisLabel:{show:!0,fontFamily:"Nunito Sans",fontWeight:700,fontSize:12.8,color:t("body-color"),margin:25,formatter:t=>t/1e3+"k"}},series:[{name:"e",type:"line",data:n,lineStyle:{type:"line",width:3,color:t("info-lighter")},showSymbol:!1,symbol:"emptyCircle",symbolSize:6,itemStyle:{color:t("info-lighter"),borderWidth:3},zlevel:2},{name:"d",type:"line",data:l,showSymbol:!1,symbol:"emptyCircle",symbolSize:6,itemStyle:{color:t("primary"),borderWidth:3},lineStyle:{type:"line",width:3,color:t("primary")},zlevel:1}],grid:{right:2,left:5,bottom:"10px",top:"2%",containLabel:!0},animation:!1})));}};

  const echartsLeadConversiontInit=()=>{const{getColor:e,getData:r,getPastDates:i,toggleColor:o}=window.phoenix.utils,t=document.querySelector(".echart-lead-conversion"),a=i(4);if(t){const i=r(t,"echarts"),l=window.echarts.init(t);echartSetOption(l,i,(()=>({color:[e("primary"),e("tertiary-bg")],tooltip:{trigger:"axis",padding:[7,10],backgroundColor:e("body-highlight-bg"),borderColor:e("border-color"),textStyle:{color:e("light-text-emphasis")},borderWidth:1,transitionDuration:0,axisPointer:{type:"none"},formatter:e=>(e=>{let r="";return e.forEach((e=>{r+=`<h6 class="fs-9 text-body-tertiary mb-0"><span class="fas fa-circle me-2" style="color:${e.color}"></span>\n      ${e.axisValue} : ${e.value}\n    </h6>`;})),`<div class='ms-1'>\n              ${r}\n            </div>`})(e),extraCssText:"z-index: 1000"},xAxis:{type:"value",inverse:!0,axisLabel:{show:!1},show:!1,data:a,axisLine:{lineStyle:{color:e("tertiary-bg")}},axisTick:!1},yAxis:{data:["Closed Won","Objection","Offer","Qualify Lead","Created"],type:"category",axisPointer:{type:"none"},axisTick:"none",splitLine:{interval:5,lineStyle:{color:e("secondary-bg")}},axisLine:{show:!1},axisLabel:{show:!0,align:"left",margin:100,color:e("body-color")}},series:{name:"Lead Conversion",type:"bar",barWidth:"20px",showBackground:!0,backgroundStyle:{borderRadius:[4,0,0,4]},data:[{value:1060,itemStyle:{color:o(e("success-lighter"),e("success-dark")),borderRadius:[4,0,0,4]},emphasis:{itemStyle:{color:o(e("success-light"),e("success-dark"))},label:{formatter:()=>"{b| 53% }",rich:{b:{color:e("white")}}}},label:{show:!0,position:"inside",formatter:()=>"{b| 53%}",rich:{b:{color:o(e("success-dark"),e("success-subtle")),fontWeight:500,padding:[0,5,0,0]}}}},{value:1200,itemStyle:{color:o(e("info-lighter"),e("info-dark")),borderRadius:[4,0,0,4]},emphasis:{itemStyle:{color:o(e("info-light"),e("info-dark"))},label:{formatter:()=>"{b| 60% }",rich:{b:{color:e("white")}}}},label:{show:!0,position:"inside",formatter:()=>"{b| 60%}",rich:{b:{color:o(e("info-dark"),e("info-bg-subtle")),fontWeight:500,padding:[0,5,0,0]}}}},{value:1600,itemStyle:{color:o(e("primary-lighter"),e("primary-dark")),borderRadius:[4,0,0,4]},emphasis:{itemStyle:{color:o(e("primary-light"),e("primary-dark"))},label:{formatter:()=>"{b| 80% }",rich:{b:{color:e("white")}}}},label:{show:!0,position:"inside",formatter:()=>"{b| 80% }",rich:{b:{color:o(e("primary-dark"),e("primary-bg-subtle")),fontWeight:500,padding:[0,5,0,0]}}}},{value:1800,itemStyle:{color:o(e("warning-lighter"),e("warning-dark")),borderRadius:[4,0,0,4]},emphasis:{itemStyle:{color:o(e("warning-light"),e("warning-dark"))},label:{formatter:()=>"{b| 90% }",rich:{b:{color:e("white")}}}},label:{show:!0,position:"inside",formatter:()=>"{b|90%}",rich:{b:{color:o(e("warning-dark"),e("warning-bg-subtle")),fontWeight:500,padding:[0,5,0,0]}}}},{value:2e3,itemStyle:{color:o(e("danger-lighter"),e("danger-dark")),borderRadius:[4,0,0,4]},emphasis:{itemStyle:{color:o(e("danger-light"),e("danger-dark"))},label:{formatter:()=>"{a|100%}",rich:{a:{color:e("white")}}}},label:{show:!0,position:"inside",formatter:()=>"{a|100%}",rich:{a:{color:o(e("danger-dark"),e("danger-bg-subtle")),fontWeight:500}}}}],barGap:"50%"},grid:{right:5,left:100,bottom:0,top:"5%",containLabel:!1},animation:!1})),{xs:{yAxis:{show:!1},grid:{left:0}},sm:{yAxis:{show:!0},grid:{left:100}}});}};

  const echartsRevenueTargetInit=()=>{const{getColor:e,getData:t}=window.phoenix.utils,o=document.querySelector(".echart-revenue-target-conversion"),a=[42e3,35e3,35e3,4e4],r=[30644,33644,28644,38644];if(o){const i=t(o,"echarts"),n=window.echarts.init(o);echartSetOption(n,i,(()=>({color:[e("primary"),e("tertiary-bg")],tooltip:{trigger:"axis",padding:[7,10],backgroundColor:e("body-highlight-bg"),borderColor:e("border-color"),textStyle:{color:e("light-text-emphasis")},borderWidth:1,transitionDuration:0,axisPointer:{type:"none"},formatter:e=>((e="MMM DD")=>{let t="";return e.forEach((e=>{t+=`<div class='ms-1'>\n          <h6 class="text-body-tertiary"><span class="fas fa-circle me-1 fs-10" style="color:${e.color}"></span>\n            ${e.seriesName} : $${e.value.toLocaleString()}\n          </h6>\n        </div>`;})),`<div>\n              <p class='mb-2 text-body-tertiary'>\n                ${e[0].axisValue}\n              </p>\n              ${t}\n            </div>`})(e),extraCssText:"z-index: 1000"},xAxis:{type:"value",axisLabel:{show:!0,interval:3,showMinLabel:!0,showMaxLabel:!1,color:e("quaternary-color"),align:"left",fontFamily:"Nunito Sans",fontWeight:400,fontSize:12.8,margin:10,formatter:e=>e/1e3+"k"},show:!0,axisLine:{lineStyle:{color:e("tertiary-bg")}},axisTick:!1,splitLine:{show:!1}},yAxis:{data:["Luxemburg","Canada","Australia","India"],type:"category",axisPointer:{type:"none"},axisTick:"none",splitLine:{interval:5,lineStyle:{color:e("secondary-bg")}},axisLine:{show:!1},axisLabel:{show:!0,margin:21,color:e("body-color")}},series:[{name:"Target",type:"bar",label:{show:!1},emphasis:{disabled:!0},showBackground:!0,backgroundStyle:{color:e("body-highlight-bg")},barWidth:"30px",barGap:"-100%",data:a,itemStyle:{borderWidth:4,color:e("secondary-bg"),borderColor:e("secondary-bg")}},{name:"Gained",type:"bar",emphasis:{disabled:!0},label:{show:!0,color:e("white"),fontWeight:700,fontFamily:"Nunito Sans",fontSize:12.8,formatter:e=>`$${e.value.toLocaleString()}`},backgroundStyle:{color:e("body-highlight-bg")},barWidth:"30px",data:r,itemStyle:{borderWidth:4,color:e("primary-light"),borderColor:e("secondary-bg")}}],grid:{right:0,left:0,bottom:8,top:0,containLabel:!0},animation:!1})));}};

  const{docReady:docReady}=window.phoenix.utils;docReady(contactsBySourceChartInit),docReady(contactsCreatedChartInit),docReady(newUsersChartsInit),docReady(newLeadsChartsInit),docReady(addClicksChartInit),docReady(echartsLeadConversiontInit),docReady(echartsRevenueTargetInit);

}));
//# sourceMappingURL=crm-dashboard.js.map
