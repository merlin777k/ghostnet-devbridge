// ─── ENCRYPTED FILE DROP INTRO ───
(function(){
  const CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/\\~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const MESSAGES = [
    '> INTERCEPTING ENCRYPTED PACKET...',
    '> SOURCE: [REDACTED] // PORT: 4444',
    '> CIPHER: AES-512-GHOST',
    '> BRUTE FORCE: INITIATED...',
    '',
    '> [DECRYPTING — PLEASE WAIT]',
    '',
    '  TO: UNKNOWN OPERATIVE',
    '  FROM: THE ARCHITECT',
    '  PRIORITY: CRITICAL',
    '',
    '  You were chosen because you are invisible.',
    '  No records. No history. No face.',
    '',
    '  The Net has been watching you.',
    '  We have been watching you.',
    '',
    '  You think hacking is about code.',
    '  It\'s about power. Information. Control.',
    '',
    '  Climb the ranks. Prove your worth.',
    '  Reach the top — and the truth awaits.',
    '',
    '  // ATTACHMENT: GHOSTNET_ACCESS_KEYS.zip',
    '  // WARNING: This message will self-destruct.',
    '',
    '> DECRYPTION COMPLETE [100%]',
    '> WELCOME TO THE UNDERGROUND.',
  ];
  const STATUS_MSGS = [
    'INITIALIZING CIPHER BREAK...',
    'ANALYZING ENTROPY...',
    'BREAKING KEY SCHEDULE...',
    'RECONSTRUCTING PLAINTEXT...',
    'FINALIZING DECRYPTION...',
  ];

  document.addEventListener('DOMContentLoaded', ()=>{
    const overlay = document.getElementById('intro-overlay');
    if(!overlay) return;

    const dtEl = document.getElementById('decrypt-text');
    const fillEl = document.getElementById('progress-fill');
    const pctEl = document.getElementById('decrypt-pct');
    const statusEl = document.getElementById('decrypt-status');
    const enterBtn = document.getElementById('enter-btn');

    if(!dtEl) return;

    let lineIdx=0, charIdx=0, displayLines=[], statusIdx=0;

    function glitchChar(){ return CHARS[Math.floor(Math.random()*CHARS.length)]; }

    function typeMessage(){
      if(lineIdx >= MESSAGES.length){
        statusEl.textContent='DECRYPTION COMPLETE';
        enterBtn.style.display='inline-block';
        return;
      }

      const pct = Math.floor((lineIdx/MESSAGES.length)*100);
      fillEl.style.width = pct+'%';
      pctEl.textContent = pct+'%';
      const sIdx = Math.floor((pct/100)*STATUS_MSGS.length);
      if(sIdx !== statusIdx && sIdx < STATUS_MSGS.length){
        statusIdx = sIdx;
        statusEl.textContent = STATUS_MSGS[statusIdx];
      }

      const line = MESSAGES[lineIdx];
      if(charIdx < line.length){
        if(charIdx===0) displayLines.push('');
        const revealed = line.substring(0, charIdx);
        const glitched = Array.from({length:Math.min(line.length-charIdx,5)}, ()=>glitchChar()).join('');
        displayLines[displayLines.length-1] = revealed+glitched;
        dtEl.textContent = displayLines.join('\n');
        charIdx++;
        setTimeout(typeMessage, 16+Math.random()*14);
      } else {
        displayLines[displayLines.length-1] = line;
        dtEl.textContent = displayLines.join('\n');
        lineIdx++; charIdx=0;
        setTimeout(typeMessage, line===''?60 : line.startsWith('>')? 100 : 55);
      }
    }

    setTimeout(typeMessage, 500);

    enterBtn && enterBtn.addEventListener('click', ()=>{
      sessionStorage.setItem('intro_seen','1');
      overlay.style.transition='opacity 0.8s';
      overlay.style.opacity='0';
      setTimeout(()=>{
        overlay.style.display='none';
        window.dispatchEvent(new Event('intro-done'));
      }, 800);
    });
  });
})();
