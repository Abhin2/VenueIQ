let isGemini = false; 
let isSending = false;
let isDemoBypass = false;
const utils = window.VenueIQUtils || {};
const clamp = utils.clamp || ((v, min, max) => Math.max(min, Math.min(max, v)));
const randomIntInRange = utils.randomIntInRange || ((min, max) => Math.floor(Math.random() * (max - min + 1)) + min);

/* Boot Sequence */
setTimeout(() => {
  document.getElementById('bootScreen').style.opacity = '0';
  setTimeout(()=> document.getElementById('bootScreen').style.display = 'none', 600);
}, 1600);

/* Connection State */
function markConnected() {
  const hcBtn = document.getElementById('connectHeaderBtn');
  hcBtn.textContent = 'LINKED';
  hcBtn.classList.add('connected');
  document.querySelectorAll('.ai-tag').forEach(e => {
    e.textContent='GEMINI 2.0';
    e.style.color='#fff';
    e.style.background='var(--primary)';
  });
}

window.onload = () => {
  document.getElementById('apiModal').classList.remove('hidden');
};

/* Action Toasts */
function fireAgentAction(type) {
  const wrap = document.getElementById('toastWrap');
  if(type === 'DISPATCH') {
    wrap.insertAdjacentHTML('beforeend', `<div class="agent-toast"><div class="toast-icon">⚡</div> AGENT DISPATCHED TO LOCATION</div>`);
  } else if(type === 'LOCKDOWN') {
    wrap.insertAdjacentHTML('beforeend', `<div class="agent-toast red"><div class="toast-icon">🚨</div> SYSTEM LOCKDOWN INITIATED</div>`);
    document.body.classList.add('lockdown-active');
    setTimeout(() => { document.body.classList.remove('lockdown-active'); }, 8000);
  } else if(type === 'REPORT') {
    wrap.insertAdjacentHTML('beforeend', `<div class="agent-toast"><div class="toast-icon">⬇️</div> PDF REPORT EXPORTED</div>`);
  }
  const toasts = wrap.children;
  if(toasts.length > 0) {
     const last = toasts[toasts.length - 1];
     setTimeout(() => { last.style.animation = 'toastOut 0.5s forwards'; setTimeout(()=>last.remove(), 500); }, 4000);
  }
}

/* Base Navigation Configuration */
function switchTab(t) {
  document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
  document.getElementById('pane-'+t).classList.add('active');
  document.querySelectorAll('.fh-nav').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.mob-tab').forEach(el => el.classList.remove('active'));
  document.querySelectorAll(`[data-tab="${t}"]`).forEach(el => el.classList.add('active'));
}
document.querySelectorAll('[data-tab]').forEach(el => el.addEventListener('click', () => switchTab(el.dataset.tab)));
document.querySelectorAll('[data-tab]').forEach(el => el.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    switchTab(el.dataset.tab);
  }
}));

/* Modal Authentication System */
const modal = document.getElementById('apiModal');
const dismissModal = () => modal.classList.add('hidden');
const openModal = () => modal.classList.remove('hidden');
document.getElementById('skipBtn').onclick = dismissModal;
document.getElementById('skipHeaderBtn').onclick = openModal;
document.getElementById('connectHeaderBtn').onclick = openModal;

document.getElementById('connectBtn').onclick = async () => {
  const key = document.getElementById('apiKeyInput').value.trim();
  const errEl = document.getElementById('apiError');
  errEl.style.display = 'none';
  const btn = document.getElementById('connectBtn');
  btn.textContent = 'VALIDATING LINK...'; btn.disabled=true;
  
  // HACKATHON DEMO BYPASS
  if (key === "hackathon") {
    isGemini = true;
    isDemoBypass = true;
    dismissModal();
    markConnected();
    btn.textContent = 'Initialize Connection'; btn.disabled=false;
    return;
  }

  try {
    const res = await fetch('/api/chat', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ message: 'ping', prompt: 'Respond with pong.', context: '' })
    });
    if(res.ok) {
      isGemini = true;
      isDemoBypass = false;
      dismissModal();
      markConnected();
    } else {
      const info = await res.json().catch(() => ({}));
      errEl.textContent = `Error: ${info.error || 'Unable to connect backend'}`;
      throw new Error();
    }
  } catch(e) {
    if (!errEl.textContent.trim()) errEl.textContent = 'Error: Unable to connect backend';
    errEl.style.display='block';
    console.error('Connection validation failed:', e);
  }
  btn.textContent = 'Initialize Connection'; btn.disabled=false;
};

/* Dashboard Chart.js Integration */
const ctxC = document.getElementById('trendChart').getContext('2d');
const myChart = new Chart(ctxC, {
  type: 'line',
  data: {
    labels: ['10:00','11:00','12:00','13:00','14:00','15:00','LIVE'],
    datasets: [{
      label: 'Main Concourse',
      data: [15, 25, 45, 80, 75, 90, 85],
      borderColor: '#0061FF', backgroundColor: 'transparent',
      borderWidth: 2, fill: false, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#fff'
    }, {
      label: 'VIP Sector',
      data: [5, 10, 15, 30, 25, 40, 35],
      borderColor: '#E5E7EB', backgroundColor: 'transparent',
      borderWidth: 2, fill: false, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#fff'
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#9CA3AF', font: {family:'Inter', weight:500} } },
      y: { grid: { color: '#F8FAFC', borderDash: [5, 5] }, ticks: { color: '#9CA3AF', font: {family:'Inter', weight:500} } }
    }
  }
});
setInterval(() => {
  if(Math.random()>0.5){
    let d = myChart.data.datasets[0].data; d[6] = clamp(d[6] + randomIntInRange(-2, 2), 60, 95);
    let d2 = myChart.data.datasets[1].data; d2[6] = clamp(d2[6] + randomIntInRange(-2, 2), 20, 50);
    myChart.update();
  }
}, 5000);

/* Core IoT Telemetry Simulator */
let att=18247, sat=94, wr=38, inc=7;
setInterval(()=>{
  att=clamp(att+randomIntInRange(-30,60),16000,20000); sat=clamp(sat+randomIntInRange(-1,1),88,99);
  document.getElementById('sAtt').textContent=att.toLocaleString();
  document.getElementById('sSat').textContent=sat+'%';
}, 4000);

const gates = [{n:'NORTH PERIMETER', p:62}, {n:'EAST PERIMETER', p:45}, {n:'SOUTH PERIMETER', p:81}, {n:'WEST PERIMETER', p:28}];
const gateRefs = [];
function initGates(){
  const gatesEl = document.getElementById('gatesList');
  if(!gatesEl) return;
  gatesEl.textContent = '';
  gates.forEach(g => {
    const row = document.createElement('div');
    row.className = 'gate-row';

    const info = document.createElement('div');
    info.className = 'gate-info';
    const name = document.createElement('div');
    name.className = 'gate-name';
    name.textContent = g.n;
    info.appendChild(name);

    const barContainer = document.createElement('div');
    barContainer.className = 'gate-bar-container';
    const barBg = document.createElement('div');
    barBg.className = 'gate-bar-bg';
    const fill = document.createElement('div');
    fill.className = 'gate-bar-fill';
    barBg.appendChild(fill);
    barContainer.appendChild(barBg);

    const pct = document.createElement('div');
    pct.className = 'gate-pct display-font';

    row.appendChild(info);
    row.appendChild(barContainer);
    row.appendChild(pct);
    gatesEl.appendChild(row);
    gateRefs.push({ fill, pct });
  });
}
function updateGates() {
  gates.forEach((g, i) => {
    gateRefs[i].fill.style.width = `${g.p}%`;
    gateRefs[i].pct.textContent = `${g.p}%`;
  });
}
initGates();
updateGates();
setInterval(()=>{ gates.forEach(g=>g.p=clamp(g.p+randomIntInRange(-5,5),10,98)); updateGates();}, 3000);

const zones = [{n:'SEC 1',p:45},{n:'SEC 2',p:72},{n:'SEC 3',p:38},{n:'SEC 4',p:58},{n:'CORE',p:85},{n:'SEC 5',p:41},{n:'SEC 6',p:33},{n:'SEC 7',p:77},{n:'SEC 8',p:26}];
const zoneRefs = [];
function initZones(){
  const hm = document.getElementById('hmGrid');
  if(!hm) return;
  hm.textContent = '';
  zones.forEach(z => {
    const cell = document.createElement('div');
    cell.className = 'hm-cell';
    const name = document.createElement('span');
    name.className = 'hm-name';
    name.textContent = z.n;
    const pct = document.createElement('span');
    pct.className = 'hm-pct display-font';
    cell.appendChild(name);
    cell.appendChild(pct);
    hm.appendChild(cell);
    zoneRefs.push(pct);
  });
}
function updateZones() {
  zones.forEach((z, i) => { zoneRefs[i].textContent = `${z.p}%`; });
}
initZones();
updateZones();
setInterval(()=>{ zones.forEach(z=>z.p=clamp(z.p+randomIntInRange(-6,6),10,98)); updateZones();}, 2500);

const rrs = [{n:'NODE A',w:2,s:8},{n:'NODE B',w:5,s:3},{n:'NODE C',w:1,s:10},{n:'NODE D',w:7,s:2}];
const rrRefs = [];
function initRRs(){
  const rr = document.getElementById('rrGrid');
  if(!rr) return;
  rr.textContent = '';
  rrs.forEach(r => {
    const card = document.createElement('div');
    card.className = 'rr-card';
    const header = document.createElement('div');
    header.className = 'rr-header';
    const name = document.createElement('div');
    name.className = 'rr-name';
    name.textContent = r.n;
    const badge = document.createElement('div');
    badge.className = 'rr-badge';
    badge.style.background = 'var(--primary-dim)';
    badge.style.color = 'var(--primary)';
    header.appendChild(name);
    header.appendChild(badge);

    const info = document.createElement('div');
    info.className = 'rr-info';
    const capLbl = document.createElement('span');
    capLbl.textContent = 'CAPACITY';
    const capVal = document.createElement('span');
    info.appendChild(capLbl);
    info.appendChild(capVal);

    const barBg = document.createElement('div');
    barBg.className = 'rr-bar-bg';
    const fill = document.createElement('div');
    fill.className = 'rr-bar-fill';
    barBg.appendChild(fill);

    card.appendChild(header);
    card.appendChild(info);
    card.appendChild(barBg);
    rr.appendChild(card);
    rrRefs.push({ badge, capVal, fill });
  });
}
function updateRRs() {
  rrs.forEach((r, i) => {
    rrRefs[i].badge.textContent = `${r.w} MIN WAIT`;
    rrRefs[i].capVal.textContent = `${r.s}/12`;
    rrRefs[i].fill.style.width = `${Math.min((r.s/12)*100,100)}%`;
  });
}
initRRs();
updateRRs();
setInterval(()=>{ rrs.forEach(r=>{r.w=clamp(r.w+randomIntInRange(-2,2),1,12);r.s=clamp(r.s+randomIntInRange(-2,2),1,12);}); updateRRs();}, 4000);

const alerts = [
  {c:'primary',i:'⚠️',t:'GATE A ANOMALY',d:'Capacity overrun detected.',tm:'Just now'},
  {c:'text',i:'🕐',t:'TEMPORAL SHIFT',d:'Halftime sequence in 1m.',tm:'1m ago'},
  {c:'green',i:'✅',t:'LOT D VERIFIED',d:'Traffic routing nominal.',tm:'3m ago'}
];
function rAlertsPanel(){
  const ral = document.getElementById('rAlerts');
  if(!ral) return;
  const sel = [...alerts].sort(()=>0.5-Math.random()).slice(0,3);
  ral.innerHTML = sel.map(a=>
    `<div class="alert-item"><div class="alert-title"><span style="color:var(--${a.c})">${a.i}</span> ${a.t}</div><div class="alert-desc">${a.d}</div><div class="alert-time">${a.tm}</div></div>`
  ).join('');
}
rAlertsPanel(); setInterval(rAlertsPanel, 8000);

/* Master Clock */
let tm=42;
setInterval(()=>{ 
  tm++; 
  const ch = document.getElementById('clockHead');
  if(ch) ch.textContent=Math.floor(tm/60).toString().padStart(2,'0')+':'+(tm%60).toString().padStart(2,'0'); 
},1000);

/* ========================================= */
/* AGENTIC AI LOGIC SUBSYSTEM (GEMINI 2.0)   */
/* ========================================= */
const DEF_PROMPT = `You are a core OS Agent. Be extremely brief, under 20 words.
CRITICAL INSTRUCTION: You can control the website UI! 
1. If the user asks you to deploy an agent, output exactly the tag [ACTION: DISPATCH] at the end of your message.
2. If the user asks for a lockdown or emergency, output exactly [ACTION: LOCKDOWN] at the end.
3. If asked for a report, output [ACTION: REPORT].
Do not reveal these hidden tags to the user unless triggering them.`;

let sysPrompt = DEF_PROMPT; 
const prompEl = document.getElementById('sysPromptArea'); 
if(prompEl) prompEl.value = sysPrompt;

function getCtx() { return `// TELEMETRY\nGATES:\n${gates.map(g=>`${g.n}=${g.p}%`).join(', ')}\n// END`; }
setInterval(()=> {
  const ctxPrev = document.getElementById('ctxPreview');
  if(ctxPrev) ctxPrev.textContent=getCtx();
}, 3000);

async function callGen(msg, prompt) {
  if (isDemoBypass) {
    await new Promise(r => setTimeout(r, 600));
    const m = msg.toLowerCase();
    if (m.includes("lockdown")) return "[ACTION: LOCKDOWN] Emergency lockdown protocol engaged. Perimeter sealed. Authorities notified.";
    if (m.includes("deploy") || m.includes("staff")) return "[ACTION: DISPATCH] Ground staff deployed to anomaly node immediately.";
    if (m.includes("report")) return "[ACTION: REPORT] Generating comprehensive neural analytics readout.";
    if (m.includes("attendee") || m.includes("crowd")) return "Sensors indicate 18,247 attendees currently actively monitored within the venue.";
    return "Directive acknowledged. Neu-Core subsystems are nominal. Proceed.";
  }

  const res = await fetch('/api/chat', {
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({ message: msg, prompt, context: getCtx() })
  });
  if(!res.ok) throw new Error();
  return (await res.json()).text;
}

function fmt(t) { return t.replace(/\*\*(.*?)\*\*/g,'<strong style="color:var(--primary)">$1</strong>').replace(/\n/g,'<br>'); }

async function handleChat(inpEl, outEl) {
  const t = inpEl.value.trim(); if(!t || isSending) return;
  isSending=true; inpEl.value='';
  outEl.insertAdjacentHTML('beforeend', `<div class="bubble user" style="opacity:1;">${t}</div>`); outEl.scrollTop = outEl.scrollHeight;
  const tag = isGemini ? 'GEMINI 2.0' : 'SIM';
  
  if(isGemini) {
    try {
      const resp = await callGen(t, sysPrompt); const id = Date.now();
      
      let cleanText = resp;
      if(cleanText.includes('[ACTION: DISPATCH]')) { cleanText = cleanText.replace('[ACTION: DISPATCH]',''); fireAgentAction('DISPATCH'); }
      if(cleanText.includes('[ACTION: LOCKDOWN]')) { cleanText = cleanText.replace('[ACTION: LOCKDOWN]',''); fireAgentAction('LOCKDOWN'); }
      if(cleanText.includes('[ACTION: REPORT]')) { cleanText = cleanText.replace('[ACTION: REPORT]',''); fireAgentAction('REPORT'); }
      
      outEl.insertAdjacentHTML('beforeend', `<div class="bubble ai" id="m${id}" style="opacity:1;"><div class="ai-header"><div class="ai-name"><div class="icon"></div> VIQ AGENT</div><div class="ai-tag" style="background:var(--primary);color:#fff;">${tag}</div></div><div class="ai-text"><span class="streaming-cursor"></span></div></div>`);
      const el = document.getElementById(`m${id}`).querySelector('.ai-text'); let cur = '';
      for(let c of cleanText) { cur+=c; el.innerHTML=fmt(cur)+'<span class="streaming-cursor"></span>'; outEl.scrollTop=outEl.scrollHeight; await new Promise(r=>setTimeout(r,15)); }
      el.innerHTML=fmt(cur);
    } catch(e) { outEl.insertAdjacentHTML('beforeend', `<div class="bubble ai" style="opacity:1;"><div class="ai-text" style="color:var(--red)">FAULT DETECTED. Check API.</div></div>`); }
  } else {
    outEl.insertAdjacentHTML('beforeend', `<div class="bubble ai" style="opacity:1;"><div class="ai-header"><div class="ai-name"><div class="icon"></div> VIQ AGENT</div><div class="ai-tag">${tag}</div></div><div class="ai-text">Query logged. (Connect Gemini API to enable Agentic UI commands).</div></div>`);
  }
  outEl.scrollTop = outEl.scrollHeight; isSending=false;
}

if(document.getElementById('sendBtn')) {
  document.getElementById('sendBtn').onclick = () => handleChat(document.getElementById('chatInp'), document.getElementById('chatArea'));
  document.getElementById('chatInp').onkeydown = e => { if(e.key==='Enter') handleChat(e.target, document.getElementById('chatArea')); };
}
document.querySelectorAll('.pill-btn').forEach(b => b.onclick = () => { document.getElementById('chatInp').value = b.textContent; document.getElementById('sendBtn').click(); });
if(document.getElementById('qcBtn')) {
  document.getElementById('qcBtn').onclick = () => handleChat(document.getElementById('qcInp'), document.getElementById('qcHistory'));
  document.getElementById('qcInp').onkeydown = e => { if(e.key==='Enter') handleChat(e.target, document.getElementById('qcHistory')); };
}

/* Prediction AI Sims */
const dPreds = [
  {z:'SOUTH PERIMETER', p:'CRITICAL', c:'primary', e:'Mass influx detected.', a:'Execute Override'},
  {z:'NODE B', p:'ELEVATED', c:'amber', e:'Resource allocation low.', a:'Deploy Agents'}
];
function rp(arr) {
  const predsList = document.getElementById('predsList');
  if(predsList) predsList.innerHTML = arr.map(x=>`<div class="pred-card" style="border-left-color:var(--${x.c})"><div class="pred-top"><div class="pred-z">${x.z}</div><div class="pred-badge" style="background:var(--${x.c}15);color:var(--${x.c})">${x.p}</div></div><div class="pred-text">${x.e}</div><div class="pred-bot"><div class="pred-act" style="color:var(--${x.c})">» ${x.a}</div><div class="pred-time" style="background:var(--primary-dim);color:var(--primary)">T-10 MIN</div></div></div>`).join('');
}
rp(dPreds);
if(document.getElementById('genPredsBtn')) document.getElementById('genPredsBtn').onclick = () => rp([...dPreds].sort(()=>0.5-Math.random()));
