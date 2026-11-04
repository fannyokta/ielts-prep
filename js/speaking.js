/* Speaking module: templates, Part 2 timer, recorder, self-assessment.
   Interactions update the DOM directly (inline handlers, prefix "sp") so timers,
   the keyword box and recordings are not wiped by the app's full re-render. */

const SP_TABS = [["p1","Part 1"],["p2","Part 2 + Timer"],["p3","Part 3"],["up","Upgrade"],["me","Self-check"]];
const sp = {tab:"p1", cue:SP_CUES[0], cd:{}, p2:{phase:"idle",rem:60,total:60,iv:null,paused:false}, rec:{mr:null,on:false,n:0,t0:0}};
const spLS = (k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
const spSet = (k,v)=>localStorage.setItem(k,JSON.stringify(v));
const spEl = id=>document.getElementById(id);
const spFmt = s=>Math.floor(s/60)+":"+String(s%60).padStart(2,"0");
const spPick = a=>a[Math.floor(Math.random()*a.length)];

function spCleanup(){
  Object.values(sp.cd).forEach(c=>clearInterval(c.iv)); sp.cd={};
  clearInterval(sp.p2.iv); sp.p2={phase:"idle",rem:60,total:60,iv:null,paused:false};
  if(sp.rec.on&&sp.rec.mr){try{sp.rec.mr.stop()}catch(e){}} sp.rec.on=false;
}
window.addEventListener("hashchange",spCleanup);

function spBeep(f=880,ms=180){
  try{const a=new (window.AudioContext||window.webkitAudioContext)(),o=a.createOscillator(),g=a.createGain();
    o.frequency.value=f;g.gain.value=.08;o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+ms/1000)}catch(e){}
}

/* ---------- builders ---------- */
const spChips=groups=>groups.map(([h,l])=>`<div class="sp-h">${h}</div><div class="chips">${l.map(x=>`<button class="chip" onclick="spCopy(this)">${x}</button>`).join("")}</div>`).join("");
const spBlock=(n,h,d,ex)=>`<div class="sp-block" onclick="this.classList.toggle('open')"><i class="n">${n}</i><div><b>${h}</b> <span class="mu">${d}</span><div class="ex">${ex}</div></div></div>`;
const spSel=(id,obj,fn)=>`<div class="tabs sp-sel" id="${id}">${Object.keys(obj).map((k,i)=>`<button class="tab ${i?'':'on'}" onclick="${fn}(this,'${k.replace(/'/g,"\\'")}')">${k}</button>`).join("")}</div>`;
const spRecBox=id=>`<div class="sp-cd"><span class="sp-dot" id="sp-dot-${id}"></span><button class="pill" id="sp-rec-${id}" onclick="spRecToggle('${id}')">Record</button><span class="mu" id="sp-recs-${id}">Not recording</span></div>
  <div class="sp-sup" id="sp-sup-${id}"></div>
  <div class="sp-live" id="sp-live-${id}" style="display:none"></div><div id="sp-takes-${id}"></div>`;
const spCountdown=(id,secs,label)=>`<div class="sp-cd"><button class="pill" id="sp-cdb-${id}" data-s="${secs}" onclick="spCount('${id}',${secs})">Start ${secs}s</button><span class="sp-cdn" id="sp-cd-${id}"></span><span class="mu">${label}</span></div>`;

function spP1(){return `
 <div class="sp-two">
  <section class="group"><h3><b>Formula: A + R + D</b></h3>
   <p class="mu sp-p">Answer, Reason, Detail. Tap a block to see an example.</p>
   ${spBlock("A","Answer","reply directly, not in one word.","“Yes, definitely.” / “Not really, to be fair.”")}
   ${spBlock("R","Reason","say why, with “because”.","“… because it helps me unwind after work.”")}
   ${spBlock("D","Detail","one short, real example.","“I usually read fiction for half an hour before bed.”")}
   <div class="sp-cmp">
    <div class="bad"><span class="tag">Band 5 style</span><p>“Yes. I like cooking. It is good.”</p></div>
    <div class="ok"><span class="tag">Band 7 style</span><p>“Yes, definitely. I'd say I'm quite into it, mainly because it helps me unwind after work. Actually, I try a new recipe every weekend.”</p></div>
   </div>
  </section>
  <section class="group"><h3><b>Fillers &amp; variety</b></h3><p class="mu sp-p">Tap to copy. Natural fillers beat “eee”.</p>${spChips(SP_PHRASES.p1)}
   <div class="sp-warn"><b>Avoid:</b> one-sentence answers, repeating the question word for word, memorised answers with a flat tone.</div></section>
 </div>
 <section class="group"><h3><b>Quick practice</b> · Part 1</h3>
  ${spSel("sp-p1-topics",SP_P1,"spTopic")}
  <div class="sp-q" id="sp-p1-q">Press “New question” to start.</div>
  <div class="sp-cd"><button class="pill" onclick="spNewP1()">New question</button></div>
  ${spCountdown("p1",45,"Answer with A + R + D.")}
  ${spRecBox("p1")}
 </section>`}

function spP2(){const kw=spLS("sp_kw","");return `
 <div class="sp-two">
  <div>
   <section class="sp-cue"><span class="tag">Cue card</span><h3 id="sp-cue-t">${sp.cue.t}</h3><ul id="sp-cue-p">${sp.cue.p.map(x=>`<li>${x}</li>`).join("")}</ul>
    <div class="sp-cd"><button class="pill" onclick="spNewCue()">New cue card</button><button class="pill" onclick="spCopyCue()">Copy</button></div>
    <p class="mu sp-p" id="sp-cue-f">Likely follow-up: “${sp.cue.f}”</p></section>
   <section class="group"><h3><b>Keyword box</b> · 1 min prep</h3><p class="mu sp-p">Write keywords only. Saved on this device.</p>
    <textarea class="sp-ta" id="sp-kw" oninput="spSet('sp_kw',this.value)" placeholder="O: café near house&#10;W: cosy, wood, plants&#10;W: 2 years ago, exams&#10;W: helps focus, friendly staff&#10;C: my little escape">${kw}</textarea>
    <div class="sp-cd"><button class="pill" onclick="spEl('sp-kw').value='';spSet('sp_kw','')">Clear</button></div></section>
  </div>
  <div>
   <section class="group sp-timer"><div class="tag" id="sp-stage">Ready</div><div class="sp-big" id="sp-time">1:00</div>
    <div class="mu sp-p" id="sp-sub">Start: 1 minute to prepare, then 2 minutes to speak.</div>
    <div class="sp-bar"><i id="sp-prog"></i></div>
    <div class="sp-cd" style="justify-content:center"><button class="pill on" id="sp-start" onclick="spP2Start()">Start</button><button class="pill" id="sp-pause" onclick="spP2Pause()" disabled>Pause</button><button class="pill" onclick="spP2Reset()">Reset</button></div></section>
   <section class="group"><h3><b>Voice recorder</b></h3><p class="mu sp-p">Record your answer, then listen back. A live transcript appears while you speak (Chrome or Edge). Audio stays in your browser and is lost when you leave this page.</p>
    ${spRecBox("p2")}
    <div class="sp-note">Listen for: how many “eee”? Tense consistent? Flat intonation? Repeated words?</div></section>
  </div>
 </div>
 <section class="group"><h3><b>5-block template</b> · Part 2</h3><p class="mu sp-p">Follow this order to fill 2 minutes. Tap a block for an example.</p>
  ${spBlock(1,"Opening","“I'd like to talk about …”","“I'd like to talk about a small café near my house that I visit almost every weekend.”")}
  ${spBlock(2,"What / who","describe it.","“It's a cosy place with wooden interiors and lots of plants. What makes it special is the quiet atmosphere.”")}
  ${spBlock(3,"When / where","give the context.","“I first went about two years ago, when I was preparing for my final exams.”")}
  ${spBlock(4,"Why","this is the long part (3–4 sentences).","“The main reason I keep going back is that it helps me focus. Another thing is that the staff are friendly. I suppose it's become my little escape from the busy city.”")}
  ${spBlock(5,"Closing","feeling or conclusion.","“So yeah, that's why this café really means a lot to me.”")}
  <div class="sp-warn"><b>Timing:</b> 0:00–0:20 opening + what · 0:20–0:50 when/where · 0:50–1:40 why · 1:40–2:00 closing.</div></section>`}

function spP3(){return `
 <div class="sp-two">
  <section class="group"><h3><b>Formula: AREA</b></h3><p class="mu sp-p">Answer, Reason, Example, Alternative.</p>
   ${spBlock("A","Answer","your opinion, directly.","“I'd argue that convenience is the main driver.”")}
   ${spBlock("R","Reason","“This is mainly because …”","“… because people are busier than ever, so ordering from a phone saves time.”")}
   ${spBlock("E","Example","“For instance, …”","“My parents now buy groceries online instead of going to the market.”")}
   ${spBlock("A","Alternative","the other side or a balance.","“Having said that, physical shops still matter, so on balance it depends on what people value.”")}
   <div class="sp-note"><b>Key:</b> it's fine to disagree. Examiners like answers that are analytical and balanced.</div></section>
  <section class="group"><h3><b>Analytical phrases</b></h3><p class="mu sp-p">Tap to copy.</p>${spChips(SP_PHRASES.p3)}</section>
 </div>
 <section class="group"><h3><b>Quick practice</b> · Part 3</h3>
  ${spSel("sp-p3-themes",SP_P3,"spTheme")}
  <div class="sp-q alt" id="sp-p3-q">Press “New question” to start.</div>
  <div class="sp-cd"><button class="pill" onclick="spNewP3()">New question</button></div>
  ${spCountdown("p3",60,"Answer with AREA.")}
  ${spRecBox("p3")}
 </section>`}

function spUp(){return `
 <div class="sp-two">
  <section class="group"><h3><b>Upgrade basic words</b></h3>${SP_UP.map(([a,b])=>`<div class="sp-up"><span class="bad">${a}</span><i>→</i><span class="ok">${b}</span></div>`).join("")}</section>
  <section class="group"><h3><b>Complex structures</b> · use 2–3 per answer</h3>${SP_STRUCT.map(([a,b])=>`<div class="sp-up"><span class="mu">${a}</span><i></i><span>${b}</span></div>`).join("")}
   <div class="sp-warn"><b>Accuracy beats complexity.</b> Skip a structure if it makes you make errors.</div></section>
 </div>
 <section class="group"><h3><b>Common mistakes</b> that keep you stuck</h3>${SP_MISTAKES.map(([a,b])=>`<div class="sp-up"><span class="bad">${a}</span><i>→</i><span>${b}</span></div>`).join("")}</section>`}

function spMe(){
  const ck=spLS("sp_check",[]),rt=spLS("sp_rate",[0,0,0,0]);
  return `
 <div class="sp-two">
  <section class="group"><h3><b>Checklist</b></h3><p class="mu sp-p">Tick after each practice. Saved on this device.</p>
   ${SP_CHECK.map((t,i)=>`<label class="sp-ck ${ck[i]?'done':''}"><input type="checkbox" ${ck[i]?'checked':''} onchange="spTick(${i},this)"> <span>${t}</span></label>`).join("")}
   <div class="sp-cd"><span class="badge" id="sp-score">${ck.filter(Boolean).length} / ${SP_CHECK.length}</span><button class="pill" onclick="spCkReset()">Reset</button></div></section>
  <section class="group"><h3><b>Rate yourself</b> · band 4–9</h3><p class="mu sp-p">After listening to your recording, rate each criterion honestly.</p>
   ${SP_BANDS.map((b,i)=>`<div class="sp-rate"><div><b>${b[0]}</b><div class="mu sm">${b[1]}<br>${b[2]}</div></div><div class="sp-nums" id="sp-r${i}">${[4,5,6,7,8,9].map(v=>`<button class="${rt[i]===v?'on':''}" onclick="spRate(${i},${v})">${v}</button>`).join("")}</div></div>`).join("")}
   <div class="sp-cd"><span class="tag">Overall</span><span class="sp-ov" id="sp-ov">–</span><button class="pill on" onclick="spSave()">Save attempt</button></div>
   <div class="sp-hist" id="sp-hist"></div></section>
 </div>
 <section class="group"><h3><b>Daily routine</b> · 40 minutes</h3><div class="sp-two3">${SP_ROUTINE.map(([a,b])=>`<div class="sp-note"><b>${a}</b> ${b}</div>`).join("")}</div>
  <p class="mu sp-p">30 minutes every day beats 5 hours once a week.</p></section>`}

function speaking(){
  spCleanup(); sp.tab="p1"; sp.cue=SP_CUES[0];
  const html=`<div class="bar"><div class="wrap"><div class="tabs">${SP_TABS.map(([k,l])=>`<button class="tab ${k===sp.tab?'on':''}" id="sp-tab-${k}" onclick="spTab('${k}')">${l}</button>`).join("")}</div></div></div>
  <div class="wrap"><div class="ph"><div class="eyebrow">Speaking · Academic &amp; General</div><h2>Speak in blocks, not in scripts.</h2></div>
  <div class="sp-panel on" id="sp-p1">${spP1()}</div><div class="sp-panel" id="sp-p2">${spP2()}</div><div class="sp-panel" id="sp-p3">${spP3()}</div>
  <div class="sp-panel" id="sp-up">${spUp()}</div><div class="sp-panel" id="sp-me">${spMe()}</div></div>`;
  setTimeout(()=>{spShowRate();spShowHist();spSupport()},0);
  return html;
}

/* ---------- interactions ---------- */
function spTab(k){sp.tab=k;SP_TABS.forEach(([t])=>{spEl("sp-"+t).classList.toggle("on",t===k);spEl("sp-tab-"+t).classList.toggle("on",t===k)});window.scrollTo(0,0)}
function spCopy(el){const t=el.textContent.trim(),o=el.textContent;(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).catch(()=>{}).finally(()=>{el.textContent="✓ copied";setTimeout(()=>el.textContent=o,800)})}
function spSelPick(btn){btn.parentNode.querySelectorAll(".tab").forEach(b=>b.classList.remove("on"));btn.classList.add("on")}
let spTopicNow=Object.keys(SP_P1)[0],spThemeNow=Object.keys(SP_P3)[0];
function spTopic(b,k){spSelPick(b);spTopicNow=k;spNewP1()}
function spTheme(b,k){spSelPick(b);spThemeNow=k;spNewP3()}
function spNewP1(){spEl("sp-p1-q").textContent=spPick(SP_P1[spTopicNow]);spStop("p1")}
function spNewP3(){spEl("sp-p3-q").textContent=spPick(SP_P3[spThemeNow]);spStop("p3")}

function spStop(id){const c=sp.cd[id];if(c){clearInterval(c.iv);delete sp.cd[id]}const b=spEl("sp-cdb-"+id),n=spEl("sp-cd-"+id);if(b)b.textContent="Start "+b.dataset.s+"s";if(n){n.textContent="";n.classList.remove("warn")}}
function spCount(id,secs){
  if(sp.cd[id]){spStop(id);return}
  let r=secs;const n=spEl("sp-cd-"+id),b=spEl("sp-cdb-"+id);n.textContent=r+"s";b.textContent="Stop";
  sp.cd[id]={iv:setInterval(()=>{r--;n.textContent=r+"s";n.classList.toggle("warn",r<=10);
    if(r<=0){clearInterval(sp.cd[id].iv);delete sp.cd[id];n.textContent="Time's up!";b.textContent="Start "+secs+"s";spBeep(660,300)}},1000)};
}

function spNewCue(){let c;do{c=spPick(SP_CUES)}while(c===sp.cue);sp.cue=c;
  spEl("sp-cue-t").textContent=c.t;spEl("sp-cue-p").innerHTML=c.p.map(x=>`<li>${x}</li>`).join("");spEl("sp-cue-f").textContent="Likely follow-up: “"+c.f+"”";spP2Reset()}
function spCopyCue(){navigator.clipboard&&navigator.clipboard.writeText(sp.cue.t+"\n"+sp.cue.p.map(p=>"• "+p).join("\n"))}

/* Part 2 timer: 60s prep then 120s speak */
function spP2Render(){const t=sp.p2;spEl("sp-time").textContent=spFmt(t.rem);spEl("sp-prog").style.width=(t.total?(t.total-t.rem)/t.total*100:0)+"%";spEl("sp-time").classList.toggle("warn",t.phase==="speak"&&t.rem<=15)}
function spP2Phase(p){const t=sp.p2,S=spEl("sp-stage"),U=spEl("sp-sub");t.phase=p;
  if(p==="prep"){S.textContent="Prep · 1 minute";U.textContent="Write keywords. Don't write full sentences.";t.total=t.rem=60}
  else if(p==="speak"){S.textContent="Speak · 2 minutes";U.textContent="Speak now. Follow the 5 blocks.";t.total=t.rem=120}
  else if(p==="done"){S.textContent="Done";U.textContent="Well done. Listen to your recording and rate yourself."}
  else{S.textContent="Ready";U.textContent="Start: 1 minute to prepare, then 2 minutes to speak.";t.total=t.rem=60}
  spP2Render()}
function spP2Start(){const t=sp.p2;if(t.iv)return;if(t.phase==="idle"||t.phase==="done")spP2Phase("prep");
  t.paused=false;spEl("sp-pause").disabled=false;spEl("sp-start").disabled=true;t.iv=setInterval(spP2Tick,1000)}
function spP2Tick(){const t=sp.p2;t.rem--;spP2Render();if(t.rem>0)return;
  if(t.phase==="prep"){spBeep(880,250);spP2Phase("speak")}
  else{clearInterval(t.iv);t.iv=null;spBeep(660,500);spP2Phase("done");spEl("sp-start").disabled=false;spEl("sp-pause").disabled=true}}
function spP2Pause(){const t=sp.p2,b=spEl("sp-pause");
  if(t.iv){clearInterval(t.iv);t.iv=null;t.paused=true;b.textContent="Resume"}
  else if(t.paused){t.iv=setInterval(spP2Tick,1000);t.paused=false;b.textContent="Pause"}}
function spP2Reset(){const t=sp.p2;clearInterval(t.iv);t.iv=null;t.paused=false;spEl("sp-start").disabled=false;spEl("sp-pause").disabled=true;spEl("sp-pause").textContent="Pause";spP2Phase("idle")}

function spSupport(){
  const ok=!!(window.SpeechRecognition||window.webkitSpeechRecognition),file=location.protocol==="file:";
  const msg=!ok?"✗ Transcript not supported in this browser. Use Chrome or Edge."
    :file?"⚠ Opened as a file. Microphone and transcript may be blocked. Open it via http://localhost or your Herd .test address instead."
    :"✓ Transcript is supported. It appears here while you speak, and stays under each take.";
  document.querySelectorAll(".sp-sup").forEach(e=>{e.textContent=msg;e.className="sp-sup "+(ok&&!file?"ok":"bad")});
}
const spSrErr={"not-allowed":"Speech recognition was blocked. Allow the microphone for this page (and open it via http://localhost or https, not as a file).","service-not-allowed":"Speech recognition was blocked by the browser or system.","network":"Speech recognition needs an internet connection.","audio-capture":"No microphone found."};
/* Recorder: every take is kept in a list, with a transcript from the browser's speech recognition */
const spFillers=/\b(um+|uh+|er+m?|you know|i mean|kind of|sort of)\b/gi;
const spStop_=new Set("the a an and or but to of in on at is are was were it i you he she we they that this for with as be so my me have has had do not no yes very just".split(" "));
function spStats(text,secs){
  const w=(text.toLowerCase().match(/[a-z']+/g)||[]),n=w.length,f=(text.match(spFillers)||[]).length,c={};
  w.filter(x=>x.length>3&&!spStop_.has(x)).forEach(x=>c[x]=(c[x]||0)+1);
  const rep=Object.entries(c).filter(e=>e[1]>=3).sort((a,b)=>b[1]-a[1]).slice(0,3).map(e=>e[0]+" ×"+e[1]);
  return {n,wpm:secs>0?Math.round(n/(secs/60)):0,f,rep};
}
function spTakeHtml(num,secs,url,text,supported,err){
  const st=spStats(text,secs);
  const tr=text?`<div class="sp-tr">${text.replace(/</g,"&lt;")}</div>
    <div class="sp-stats"><span><b>${st.n}</b> words</span><span><b>${st.wpm}</b> words/min</span><span><b>${st.f}</b> fillers</span>${st.rep.length?`<span>repeated: ${st.rep.join(", ")}</span>`:""}</div>
    <div class="mu sm">Aim for roughly 110–160 words/min. The browser often leaves out “um” and “uh”, so the filler count is a minimum. Check the transcript for mistakes too: wrong words can mean unclear pronunciation.</div>`
    :`<div class="sp-err">${err?err:supported?"No speech was recognised. Speak closer to the mic and try again.":"Transcript isn't supported in this browser. Use Chrome or Edge."}</div>`;
  return `<div class="sp-take"><span class="mu">Take ${num} · ${spFmt(secs)}</span><audio controls src="${url}"></audio>${tr}</div>`;
}
async function spRecToggle(id){
  const r=sp.rec,$=k=>spEl("sp-"+k+"-"+id);
  if(r.on&&r.id!==id){$("recs").textContent="Stop the other recording first.";return}
  if(r.on){r.on=false;if(r.sr){try{r.sr.stop()}catch(e){}}r.mr.stop();return}
  try{
    const st=await navigator.mediaDevices.getUserMedia({audio:true}),ch=[];
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition,live=$("live");r.id=id;
    r.final="";r.sr=null;r.err="";
    r.mr=new MediaRecorder(st);
    r.mr.ondataavailable=e=>{if(e.data.size)ch.push(e.data)};
    r.mr.onstop=()=>{r.on=false;st.getTracks().forEach(t=>t.stop());
      $("dot").classList.remove("live");$("rec").textContent="Record again";$("recs").textContent="Finishing transcript…";
      const secs=Math.round((Date.now()-r.t0)/1000),url=URL.createObjectURL(new Blob(ch,{type:r.mr.mimeType||"audio/webm"}));
      setTimeout(()=>{live.style.display="none";$("recs").textContent="Saved below";
        $("takes").insertAdjacentHTML("afterbegin",spTakeHtml(++r.n,secs,url,r.final.trim(),!!SR,r.err))},r.sr?700:0)};
    r.mr.start();r.t0=Date.now();r.on=true;
    if(SR){
      const sr=r.sr=new SR();sr.lang="en-US";sr.continuous=true;sr.interimResults=true;
      sr.onresult=e=>{let f="",i="";for(let k=0;k<e.results.length;k++){const t=e.results[k][0].transcript;e.results[k].isFinal?f+=t+" ":i+=t}
        r.final=f;live.textContent=f+i};
      sr.onend=()=>{if(r.on){try{sr.start()}catch(e){}}};
      sr.onerror=e=>{if(e.error==="no-speech"||e.error==="aborted")return;r.err=spSrErr[e.error]||("Speech recognition error: "+e.error);live.style.display="block";live.textContent=r.err};
      try{sr.start()}catch(e){}
      live.style.display="block";live.textContent="Listening… start speaking, your words will appear here.";
    }else{live.style.display="block";live.textContent="Live transcript isn't supported in this browser. Use Chrome or Edge."}
    $("dot").classList.add("live");$("rec").textContent="Stop";$("recs").textContent="Recording…";
  }catch(e){$("recs").textContent="Microphone not available or permission denied."}
}

/* Checklist */
function spTick(i,el){const c=spLS("sp_check",[]);c[i]=el.checked;spSet("sp_check",c);el.parentNode.classList.toggle("done",el.checked);spEl("sp-score").textContent=c.filter(Boolean).length+" / "+SP_CHECK.length}
function spCkReset(){spSet("sp_check",[]);document.querySelectorAll(".sp-ck").forEach(l=>{l.classList.remove("done");l.querySelector("input").checked=false});spEl("sp-score").textContent="0 / "+SP_CHECK.length}

/* Self-rating: overall = average rounded to the nearest half band */
function spOverall(r){return r.every(Boolean)?Math.round(r.reduce((a,b)=>a+b,0)/r.length*2)/2:null}
function spShowRate(){const o=spOverall(spLS("sp_rate",[0,0,0,0]));if(spEl("sp-ov"))spEl("sp-ov").textContent=o===null?"–":o.toFixed(1)}
function spRate(i,v){const r=spLS("sp_rate",[0,0,0,0]);r[i]=v;spSet("sp_rate",r);
  spEl("sp-r"+i).querySelectorAll("button").forEach(b=>b.classList.toggle("on",+b.textContent===v));spShowRate()}
function spSave(){const r=spLS("sp_rate",[0,0,0,0]),o=spOverall(r);if(o===null){spEl("sp-ov").textContent="rate all 4";return}
  const h=spLS("sp_hist",[]);h.unshift({d:new Date().toLocaleDateString(),o,r});spSet("sp_hist",h.slice(0,8));spShowHist()}
function spShowHist(){const e=spEl("sp-hist");if(!e)return;const h=spLS("sp_hist",[]);
  e.innerHTML=h.length?`<div class="sp-h">Recent attempts</div>`+h.map(x=>`<div class="sp-up"><span class="mu">${x.d}</span><i></i><span><b>${x.o.toFixed(1)}</b> <span class="mu">(${x.r.join(" · ")})</span></span></div>`).join(""):""}
