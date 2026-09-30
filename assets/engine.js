const id=new URLSearchParams(location.search).get("s"),SEC=SECTIONS.find(s=>s.id==id),app=$("app");
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const FIXED=/^(statement \d|none of the above|no error|no improvement|all of the above)/i,L="ABCDEFG";
let T,S,timer;
if(!SEC)location.replace("./");else{document.title=SEC.title+" · Practice Hub";document.documentElement.style.setProperty("--c",SEC.color);load(id).then(t=>{T=t;setup()}).catch(()=>app.innerHTML='<div class="card">Could not load questions. Check the data folder.</div>')}
const fmt=s=>String(s/60|0).padStart(2,"0")+":"+String(s%60).padStart(2,"0");
function setup(){clearInterval(timer);const N=T.D.length,b=(stats.all()[id]||{}).best;let n=N,fb=1,sq=1;
 const opts=[10,20,N].filter((v,i,a)=>v<=N&&a.indexOf(v)==i);
 app.innerHTML=`<div class="tophead"><div class="tile" style="width:52px;height:52px;border-radius:14px;display:grid;place-items:center;color:#fff;background:var(--c)">${icon(id)}</div><div><h1>${SEC.title}</h1><span class="mut">${N} questions${b?" · Best "+b+"%":""}</span></div></div><p class="mut">${SEC.desc}</p>
 <div class="card"><div class="lbl">Number of questions</div><div class="row seg" id="ns">${opts.map(v=>`<button data-v="${v}" class="${v==N?"on":""}">${v==N?"All "+v:v}</button>`).join("")}</div>
 <div class="lbl">Mode</div><div class="row seg" id="ms"><button data-v="1" class="on">Practice · instant feedback</button><button data-v="0">Exam · answers at the end</button></div>
 <div class="lbl">Order</div><div class="row seg" id="ss"><button data-v="1" class="on">Shuffle</button><button data-v="0">In order</button></div>
 <div class="row"><button class="btn" id="go">Start test →</button></div></div>`;
 const sg=(k,f)=>$(k).onclick=e=>{const v=e.target.closest("button");if(!v)return;[...$(k).children].forEach(x=>x.classList.toggle("on",x==v));f(+v.dataset.v)};
 sg("ns",v=>n=v);sg("ms",v=>fb=v);sg("ss",v=>sq=v);$("go").onclick=()=>start(n,fb,sq)}
function start(n,fb,sq,pool){pool=pool||T.D.map((_,i)=>i);pool=(sq?shuf(pool):pool).slice(0,n);
 S={fb,sq,i:0,t0:Date.now(),items:pool.map(i=>{const d=T.D[i],ix=d[1].map((_,k)=>k),o=sq&&!d[1].some(t=>FIXED.test(t))?shuf(ix):ix;
  return{id:i,q:d[0],o:o.map(k=>d[1][k]),c:o.indexOf(d[2]),e:d[3],x:d[4]?(T.extra=="passage"?T.P[d[4]]:d[4]):"",pick:null}})};
 clearInterval(timer);timer=setInterval(()=>{const t=$("tm");if(t)t.textContent=fmt((Date.now()-S.t0)/1000|0)},500);show()}
function show(){const it=S.items[S.i],n=S.items.length,last=S.i==n-1;
 app.innerHTML=`<div class="top"><span>Question ${S.i+1} of ${n}</span><span id="tm">${fmt((Date.now()-S.t0)/1000|0)}</span></div><div class="bar"><i style="width:${S.i/n*100}%"></i></div>
 <div class="card">${it.x&&T.extra=="passage"?'<div class="pas"><b>Passage</b><div id="x"></div></div>':""}<h2 class="q" id="q"></h2>${it.x&&T.extra=="figure"?`<div class="fig">${it.x}</div>`:""}<div id="opts"></div><div id="fbk"></div>
 <div class="row"><button class="btn ghost" id="pv" ${S.i?"":"disabled"}>← Back</button><button class="btn" id="nx">${last?"Finish test":"Next →"}</button><button class="btn ghost" id="qt">Quit</button></div></div>`;
 if(it.x&&T.extra=="passage")$("x").textContent=it.x;$("q").textContent=it.q;
 it.o.forEach((t,k)=>{const b=document.createElement("button");b.className="opt"+(t.includes("\n")?" mono":"");b.dataset.k=k;const s=document.createElement("span");s.textContent=t;b.innerHTML="<b>"+L[k]+"</b>";b.appendChild(s);b.onclick=()=>pick(k);$("opts").appendChild(b)});
 $("pv").onclick=()=>{S.i--;show()};$("nx").onclick=next;$("qt").onclick=()=>{if(confirm("Quit this test? Progress will be lost."))setup()};mark()}
function mark(){const it=S.items[S.i],lock=S.fb&&it.pick!==null;
 document.querySelectorAll(".opt").forEach(b=>{const k=+b.dataset.k;b.className=b.className.replace(/ ?(sel|ok|bad)/g,"");if(lock){b.disabled=true;if(k==it.c)b.classList.add("ok");else if(k==it.pick)b.classList.add("bad")}else if(k==it.pick)b.classList.add("sel")});
 $("fbk").innerHTML="";if(lock){const ok=it.pick==it.c,d=document.createElement("div");d.className="fb "+(ok?"ok":"bad");d.innerHTML="<b>"+(ok?"Correct. ":"Incorrect. ")+"</b>";d.appendChild(document.createTextNode(it.e));$("fbk").appendChild(d)}}
function pick(k){const it=S.items[S.i];if(S.fb&&it.pick!==null)return;it.pick=k;mark()}
function next(){const un=S.items.filter(x=>x.pick===null).length;if(S.i<S.items.length-1){S.i++;show()}else if(!un||confirm(un+" question(s) unanswered. Finish anyway?"))result()}
document.addEventListener("keydown",e=>{if(!S||!$("opts")||e.ctrlKey||e.metaKey)return;const k=L.indexOf(e.key.toUpperCase()),d=+e.key-1;const i=k>=0?k:d;
 if(i>=0&&i<S.items[S.i].o.length&&e.key.length==1)pick(i);else if(e.key=="Enter"||e.key=="ArrowRight")next();else if(e.key=="ArrowLeft"&&S.i){S.i--;show()}});
function result(){clearInterval(timer);const n=S.items.length,ok=S.items.filter(x=>x.pick==x.c).length,pct=Math.round(ok/n*100),secs=(Date.now()-S.t0)/1000|0,
 wrong=S.items.filter(x=>x.pick!==x.c),skip=S.items.filter(x=>x.pick===null).length;stats.save(id,pct);
 const msg=pct>=80?"Strong result. You are ready for this topic.":pct>=60?"Good start. Review the missed questions below.":"Needs more practice. Read the explanations and retry.";
 app.innerHTML=`<div class="card"><div class="res"><div class="ring" style="--p:${pct}"><b>${pct}%</b></div><div><h2 style="margin:0">${ok} / ${n} correct</h2><p class="mut">${wrong.length-skip} wrong · ${skip} skipped · ${fmt(secs)}</p><p>${msg}</p></div></div>
 <div class="row">${wrong.length?'<button class="btn" id="rw">Retry wrong questions</button>':""}<button class="btn ghost" id="again">New test</button><a class="btn ghost" href="./">All sections</a></div></div><div class="card" style="margin-top:16px"><h2 style="margin-top:0">Review</h2><div id="rv"></div></div>`;
 S.items.forEach((x,i)=>{const good=x.pick==x.c,d=document.createElement("div");d.className="rev";d.innerHTML=`<b class="${good?"ok":"bad"}">${good?"Correct":x.pick===null?"Skipped":"Wrong"}</b> <span class="mut">Question ${i+1}</span><p class="q" style="font-size:1rem"></p><p></p><p class="mut"></p>`;
  d.children[2].textContent=x.q;d.children[3].innerHTML=(good?"":'Your answer: <span class="bad"></span><br>')+'Correct answer: <b class="ok"></b>';
  if(!good)d.children[3].querySelector(".bad").textContent=x.pick===null?"(skipped)":x.o[x.pick];d.children[3].querySelector("b.ok").textContent=x.o[x.c];d.children[4].textContent=x.e;$("rv").appendChild(d)});
 $("again").onclick=setup;if(wrong.length)$("rw").onclick=()=>start(999,S.fb,S.sq,wrong.map(x=>x.id))}
