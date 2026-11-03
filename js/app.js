/* Pages, state, views, routing */
function grammar(){
  const tabs=Object.keys(G),tab=gst.tab;
  const row=(c,x)=>`<div class="row ${c}"><i class="m">${c==='ok'?'✓':'✗'}</i><span>${x}</span></div>`;
  const cards=G[tab].map((c,i)=>{
    const id=`${tab}|${i}`,pk=gst.picks[id];
    let q="";
    if(c.q){const done=pk!==undefined;
      q=`<div class="gq"><p>${c.q.s}</p><div class="gopts">${c.q.o.map((o,j)=>{
        const cls=done?(j===c.q.a?"right":j===pk?"wrong":""):"";
        return `<button class="opt ${cls}" data-gq="${i}|${j}" ${done?"disabled":""}>${o}</button>`}).join("")}</div></div>`;}
    return `<section class="group gcard"><h3 class="gh">${c.h}</h3><p class="gp">${c.p}</p>${c.pat?`<div class="pat">${c.pat}</div>`:""}
      ${(c.no||[]).map(x=>row("no",x)).join("")}${(c.ok||[]).map(x=>row("ok",x)).join("")}${q}</section>`}).join("");
  const legend=tab==="Clauses & Sentences"?`<div class="lg"><span class="ind">independent clause</span><span class="dep">dependent clause</span></div>`:"";
  return `<div class="bar"><div class="wrap"><div class="tabs">${tabs.map(t=>`<button class="tab ${t===tab?'on':''}" data-gt="${t}">${t}</button>`).join("")}</div></div></div>
  <div class="wrap"><div class="ph"><div class="eyebrow">Grammar · Academic Writing</div><h2>Write it correctly, then write it well.</h2></div>${legend}${cards}</div>`;
}


const PAGES={
  task1:{title:"Writing Task 1",sub:"Graphs, charts, maps & processes",data:T1,viz:true},
  task2:{title:"Writing Task 2",sub:"Essay argument & topic language",data:T2,viz:false}
};

/* ============ State ============ */
const state={task1:{tab:Object.keys(T1)[0]},task2:{tab:Object.keys(T2)[0]}};
let drill=false,quiz=false,open=null,qs=null;
const known=new Set(JSON.parse(localStorage.getItem("known")||"[]"));
const $=id=>document.getElementById(id);
const save=()=>localStorage.setItem("known",JSON.stringify([...known]));
const esc=s=>s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const shuffle=a=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(p=>p[1]);
const count=d=>Object.values(d).flat().reduce((n,g)=>n+g.w.length,0);
const route=()=>(location.hash.replace(/^#\/?/,"")||"home");

function newQ(p){
  const all=PAGES[p].data[state[p].tab].flatMap(g=>g.w);
  const ans=all[Math.floor(Math.random()*all.length)];
  const wrong=shuffle(all.filter(x=>x!==ans)).slice(0,3);
  qs={ans,opts:shuffle([ans,...wrong]),picked:null,score:qs?qs.score:0,n:qs?qs.n:0};
}

/* ============ Views ============ */
function navHtml(r){
  const crumbs={home:"",vocab:`<a href="#/">Home</a> / Vocabulary`,task1:`<a href="#/">Home</a> / <a href="#/vocab">Vocabulary</a> / Task 1`,task2:`<a href="#/">Home</a> / <a href="#/vocab">Vocabulary</a> / Task 2`,grammar:`<a href="#/">Home</a> / Grammar`};
  return `<a class="brand" href="#/">IELTS<i>.</i>prep</a><span class="crumb">${crumbs[r]||""}</span>`;
}

function home(){
  return `<div class="wrap"><section class="hero">
    <div class="eyebrow">IELTS Academic · Band 6.5+</div>
    <h1>Say it clearly.<br>Score <em>higher</em>.</h1>
    <p class="sub">Short, visual lessons with everyday words that examiners reward. Pick a module and start.</p>
    <a class="cta" href="#/vocab">Start learning →</a>
  </section>
  <div class="menu">
    <a class="mcard" href="#/vocab"><span class="tag">Module 01</span><h2>Vocabulary</h2><p>Useful, easy-to-reuse words for Task 1 and Task 2, with visuals, drills and quizzes.</p><span class="go">Open →</span></a>
    <a class="mcard" href="#/grammar"><span class="tag">Module 02</span><h2>Grammar</h2><p>Clauses, contrast words, commas and the small rules that cost marks.</p><span class="go">Open →</span></a>
    <div class="mcard soon"><span class="tag">Module 03 · Soon</span><h2>Model answers</h2><p>Band 9 samples with annotations.</p></div>
  </div></div>`;
}

function vocab(){
  return `<div class="wrap"><section class="ph"><div class="eyebrow">Vocabulary</div><h1 style="font-size:clamp(30px,5vw,44px)">Choose your task.</h1>
    <p class="sub">Both for the <b>Academic</b> module.</p></section>
  <div class="menu" style="margin-top:6px">
    <a class="mcard big" href="#/task1"><span class="tag">Writing Task 1<span class="badge">Academic</span></span><h2>Describe the data</h2><p>Line &amp; bar charts, pies, tables, processes and maps. Every group comes with an illustration.</p><span class="go">${count(T1)} expressions →</span></a>
    <a class="mcard big" href="#/task2"><span class="tag">Writing Task 2<span class="badge">Academic</span></span><h2>Argue your case</h2><p>Opinion, contrast, cause &amp; effect, solutions and topic language for the essay.</p><span class="go">${count(T2)} expressions →</span></a>
  </div></div>`;
}

function task(p){
  const P=PAGES[p],D=P.data,tabs=Object.keys(D),tab=state[p].tab;
  const head=`<div class="bar"><div class="wrap">
    <div class="tabs">${tabs.map(t=>`<button class="tab ${t===tab?'on':''}" data-t="${t}">${t}</button>`).join("")}</div>
    <div class="tools"><button class="pill ${drill?'on':''}" data-m="drill">${drill?'Drill: on':'Drill'}</button><button class="pill ${quiz?'on':''}" data-m="quiz">Quiz</button></div>
  </div></div>`;
  const title=`<div class="wrap"><div class="ph"><div class="eyebrow">${P.title} · Academic</div><h2>${P.sub}</h2></div>`;
  let body="";
  if(quiz){
    if(!qs)newQ(p);
    const sent=esc(qs.ans[1]).replace(/\[\[(.+?)\]\]/g,'<span class="blank"></span>'),done=qs.picked!==null;
    body=`<div class="hint"><span>Pick the expression that fits the gap.</span></div>
    <div class="quiz"><p class="q">${sent}</p><div class="opts">${qs.opts.map((o,i)=>{
      const c=done?(o===qs.ans?"right":i===qs.picked?"wrong":""):"";
      return `<button class="opt ${c}" data-o="${i}" ${done?"disabled":""}>${esc(o[0])}</button>`}).join("")}</div>
    <div class="qfoot"><span>Score ${qs.score} / ${qs.n}</span>${done?'<button class="next" data-next>Next →</button>':''}</div></div>`;
  }else{
    let total=0,got=0;
    const groups=D[tab].map((g,gi)=>{
      const chips=g.w.map((x,wi)=>{total++;if(known.has(x[0]))got++;
        const id=`${gi}-${wi}`,o=open===id;
        return `<button class="chip ${o?'open':''} ${drill&&!o?'hide':''} ${known.has(x[0])?'known':''}" data-id="${id}">${esc(x[0])}</button>`}).join("");
      let eg="";
      if(open&&open.startsWith(gi+"-")){const x=g.w[+open.split("-")[1]];
        eg=`<div class="eg">${esc(x[1]).replace(/\[\[(.+?)\]\]/g,"<b>$1</b>")}<button data-k="${esc(x[0])}">${known.has(x[0])?'Unmark':'Got it ✓'}</button></div>`}
      const viz=P.viz&&g.v?`<div class="viz">${VIZ[g.v]()}</div>`:"";
      return `<section class="group"><h3>${g.h||`Instead of <b>“${g.c}”</b>`}</h3><div class="gbody">${viz}<div class="side"><div class="chips">${chips}</div>${eg}</div></div></section>`}).join("");
    body=`<div class="hint"><span>${drill?"Words are hidden. Tap to reveal.":"Tap a word for an example."}</span><span>${got} / ${total} learned</span></div>${p==='task1'&&tab==='Verb + Adverb'?builder():''}${groups}`;
  }
  return head+title+body+"</div>";
}

function render(){
  const r=route();
  $("nav").innerHTML=navHtml(r);
  $("app").innerHTML=r==="vocab"?vocab():r==="grammar"?grammar():PAGES[r]?task(r):home();
}

window.addEventListener("hashchange",()=>{drill=false;quiz=false;open=null;qs=null;render();window.scrollTo(0,0)});

document.addEventListener("click",e=>{
  const t=e.target.closest("[data-t],[data-id],[data-k],[data-o],[data-next],[data-m],[data-bv],[data-ba],[data-gt],[data-gq]");
  if(!t)return;
  const p=route();
  if(t.dataset.gt){gst.tab=t.dataset.gt}
  else if(t.dataset.gq){const [i,j]=t.dataset.gq.split("|");gst.picks[gst.tab+"|"+i]=+j}
  else if(t.dataset.t){state[p].tab=t.dataset.t;open=null;qs=null}
  else if(t.dataset.bv!==undefined)bld.v=+t.dataset.bv;
  else if(t.dataset.ba!==undefined)bld.a=+t.dataset.ba;
  else if(t.dataset.id)open=open===t.dataset.id?null:t.dataset.id;
  else if(t.dataset.k){const k=t.dataset.k;known.has(k)?known.delete(k):known.add(k);save()}
  else if(t.dataset.o!==undefined){qs.picked=+t.dataset.o;qs.n++;if(qs.opts[qs.picked]===qs.ans){qs.score++;known.add(qs.ans[0]);save()}}
  else if("next" in t.dataset)newQ(p);
  else if(t.dataset.m==="drill"){drill=!drill;quiz=false}
  else if(t.dataset.m==="quiz"){quiz=!quiz;qs=null;open=null}
  const y=window.scrollY;render();window.scrollTo(0,y);
});
render();
