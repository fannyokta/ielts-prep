/* "Build a sentence" widget (Verb + Adverb tab) */
const BV=[["rise","rose",1],["increase","increased",1],["fall","fell",0],["decrease","decreased",0],["decline","declined",0],["drop","dropped",0]];
const BA=[["slightly","slight"],["gradually","gradual"],["steadily","steady"],["considerably","considerable"],["significantly","significant"],["sharply","sharp"],["rapidly","rapid"],["dramatically","dramatic"],["suddenly","sudden"]];
const bld={v:0,a:5};
function builder(){
  const v=BV[bld.v],a=BA[bld.a],nums=v[2]?"from 20 to 60":"from 60 to 20";
  return `<section class="group"><h3>Build a sentence · <b>verb + adverb</b></h3>
   <div class="chips">${BV.map((x,i)=>`<button class="chip ${i===bld.v?'open':''}" data-bv="${i}">${x[0]}</button>`).join("")}</div>
   <div class="chips" style="margin-top:8px">${BA.map((x,i)=>`<button class="chip ${i===bld.a?'open':''}" data-ba="${i}">${x[0]}</button>`).join("")}</div>
   <div class="eg"><span style="color:var(--mute);font-size:12px">Verb + adverb</span><br>Sales <b>${v[1]} ${a[0]}</b> ${nums} units.</div>
   <div class="eg"><span style="color:var(--mute);font-size:12px">Adjective + noun</span><br>There was <b>a ${a[1]} ${v[0]}</b> in sales ${nums} units.</div>
   <div class="eg" style="border-color:var(--line)"><span style="color:var(--mute);font-size:13px">Put the adverb <b style="color:var(--ink)">after</b> the verb: <i>rose sharply</i>, not <i>sharply rose</i>. Adverb ends in -ly; the adjective doesn’t.</span></div></section>`;
}

