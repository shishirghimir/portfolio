/* Shishir Ghimire — NetaNix Labs · interactions */
(function(){
  'use strict';
  const d = document, w = window;
  const reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- inject icons by data-icon ---- */
  function paintIcons(){
    if(!w.ICONS) return;
    d.querySelectorAll('[data-icon]').forEach(el=>{
      const k = el.getAttribute('data-icon');
      if(w.ICONS[k]) el.innerHTML = w.ICONS[k];
    });
  }

  /* ---- nav: toggle, scroll state, progress, active link ---- */
  function nav(){
    const navEl = d.querySelector('.nav');
    const toggle = d.querySelector('.nav-toggle');
    const prog = d.querySelector('.scroll-progress');
    const links = d.querySelectorAll('.nav-links a[href*="#"]');

    if(toggle){
      toggle.addEventListener('click', ()=> d.documentElement.classList.toggle('nav-open'));
      d.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>d.documentElement.classList.remove('nav-open')));
    }

    let ticking=false;
    function onScroll(){
      const y = w.scrollY || w.pageYOffset;
      if(navEl) navEl.classList.toggle('scrolled', y>24);
      if(prog){
        const h = d.documentElement.scrollHeight - w.innerHeight;
        prog.style.width = (h>0 ? (y/h*100) : 0) + '%';
      }
      ticking=false;
    }
    w.addEventListener('scroll', ()=>{ if(!ticking){ w.requestAnimationFrame(onScroll); ticking=true; } }, {passive:true});
    onScroll();

    /* active section highlight (homepage anchors) */
    const secMap = [];
    links.forEach(a=>{
      const id = a.getAttribute('href').split('#')[1];
      const sec = id && d.getElementById(id);
      if(sec) secMap.push({a, sec});
    });
    if(secMap.length){
      const io = new IntersectionObserver((entries)=>{
        entries.forEach(e=>{
          if(e.isIntersecting){
            links.forEach(l=>l.classList.remove('active'));
            const m = secMap.find(x=>x.sec===e.target);
            if(m) m.a.classList.add('active');
          }
        });
      },{rootMargin:'-45% 0px -50% 0px'});
      secMap.forEach(x=>io.observe(x.sec));
    }
  }

  /* ---- reveal on scroll ---- */
  function reveals(){
    const els = d.querySelectorAll('.reveal-up,[data-stagger],.in-view-trigger');
    if(reduce || !('IntersectionObserver' in w)){
      els.forEach(el=>el.classList.add('in-view'));
      return;
    }
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){ e.target.classList.add('in-view'); io.unobserve(e.target); }
      });
    },{rootMargin:'0px 0px -8% 0px', threshold:0.08});
    els.forEach(el=>io.observe(el));
  }

  /* ---- animated counters ---- */
  function counters(){
    const els = d.querySelectorAll('[data-count]');
    if(!els.length) return;
    const run = (el)=>{
      const target = parseFloat(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix')||'';
      const dur = 1400; const start = performance.now();
      if(reduce){ el.textContent = target + suffix; return; }
      function tick(now){
        const p = Math.min(1,(now-start)/dur);
        const eased = 1-Math.pow(1-p,3);
        const val = target % 1 === 0 ? Math.round(target*eased) : (target*eased).toFixed(1);
        el.textContent = val + suffix;
        if(p<1) w.requestAnimationFrame(tick);
      }
      w.requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ run(e.target); io.unobserve(e.target); } });
    },{threshold:0.4});
    els.forEach(el=>io.observe(el));
  }

  /* ---- card spotlight follow ---- */
  function spotlight(){
    if(reduce) return;
    d.querySelectorAll('.card').forEach(card=>{
      card.addEventListener('pointermove',(e)=>{
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX-r.left)+'px');
        card.style.setProperty('--my', (e.clientY-r.top)+'px');
      });
    });
  }

  /* ---- magnetic buttons ---- */
  function magnetic(){
    if(reduce || w.matchMedia('(pointer:coarse)').matches) return;
    d.querySelectorAll('[data-magnetic]').forEach(btn=>{
      btn.addEventListener('pointermove',(e)=>{
        const r = btn.getBoundingClientRect();
        const x = (e.clientX-r.left-r.width/2)*.25;
        const y = (e.clientY-r.top-r.height/2)*.35;
        btn.style.transform = `translate(${x}px,${y}px)`;
      });
      btn.addEventListener('pointerleave',()=>{ btn.style.transform=''; });
    });
  }

  /* ---- hero typing role ---- */
  function typing(){
    const el = d.querySelector('[data-typing]');
    if(!el) return;
    let roles;
    try{ roles = JSON.parse(el.getAttribute('data-typing')); }catch(_){ return; }
    if(!roles || !roles.length) return;
    const span = d.createElement('span'); span.className='t';
    const cur = d.createElement('span'); cur.className='cursor';
    el.textContent=''; el.appendChild(span); el.appendChild(cur);
    if(reduce){ span.textContent = roles[0]; return; }
    let ri=0, ci=0, del=false;
    function step(){
      const word = roles[ri];
      span.textContent = word.slice(0, ci);
      if(!del){
        if(ci<word.length){ ci++; setTimeout(step,55); }
        else { del=true; setTimeout(step,1700); }
      } else {
        if(ci>0){ ci--; setTimeout(step,28); }
        else { del=false; ri=(ri+1)%roles.length; setTimeout(step,260); }
      }
    }
    step();
  }

  /* ---- hero intro ---- */
  function heroIn(){
    const hero = d.querySelector('.hero');
    if(hero) requestAnimationFrame(()=>hero.classList.add('ready'));
  }

  /* ---- Medium feed ---- */
  w.loadMedium = function(opts){
    const target = d.querySelector(opts.target);
    if(!target) return;
    const limit = opts.limit || 6;
    const statusEl = opts.statusEl;
    const FEED = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent('https://medium.com/feed/@netanix96');
    const esc = s => (s||'').replace(/[<>&"]/g, c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
    function stripImg(html){ const m=/<img[^>]+src="([^">]+)"/.exec(html||''); return m?m[1]:''; }
    function clean(html){ return (html||'').replace(/<[^>]+>/g,'').replace(/&[a-z]+;/g,' ').trim(); }
    fetch(FEED).then(r=>r.json()).then(data=>{
      if(!data || data.status!=='ok' || !data.items || !data.items.length) throw new Error('empty');
      const items = data.items.slice(0,limit);
      target.innerHTML = items.map(it=>{
        const img = it.thumbnail && /^https?:/.test(it.thumbnail) ? it.thumbnail : stripImg(it.content||it.description);
        const desc = clean(it.description).slice(0,160);
        const cats = (it.categories||[]).slice(0,1)[0] || 'Writeup';
        const date = it.pubDate ? new Date(it.pubDate).toLocaleDateString('en-US',{month:'short',year:'numeric'}) : '';
        return `<article class="card wr reveal-up in-view">
          <a href="${esc(it.link)}" target="_blank" rel="noopener" aria-label="${esc(it.title)}">
          <div class="thumb">${img?`<img loading="lazy" src="${esc(img)}" alt="${esc(it.title)}" onerror="this.remove()">`:''}
            <span class="fallback" data-icon="fileText"></span></div>
          <div class="body"><div class="tagline">${esc(cats)} · ${date}</div>
          <h3>${esc(it.title)}</h3><p>${esc(desc)}…</p>
          <span class="read">Read on Medium <span data-icon="arrowUpRight"></span></span>
          </div></a></article>`;
      }).join('');
      paintIcons();
      if(statusEl) statusEl.remove();
    }).catch(()=>{
      if(statusEl) statusEl.textContent='Could not load the live feed — read everything on Medium →';
      if(!opts.fallbackKeep && !target.children.length){
        target.innerHTML = '<p style="color:var(--muted)">Visit <a href="https://medium.com/@netanix96" target="_blank" rel="noopener" style="color:var(--accent-2)">@netanix96 on Medium</a> for all writeups.</p>';
      }
    });
  };

  /* ---- contact form (mailto, no backend) ---- */
  function contactForm(){
    const f = d.getElementById('contact-form');
    if(!f) return;
    f.addEventListener('submit',(e)=>{
      e.preventDefault();
      const name = f.name.value.trim(), email = f.email.value.trim(),
            topic = f.topic.value, msg = f.message.value.trim();
      const subject = encodeURIComponent(`[Portfolio] ${topic||'Message'} — ${name}`);
      const body = encodeURIComponent(`${msg}\n\n— ${name}\n${email}`);
      w.location.href = `mailto:ssishir39@gmail.com?subject=${subject}&body=${body}`;
      const btn = f.querySelector('button[type=submit]');
      if(btn){ const t=btn.innerHTML; btn.innerHTML='Opening your mail app…'; setTimeout(()=>btn.innerHTML=t,3000); }
    });
  }

  /* ---- year ---- */
  function year(){ d.querySelectorAll('[data-year]').forEach(e=>e.textContent=new Date().getFullYear()); }

  /* ---- interactive ink dot-field background (light theme) ---- */
  function liveBackground(){
    if(d.getElementById('bg')) return;
    const c=d.createElement('canvas'); c.id='bg'; c.setAttribute('aria-hidden','true');
    d.body.prepend(c);
    const ctx=c.getContext('2d',{alpha:true});
    const coarse=w.matchMedia('(pointer:coarse)').matches;
    let W,H,DPR,GAP,dots=[];
    const INK=[23,21,14], LIME=[120,170,30];
    const mouse={x:-9999,y:-9999};
    const R=150;                /* influence radius (css px) */
    function build(){
      GAP = (w.innerWidth<720?34:40);
      dots=[];
      const cols=Math.ceil(w.innerWidth/GAP)+1, rows=Math.ceil(w.innerHeight/GAP)+1;
      for(let i=0;i<cols;i++) for(let j=0;j<rows;j++)
        dots.push({x:i*GAP,y:j*GAP,ph:(i+j)*0.35});
    }
    function resize(){
      DPR=Math.min(2,w.devicePixelRatio||1);
      W=c.width=Math.floor(w.innerWidth*DPR); H=c.height=Math.floor(w.innerHeight*DPR);
      c.style.width=w.innerWidth+'px'; c.style.height=w.innerHeight+'px';
      ctx.setTransform(DPR,0,0,DPR,0,0);
      build();
    }
    resize();
    w.addEventListener('resize',resize,{passive:true});
    if(!coarse){
      w.addEventListener('pointermove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;},{passive:true});
      w.addEventListener('pointerleave',()=>{mouse.x=mouse.y=-9999;});
    }
    let t=0,running=true;
    function draw(){
      t++;
      ctx.clearRect(0,0,w.innerWidth,w.innerHeight);
      for(const dt of dots){
        const dx=dt.x-mouse.x, dy=dt.y-mouse.y, d2=dx*dx+dy*dy;
        let r=1.1, lime=0, push=0;
        if(!coarse && d2<R*R){
          const dist=Math.sqrt(d2)||1, f=1-dist/R;
          r=1.1+f*2.4; lime=f; push=f*7;        /* grow + lime tint + part around cursor */
          dt._x=dt.x+(dx/dist)*push; dt._y=dt.y+(dy/dist)*push;
        } else { dt._x=dt.x; dt._y=dt.y; }
        const wob = coarse?(Math.sin(t*0.03+dt.ph)*0.35+0.4):0;
        const alpha=0.16+lime*0.5+wob*0.12;
        const col = lime>0 ? [Math.round(INK[0]+(LIME[0]-INK[0])*lime),Math.round(INK[1]+(LIME[1]-INK[1])*lime),Math.round(INK[2]+(LIME[2]-INK[2])*lime)] : INK;
        ctx.fillStyle='rgba('+col[0]+','+col[1]+','+col[2]+','+alpha.toFixed(3)+')';
        ctx.beginPath(); ctx.arc(dt._x,dt._y,r+wob*0.6,0,6.283); ctx.fill();
      }
    }
    function loop(){ if(!running)return; draw(); w.requestAnimationFrame(loop); }
    if(reduce){ draw(); }
    else{ loop(); d.addEventListener('visibilitychange',()=>{running=!d.hidden; if(running) loop();}); }
  }

  function init(){
    liveBackground();
    paintIcons(); nav(); reveals(); counters(); spotlight(); magnetic();
    typing(); heroIn(); contactForm(); year();
  }
  if(d.readyState==='loading') d.addEventListener('DOMContentLoaded', init);
  else init();

  /* service worker */
  if('serviceWorker' in navigator){
    w.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  }
})();
