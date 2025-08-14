/* Index-only interactions for NETANIX */
(function(){
  const ready = (fn) => (document.readyState !== 'loading') ? fn() : document.addEventListener('DOMContentLoaded', fn);

  // Mode handling is centralized in assets/main.js (pro/hacker). No early toggles here.

  ready(()=>{
    // Footer year
    const yearEl = document.getElementById('year');
    if(yearEl){ yearEl.textContent = new Date().getFullYear(); }

    // Copy email & vCard
    const emailAddr = 'netanix96@gmail.com';
    const copyBtn = document.getElementById('copyEmail');
    const vcfBtn = document.getElementById('downloadVcf');
    if(copyBtn){
      copyBtn.addEventListener('click', async ()=>{
        try{ await navigator.clipboard.writeText(emailAddr); alert('Email copied to clipboard'); }
        catch(e){ alert('Copy failed'); }
      });
    }
    if(vcfBtn){
      const vcf = `BEGIN:VCARD\nVERSION:3.0\nFN:Shishir Ghimire (NETANIX)\nEMAIL:${emailAddr}\nURL:https://github.com/shishirghimir\nEND:VCARD`;
      const blob = new Blob([vcf], {type:'text/vcard'});
      vcfBtn.href = URL.createObjectURL(blob);
    }

    // Smooth scrolling for in-page anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if(target){ e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
      });
    });

    // Mode toggle: defer to main.js (dispatch 'm' key)
    const toggleBtn = document.getElementById('modeToggle');
    if(toggleBtn){
      toggleBtn.addEventListener('click', ()=>{
        const ev = new KeyboardEvent('keydown', {key:'m'});
        document.dispatchEvent(ev);
      });
    }

    // Scanner bar animation (top sweeping line)
    const scanner = document.getElementById('scanner');
    if(scanner && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      function animateScanner(){
        const scanHeight = document.body.scrollHeight - window.innerHeight + 20;
        let position = -10;
        function moveScanner(){
          position += 4;
          scanner.style.top = position + 'px';
          if(position < scanHeight){
            requestAnimationFrame(moveScanner);
          } else {
            setTimeout(()=>{ scanner.style.top = '-10px'; animateScanner(); }, 3000);
          }
        }
        moveScanner();
      }
      animateScanner();
    }

    // Matrix code rain on #matrixCanvas (homepage)
    const canvas = document.getElementById('matrixCanvas');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Only run if it's truly a canvas; otherwise main.js handles matrix globally
    if(canvas && canvas instanceof HTMLCanvasElement && !reduced){
      const ctx = canvas.getContext('2d');
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*';
      const charArray = chars.split('');
      let fontSize = 14, columns = 0, drops = [];

      function resize(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
      }

      function init(){
        fontSize = window.innerWidth < 768 ? 10 : 14;
        columns = Math.floor(canvas.width / fontSize);
        drops = new Array(columns).fill(0).map(()=> Math.floor(Math.random() * canvas.height / fontSize));
      }

      function draw(){
        ctx.fillStyle = 'rgba(0,0,0,0.05)';
        ctx.fillRect(0,0,canvas.width, canvas.height);
        ctx.fillStyle = '#00FF00';
        ctx.font = `${fontSize}px monospace`;
        for(let i=0;i<drops.length;i++){
          const ch = charArray[Math.floor(Math.random()*charArray.length)];
          ctx.fillText(ch, i*fontSize, drops[i]*fontSize);
          if(drops[i]*fontSize > canvas.height && Math.random() > 0.975){ drops[i] = 0; }
          drops[i]++;
        }
      }

      window.addEventListener('resize', resize);
      resize();
      const frameRate = window.innerWidth < 768 ? 66 : 33; // ~15fps on mobile, ~30fps on desktop
      setInterval(draw, frameRate);
    }

    // Random card highlight (subtle)
    function highlightRandomCard(){
      const cards = document.querySelectorAll('#projects .card');
      if(!cards.length) return;
      cards.forEach(c=> c.classList.remove('border-terminal-green','shadow-lg'));
      const random = cards[Math.floor(Math.random()*cards.length)];
      random.classList.add('border-terminal-green','shadow-lg');
      setTimeout(()=> random.classList.remove('border-terminal-green','shadow-lg'), 2000);
    }
    setTimeout(()=>{ setInterval(highlightRandomCard, 3000); }, 8000);
  });
})();
