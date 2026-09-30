const id=new URLSearchParams(location.search).get("s"),MOCK=id=="mock",SEC=MOCK?MOCKSEC:SECTIONS.find(s=>s.id==id),app=$("app");
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const FIXED=/^(statement \d|none of the above|no error|no improvement|all of the above)/i,L="ABCDEFG",ALL=()=>T.D.map((_,i)=>({s:id,i}));
let T,S,timer;
if(!SEC)location.replace("index.html");else{document.title=SEC.title+" · Practice Hub";document.documentElement.style.setProperty("--c",SEC.color);
 (MOCK?Promise.all(SECTIONS.map(s=>load(s.id))).then(a=>{T={all:{}};a.forEach((t,i)=>T.all[SECTIONS[i].id]=t);T.N=a.reduce((n,t)=>n+t.D.length,0)}):load(id).then(t=>{T=t;T.N=t.D.length})).then(setup).catch(()=>app.innerHTML='<div class="card">Could not load questions. Check the data folder.</div>')}
const fmt=s=>String(Math.max(0,s)/60|0).padStart(2,"0")+":"+String(Math.max(0,s)%60|0).padStart(2,"0");
/* Mock: shuffle each section, then take round-robin so all five sections are represented, then shuffle the mix */
function mockPool(n){const q=shuf(SECTIONS.map(s=>shuf(T.all[s.id].D.map((_,i)=>({s:s.id,i}))))),out=[];while(out.length<n&&q.some(a=>a.length))q.forEach(a=>{if(out.length<n&&a.length)out.push(a.pop())});return shuf(out)}
function setup(){clearInterval(timer);if(S)clearTimeout(S.adv);S=null;const N=T.N,b=(stats.all()[id]||{}).best,o={n:MOCK?Math.min(25,N):N,fb:MOCK?0:1,sq:1,pq:0,tot:0},
 P=(MOCK?[10,25,50,100,N]:[10,20,N]).filter((v,i,a)=>v<=N&&a.indexOf(v)==i),
 seg=(k,arr,f)=>`<div class="row seg" id="${k}">${arr.map(v=>`<button data-v="${v[0]}" class="${v[0]==f?"on":""}">${v[1]}</button>`).join("")}</div>`;
 app.innerHTML=`<div class="tophead"><div class="tile" style="width:52px;height:52px;border-radius:14px;display:grid;place-items:center;color:#fff;background:var(--c)">${icon(id)}</div><div><h1>${SEC.title}</h1><span class="mut">${N} questions${b?" · Best "+b+"%":""}</span></div></div><p class="mut">${SEC.desc}</p>
 <div class="card"><div class="lbl">Number of questions${MOCK?" (pick a preset or type any number, max "+N+")":""}</div>${seg("ns",P.map(v=>[v,v==N?"All "+v:v]),o.n)}${MOCK?`<input type="number" class="num" id="cn" min="1" max="${N}" value="${o.n}" aria-label="Number of questions">`:""}
 <div class="lbl">Time per question</div>${seg("ps",[[0,"Off"],[30,"30 s"],[60,"60 s"],[90,"90 s"],[120,"2 min"]],0)}
 ${MOCK?`<div class="lbl">Total exam time</div>${seg("ts",[[0,"Off"],[30,"30 min"],[60,"60 min"],[90,"90 min"]],0)}`:""}
 <div class="lbl">Mode</div>${seg("ms",[[1,"Practice · instant feedback"],[0,"Exam · answers at the end"]],o.fb)}
 ${MOCK?"":`<div class="lbl">Order</div>${seg("ss",[[1,"Shuffle"],[0,"In order"]],1)}`}
 <p class="mut" id="hint"></p><div class="row"><button class="btn" id="go">Start ${MOCK?"mock test":"test"} →</button></div></div>`;
 const sg=(k,f)=>{const e=$(k);if(e)e.onclick=ev=>{const v=ev.target.closest("button");if(!v)return;[...e.children].forEach(x=>x.classList.toggle("on",x==v));f(+v.dataset.v);hint()}},
 hint=()=>$("hint").textContent=o.pq?"Each question locks when its timer ends and moves on automatically. Going back is disabled.":"";
 sg("ns",v=>{o.n=v;if($("cn"))$("cn").value=v});sg("ps",v=>o.pq=v);sg("ts",v=>o.tot=v);sg("ms",v=>o.fb=v);sg("ss",v=>o.sq=v);
 if(MOCK)$("cn").oninput=e=>{o.n=Math.max(1,Math.min(N,+e.target.value||1));[...$("ns").children].forEach(x=>x.classList.toggle("on",+x.dataset.v==o.n))};
 $("go").onclick=()=>start(o)}
function start(o,pool){pool=pool||(MOCK?mockPool(o.n):(o.sq?shuf(ALL()):ALL()).slice(0,o.n));
 S={...o,i:0,t0:Date.now(),items:pool.map(p=>{const t=MOCK?T.all[p.s]:T,d=t.D[p.i],ix=d[1].map((_,k)=>k),r=o.sq&&!d[1].some(x=>FIXED.test(x))?shuf(ix):ix;
  return{p,sec:p.s,q:d[0],o:r.map(k=>d[1][k]),c:r.indexOf(d[2]),e:d[3],ex:t.extra,x:d[4]?(t.extra=="passage"?t.P[d[4]]:d[4]):"",pick:null,t:0,to:0}})};
 clearInterval(timer);timer=setInterval(tick,250);show()}
function leave(){const it=S.items[S.i];it.t+=(Date.now()-S.qs)/1000;clearTimeout(S.adv)}
function go(d){leave();S.i+=d;show()}
function tick(){if(!S||S.done)return;const now=Date.now(),e=(now-S.t0)/1000|0,rem=S.tot*60-e;
 if(S.tot&&rem<=0)return finish();
 const tm=$("tm");if(tm)tm.textContent=S.tot?"Left "+fmt(rem):fmt(e);
 if(S.pq){const it=S.items[S.i],l=Math.ceil(S.pq-(now-S.qs)/1000),p=$("pq");if(p){p.textContent="⏳ "+fmt(l);p.classList.toggle("warn",l<=10)}
  if(l<=0&&!it.to){it.to=1;mark();S.adv=setTimeout(()=>S.i<S.items.length-1?go(1):finish(),S.fb?1500:500)}}}
function show(){const it=S.items[S.i],n=S.items.length,last=S.i==n-1;S.qs=Date.now();
 app.innerHTML=`<div class="top"><span>Question ${S.i+1} of ${n}</span>${S.pq?'<span class="pq" id="pq"></span>':""}<span id="tm"></span></div><div class="bar"><i style="width:${S.i/n*100}%"></i></div>
 <div class="card">${MOCK?`<div class="mut" style="margin-bottom:6px">${esc(secName(it.sec))}</div>`:""}${it.x&&it.ex=="passage"?'<div class="pas"><b>Passage</b><div id="x"></div></div>':""}<h2 class="q" id="q"></h2>${it.x&&it.ex=="figure"?`<div class="fig">${it.x}</div>`:""}<div id="opts"></div><div id="fbk"></div>
 <div class="row"><button class="btn ghost" id="pv" ${S.i&&!S.pq?"":"disabled"}>← Back</button><button class="btn" id="nx">${last?"Finish test":"Next →"}</button><button class="btn ghost" id="qt">Quit</button></div></div>`;
 if(it.x&&it.ex=="passage")$("x").textContent=it.x;$("q").textContent=it.q;
 it.o.forEach((t,k)=>{const b=document.createElement("button");b.className="opt"+(t.includes("\n")?" mono":"");b.dataset.k=k;const s=document.createElement("span");s.textContent=t;b.innerHTML="<b>"+L[k]+"</b>";b.appendChild(s);b.onclick=()=>pick(k);$("opts").appendChild(b)});
 $("pv").onclick=()=>go(-1);$("nx").onclick=next;$("qt").onclick=()=>{if(confirm("Quit this test? Progress will be lost."))setup()};mark();tick()}
function mark(){const it=S.items[S.i],rev=S.fb&&(it.pick!==null||it.to),lock=rev||it.to;
 document.querySelectorAll(".opt").forEach(b=>{const k=+b.dataset.k;b.className=b.className.replace(/ ?(sel|ok|bad)/g,"");b.disabled=!!lock;if(rev){if(k==it.c)b.classList.add("ok");else if(k==it.pick)b.classList.add("bad")}else if(k==it.pick)b.classList.add("sel")});
 $("fbk").innerHTML="";if(rev||it.to){const ok=it.pick==it.c,d=document.createElement("div");d.className="fb "+(rev&&ok?"ok":"bad");d.innerHTML="<b>"+(it.pick===null?"Time's up. ":rev?(ok?"Correct. ":"Incorrect. "):"Time's up. ")+"</b>";if(rev)d.appendChild(document.createTextNode(it.e));$("fbk").appendChild(d)}}
function pick(k){const it=S.items[S.i];if(it.to||S.fb&&it.pick!==null)return;it.pick=k;mark()}
function next(){const un=S.items.filter(x=>x.pick===null).length;if(S.i<S.items.length-1)go(1);else if(!un||confirm(un+" question(s) unanswered. Finish anyway?"))finish()}
document.addEventListener("keydown",e=>{if(!S||!$("opts")||e.ctrlKey||e.metaKey||e.target.tagName=="INPUT")return;const k=L.indexOf(e.key.toUpperCase()),d=+e.key-1;const i=k>=0?k:d;
 if(i>=0&&i<S.items[S.i].o.length&&e.key.length==1)pick(i);else if(e.key=="Enter"||e.key=="ArrowRight")next();else if(e.key=="ArrowLeft"&&S.i&&!S.pq)go(-1)});
function finish(){if(S.done)return;leave();S.done=1;clearInterval(timer);result()}
function result(){const it=S.items,n=it.length,ok=it.filter(x=>x.pick==x.c).length,pct=Math.round(ok/n*100),secs=(Date.now()-S.t0)/1000|0,
 wrong=it.filter(x=>x.pick!==x.c),skip=it.filter(x=>x.pick===null).length,
 rec={id:Date.now(),name:user.get()||"Student",sec:SEC.title,sid:id,pct,ok,n,wr:wrong.length-skip,skip,secs,pq:S.pq,tot:S.tot,fb:S.fb,
  items:it.map(x=>({s:x.sec,q:x.q,y:x.pick===null?null:x.o[x.pick],a:x.o[x.c],r:x.pick===null?"s":x.pick==x.c?"c":"w",t:x.t,to:x.to,e:x.pick==x.c?"":x.e}))};
 stats.save(id,pct);reports.add(rec);
 const msg=pct>=80?"Strong result. You are ready for this topic.":pct>=60?"Good start. Review the missed questions below.":"Needs more practice. Read the explanations and retry.",
 bs=Object.entries(bySec(rec.items)).map(([k,v])=>secName(k)+" "+v.ok+"/"+v.n).join(" · ");
 app.innerHTML=`<div class="card"><div class="res"><div class="ring" style="--p:${pct}"><b>${pct}%</b></div><div><h2 style="margin:0">${ok} / ${n} correct</h2><p class="mut">${esc(rec.name)} · ${rec.wr} wrong · ${skip} skipped · ${fmt(secs)}</p><p>${msg}</p>${MOCK?'<p class="mut" id="bs"></p>':""}</div></div>
 <div class="row"><button class="btn" id="dl">${icon("dl")} Download report card</button>${wrong.length?'<button class="btn ghost" id="rw">Retry wrong questions</button>':""}<button class="btn ghost" id="again">New test</button><a class="btn ghost" href="index.html">All sections</a></div><p class="mut">Choose “Save as PDF” in the print window. Every report is also kept under “My reports” on the home page.</p></div><div class="card" style="margin-top:16px"><h2 style="margin-top:0">Review</h2><div id="rv"></div></div>`;
 if(MOCK)$("bs").textContent=bs;$("dl").onclick=()=>printReport(rec);
 it.forEach((x,i)=>{const good=x.pick==x.c,d=document.createElement("div");d.className="rev";d.innerHTML=`<b class="${good?"ok":"bad"}">${good?"Correct":x.pick===null?(x.to?"Timed out":"Skipped"):"Wrong"}</b> <span class="mut">Question ${i+1}</span><p class="q" style="font-size:1rem"></p><p></p><p class="mut"></p>`;
  d.children[2].textContent=x.q;d.children[3].innerHTML=(good?"":'Your answer: <span class="bad"></span><br>')+'Correct answer: <b class="ok"></b>';
  if(!good)d.children[3].querySelector(".bad").textContent=x.pick===null?"(skipped)":x.o[x.pick];d.children[3].querySelector("b.ok").textContent=x.o[x.c];d.children[4].textContent=x.e;$("rv").appendChild(d)});
 $("again").onclick=setup;if(wrong.length)$("rw").onclick=()=>start({n:999,fb:S.fb,sq:S.sq,pq:S.pq,tot:0},wrong.map(x=>x.p))}
