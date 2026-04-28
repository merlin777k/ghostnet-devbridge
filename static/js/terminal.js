// ─── GHOSTNET TERMINAL JS ───
(function(){
  const output = document.getElementById('terminal-output');
  const input  = document.getElementById('cmd-input');
  const toastC = document.getElementById('toast-container');
  let history = [], hIdx = -1;
  let musicOn = false;

  // ─── TOAST ───
  window.toast = function(msg, type=''){
    if(!toastC) return;
    const div = document.createElement('div');
    div.className = 'toast '+(type);
    div.textContent = msg;
    toastC.appendChild(div);
    setTimeout(()=>{ div.style.opacity='0'; div.style.transition='opacity 0.5s'; setTimeout(()=>div.remove(),500); }, 4000);
  };

  // ─── PRINT LINE ───
  function print(text, cls=''){
    if(!output) return;
    text.split('\n').forEach(line=>{
      const div = document.createElement('div');
      div.className = 't-line '+(cls);
      div.textContent = line;
      output.appendChild(div);
    });
    output.scrollTop = output.scrollHeight;
  }

  function printSep(){
    print('─────────────────────────────────────────','dim');
  }

  // ─── COMMANDS ───
  const COMMANDS = {
    help: ()=>{
      printSep();
      print('Available commands:','system');
      print('  hack <target>   — Attack a target', 'system');
      print('  scan            — Scan for targets', 'system');
      print('  status          — Show your stats', 'system');
      print('  botnet          — List your botnet', 'system');
      print('  missions        — Show missions', 'system');
      print('  leaderboard     — Open leaderboard', 'system');
      print('  quantum         — Quantum exploit', 'system');
      print('  clear           — Clear terminal', 'system');
      print('  whoami          — Identity check', 'system');
      printSep();
    },
    clear: ()=>{
      output.innerHTML='';
    },
    whoami: ()=>{
      const user = document.querySelector('.topbar-user');
      if(user) print(user.textContent, 'success');
    },
    status: async ()=>{
      const r = await fetch('/api/status');
      const d = await r.json();
      if(d.xp!==undefined){
        printSep();
        print(`XP:   ${d.xp.toLocaleString()}`, 'success');
        print(`CASH: $${d.cash.toLocaleString()}`, 'warn');
        print(`RANK: ${d.rank_icon} ${d.rank_name}`, 'success');
        printSep();
      }
    },
    scan: ()=>{
      print('> Scanning subnet 10.0.██.0/24...','system');
      setTimeout(()=>{ print('> Found 6 active nodes. Use hack <target>.','success'); },600);
    },
    missions: ()=>{
      document.querySelector('.btab')?.click();
      print('> Mission board opened below.','system');
    },
    leaderboard: ()=>{
      window.open('/leaderboard');
      print('> Opening leaderboard...','system');
    },
    quantum: async ()=>{
      print('> Initiating quantum exploit...','system');
      print('> Loading Grover oracle...','system');
      const r = await fetch('/api/quantum', {method:'POST', headers:{'Content-Type':'application/json'}, body:'{}'});
      const d = await r.json();
      if(d.ok){
        print(d.msg,'success');
        updateHUD(d);
      } else {
        print(d.msg,'error');
      }
    },
    botnet: ()=>{
      print('> Botnet status:','system');
      document.querySelectorAll('.bot-row').forEach(row=>{
        const name = row.querySelector('.bot-name')?.textContent;
        const count = row.querySelector('[id^=bot-count]')?.textContent;
        print(`  ${name}: ${count}`, 'success');
      });
    },
    vip: ()=>{ window.location.href='/vip'; },
  };

  // ─── HACK COMMAND ───
  async function doHack(target){
    print(`> Connecting to ${target}...`,'system');
    print('> Bypassing firewall...','system');
    setTimeout(async()=>{
      print('> Injecting payload...','system');
      setTimeout(async()=>{
        const r = await fetch('/api/hack', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({target})
        });
        const d = await r.json();
        if(d.ok){
          print(d.msg, d.success?'success':'warn');
          updateHUD(d);
          toast(d.msg, d.success?'success':'');
        } else {
          print('> ERROR: '+d.msg,'error');
        }
      }, 400+Math.random()*600);
    }, 300+Math.random()*400);
  }

  // ─── UPDATE HUD ───
  function updateHUD(d){
    if(d.xp !== undefined){
      const xpEl = document.getElementById('hud-xp');
      const cashEl = document.getElementById('hud-cash');
      const rankEl = document.getElementById('hud-rank');
      const rankIco = document.getElementById('hud-rank-icon');
      if(xpEl) xpEl.textContent = d.xp.toLocaleString();
      if(cashEl) cashEl.textContent = d.cash.toLocaleString();
      if(rankEl && d.rank_name) rankEl.textContent = d.rank_name;
      if(rankIco && d.rank_icon) rankIco.textContent = d.rank_icon;
    }
  }

  // ─── INPUT HANDLER ───
  if(input){
    input.addEventListener('keydown', async (e)=>{
      if(e.key==='ArrowUp'){
        hIdx = Math.min(hIdx+1, history.length-1);
        input.value = history[history.length-1-hIdx] || '';
      } else if(e.key==='ArrowDown'){
        hIdx = Math.max(hIdx-1, -1);
        input.value = hIdx<0?'' : history[history.length-1-hIdx];
      }
      if(e.key!=='Enter') return;
      const raw = input.value.trim();
      if(!raw) return;
      history.push(raw); hIdx=-1;
      input.value='';
      const promptEl = document.querySelector('.prompt');
      print((promptEl?promptEl.textContent:'> ')+' '+raw,'dim');

      const parts = raw.split(' ');
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1).join(' ');

      if(cmd==='hack'){
        if(!args){ print('Usage: hack <target>','error'); return; }
        doHack(args);
      } else if(COMMANDS[cmd]){
        await COMMANDS[cmd](args);
      } else {
        print(`Command not found: ${cmd}. Type 'help'.`,'error');
      }
    });
    input.focus();
  }

  // ─── WORLD MAP TARGETS ───
  window.hackTarget = function(name, reqRank){
    const rankIdx = parseInt(document.getElementById('hud-rank')?.dataset?.rankIdx || '0');
    if(input){ input.value='hack '+name; input.focus(); }
    doHack(name);
  };

  // ─── BUY BOTNET ───
  window.buyBot = async function(node, cost){
    const r = await fetch('/api/botnet/buy', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({node})
    });
    const d = await r.json();
    if(d.ok){
      toast(d.msg, 'success');
      print('> '+d.msg,'success');
      // update count
      const countEl = document.getElementById('bot-count-'+node);
      if(countEl && d.botnets) countEl.textContent = '×'+(d.botnets[node]||0);
      updateHUD({xp:undefined, cash:d.cash});
      const cashEl = document.getElementById('hud-cash');
      if(cashEl) cashEl.textContent = d.cash.toLocaleString();
    } else {
      toast(d.msg,'error');
      print('> ERROR: '+d.msg,'error');
    }
  };

  // ─── RUN MISSION ───
  window.runMission = async function(id, reqRank){
    const r = await fetch('/api/mission', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({id})
    });
    const d = await r.json();
    if(d.ok){
      toast(d.msg,'success');
      print(d.msg,'success');
      updateHUD(d);
    } else {
      toast(d.msg,'error');
      print('> '+d.msg,'error');
    }
  };

  // ─── QUANTUM ───
  window.runQuantum = async function(){
    const resEl = document.getElementById('quantum-result');
    if(resEl) resEl.textContent='⚛️ Initializing quantum circuit...';
    const r = await fetch('/api/quantum', {method:'POST', headers:{'Content-Type':'application/json'}, body:'{}'});
    const d = await r.json();
    if(resEl) resEl.textContent = d.msg;
    if(d.ok){
      resEl.style.color='var(--green)';
      updateHUD(d);
      toast(d.msg,'success');
    } else {
      resEl.style.color='var(--magenta)';
    }
  };

  // ─── TABS ───
  window.showTab = function(name){
    document.querySelectorAll('.tab-content').forEach(el=>el.classList.add('hidden'));
    document.querySelectorAll('.btab').forEach(el=>el.classList.remove('active'));
    const el = document.getElementById('tab-'+name);
    if(el) el.classList.remove('hidden');
    const btabs = document.querySelectorAll('.btab');
    const names = ['missions','achievements','ranks','quantum'];
    const idx = names.indexOf(name);
    if(btabs[idx]) btabs[idx].classList.add('active');
  };

  // ─── MUSIC ───
  window.toggleMusic = function(){
    const audio = document.getElementById('bg-music');
    const btn = document.getElementById('music-toggle');
    if(!audio) return;
    if(musicOn){ audio.pause(); musicOn=false; if(btn)btn.textContent='♪ OFF'; }
    else { audio.play().catch(()=>{}); musicOn=true; if(btn)btn.textContent='♪ ON'; }
  };
  // Autoplay attempt
  document.addEventListener('DOMContentLoaded', ()=>{
    const audio = document.getElementById('bg-music');
    if(audio){ audio.play().then(()=>{ musicOn=true; }).catch(()=>{}); }
  });

})();
