/* NETANIX pro interactions */
(function(){
  // Safe DOM ready
  const ready = (fn) => (document.readyState !== 'loading') ? fn() : document.addEventListener('DOMContentLoaded', fn);

  ready(() => {
    // ============================
    // Global Theme + Terminal UX
    // ============================
    const MODE_KEY = 'netanix-mode'; // values: 'hacker' | 'pro'
    const body = document.body;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Hoisted to avoid TDZ in ensureMatrixCanvas/applyMode
    var matrixTimer = null;

    // Apply mode classes (only 'pro' and 'hacker')
    function applyMode(mode){
      const isPro = mode === 'pro';
      // Only maintain two explicit classes to avoid style conflicts
      body.classList.toggle('pro', isPro);
      body.classList.toggle('hacker', !isPro);
      body.setAttribute('data-mode', isPro ? 'pro' : 'hacker');
      try { localStorage.setItem(MODE_KEY, mode); } catch(e){}
      // Visual effects only in hacker mode
      ensureMatrixCanvas(!isPro);
      ensureGlobe(!isPro);
      // Update toggle aria state
      const tb = document.getElementById('modeToggle');
      if(tb){ tb.setAttribute('aria-pressed', (!isPro).toString()); }
    }

    // Wireframe hacking globe (only in hacker mode)
    let globeTimer = null;
    let globeResizeHandler = null;
    let globeResizeObserver = null;
    function ensureGlobe(enable){
      const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
      const onHome = (path === '' || path === 'index.html');
      let globe = document.getElementById('hackingGlobe');
      if(!(enable && onHome)){
        // disable/remove if not enabled or not on homepage
        if(globe){ globe.remove(); }
        if(globeTimer){ cancelAnimationFrame(globeTimer); globeTimer=null; }
        if(globeResizeHandler){ window.removeEventListener('resize', globeResizeHandler); globeResizeHandler=null; }
        if(globeResizeObserver){ globeResizeObserver.disconnect(); globeResizeObserver=null; }
        return;
      }
      // Only attach if the target container exists
      const container = document.getElementById('nmapPreview');
      if(!container){
        if(globe){ globe.remove(); }
        if(globeTimer){ cancelAnimationFrame(globeTimer); globeTimer=null; }
        if(globeResizeHandler){ window.removeEventListener('resize', globeResizeHandler); globeResizeHandler=null; }
        if(globeResizeObserver){ globeResizeObserver.disconnect(); globeResizeObserver=null; }
        return;
      }
      if(globe){ return; }
      globe = document.createElement('canvas');
      globe.id = 'hackingGlobe';
      // initial size; will be updated by layoutGlobe()
      globe.width = 140; globe.height = 140;
      const common = 'z-index:4;opacity:0.75;pointer-events:none;filter:drop-shadow(0 0 6px rgba(55,255,107,.6))';
      const cs = getComputedStyle(container);
      if(cs.position === 'static'){ container.style.position = 'relative'; }
      globe.style.cssText = `position:absolute;${common}`;
      container.appendChild(globe);
      layoutGlobe(globe, container);
      globeResizeHandler = () => layoutGlobe(globe, container);
      window.addEventListener('resize', globeResizeHandler);
      if('ResizeObserver' in window){
        globeResizeObserver = new ResizeObserver(() => layoutGlobe(globe, container));
        globeResizeObserver.observe(container);
      }
      if(!prefersReduced){ startGlobe(globe); }
    }

    function layoutGlobe(globe, container){
      // Responsive size & position inside its container
      const vw = window.innerWidth || 1024;
      const isMobile = vw < 640; // tailwind 'sm'
      const rect = container.getBoundingClientRect();
      const cw = container.clientWidth || rect.width || 800;
      const ch = container.clientHeight || rect.height || 260;
      const base = isMobile ? 0.28 : 0.18; // bigger on mobile for visibility
      let size = Math.floor(cw * base);
      const minS = isMobile ? 72 : 110;
      const maxS = isMobile ? 140 : 180;
      size = Math.max(minS, Math.min(maxS, size));
      globe.width = size; globe.height = size;
      const pad = isMobile ? 8 : 12;
      // Position bottom-right, clamped within container
      const left = Math.max(pad, cw - size - pad);
      const top = Math.max(pad, ch - size - pad);
      globe.style.left = left + 'px';
      globe.style.top = top + 'px';
      globe.style.right = '';
    }

    function startGlobe(canvas){
      const ctx = canvas.getContext('2d');
      let t = 0;
      function draw(){
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0,0,w,h);
        const cx = w/2, cy = h/2, r = Math.min(w,h)/2 - 6;
        // Outer circle
        ctx.strokeStyle = '#37ff6b';
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.stroke();
        // Longitudes (rotating)
        for(let i=0;i<12;i++){
          const a = (i/12)*Math.PI*2 + t*0.02;
          const sx = Math.cos(a), sy = Math.sin(a);
          ctx.beginPath();
          for(let j=-90;j<=90;j+=6){
            const lat = j * Math.PI/180;
            const x = r * Math.cos(lat) * sx;
            const y = r * Math.sin(lat);
            const px = cx + x;
            const py = cy + y*0.55; // squash for perspective
            if(j===-90) ctx.moveTo(px,py); else ctx.lineTo(px,py);
          }
          ctx.stroke();
        }
        // Latitudes
        for(let k=-60;k<=60;k+=30){
          const lat = k * Math.PI/180;
          const rr = r * Math.cos(lat);
          const yy = cy + (r * Math.sin(lat))*0.55;
          ctx.beginPath();
          for(let a=0;a<=Math.PI*2+0.01;a+=Math.PI/60){
            const px = cx + rr * Math.cos(a + t*0.02);
            const py = yy + (rr * Math.sin(a + t*0.02))*0.15;
            if(a===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
          }
          ctx.stroke();
        }
        t += 1;
        globeTimer = requestAnimationFrame(draw);
      }
      draw();
    }

    // =============== Mini Neta and Prank Modal ==================
    const PRANK_KEY = 'neta-prank-shown'; // no longer used for gating; kept for compatibility

    function initPrankModal(){
      const modal = document.createElement('div');
      modal.className = 'neta-modal';
      modal.innerHTML = `
        <div class="box">
          <div class="title">[ MINI NETA ] Initializing Recon...</div>
          <pre id="netaPrankLog">> Booting AI core...\n> Calibrating threat matrix...\n> Scanning surface ports...\n</pre>
          <div class="row">
            <button id="netaPrankCancel">Abort</button>
            <button id="netaPrankOk">Proceed</button>
          </div>
        </div>`;
      document.body.appendChild(modal);
      setTimeout(()=> modal.classList.add('open'), 600);
      const log = modal.querySelector('#netaPrankLog');
      const lines = [
        '> Enumerating services... OK',
        '> Finding CVEs... OK',
        '> Exfiltrating cookies... [DENIED]',
        '> Negotiating with firewall... [TIMEOUT]',
        '> Deploying mini assistant... OK',
        '',
        'Just kidding. Welcome to the portfolio! :)'
      ];
      let i=0; const t = setInterval(()=>{
        if(i>=lines.length){ clearInterval(t); return; }
        log.textContent += (lines[i++] + "\n");
        log.scrollTop = log.scrollHeight;
      }, 500);
      const finish = ()=>{
        modal.classList.remove('open');
        setTimeout(()=> modal.remove(), 250);
        // Auto-open Mini Neta with greeting
        setTimeout(()=>{ if(window.miniNetaOpen){ window.miniNetaOpen(true); } }, 350);
      };
      modal.querySelector('#netaPrankOk').addEventListener('click', finish);
      modal.querySelector('#netaPrankCancel').addEventListener('click', finish);
    }

    function initMiniNeta(){
      if(document.getElementById('miniNetaBtn')) return;
      const btn = document.createElement('button');
      btn.className = 'mini-neta';
      btn.setAttribute('aria-label','Open Mini Neta chat');
      btn.setAttribute('title','Open Mini Neta');
      btn.setAttribute('tabindex','0');
      btn.innerHTML = `
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="#37ff6b" stroke-width="1.5" fill="rgba(55,255,107,.08)"/>
          <path d="M8.5 9.5h1.5M14 9.5h1.5" stroke="#caffd8" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M8 14c1.2 1.2 2.7 1.8 4 1.8S14.8 15.2 16 14" stroke="#37ff6b" stroke-width="1.5" stroke-linecap="round"/>
        </svg>`;
      const panel = document.createElement('div');
      panel.id = 'miniNetaPanel';
      panel.className = 'neta-panel';
      panel.innerHTML = `
        <div class="neta-head">
          <div>Mini Neta</div>
          <button class="neta-close" aria-label="Close">×</button>
        </div>
        <div class="neta-body" id="netaBody"></div>
        <div class="neta-actions">
          <button data-act="help">help</button>
          <button data-act="projects">projects</button>
          <button data-act="writeups">writeups</button>
          <button data-act="skills">skills</button>
          <button data-act="experience">experience</button>
          <button data-act="mode">toggle mode</button>
          <button data-act="prank">prank</button>
          <button data-act="github">github</button>
          <button data-act="linkedin">linkedin</button>
          <button data-act="resume">resume</button>
          <button data-act="contact">contact</button>
        </div>
        <div class="neta-input">
          <input id="netaInput" autocomplete="off" spellcheck="false" placeholder="type a command..." aria-label="Type a message">
          <button id="netaSend" aria-label="Send message">Send</button>
        </div>`;
      document.body.appendChild(btn);
      document.body.appendChild(panel);

      const bodyEl = panel.querySelector('#netaBody');
      const inputEl = panel.querySelector('#netaInput');
      const sendBtn = panel.querySelector('#netaSend');
      const closeBtn = panel.querySelector('.neta-close');

      function open(){ panel.classList.add('open'); inputEl.focus(); }
      function close(){ panel.classList.remove('open'); }
      btn.addEventListener('click', ()=> panel.classList.toggle('open'));
      closeBtn.addEventListener('click', close);

      function pushMsg(text, role){
        const d = document.createElement('div');
        d.className = 'neta-msg' + (role ? ` ${role}` : '');
        d.textContent = text;
        bodyEl.appendChild(d);
        bodyEl.scrollTop = bodyEl.scrollHeight;
      }
      function typing(on){
        let tip = panel.querySelector('.neta-typing');
        if(on){
          if(!tip){ tip = document.createElement('div'); tip.className = 'neta-msg neta-typing'; tip.textContent = 'typing…'; bodyEl.appendChild(tip); }
        } else if(tip){ tip.remove(); }
        bodyEl.scrollTop = bodyEl.scrollHeight;
      }
      function greet(){
        if(bodyEl.childElementCount>0) return;
        pushMsg('Hi, I\'m Mini Neta. Try: help, projects, writeups, skills, experience, mode, prank', 'bot');
      }
      function handle(cmd){
        const c = (cmd||'').trim().toLowerCase();
        if(!c) return;
        pushMsg('> ' + c, 'user');
        // Basic intents & synonyms
        const intent = (()=>{
          if(['help','?','commands'].includes(c)) return 'help';
          if(['project','projects','work','portfolio'].includes(c)) return 'projects';
          if(['writeup','writeups','blog','notes'].includes(c)) return 'writeups';
          if(['skill','skills','stack'].includes(c)) return 'skills';
          if(['experience','experiences','xp','resume'].includes(c)) return 'experiences';
          if(['mode','theme','toggle mode','switch mode'].includes(c)) return 'mode';
          if(['prank','fun','joke'].includes(c)) return 'prank';
          if(c.startsWith('goto ')) return 'goto';
          if(c.startsWith('avatar')) return 'avatar';
          if(c.startsWith('github')) return 'github';
          if(c.startsWith('linkedin')) return 'linkedin';
          if(c.startsWith('resume')) return 'resume';
          if(c.startsWith('contact')) return 'contact';
          return 'unknown';
        })();
        if(intent==='help'){
          typing(true); setTimeout(()=>{ typing(false); pushMsg('Available: help, projects, writeups, skills, experience, mode, prank, goto <section>. Try "projects".', 'bot'); }, 400); return; }
        if(['projects','writeups','skills','experiences'].includes(intent)){
          const page = intent + '.html'; typing(true); setTimeout(()=>{ typing(false); pushMsg('Opening ' + page + ' …', 'bot'); window.location.href = page; }, 300); return; }
        if(intent==='mode'){
          const ev = new KeyboardEvent('keydown', {key:'m'}); document.dispatchEvent(ev);
          typing(true); setTimeout(()=>{ typing(false); pushMsg('Toggled theme.', 'bot'); }, 250); return;
        }
        if(intent==='prank'){ window.netaShowPrank && window.netaShowPrank(); return; }
        if(intent==='github'){
          typing(true); setTimeout(()=>{ typing(false); pushMsg('Opening GitHub…', 'bot'); window.open('https://github.com/shishirghimir','_blank'); }, 200); return;
        }
        if(intent==='linkedin'){
          typing(true); setTimeout(()=>{ typing(false); pushMsg('Opening LinkedIn…', 'bot'); window.open('https://www.linkedin.com/in/shishir-ghimire-2b7934292/','_blank'); }, 200); return;
        }
        if(intent==='resume'){
          const resumeEl = document.getElementById('resume');
          if(resumeEl){ typing(true); setTimeout(()=>{ typing(false); pushMsg('Jumping to resume section…', 'bot'); resumeEl.scrollIntoView({behavior:'smooth'}); }, 200); }
          else { typing(true); setTimeout(()=>{ typing(false); pushMsg('You can find my experience on LinkedIn as well. Opening LinkedIn…', 'bot'); window.open('https://www.linkedin.com/in/shishir-ghimire-2b7934292/','_blank'); }, 200); }
          return;
        }
        if(intent==='contact'){
          const el = document.getElementById('contact');
          if(el){ typing(true); setTimeout(()=>{ typing(false); pushMsg('Taking you to contact…', 'bot'); el.scrollIntoView({behavior:'smooth'}); }, 200); }
          else { typing(true); setTimeout(()=>{ typing(false); pushMsg('Reach me via the footer contact links.', 'bot'); }, 200); }
          return;
        }
        if(intent==='goto'){
          const id = c.slice(5).trim();
          if(id){
            const el = document.getElementById(id);
            if(el){ el.scrollIntoView({behavior:'smooth'}); }
          }
          return;
        }
        if(intent==='avatar'){
          pushMsg('My avatar is a stylized representation of my digital presence.', 'bot');
          return;
        }
        // Smart Q&A with keyword includes and randomized replies
        const rand = (arr)=> arr[Math.floor(Math.random()*arr.length)];
        const qa = [
          { keywords:['hi','hello','hey'], replies:[
            'Hello! How can I help you today?',
            'Hi there! How are you doing?',
            'Hey! What’s up?'
          ]},
          { keywords:['good morning'], replies:['Good morning! Hope you have a great day.'] },
          { keywords:['good night'], replies:['Good night! Sleep well.'] },

          { keywords:['how are you'], replies:[
            'I’m doing great! Thanks for asking. How about you?',
            'All systems nominal. How are you?'
          ]},
          { keywords:['what is your name','your name'], replies:['I’m Mini Neta, your friendly on-page assistant.'] },
          { keywords:['nice to meet you'], replies:['Nice to meet you too!'] },
          { keywords:['what are you doing'], replies:['Just chatting with you!'] },
          { keywords:['where are you from'], replies:['I live in the digital world. 🌐'] },

          { keywords:['can you help me','help'], replies:['Of course! Tell me what you need help with.'] },
          { keywords:['what can you do'], replies:['I can chat, answer basic questions, and help you navigate this site.'] },
          { keywords:['bye','goodbye','see you'], replies:['Goodbye! Have a great day!'] },
          { keywords:['thank you','thanks','ty'], replies:['You’re welcome! 😊'] },
          { keywords:['ok','okay','k'], replies:['Got it!'] },

          { keywords:['joke','funny'], replies:[
            'Why don’t skeletons fight each other? They don’t have the guts!',
            'I told a computer a joke, but it didn’t get it — no sense of humor.exe'
          ]},
          { keywords:['time','what is the time','current time'], replies:[ ()=>`It’s ${new Date().toLocaleTimeString()} on your device.` ] },
          { keywords:['who made you','who created you'], replies:['I was created by the site owner and improved with code magic.'] }
        ];
        const qaHit = qa.find(item => item.keywords.some(k => c.includes(k)));
        if(qaHit){
          const rep = rand(qaHit.replies);
          const msg = (typeof rep === 'function') ? rep() : rep;
          typing(true); setTimeout(()=>{ typing(false); pushMsg(msg, 'bot'); }, 250);
          return;
        }
        // Small knowledge base
        const kb = [
          {k:['neta','netanix','who are you'], v:'I am Mini Neta, your on-page cyber assistant.'},
          {k:['portfolio','about'], v:'This site showcases pentesting, DFIR, network security, CTF, and secure full‑stack projects.'},
          {k:['contact','email','reach'], v:'Use the Contact section in the header/footer. I can also guide you: type goto contact.'}
        ];
        const hit = kb.find(x => x.k.some(w => c.includes(w)));
        if(hit){ typing(true); setTimeout(()=>{ typing(false); pushMsg(hit.v, 'bot'); }, 350); return; }
        pushMsg('Unknown command. Type "help".', 'bot');
      }
      function send(){ handle(inputEl.value); inputEl.value=''; }
      sendBtn.addEventListener('click', send);
      inputEl.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ send(); }});
      panel.querySelectorAll('[data-act]').forEach(b=> b.addEventListener('click', ()=> handle(b.dataset.act)));

      // expose manual triggers
      window.netaShowPrank = function(){ initPrankModal(); };
      window.miniNetaOpen = function(withGreet){ panel.classList.add('open'); if(withGreet){ greet(); } inputEl.focus(); };
      window.netaCloseMiniNeta = function(){ panel.classList.remove('open'); };
      // Always keep button present; no session gating
    }

    // Ensure initial mode from storage (default to Professional on first visit)
    (()=>{
      let saved = 'pro';
      try { saved = localStorage.getItem(MODE_KEY) || 'pro'; } catch(e){}
      applyMode(saved);
      try {
        // Only show prank modal on homepage
        const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
        if(path === '' || path === 'index.html'){
          initPrankModal();
        }
        // Mini Neta should be everywhere
        initMiniNeta();
      } catch(err){ console.warn('MiniNeta init failed', err); }
    })();

    // Optional: button toggle if present
    const toggleBtn = document.getElementById('modeToggle');
    if(toggleBtn && !toggleBtn.dataset.bound){
      toggleBtn.dataset.bound = '1';
      toggleBtn.addEventListener('click', ()=>{
        const next = body.classList.contains('hacker') ? 'pro' : 'hacker';
        applyMode(next);
      });
      toggleBtn.setAttribute('aria-label','Toggle color mode');
      toggleBtn.setAttribute('aria-pressed', body.classList.contains('hacker') ? 'true' : 'false');
      toggleBtn.setAttribute('tabindex','0');
      toggleBtn.addEventListener('keydown', (e)=>{
        if(e.key==='Enter' || e.key===' '){ e.preventDefault(); toggleBtn.click(); }
      });
    }

    // Keyboard shortcuts
    //   m -> toggle mode
    //   ` -> toggle terminal overlay
    document.addEventListener('keydown', (e)=>{
      if (e.key === 'm' || e.key === 'M'){
        const next = body.classList.contains('hacker') ? 'pro' : 'hacker';
        applyMode(next);
      }
      if (e.key === '`'){
        e.preventDefault();
        toggleTerminal();
      }
      if (e.key === 'Escape'){
        // Try closing prank modal and Mini Neta chat if available
        if(window.netaHidePrank) try{ window.netaHidePrank(); }catch(_){ }
        if(window.netaCloseMiniNeta) try{ window.netaCloseMiniNeta(); }catch(_){ }
        const modal = document.querySelector('.neta-modal.open');
        if(modal){ modal.classList.remove('open'); }
        const panel = document.querySelector('.neta-panel.open');
        if(panel){ panel.classList.remove('open'); }
      }
    });

    // Matrix canvas across pages (only for hacker mode)
    function ensureMatrixCanvas(enable){
      const existing = document.getElementById('matrixCanvas');
      if(enable){
        if(existing){ return; }
        const cv = document.createElement('canvas');
        cv.id = 'matrixCanvas';
        cv.className = 'fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-20';
        document.body.prepend(cv);
        if(!prefersReduced){ startMatrix(cv); }
        ensureGlobe(true);
      } else {
        if(existing){ existing.remove(); }
        if(matrixTimer){ clearInterval(matrixTimer); matrixTimer=null; }
        ensureGlobe(false);
      }
    }

    function startMatrix(canvas){
      const ctx = canvas.getContext('2d');
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*';
      const charArray = chars.split('');
      let fontSize = 14, columns = 0, drops = [];
      function resize(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
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
      const frameRate = window.innerWidth < 768 ? 66 : 33;
      matrixTimer = setInterval(draw, frameRate);
    }

    // Terminal overlay
    let termEl = null;
    function buildTerminal(){
      if(termEl) return termEl;
      const wrap = document.createElement('div');
      wrap.id = 'terminalOverlay';
      wrap.style.cssText = 'position:fixed;inset:0;z-index:60;background:rgba(0,0,0,0.92);display:none;';
      wrap.innerHTML = `
        <div class="terminal-container" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(1000px,92vw);max-height:80vh;overflow:auto;">
          <div class="terminal-header">
            <div class="terminal-buttons">
              <div class="terminal-button close" data-x></div>
              <div class="terminal-button minimize"></div>
              <div class="terminal-button maximize"></div>
            </div>
            <div class="terminal-title">NETANIX@portfolio:~/interactive$</div>
          </div>
          <div class="scan-line"></div>
          <div style="padding:14px;font-family:monospace;font-size:14px;line-height:1.5;">
            <pre id="termOut" style="white-space:pre-wrap;margin:0;">Welcome to NETANIX interactive terminal. Type 'help' to begin.\n</pre>
            <div style="display:flex;gap:8px;align-items:center;margin-top:10px;">
              <span class="text-terminal-green">guest@netanix:~$</span>
              <input id="termIn" autocomplete="off" spellcheck="false" style="flex:1;background:#001100;border:1px solid #003300;color:#33ff33;padding:6px 8px;border-radius:4px;outline:none;" />
            </div>
          </div>
        </div>`;
      document.body.appendChild(wrap);
      const closer = wrap.querySelector('[data-x]');
      closer.addEventListener('click', hideTerminal);
      wrap.addEventListener('click', (e)=>{ if(e.target===wrap) hideTerminal(); });
      const input = wrap.querySelector('#termIn');
      const out = wrap.querySelector('#termOut');
      const cmds = {
        help(){ return "Commands: help, whoami, mode, projects, writeups, skills, experience, clear"; },
        whoami(){ return "User: guest\nRole: curious\nSystem: NETANIX"; },
        mode(){ return `Current mode: ${body.classList.contains('normal') ? 'pro' : 'hacker'}\nToggle with 'm' key.`; },
        projects(){ window.location.href='projects.html'; return "Opening projects..."; },
        writeups(){ window.location.href='writeups.html'; return "Opening writeups..."; },
        skills(){ window.location.href='skills.html'; return "Opening skills..."; },
        experience(){ window.location.href='experiences.html'; return "Opening experience..."; },
        clear(){ out.textContent=''; return ''; }
      };
      input.addEventListener('keydown', (e)=>{
        if(e.key==='Enter'){
          const v = input.value.trim(); input.value='';
          if(!v) return;
          out.textContent += `guest@netanix:~$ ${v}\n`;
          const [cmd] = v.split(/\s+/);
          let res = cmds[cmd] ? cmds[cmd]() : `Command not found: ${cmd}`;
          if(res){ out.textContent += res + '\n'; }
          wrap.querySelector('#termOut').scrollTop = 1e9;
        }
      });
      termEl = wrap;
      return wrap;
    }

    function showTerminal(){
      const el = buildTerminal();
      el.style.display = 'block';
      const input = el.querySelector('#termIn');
      setTimeout(()=> input && input.focus(), 0);
    }
    function hideTerminal(){ if(termEl){ termEl.style.display='none'; } }
    function toggleTerminal(){ if(!termEl || termEl.style.display==='none'){ showTerminal(); } else { hideTerminal(); } }
    // GSAP plugin registration
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }
    // Smooth scroll via Lenis if available
    if(window.Lenis){
      const lenis = new Lenis({
        duration: 1.1,
        smoothWheel: true,
        smoothTouch: false
      });
      function raf(time){ lenis.raf(time); requestAnimationFrame(raf) }
      requestAnimationFrame(raf);
    }

    // Custom cursor
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if(dot && ring){
      let x = innerWidth/2, y = innerHeight/2, tx = x, ty = y;
      window.addEventListener('mousemove', (e)=>{ tx = e.clientX; ty = e.clientY; dot.style.transform = `translate(${tx-3}px,${ty-3}px)`; });
      function loop(){ x += (tx - x) * 0.15; y += (ty - y) * 0.15; ring.style.transform = `translate(${x-18}px,${y-18}px)`; requestAnimationFrame(loop) }
      loop();
      // Hover scale
      document.querySelectorAll('a, button, .card, .hover-card, .tag').forEach(el=>{
        el.addEventListener('mouseenter', ()=>{ ring.style.opacity = 1; ring.style.transform += ' scale(1.2)' });
        el.addEventListener('mouseleave', ()=>{ ring.style.opacity = .6; ring.style.transform = ring.style.transform.replace(' scale(1.2)','') });
      });
    }

    // GSAP reveal animations
    const animateIn = (els, opts={}) => {
      if(!window.gsap) return;
      gsap.utils.toArray(els).forEach((el)=>{
        el.classList.add('reveal');
        gsap.fromTo(el, {autoAlpha:0, y:16}, {autoAlpha:1, y:0, duration:.8, ease:'power2.out', scrollTrigger:{trigger:el, start:'top 85%'}});
      });
    };
    if(window.gsap && !gsap.core.globals().ScrollTrigger){
      // Load ScrollTrigger if absent (optional lightweight import via CDN not inline here)
    }
    animateIn('.section');
    animateIn('.card');
    animateIn('.section-title');

    // Subtle grid canvas
    const grid = document.getElementById('gridBg');
    if(grid && grid instanceof HTMLCanvasElement){
      const ctx = grid.getContext('2d');
      const DPR = Math.min(2, window.devicePixelRatio || 1);
      const resize = ()=>{ grid.width = innerWidth*DPR; grid.height = innerHeight*DPR; grid.style.width = innerWidth+'px'; grid.style.height = innerHeight+'px'; draw() };
      const draw = ()=>{
        ctx.clearRect(0,0,grid.width, grid.height);
        ctx.lineWidth = 1*DPR; ctx.strokeStyle = 'rgba(55,255,107,.22)';
        const gap = 40*DPR; let off = (Date.now()/40)%gap;
        for(let x=-gap; x<grid.width+gap; x+=gap){ ctx.beginPath(); ctx.moveTo(x+off,0); ctx.lineTo(x+off,grid.height); ctx.stroke(); }
        for(let y=-gap; y<grid.height+gap; y+=gap){ ctx.beginPath(); ctx.moveTo(0,y+off); ctx.lineTo(grid.width,y+off); ctx.stroke(); }
        requestAnimationFrame(draw);
      };
      window.addEventListener('resize', resize);
      resize();
    }

    // Respect prefers-reduced-motion
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      const scan = document.querySelector('.scanline');
      if(scan) scan.style.animation = 'none';
    }

    // Mobile menu toggle
    const menuBtn = document.getElementById('menuBtn');
    const siteNav = document.getElementById('siteNav');
    if(menuBtn && siteNav){
      const closeNav = ()=>{ siteNav.classList.remove('open'); };
      const toggleNav = ()=>{ siteNav.classList.toggle('open'); };
      menuBtn.addEventListener('click', toggleNav);
      siteNav.querySelectorAll('a').forEach(a=> a.addEventListener('click', closeNav));
      window.addEventListener('resize', ()=>{ if(window.innerWidth>840) closeNav(); });
      document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeNav(); });
    }

    // Typed effect (no external lib) for #typed element
    const typedEl = document.getElementById('typed');
    if(typedEl){
      const lines = (typedEl.dataset.words || 'Pentesting|DFIR|Networks|Firewall Systems|Secure Apps').split('|');
      let i = 0, j = 0, deleting = false;
      const tick = () => {
        const word = lines[i % lines.length];
        j += deleting ? -1 : 1;
        typedEl.textContent = word.slice(0, j);
        if(!deleting && j === word.length){ deleting = true; setTimeout(tick, 900); return; }
        if(deleting && j === 0){ deleting = false; i++; }
        setTimeout(tick, deleting ? 40 : 90);
      };
      tick();
    }

    // Section-scoped filter bar using data-tags when available (fallback to text)
    const filterBar = document.getElementById('projectFilters');
    if(filterBar){
      const section = filterBar.closest('section') || document;
      const cards = Array.from(section.querySelectorAll('.card, .hover-card'));
      const apply = (key) => {
        const k = (key || 'all').toLowerCase();
        cards.forEach(c => {
          if(k === 'all'){ c.style.display = ''; return; }
          const tagsAttr = (c.getAttribute('data-tags') || '').toLowerCase();
          const text = c.textContent.toLowerCase();
          const hay = tagsAttr || text; // prefer tags when present
          const show = hay.includes(k);
          c.style.display = show ? '' : 'none';
        });
      };
      filterBar.querySelectorAll('[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
          filterBar.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('active'));
          btn.classList.add('active');
          apply(btn.dataset.filter);
        });
      });
    }

    // Subtle tilt on hover for cards
    const tilts = document.querySelectorAll('.tilt, .card');
    tilts.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const cx = e.clientX - r.left, cy = e.clientY - r.top;
        const rx = ((cy / r.height) - 0.5) * -6;
        const ry = ((cx / r.width) - 0.5) * 6;
        el.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      el.addEventListener('mouseleave', ()=>{ el.style.transform = ''; });
    });
  });
})();
