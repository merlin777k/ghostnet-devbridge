// ─── CITY SKYLINE + RAIN + PARTICLES ───
(function(){
  const signs = ['NEOTEK','GHOST//','DARKNET','CIPHER','UPLINK','NEXUS','VOID_SYS','HACK_X','SHDW_BR','PHANTOM'];
  const signColors = ['cyan','magenta','yellow'];

  function buildCity(){
    const backEl = document.getElementById('buildings-back');
    const frontEl = document.getElementById('buildings-front');
    if(!backEl || !frontEl) return;
    const vw = window.innerWidth;

    // Back layer
    let x = 0;
    while(x < vw + 80){
      const w = 20 + Math.random()*60;
      const h = 80 + Math.random()*220;
      const div = document.createElement('div');
      div.className = 'bld';
      div.style.cssText = `width:${w}px;height:${h}px;`;
      if(Math.random()>0.5){
        const ant = document.createElement('div');
        ant.className = 'antenna';
        div.appendChild(ant);
      }
      if(Math.random()>0.65){
        const sign = document.createElement('div');
        sign.className = 'neon-sign '+signColors[Math.floor(Math.random()*signColors.length)];
        sign.textContent = signs[Math.floor(Math.random()*signs.length)];
        sign.style.cssText = `bottom:${20+Math.random()*50}%;left:${5+Math.random()*20}%;`;
        div.appendChild(sign);
      }
      backEl.appendChild(div);
      x += w + 2;
    }

    // Front layer
    x = 0;
    while(x < vw + 100){
      const w = 30 + Math.random()*90;
      const h = 50 + Math.random()*160;
      const div = document.createElement('div');
      div.className = 'bld bld-front';
      div.style.cssText = `width:${w}px;height:${h}px;`;
      if(Math.random()>0.6){
        const ant = document.createElement('div');
        ant.className = 'antenna';
        div.appendChild(ant);
      }
      frontEl.appendChild(div);
      x += w + 3;
    }
  }

  // Rain
  let canvas, ctx, drops = [];
  function initRain(){
    canvas = document.getElementById('rain');
    if(!canvas) return;
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drops = Array.from({length:100}, ()=>({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      speed: 4+Math.random()*8,
      len: 10+Math.random()*25,
      alpha: 0.08+Math.random()*0.25
    }));
  }
  function drawRain(){
    if(!ctx) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drops.forEach(d=>{
      ctx.beginPath();
      ctx.strokeStyle = `rgba(0,245,255,${d.alpha})`;
      ctx.lineWidth = 0.5;
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x-1, d.y+d.len);
      ctx.stroke();
      d.y += d.speed;
      if(d.y > canvas.height){ d.y=-d.len; d.x=Math.random()*canvas.width; }
    });
    requestAnimationFrame(drawRain);
  }

  // Particles
  function buildParticles(){
    const pEl = document.getElementById('particles');
    if(!pEl) return;
    for(let i=0;i<25;i++){
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = `
        left:${Math.random()*100}%;
        bottom:${Math.random()*20}%;
        animation-duration:${6+Math.random()*14}s;
        animation-delay:${Math.random()*10}s;
        background:${Math.random()>0.5?'var(--cyan)':'var(--magenta)'};
      `;
      pEl.appendChild(p);
    }
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    buildCity();
    initRain();
    drawRain();
    buildParticles();
    window.addEventListener('resize', ()=>{
      if(canvas){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
    });
  });
})();
