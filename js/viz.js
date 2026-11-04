/* SVG helpers + illustrations for Writing Task 1 */
const svg=(i,h=90)=>`<svg viewBox="0 0 160 ${h}" role="img">${i}</svg>`;
const AX='<path class="ax" d="M12 8V76H154"/>';
const pl=(p,c='ln')=>`<polyline class="${c}" points="${p.map(q=>q.join(',')).join(' ')}"/>`;
const dot=(x,y)=>`<circle class="pt" cx="${x}" cy="${y}" r="3.5"/>`;
const tx=(x,y,t,a='start',c='')=>`<text class="tx ${c}" x="${x}" y="${y}" text-anchor="${a}">${t}</text>`;
const bars=(h,hl=[],x0=22)=>h.map((v,i)=>`<rect class="bar1 ${hl.includes(i)?'hl':''}" x="${x0+i*26}" y="${76-v}" width="18" height="${v}" rx="2"/>`).join('');
const line=(p,m='',extra='')=>svg(AX+extra+pl(p)+m);
const barc=(h,hl,m='')=>svg(AX+bars(h,hl)+m);
const pie=(parts,hl,cx=44,cy=45,r=32)=>{let a=-Math.PI/2;const cols=['#d9d2c5','#c9c0b0','#b9afa0','#e6e0d4'];
  return parts.map((v,i)=>{const b=a+v/100*2*Math.PI,d=`M${cx} ${cy}L${cx+r*Math.cos(a)} ${cy+r*Math.sin(a)}A${r} ${r} 0 ${v>50?1:0} 1 ${cx+r*Math.cos(b)} ${cy+r*Math.sin(b)}Z`;a=b;
  return `<path d="${d}" fill="${i===hl?'var(--accent)':cols[i%4]}" stroke="#fff" stroke-width="1.5"/>`}).join('')};
const bx=(x,y,t,hl,w=30,h=22)=>`<rect class="bx ${hl?'hl':''}" x="${x}" y="${y}" width="${w}" height="${h}" rx="5"/>`+tx(x+w/2,y+h/2+3,t,'middle',hl?'w':'');
const ar=(x1,y1,x2,y2,d)=>`<line class="${d?'arrd':'arr'}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#${d?'ahd':'ah'})"/>`;
const seq=(hl,label)=>{const an=hl===0?'start':hl===3?'end':'middle',ax=hl===0?10:hl===3?154:25+hl*38;let s='';for(let i=0;i<4;i++){s+=bx(10+i*38,34,i+1,i===hl);if(i<3)s+=ar(41+i*38,45,48+i*38,45)}return svg(s+tx(ax,74,label,an,'acc'))};
const shape=([t,x,y,w,h])=>{
  if(t==='h')return `<rect x="${x}" y="${y}" width="9" height="9" rx="1.5" fill="#8f867a"/>`;
  if(t==='s')return `<rect x="${x}" y="${y}" width="${w||9}" height="${h||9}" rx="1.5" fill="var(--accent)"/>`;
  if(t==='p')return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#c3d8bb"/>`;
  if(t==='w')return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#bcd0de"/>`;
  if(t==='r')return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#ddd7cc"/>`;
  if(t==='e')return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="none" stroke="#9a9286" stroke-dasharray="3 2"/>`;
  if(t==='x')return `<rect x="${x}" y="${y}" width="9" height="9" rx="1.5" fill="none" stroke="var(--accent)" stroke-dasharray="2 2"/><path d="M${x+1} ${y+1}L${x+8} ${y+8}M${x+8} ${y+1}L${x+1} ${y+8}" stroke="var(--accent)" stroke-width="1"/>`;
};
const panel=(x,sh)=>`<g transform="translate(${x},18)"><rect width="68" height="54" rx="4" fill="#f1ede4"/>${sh.map(shape).join('')}</g>`;
const mpair=(b,a,cap)=>svg(tx(38,12,'before','middle','mu')+tx(122,12,'after','middle','mu')+panel(4,b)+panel(88,a)+ar(73,45,86,45)+tx(80,86,cap,'middle','acc'));
const R=['r',0,42,68,6];

/* ============ Visuals ============ */
const VIZ={
  up:()=>line([[14,68],[44,64],[74,56],[100,42],[126,24],[148,16]],dot(126,24)+tx(118,16,'rise','end')+dot(148,16)+tx(152,9,'rocket','end'))
      +barc([10,18,26,40,58],[4],tx(140,12,'grow','end')),
  down:()=>line([[14,16],[40,20],[66,28],[92,48],[120,64],[148,70]],dot(92,48)+tx(100,40,'fall sharply')+dot(148,70)+tx(152,62,'plunge','end'))
      +barc([58,42,30,16,6],[4],tx(150,40,'decrease','end')),
  flat:()=>line([[14,66],[40,46],[66,26],[90,22],[120,22],[148,22]],dot(100,22)+tx(104,14,'plateau')+dot(66,26)+tx(60,19,'level off','end')),
  osc:()=>line([[14,44],[32,22],[50,60],[68,24],[86,58],[104,26],[122,56],[148,40]],tx(150,14,'fluctuate','end'),'<line class="ax dash" x1="12" y1="42" x2="154" y2="42"/>'),
  peak:()=>line([[14,50],[40,28],[62,16],[90,44],[112,68],[136,52],[150,42]],dot(62,16)+tx(62,10,'peak','middle')+dot(112,68)+tx(112,86,'lowest point','middle')),
  small:()=>line([[14,44],[60,42],[100,40],[148,37]],tx(148,28,'a slight rise','end')+tx(14,62,'little change','start','mu'),'<line class="ax dash" x1="12" y1="44" x2="154" y2="44"/>'),
  big:()=>line([[14,72],[40,70],[64,64],[88,52],[110,34],[130,18],[148,10]],tx(104,14,'dramatically','end')+tx(150,70,'a sharp rise','end','mu')),
  recover:()=>line([[14,20],[44,34],[70,66],[98,52],[128,36],[150,28]],dot(70,66)+tx(76,74,'recover','start','acc')+tx(150,20,'bounce back','end')),
  advsize:()=>svg(AX+pl([[14,70],[48,64]])+tx(31,58,'slightly','middle','mu')+pl([[56,70],[98,48]])+tx(77,42,'considerably','middle')+pl([[106,70],[148,16]])+tx(127,10,'dramatically','middle','acc')),
  advspeed:()=>svg(AX+pl([[14,72],[84,48]])+tx(14,42,'gradually · steadily','start','mu')+pl([[96,72],[116,16]])+tx(122,32,'sharply','start','acc')+tx(122,44,'rapidly','start','acc')),
  slow:()=>line([[14,66],[44,66],[44,54],[74,54],[74,42],[104,42],[104,30],[134,30],[134,20],[150,20]],tx(20,30,'gradually','start','acc')+tx(20,42,'steadily','start','mu')),
  biggest:()=>svg(pie([62,20,10,8],0)+tx(88,36,'the largest','start','acc')+tx(88,46,'proportion','start','acc')+tx(88,60,'the majority','start')+tx(88,72,'most popular','start','mu')),
  smallest:()=>svg(pie([88,7,5],1)+tx(88,36,'the smallest','start','acc')+tx(88,46,'proportion','start','acc')+tx(88,60,'a small minority','start')+tx(88,72,'least popular','start','mu')),
  about:()=>barc([30,34,28,32,31],[],'<line class="ax dash" x1="12" y1="45" x2="154" y2="45"/>'+tx(152,40,'approximately · around','end','acc')),
  makeup:()=>svg('<rect x="14" y="40" width="79" height="22" rx="4" fill="var(--accent)"/><rect x="93" y="40" width="53" height="22" rx="4" fill="#d9d2c5"/>'+tx(53,54,'60%','middle','w')+tx(120,54,'40%','middle')+tx(53,32,'make up','middle','acc')+tx(80,78,'account for · represent','middle','mu')),
  frac:()=>{let s='';for(let i=0;i<5;i++)s+=`<rect x="${14+i*28}" y="30" width="22" height="22" rx="4" fill="${i===0?'var(--accent)':'#e6e0d4'}"/>`;return svg(s+tx(80,70,'one in five · a fifth','middle','acc'))
      +barc([14,28,42],[2],tx(100,34,'it doubled','start','mu')+tx(100,20,'it tripled','start','acc'))},
  similar:()=>line([[14,56],[44,40],[74,46],[104,24],[148,18]],tx(150,10,'similar · the same','end'),pl([[14,59],[44,43],[74,49],[104,27],[148,21]],'ln2')),
  diff:()=>line([[14,40],[50,36],[84,30],[116,20],[148,12]],tx(150,60,'whereas','end','acc')+tx(14,86,'in contrast','start','mu'),pl([[14,42],[50,46],[84,54],[116,62],[148,70]],'ln2'))
      +barc([56,22],[0],tx(70,36,'higher than','start','acc')),
  rank:()=>line([[14,60],[44,50],[74,40],[104,28],[148,16]],dot(80,38)+tx(84,52,'overtake','start','acc')+tx(150,10,'tea','end','mu'),pl([[14,22],[44,26],[74,38],[104,50],[148,62]],'ln2'))
      +barc([60,46,30,14],[3],tx(130,60,'fall behind','end','acc')),
  pstart:()=>seq(0,'first · to begin with'),
  pnext:()=>seq(1,'then · after that')
      +svg(bx(69,8,1,0,22,16)+bx(104,37,2,1,22,16)+bx(69,66,3,0,22,16)+bx(34,37,4,0,22,16)+ar(90,15,106,35)+ar(108,54,92,68)+ar(68,72,50,55)+ar(40,36,68,18)+tx(80,50,'cycle','middle','mu')),
  ppar:()=>svg(bx(8,34,1,0)+bx(60,10,2,1)+bx(60,58,2,1)+bx(122,34,3,0)+ar(38,40,60,24)+ar(38,50,60,66)+ar(90,24,122,40)+ar(90,66,122,50)+tx(76,49,'meanwhile','middle','acc')+tx(76,88,'at the same time','middle','mu')),
  pfinish:()=>seq(3,'finally · end product'),
  pverb:()=>svg(bx(8,34,'in',0,28)+bx(58,30,'is heated',1,48,30)+bx(124,34,'out',0,28)+ar(36,45,58,45)+ar(106,45,124,45)+tx(47,38,'',' ')+tx(82,76,'is cooled · is mixed','middle','acc')+tx(82,22,'is washed · is cut','middle','acc')),
  pcause:()=>svg(bx(10,30,'A',0,34)+bx(116,30,'B',1,34)+ar(44,41,116,41)+tx(80,32,'so · as a result','middle','acc')+ar(80,45,80,62,1)+bx(60,62,'result',0,40,18)),
  mloc:()=>svg('<rect x="8" y="12" width="44" height="26" rx="4" fill="#c3d8bb"/><rect x="54" y="16" width="16" height="14" rx="2" fill="var(--accent)"/><rect x="4" y="44" width="152" height="8" fill="#ddd7cc"/><rect x="132" y="14" width="18" height="14" rx="2" fill="var(--accent)"/>'
      +[16,36,56,76,96,116].map(x=>`<circle cx="${x}" cy="41" r="2.5" fill="#7da574"/><circle cx="${x}" cy="55" r="2.5" fill="#7da574"/>`).join('')
      +tx(62,10,'next to','middle','acc')+tx(156,10,'on the edge','end','acc')+tx(80,72,'along the road','middle','mu')+tx(150,84,'N ↑','middle','mu')),
  mbuild:()=>mpair([R,['h',6,8],['h',18,8],['e',44,10,12,12]],[R,['h',6,8],['h',18,8],['s',44,10,12,12]],'built · added · opened'),
  mremove:()=>mpair([R,['h',6,8],['h',18,8],['h',44,10]],[R,['h',6,8],['h',18,8],['x',44,10]],'knocked down · removed'),
  mexpand:()=>mpair([R,['h',6,8],['h',18,8],['h',30,8]],[R,['h',6,8],['h',18,8],['h',30,8],['s',42,8],['s',54,8],['s',6,24],['s',18,24],['s',30,24]],'expanded · extended'),
  mconv:()=>mpair([['p',4,6,60,30],R],[['s',8,10],['s',24,10],['s',40,10],['s',8,26],['s',24,26],['s',40,26],R],'replaced by · turned into'),
  msame:()=>mpair([['p',4,4,28,26],['w',38,8,26,20],['h',8,36],['h',22,36],R],[['p',4,4,28,26],['w',38,8,26,20],['h',8,36],['h',22,36],R],'unchanged · stayed the same'),
  marea:()=>svg('<rect x="6" y="8" width="52" height="64" rx="4" fill="#f1ede4"/><rect x="62" y="8" width="44" height="30" rx="4" fill="#f3d9d1"/><rect x="62" y="42" width="92" height="30" rx="4" fill="#c3d8bb"/><rect x="110" y="8" width="44" height="30" rx="4" fill="#bcd0de"/>'
      +[[12,16],[26,16],[40,16],[12,32],[26,32],[40,32],[12,48],[26,48],[40,48]].map(([x,y])=>shape(['h',x,y])).join('')
      +[[68,12],[84,12]].map(([x,y])=>shape(['s',x,y])).join('')
      +tx(32,68,'housing','middle','mu')+tx(84,52,'park / farmland','middle')+tx(132,25,'water','middle','mu')+tx(84,32,'shops','middle','acc')),
  ostrik:()=>barc([20,26,22,62,24],[3],tx(80,12,'stands out','middle','acc')),
  oover:()=>line([[14,60],[44,50],[74,54],[104,34],[148,22]],tx(14,18,'the general trend','start','acc'),'<line class="arrd" x1="16" y1="68" x2="148" y2="26" marker-end="url(#ahd)"/>'),
  ocontrast:()=>line([[14,60],[50,48],[90,34],[148,16]],tx(60,86,'while · however','start','acc'),pl([[14,20],[50,32],[90,48],[148,66]],'ln2'))
};


/* extra illustrations for newer groups */
VIZ.nphr=()=>line([[14,70],[40,66],[66,48],[92,22],[122,14],[148,12]],tx(92,16,'a sharp increase','end','acc')+tx(150,28,'a steady rise','end','mu'),pl([[14,30],[44,34],[74,44],[104,58],[148,72]],'ln2')+tx(150,82,'a dramatic drop','end','mu'));
VIZ.mdir=()=>svg('<rect x="4" y="8" width="152" height="74" rx="4" fill="#f1ede4"/><path d="M4 56C50 40 100 70 156 50" stroke="#bcd0de" stroke-width="8" fill="none"/><rect x="0" y="0" width="0" height="0"/><rect x="74" y="30" width="10" height="46" fill="#ddd7cc"/><rect x="72" y="52" width="14" height="6" fill="var(--accent)"/>'+ar(79,28,79,12)+tx(88,20,'leads to','start','acc')+tx(10,36,'river stretches','start','mu')+tx(90,68,'bridge crosses','start','mu')+tx(10,78,'road runs through','start'));
VIZ.ptab=()=>{const r=(y,a,b,c,hl)=>tx(8,y,a,'start',hl?'acc':'')+tx(78,y,b,'middle')+tx(106,y,c,'middle')+tx(130,y,hl?'':'','start');
  return svg('<rect x="4" y="8" width="152" height="16" rx="4" fill="#f1ede4"/>'+tx(8,19,'','start')+tx(78,19,'A','middle','mu')+tx(106,19,'B','middle','mu')+r(40,'a minority','10%','20%',1)+r(58,'respectively','A, B','','')+tx(80,78,'10% and 20%, respectively','middle','acc'))};
/* larger overview illustration shown at the top of a Task 1 tab */
const HERO={
 "Line & Bar":()=>`<svg viewBox="0 0 320 130"><path class="ax" d="M24 8V112H312"/>
  <polyline points="24,102 80,90 140,66 200,42 260,26 306,18" fill="none" stroke="#4d7c58" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <polyline points="24,30 80,38 140,52 200,80 260,100 306,106" fill="none" stroke="#b3472f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <polyline points="24,66 80,64 140,68 200,63 260,67 306,64" fill="none" stroke="#c9922b" stroke-width="3" stroke-dasharray="6 4" stroke-linecap="round"/>
  ${tx(300,12,'rise · climb · surge','end')}${tx(300,98,'fall · plummet · slump','end')}${tx(300,58,'plateau · level off','end')}${tx(28,124,'time →','start','mu')}</svg>`,
 "Map":()=>mpair([R,['h',6,8],['h',18,8],['p',40,4,24,30],['h',6,24],['h',18,24]],[R,['s',6,8,22,12],['s',6,24,22,12],['s',40,4,24,30],['h',44,36]],'farm → school · houses → flats'),
 "Process":()=>svg(bx(2,30,'pick',0,30)+bx(44,30,'wash',0,30)+bx(86,30,'heat',0,30)+bx(128,30,'pack',1,30)+ar(33,41,43,41)+ar(75,41,85,41)+ar(117,41,127,41)+tx(80,74,'first → then → next → finally','middle','acc')+tx(80,14,'is picked · washed · heated · packed','middle','mu')),
 "Pie, Table & Compare":()=>svg('<rect x="4" y="6" width="152" height="16" rx="4" fill="#f1ede4"/>'+tx(8,17,'category','start','mu')+tx(70,17,'2015','middle','mu')+tx(100,17,'2020','middle','mu')+tx(130,17,'change','start','mu')
  +[['online','35%','68%','▲ rise'],['in-store','65%','32%','▼ fall'],['mobile','10%','45%','▲ surge']].map((r,i)=>tx(8,38+i*18,r[0])+tx(70,38+i*18,r[1],'middle')+tx(100,38+i*18,r[2],'middle')+tx(130,38+i*18,r[3],'start','acc')).join(''))
};
