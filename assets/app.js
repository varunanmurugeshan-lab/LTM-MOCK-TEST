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
