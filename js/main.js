/* ============ CONFIG / DATA ============ */
const FEST_DATE = new Date('2026-12-16T09:00:00+05:30'); // Techfest 2026: 16–18 Dec
const EVENTS = [
  {c:'robotics', t:'International Robotics Challenge', d:'Autonomous bots battle across arenas built for precision and speed.', tag:'IRC'},
  {c:'robotics', t:'Exoskeleton Arena', d:'Wearable robotics trials: strength, balance and adaptive control.', tag:'BIO'},
  {c:'management', t:'Technomanagement Summit', d:'Strategy cases where deep-tech meets business scale.', tag:'TM'},
  {c:'lectures', t:'Keynote Lectures', d:'Pioneers in AI, space and neurotech take the main stage.', tag:'KEY'},
  {c:'competitions', t:'Hack the Core', d:'36-hour build sprint on human-augmentation challenges.', tag:'HACK'},
  {c:'competitions', t:'Neural Net Showdown', d:'Train, tune and deploy models against live leaderboards.', tag:'ML'},
  {c:'workshops', t:'Embedded Systems Lab', d:'Hands-on microcontroller and sensor-fusion workshop.', tag:'LAB'},
  {c:'workshops', t:'Generative AI Studio', d:'Build and ship a multimodal app in one session.', tag:'GEN'}
];
const STEPS = [
  ['Registrations Open','Create your profile and pick your modules.'],
  ['Competition Deadlines','Submit abstracts and team rosters.'],
  ['Online Qualifiers','Rounds that decide who reaches campus.'],
  ['Techfest Day 1','Opening ceremony, keynotes, robotics arena.'],
  ['Techfest Day 2','Workshops, finals and exhibitions.'],
  ['Techfest Day 3','Grand finale, awards and closing.']
];
const PARTS = [
  ['Optic Cortex','High-resolution vision stack with thermal overlay.',97],
  ['Neural Lace','Low-latency interface between thought and actuator.',88],
  ['Servo Spine','Adaptive load-bearing frame with 24 joints.',92],
  ['Power Core','Compact fusion-style cell with 14-day autonomy.',79]
];
const SPONSORS = ['AWS (AMAZON WEB SERVICES)','MOTWANI JADEJA INDIA PAVILION','MARSH MCLENNAN','IDFC FIRST BANK','POKÉMON GO','UNESCO','UNICEF','CENTRE FOR ENVIRONMENT EDUCATION (CEE)','SOUTH ASIA YOUTH ENVIRONMENT NETWORK (SAYEN)'];
const $ = (s,p=document)=>p.querySelector(s);

/* ============ MODE TOGGLE ============ */
$('#modeBtn').addEventListener('click',e=>{
  const root=document.documentElement, st=root.dataset.mode==='stealth';
  root.dataset.mode = st ? 'augmented' : 'stealth';
  $('#modeLabel').textContent = st ? 'AUGMENTED' : 'STEALTH';
  e.currentTarget.setAttribute('aria-pressed', String(!st));
});

/* ============ COUNTDOWN ============ */
const cd=$('#countdown');
cd.innerHTML=['DAYS','HRS','MIN','SEC'].map((l,i)=>`<div class="glass text-center py-3"><div class="font-head text-2xl sm:text-3xl text-white" id="cd${i}">00</div><div class="font-mono text-[10px] text-[#9AA5B1]">${l}</div></div>`).join('');
function tick(){
  let s=Math.max(0,Math.floor((FEST_DATE-Date.now())/1000));
  const v=[Math.floor(s/86400),Math.floor(s%86400/3600),Math.floor(s%3600/60),s%60];
  v.forEach((n,i)=>$('#cd'+i).textContent=String(n).padStart(2,'0'));
}
tick(); setInterval(tick,1000);

/* ============ EVENTS: render + filter + tilt ============ */
const grid=$('#grid');
function renderEvents(f='all'){
  grid.innerHTML=EVENTS.filter(e=>f==='all'||e.c===f).map(e=>`
    <article class="card glass p-6 reveal in" tabindex="0">
      <span class="font-mono text-[11px] px-2 py-1 border border-[var(--line)] glow-text">${e.tag}</span>
      <h3 class="font-head font-bold text-lg text-white mt-4">${e.t}</h3>
      <p class="mt-2 text-sm text-[#B8C2CC] leading-relaxed">${e.d}</p>
      <p class="font-mono text-[11px] mt-5" style="color:var(--alert)">&gt; INITIALISE ▸</p>
    </article>`).join('');
  grid.querySelectorAll('.card').forEach(c=>{
    c.addEventListener('pointermove',ev=>{
      if(ev.pointerType==='touch')return;
      const r=c.getBoundingClientRect(), x=(ev.clientX-r.left)/r.width-.5, y=(ev.clientY-r.top)/r.height-.5;
      c.style.transform=`rotateY(${x*10}deg) rotateX(${-y*10}deg) translateZ(6px)`;
      beep(520+x*200,.02);   // subtle sound cue
    });
    c.addEventListener('pointerleave',()=>c.style.transform='');
  });
}
$('#filters').addEventListener('click',e=>{
  const b=e.target.closest('button'); if(!b)return;
  document.querySelectorAll('#filters button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  renderEvents(b.dataset.f);
});
renderEvents();

/* Tiny WebAudio blip (starts only after a user gesture, rate limited) */
let ac,last=0;
function beep(f,v){
  const n=performance.now(); if(n-last<140||!ac)return; last=n;
  const o=ac.createOscillator(),g=ac.createGain(); o.frequency.value=f; o.type='square'; g.gain.value=v;
  o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime+.05);
}
addEventListener('pointerdown',()=>{ try{ac=ac||new AudioContext()}catch(e){} },{once:true});

/* ============ TIMELINE ============ */
$('#tl').insertAdjacentHTML('beforeend',STEPS.map((s,i)=>`
  <li class="relative mb-10 reveal">
    <span class="node absolute -left-[39px] top-1 w-[13px] h-[13px] rounded-full" style="background:${i>2?'var(--alert)':'var(--accent)'}"></span>
    <p class="font-mono text-xs glow-text">NODE_0${i+1}</p>
    <h3 class="font-head text-lg text-white">${s[0]}</h3>
    <p class="text-sm text-[#B8C2CC] mt-1">${s[1]}</p>
  </li>`).join(''));

/* ============ DIAGNOSTICS ============ */
$('#parts').innerHTML=PARTS.map((p,i)=>`<button role="tab" class="text-left font-mono text-sm border border-[var(--line)] px-4 py-3 text-white hover:border-cy" data-i="${i}">0${i+1} // ${p[0].toUpperCase()}</button>`).join('');
function showPart(i){
  const p=PARTS[i]; $('#pName').textContent=p[0]; $('#pDesc').textContent=p[1]; $('#pVal').textContent=p[2];
  $('#pBar').style.width=p[2]+'%';
  document.querySelectorAll('#parts button').forEach((b,j)=>b.setAttribute('aria-selected',String(j===i)));
}
$('#parts').addEventListener('click',e=>{const b=e.target.closest('button'); if(b)showPart(+b.dataset.i)});
showPart(0);

/* ============ SPONSORS ============ */
$('#sp').innerHTML=SPONSORS.map(n=>`<div class="sp glass min-h-24 px-3 py-4 flex items-center justify-center text-center leading-snug font-head text-xs tracking-widest text-[#9AA5B1] reveal">${n}</div>`).join('');

/* ============ SCROLL REVEAL + COUNT-UP ============ */
const io=new IntersectionObserver(es=>es.forEach(en=>{
  if(!en.isIntersecting)return; en.target.classList.add('in');
  en.target.querySelectorAll?.('[data-count]').forEach(el=>{
    const end=+el.dataset.count; let t0;
    const step=t=>{t0??=t; const k=Math.min(1,(t-t0)/1400); el.textContent=Math.floor(end*k).toLocaleString('en-IN')+(k===1?'+':''); if(k<1)requestAnimationFrame(step)};
    requestAnimationFrame(step);
  });
  io.unobserve(en.target);
}),{threshold:.15});
document.querySelectorAll('.reveal:not(.in)').forEach(el=>io.observe(el));

/* ============ PARTICLES (canvas, mouse-reactive) ============ */
const cv=$('#particles'),cx=cv.getContext('2d'); let W,H,P=[],mouse={x:-999,y:-999};
function size(){W=cv.width=innerWidth;H=cv.height=innerHeight;P=Array.from({length:Math.min(90,Math.floor(W*H/16000))},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4}))}
addEventListener('resize',size); size();
function loop(){
  cx.clearRect(0,0,W,H);
  const col=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  cx.fillStyle=col; cx.strokeStyle=col;
  for(const a of P){
    a.x+=a.vx; a.y+=a.vy; if(a.x<0||a.x>W)a.vx*=-1; if(a.y<0||a.y>H)a.vy*=-1;
    const dx=a.x-mouse.x,dy=a.y-mouse.y,d=Math.hypot(dx,dy); if(d<120){a.x+=dx/d*1.5;a.y+=dy/d*1.5}
    cx.globalAlpha=.7; cx.fillRect(a.x,a.y,2,2);
  }
  for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){
    const d=Math.hypot(P[i].x-P[j].x,P[i].y-P[j].y);
    if(d<110){cx.globalAlpha=(1-d/110)*.25;cx.beginPath();cx.moveTo(P[i].x,P[i].y);cx.lineTo(P[j].x,P[j].y);cx.stroke()}
  }
  requestAnimationFrame(loop);
}
if(!matchMedia('(prefers-reduced-motion:reduce)').matches)loop();

/* ============ RETICLE + EYE TRACKING ============ */
const ret=$('#reticle'),pupil=$('#pupil');
addEventListener('pointermove',e=>{
  mouse.x=e.clientX; mouse.y=e.clientY;
  ret.style.transform=`translate(${e.clientX}px,${e.clientY}px)`;
  ret.classList.toggle('hot',!!e.target.closest('a,button,.card'));
  const r=$('#eyeWrap').getBoundingClientRect(), dx=e.clientX-(r.left+r.width/2), dy=e.clientY-(r.top+r.height/2), m=Math.hypot(dx,dy)||1, k=Math.min(m,300)/300*22;
  pupil.setAttribute('transform',`translate(${dx/m*k} ${dy/m*k})`);
});

/* ============ FOOTER TELEMETRY ============ */
$('#yr').textContent=new Date().getFullYear();
const t0=Date.now();
setInterval(()=>{
  const s=Math.floor((Date.now()-t0)/1000),f=n=>String(n).padStart(2,'0');
  $('#up').textContent=`${f(Math.floor(s/3600))}:${f(Math.floor(s%3600/60))}:${f(s%60)}`;
  $('#cpu').textContent=(20+Math.random()*40|0); $('#net').textContent=(8+Math.random()*30|0);
},1000);
