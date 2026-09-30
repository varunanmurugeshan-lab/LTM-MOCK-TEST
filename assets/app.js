/* Shared: theme, section list, saved stats, data loader */
const IC={sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/>',moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
reasoning:'<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4"/>',
quant:'<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>',
verbal:'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
cs:'<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>',
tech:'<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>'};
const icon=n=>`<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${IC[n]}</svg>`;
const SECTIONS=[
{id:"reasoning",title:"Reasoning",color:"#7c5cf0",desc:"Analogies, coding-decoding, directions, symbols, data sufficiency and case-based decisions.",tags:["Analogies","Coding","Directions"]},
{id:"quant",title:"Quantitative Aptitude",color:"#f08a1c",desc:"Permutations, probability, logarithms, percentages, time, speed and work.",tags:["P&C","Probability","Time & Work"]},
{id:"verbal",title:"Verbal Ability",color:"#12a37f",desc:"Fill in the blanks, sentence improvement, sentence arrangement and reading comprehension.",tags:["Grammar","Vocabulary","RC"]},
{id:"cs",title:"CS Fundamentals",color:"#2b8de0",desc:"Operating systems, DBMS, computer networks and computer organization.",tags:["OS","DBMS","Networks"]},
{id:"tech",title:"Technical MCQ",color:"#e04a7b",desc:"Programming fundamentals, data structures, algorithms, pseudocode and OOP.",tags:["DSA","Pseudocode","OOP"]}];
const $=id=>document.getElementById(id);
const theme={get:()=>document.documentElement.dataset.theme,set(t){document.documentElement.dataset.theme=t;try{localStorage.setItem("ph:theme",t)}catch(e){}const b=$("tt");if(b)b.innerHTML=icon(t=="dark"?"sun":"moon")},
init(){const b=$("tt");if(b){b.innerHTML=icon(theme.get()=="dark"?"sun":"moon");b.onclick=()=>theme.set(theme.get()=="dark"?"light":"dark")}}};
const stats={all(){try{return JSON.parse(localStorage.getItem("ph:stats"))||{}}catch(e){return{}}},
save(id,pct){const a=stats.all(),s=a[id]||{best:0,tries:0};s.tries++;s.best=Math.max(s.best,pct);a[id]=s;try{localStorage.setItem("ph:stats",JSON.stringify(a))}catch(e){}}};
window.TESTS=window.TESTS||{};
const load=id=>new Promise((ok,no)=>{if(TESTS[id])return ok(TESTS[id]);const s=document.createElement("script");s.src=`data/${id}.js`;s.onload=()=>ok(TESTS[id]);s.onerror=no;document.head.appendChild(s)});
document.addEventListener("DOMContentLoaded",theme.init);
/* ---- Name, mock section, saved reports, report card (print to PDF) ---- */
IC.mock='<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/>';IC.dl='<path d="M12 3v12m0 0-4-4m4 4 4-4M4 21h16"/>';
const MOCKSEC={id:"mock",title:"Full Mock Test",color:"#d9822b",desc:"One exam with random questions drawn from all five sections. You choose how many questions."};
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const user={get(){try{return localStorage.getItem("ph:name")||""}catch(e){return""}},set(n){try{localStorage.setItem("ph:name",n)}catch(e){}}};
const reports={all(){try{return JSON.parse(localStorage.getItem("ph:reports"))||[]}catch(e){return[]}},
add(r){let a=[r,...reports.all()].slice(0,25);for(;;){try{localStorage.setItem("ph:reports",JSON.stringify(a));return}catch(e){if(a.length<2)return;a=a.slice(0,Math.ceil(a.length/2))}}},
clear(){try{localStorage.removeItem("ph:reports")}catch(e){}}};
const secName=k=>k=="mock"?"Full Mock Test":(SECTIONS.find(s=>s.id==k)||{}).title||k;
const bySec=items=>{const m={};items.forEach(x=>{const o=m[x.s]||(m[x.s]={n:0,ok:0});o.n++;if(x.r=="c")o.ok++});return m};
function askName(force){if($("nmm"))return;const m=document.createElement("div");m.className="modal";m.id="nmm";
 m.innerHTML=`<form class="card"><h2 style="margin-top:0">${force?"Change name":"Welcome! What is your name?"}</h2><p class="mut">Your name is printed on your report cards. It is saved only in this browser.</p><input type="text" id="nmi" maxlength="40" required placeholder="Your full name" autocomplete="name" value="${esc(user.get())}"><div class="row"><button class="btn">Continue →</button>${force?'<button type="button" class="btn ghost" id="nmc">Cancel</button>':""}</div></form>`;
 document.body.appendChild(m);const i=$("nmi");i.focus();i.select();
 m.firstChild.onsubmit=e=>{e.preventDefault();const v=i.value.trim();if(!v)return;user.set(v);m.remove();greet()};if(force)$("nmc").onclick=()=>m.remove()}
function greet(){let b=$("who");if(!b){b=document.createElement("button");b.id="who";b.className="who";b.title="Change name";b.onclick=()=>askName(1);document.querySelector("nav").insertBefore(b,$("tt"))}b.textContent="👤 "+user.get()}
document.addEventListener("DOMContentLoaded",()=>user.get()?greet():askName());
function printReport(r){const ss={};r.items.forEach(x=>{const o=ss[x.s]||(ss[x.s]={n:0,ok:0,t:0});o.n++;o.t+=x.t;if(x.r=="c")o.ok++});
 const multi=Object.keys(ss).length>1,g=r.pct>=80?"Excellent":r.pct>=60?"Good":r.pct>=40?"Fair":"Needs practice",att=r.n-r.skip,acc=att?Math.round(r.ok/att*100):0,
 mm=s=>Math.floor(s/60)+"m "+String(Math.round(s)%60).padStart(2,"0")+"s",fin=new Date(r.id),st=new Date(r.id-r.secs*1000),tf=d=>d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),
 lim=[r.pq?r.pq+" s per question":"",r.tot?r.tot+" min total":""].filter(Boolean).join(", ")||"None",w=v=>(v/r.n*100).toFixed(1),
 html=`<!doctype html><html><head><meta charset="utf-8"><title>${esc(r.name)} - ${esc(r.sec)} - Report Card</title><style>@page{size:A4;margin:14mm}*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}body{font:13px/1.45 system-ui,Arial,sans-serif;color:#141b34;margin:0}h1{margin:0;font-size:24px}h2{font-size:15px;margin:20px 0 8px}.h{display:flex;justify-content:space-between;align-items:end;border-bottom:3px solid #5b5bf0;padding-bottom:10px}.sub{color:#5d6785}
 .top{display:flex;gap:22px;align-items:center;margin:18px 0}.ring{flex:none;width:120px;height:120px;border-radius:50%;background:conic-gradient(#5b5bf0 ${r.pct}%,#e3e6f3 0);display:grid;place-items:center;position:relative}.ring:before{content:"";position:absolute;inset:11px;background:#fff;border-radius:50%}.ring b{position:relative;font-size:26px}
 .kv{flex:1}.kv div{display:flex;justify-content:space-between;border-bottom:1px solid #e3e6f3;padding:5px 0}.kv span{color:#5d6785}
 .sc{display:flex;gap:10px}.sc div{flex:1;border:1px solid #dde;border-radius:8px;padding:10px 6px;text-align:center;color:#5d6785}.sc b{display:block;font-size:22px;color:#141b34}
 .seg{display:flex;height:16px;border-radius:8px;overflow:hidden;background:#e3e6f3}.seg i{display:block}.lg{display:flex;gap:16px;margin-top:6px;color:#5d6785;font-size:12px}
 table{width:100%;border-collapse:collapse}th,td{border-bottom:1px solid #e3e6f3;padding:7px;text-align:left}th{background:#eef0fb}.bar{height:10px;background:#e3e6f3;border-radius:5px;overflow:hidden;min-width:110px}.bar i{display:block;height:100%;background:#5b5bf0}.ft{margin-top:26px;color:#8a92ad;font-size:11px;text-align:center}</style></head><body>
 <div class="h"><div><h1>Performance Report</h1><div class="sub">Practice Hub · ${esc(r.sec)}</div></div><div class="sub">${esc(fin.toLocaleDateString([],{day:"numeric",month:"long",year:"numeric"}))}</div></div>
 <div class="top"><div class="ring"><b>${r.pct}%</b></div><div class="kv"><div><span>Candidate</span><b>${esc(r.name)}</b></div><div><span>Test</span><b>${esc(r.sec)}</b></div><div><span>Started</span><b>${tf(st)}</b></div><div><span>Finished</span><b>${tf(fin)}</b></div><div><span>Time taken</span><b>${mm(r.secs)}</b></div><div><span>Time limit</span><b>${esc(lim)}</b></div></div></div>
 <div class="sc"><div><b>${r.ok}/${r.n}</b>Marks</div><div><b>${r.pct}%</b>Percentage</div><div><b>${acc}%</b>Accuracy</div><div><b>${mm(r.secs/r.n)}</b>Avg / question</div><div><b>${g}</b>Result</div></div>
 <h2>Answer breakdown</h2><div class="seg"><i style="width:${w(r.ok)}%;background:#0f8a48"></i><i style="width:${w(r.wr)}%;background:#c8332b"></i><i style="width:${w(r.skip)}%;background:#b7bdd3"></i></div>
 <div class="lg"><span>■ Correct ${r.ok}</span><span>■ Wrong ${r.wr}</span><span>■ Unanswered ${r.skip}</span><span>Total ${r.n}</span></div>
 ${multi?`<h2>Section-wise analysis</h2><table><tr><th>Section</th><th>Marks</th><th>Score</th><th></th><th>Avg time</th></tr>${Object.entries(ss).map(([k,v])=>{const p=Math.round(v.ok/v.n*100);return`<tr><td>${esc(secName(k))}</td><td>${v.ok}/${v.n}</td><td>${p}%</td><td><div class="bar"><i style="width:${p}%"></i></div></td><td>${mm(v.t/v.n)}</td></tr>`}).join("")}</table>`:""}
 <div class="ft">Generated by Practice Hub for ${esc(r.name)} on ${esc(fin.toLocaleString())}</div></body></html>`;
 const old=$("rpf");if(old)old.remove();const f=document.createElement("iframe");f.id="rpf";f.style.cssText="position:fixed;right:0;bottom:0;width:0;height:0;border:0";f.srcdoc=html;
 f.onload=()=>{const t=document.title;document.title=r.name+" - "+r.sec+" - Report Card";f.contentWindow.focus();f.contentWindow.print();setTimeout(()=>document.title=t,2000)};document.body.appendChild(f)}
