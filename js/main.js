'use strict';

/* rAF-throttled scroll dispatcher — one callback per frame max */
const _scrollSubs=[];let _scrollTicking=false;
function onScroll(fn){_scrollSubs.push(fn);fn()}
window.addEventListener('scroll',()=>{
  if(_scrollTicking)return;_scrollTicking=true;
  requestAnimationFrame(()=>{_scrollSubs.forEach(f=>f());_scrollTicking=false});
},{passive:true});

/* nav scroll background */
function initNav(){
  const nav=document.querySelector('.nav');
  if(!nav)return;
  onScroll(()=>nav.classList.toggle('sc',window.scrollY>20));
}

/* mobile menu */
function initMenu(){
  const btn=document.getElementById('nb'),links=document.getElementById('nl');
  if(!btn||!links)return;
  btn.addEventListener('click',()=>{
    const o=links.classList.toggle('open');
    btn.classList.toggle('open',o);
    btn.setAttribute('aria-expanded',o);
    document.body.style.overflow=o?'hidden':'';
  });
  links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    links.classList.remove('open');btn.classList.remove('open');
    btn.setAttribute('aria-expanded','false');document.body.style.overflow='';
  }));
}

/* active nav link */
function setActive(){
  const p=window.location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('#nl a').forEach(a=>{
    if(a.getAttribute('href')===p){a.classList.add('active');a.setAttribute('aria-current','page')}
  });
}

/* scroll reveal */
function initFade(){
  const els=document.querySelectorAll('[data-f]');
  if(!els.length)return;
  const obs=new IntersectionObserver(es=>{
    es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target)}});
  },{threshold:.08,rootMargin:'0px 0px -40px 0px'});
  els.forEach(el=>obs.observe(el));
}

/* stagger children reveal */
function initStagger(){
  const els=document.querySelectorAll('[data-stagger]');if(!els.length)return;
  const obs=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target)}
  }),{threshold:.1,rootMargin:'0px 0px -30px 0px'});
  els.forEach(el=>obs.observe(el));
}

/* typewriter */
function initTyper(){
  const el=document.getElementById('typer');
  if(!el)return;
  const lines=['Penetration Testing','Digital Forensics','Red Team Operations','Security Tool Creation','CTF Design','OSINT Research','Always Learning'];
  let li=0,ci=0,del=false;
  const tick=()=>{
    const cur=lines[li];
    if(!del){el.textContent=cur.slice(0,++ci);if(ci===cur.length){del=true;setTimeout(tick,1800);return}}
    else{el.textContent=cur.slice(0,--ci);if(ci===0){del=false;li=(li+1)%lines.length}}
    setTimeout(tick,del?38:75);
  };
  tick();
}

/* skill bars fill on view */
function initBars(){
  const bars=document.querySelectorAll('.bfill');
  if(!bars.length)return;
  const obs=new IntersectionObserver(es=>{
    es.forEach(e=>{if(e.isIntersecting){e.target.style.width=e.target.dataset.lvl+'%';obs.unobserve(e.target)}});
  },{threshold:.3});
  bars.forEach(b=>{b.style.width='0%';obs.observe(b)});
}

/* glitch on hero name */
function initGlitch(){
  const el=document.getElementById('gname');
  if(!el)return;
  const chars='!<>-_\\/[]{}=+*^?#';
  const orig=el.textContent;
  setInterval(()=>{
    let i=0;
    const iv=setInterval(()=>{
      el.textContent=orig.split('').map((c,idx)=>(c===' '||c==='\n'||idx<i)?c:chars[Math.floor(Math.random()*chars.length)]).join('');
      if(++i>orig.length){clearInterval(iv);el.textContent=orig}
    },28);
  },5500);
}

/* number counters with thousands-separator formatting + ease-out */
function initCount(){
  const fmt=n=>n.toLocaleString('en-US');
  document.querySelectorAll('[data-count]').forEach(el=>{
    const obs=new IntersectionObserver(([e])=>{
      if(!e.isIntersecting)return;
      const end=+el.dataset.count,suf=el.dataset.suf||'',dur=1500,s=performance.now();
      const ease=t=>1-Math.pow(1-t,3); /* ease-out cubic for natural feel */
      const go=now=>{const p=Math.min((now-s)/dur,1);el.textContent=fmt(Math.floor(ease(p)*end))+suf;if(p<1)requestAnimationFrame(go);else el.textContent=fmt(end)+suf};
      requestAnimationFrame(go);obs.unobserve(el);
    },{threshold:.5});
    obs.observe(el);
  });
}

/* contact form */
function initForm(){
  const form=document.getElementById('cf');if(!form)return;
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const n=document.getElementById('fn').value.trim();
    const em=document.getElementById('fe').value.trim();
    const m=document.getElementById('fm2').value.trim();
    const fb=document.getElementById('ffb');
    if(!n||!em||!m){setFb(fb,'All required fields must be filled.','err');return}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){setFb(fb,'Please enter a valid email address.','err');return}
    setFb(fb,'Message received. I will respond within 24 hours.','ok');form.reset();
  });
}
function setFb(el,msg,type){
  if(!el)return;el.textContent=msg;el.className='ffb '+type;el.setAttribute('role','alert');
  if(type==='ok')setTimeout(()=>{el.textContent='';el.className='ffb'},6000);
}

/* footer year */
function setYr(){const e=document.getElementById('yr');if(e)e.textContent=new Date().getFullYear()}

/* spotlight removed — aurora background covers ambient motion at zero CPU */

/* magnetic buttons (desktop only) */
function initMagnetic(){
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  document.querySelectorAll('.btn,[data-mag]').forEach(el=>{
    let raf;
    el.addEventListener('mousemove',e=>{
      const r=el.getBoundingClientRect();
      const x=e.clientX-r.left-r.width/2;
      const y=e.clientY-r.top-r.height/2;
      cancelAnimationFrame(raf);
      raf=requestAnimationFrame(()=>{el.style.transform=`translate(${x*.18}px,${y*.28}px)`});
    });
    el.addEventListener('mouseleave',()=>{cancelAnimationFrame(raf);el.style.transform=''});
  });
}

/* subtle 3D card tilt (desktop, large screens only) */
function initTilt(){
  if(!matchMedia('(hover:hover) and (pointer:fine) and (min-width:900px)').matches)return;
  document.querySelectorAll('.pcard,.ncard,.wcard,.exp').forEach(el=>{
    let raf;
    el.addEventListener('mousemove',e=>{
      const r=el.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width;
      const y=(e.clientY-r.top)/r.height;
      const rx=(.5-y)*4;
      const ry=(x-.5)*4;
      cancelAnimationFrame(raf);
      raf=requestAnimationFrame(()=>{el.style.transform=`perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`});
    });
    el.addEventListener('mouseleave',()=>{cancelAnimationFrame(raf);el.style.transform=''});
  });
}

/* scroll progress bar — rAF-throttled via shared dispatcher */
function initProgress(){
  const p=document.createElement('div');p.className='prog';p.setAttribute('aria-hidden','true');
  document.body.appendChild(p);
  const upd=()=>{
    const h=document.documentElement;
    const total=h.scrollHeight-h.clientHeight;
    p.style.transform='scaleX('+(total>0?(h.scrollTop/total):0)+')';
  };
  onScroll(upd);
  window.addEventListener('resize',upd,{passive:true});
}

/* mouse parallax for orbs and hero photo (desktop only) */
function initParallax(){
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  const o1=document.querySelector('.bg-orb-1');
  const o2=document.querySelector('.bg-orb-2');
  const pf=document.querySelector('.pframe');
  if(!o1&&!o2&&!pf)return;
  let raf;
  document.addEventListener('mousemove',e=>{
    const x=(e.clientX/window.innerWidth-.5)*22;
    const y=(e.clientY/window.innerHeight-.5)*22;
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>{
      if(o1)o1.style.translate=`${x}px ${y}px`;
      if(o2)o2.style.translate=`${-x*.6}px ${-y*.6}px`;
      if(pf)pf.style.translate=`${x*.2}px ${y*.2}px`;
    });
  },{passive:true});
}

/* preloader */
function hidePreload(){
  const p=document.getElementById('preload');if(!p)return;
  setTimeout(()=>{p.classList.add('gone');setTimeout(()=>p.remove(),600)},900);
}

/* back to top */
function initToTop(){
  const b=document.createElement('button');
  b.className='totop';b.setAttribute('aria-label','Back to top');b.type='button';
  b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
  document.body.appendChild(b);
  window.addEventListener('scroll',()=>b.classList.toggle('show',window.scrollY>700),{passive:true});
  b.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
}

/* ── Medium RSS loader ── pulls latest articles from medium.com/@netanix96 */
const MEDIUM_USER = '@netanix96';
const MEDIUM_RSS = 'https://medium.com/feed/' + MEDIUM_USER;
const RSS2JSON = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(MEDIUM_RSS);

function detectCat(title){
  const t=(title||'').toLowerCase();
  if(t.includes('htb')||t.includes('hackthebox')||t.includes('hack the box'))return 'HackTheBox';
  if(t.includes('tryhackme')||t.includes('thm '))return 'TryHackMe';
  if(t.includes('forensic'))return 'Forensics';
  if(t.includes('osint'))return 'OSINT';
  if(t.includes('ai ')||t.includes(' ai')||t.includes('mythos')||t.includes('anthropic'))return 'AI Security';
  if(t.includes('cve')||t.includes('exploit'))return 'Exploit';
  if(t.includes('malware'))return 'Malware';
  return 'Article';
}
function extractThumb(item){
  if(item.thumbnail&&item.thumbnail!=='')return item.thumbnail;
  if(item.content){
    const m=item.content.match(/<img[^>]+src=["']([^"'>]+)["']/i);
    if(m)return m[1];
  }
  return '';
}
function excerptFrom(item){
  const tmp=document.createElement('div');
  tmp.innerHTML=item.description||item.content||'';
  const t=tmp.textContent.replace(/\s+/g,' ').trim();
  return t.length>180?t.slice(0,180).trim()+'…':t;
}
function fmtDate(d){
  try{return new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
  catch(e){return ''}
}

async function loadMedium(opts){
  const {target,limit=10,fallbackKeep=true,statusEl}=opts||{};
  const container=typeof target==='string'?document.querySelector(target):target;
  if(!container)return;

  /* show skeletons */
  if(!fallbackKeep||container.children.length===0){
    container.innerHTML='';
    for(let i=0;i<Math.min(limit,4);i++){
      const sk=document.createElement('div');
      sk.className='wcard sk';
      sk.innerHTML='<div class="sk-line sk-x"></div><div class="sk-line sk-h"></div><div class="sk-line"></div><div class="sk-line sk-s"></div>';
      container.appendChild(sk);
    }
  }

  try{
    const res=await fetch(RSS2JSON,{cache:'no-store'});
    const data=await res.json();
    if(data.status!=='ok'||!Array.isArray(data.items))throw new Error('rss feed error');
    const items=data.items.slice(0,limit);
    if(!items.length)throw new Error('empty');

    container.innerHTML='';
    items.forEach(it=>{
      const thumb=extractThumb(it);
      const cat=detectCat(it.title);
      const card=document.createElement('article');
      card.className='wcard wcard-img';
      const dateStr=fmtDate(it.pubDate);
      card.innerHTML=
        (thumb?'<a href="'+it.link+'" target="_blank" rel="noopener" class="wcard-thumb"><span class="wcat">'+cat+'</span>'+(dateStr?'<span class="wdate">'+dateStr+'</span>':'')+'<img loading="lazy" src="'+thumb+'" alt=""/></a>':'')+
        '<span class="shine" aria-hidden="true"></span>'+
        '<div class="wcard-body">'+
          (!thumb?'<div class="wcard-meta"><span class="wcat">'+cat+'</span><span class="wdate">'+dateStr+'</span></div>':'')+
          '<h3><a href="'+it.link+'" target="_blank" rel="noopener">'+it.title+'</a></h3>'+
          '<p>'+excerptFrom(it)+'</p>'+
          '<a class="wlink" href="'+it.link+'" target="_blank" rel="noopener">Read on Medium <span class="ico-x"></span></a>'+
        '</div>';
      container.appendChild(card);
    });
    container.querySelectorAll('.ico-x').forEach(el=>{el.innerHTML=window.ICONS&&ICONS.external?ICONS.external:'↗'});
    container.classList.add('in');
    if(statusEl)statusEl.textContent='Live from Medium · '+items.length+' articles';
    /* re-init tilt for newly added cards */
    if(typeof initTilt==='function')initTilt();
    /* inject Article schema for SEO so each writeup gets indexed properly */
    try{
      const old=document.getElementById('articles-jsonld');if(old)old.remove();
      const ld=document.createElement('script');ld.type='application/ld+json';ld.id='articles-jsonld';
      const list={
        '@context':'https://schema.org','@type':'ItemList','itemListElement':items.map((it,idx)=>({
          '@type':'ListItem','position':idx+1,
          'item':{
            '@type':'Article','headline':it.title,'url':it.link,
            'datePublished':it.pubDate,'image':extractThumb(it),
            'author':{'@type':'Person','name':'Shishir Ghimire','url':'https://shishirghimire.info.np/'},
            'publisher':{'@type':'Organization','name':'Medium','url':'https://medium.com/'},
            'articleSection':detectCat(it.title)
          }
        }))
      };
      ld.textContent=JSON.stringify(list);document.head.appendChild(ld);
    }catch{}
  }catch(e){
    if(statusEl){statusEl.textContent='Live feed unavailable — showing cached posts';statusEl.classList.add('err')}
    /* fallback: skeletons remain unless fallbackKeep already populated */
    if(!fallbackKeep||container.querySelectorAll('.wcard.sk').length===container.children.length){
      container.innerHTML='<p class="wr-status err">Could not reach Medium right now. Visit <a href="https://medium.com/'+MEDIUM_USER+'" target="_blank" rel="noopener">medium.com/'+MEDIUM_USER+'</a> for the latest.</p>';
    }
    console.warn('Medium feed:',e);
  }
}

/* inject corner-bracket decorations into cards */
function initBrackets(){
  document.querySelectorAll('.pcard,.ncard,.exp').forEach(el=>{
    if(el.dataset.brk==='1')return;
    ['tl','tr','bl','br'].forEach(p=>{
      const b=document.createElement('span');b.className='brk '+p;b.setAttribute('aria-hidden','true');
      el.appendChild(b);
    });
    el.dataset.brk='1';
  });
}

/* smooth scroll handled natively via CSS `html{scroll-behavior:smooth}` —
   no JS hijack (was causing jitter on precision trackpads / 120Hz displays) */

/* ── Command palette (Cmd+K / Ctrl+K) ── */
function initCmdK(){
  const items=[
    {label:'Home',href:'index.html',ico:'code',group:'Pages'},
    {label:'About',href:'about.html',ico:'user',group:'Pages'},
    {label:'Projects',href:'projects.html',ico:'package',group:'Pages'},
    {label:'Writeups',href:'writeups.html',ico:'fileText',group:'Pages'},
    {label:'Certifications',href:'certs.html',ico:'award',group:'Pages'},
    {label:'Contact',href:'contact.html',ico:'mail',group:'Pages'},
    {label:'Medium @netanix96',href:'https://medium.com/@netanix96',ico:'fileText',group:'Links',ext:true},
    {label:'GitHub @shishirghimir',href:'https://github.com/shishirghimir',ico:'github',group:'Links',ext:true},
    {label:'TryHackMe N3TANIX',href:'https://tryhackme.com/p/N3TANIX',ico:'terminal',group:'Links',ext:true},
    {label:'LinkedIn',href:'https://linkedin.com/in/shishir-ghimire-2b7934292',ico:'linkedin',group:'Links',ext:true},
    {label:'NetaNix CTF',href:'https://netanixctf.xyz',ico:'flag',group:'Links',ext:true},
    {label:'Join NetaNix CTF Discord',href:'https://discord.com/invite/XcFfwgEDjp',ico:'discord',group:'Links',ext:true},
    {label:'Email — ssishir39@gmail.com',href:'mailto:ssishir39@gmail.com',ico:'mail',group:'Actions'},
    {label:'Toggle CRT mode (Konami)',action:()=>document.body.classList.toggle('crt'),ico:'cpu',group:'Actions'},
    {label:'Scroll to top',action:()=>window.scrollTo({top:0,behavior:'smooth'}),ico:'arrowRight',group:'Actions'},
  ];
  const back=document.createElement('div');back.className='cmdk-back';back.setAttribute('aria-hidden','true');
  back.innerHTML=`
    <div class="cmdk" role="dialog" aria-label="Command palette">
      <div class="cmdk-input">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" placeholder="Search pages, links, actions…" autocomplete="off" spellcheck="false" id="cmdk-q"/>
        <span class="cmdk-kbd">esc</span>
      </div>
      <div class="cmdk-list" id="cmdk-list" role="listbox"></div>
    </div>`;
  document.body.appendChild(back);
  const input=back.querySelector('#cmdk-q');
  const list=back.querySelector('#cmdk-list');
  let sel=0,filtered=[];
  const render=q=>{
    const Q=q.trim().toLowerCase();
    filtered=Q?items.filter(i=>i.label.toLowerCase().includes(Q)||i.group.toLowerCase().includes(Q)):items;
    if(!filtered.length){list.innerHTML='<div class="cmdk-empty">No matches</div>';return}
    sel=Math.min(sel,filtered.length-1);
    let cur='';let html='';
    filtered.forEach((it,i)=>{
      if(it.group!==cur){cur=it.group;html+=`<div class="cmdk-group-l">${cur}</div>`}
      const icoSvg=window.ICONS&&ICONS[it.ico]?ICONS[it.ico]:'';
      html+=`<button class="cmdk-item${i===sel?' sel':''}" data-i="${i}" role="option"><span class="ico">${icoSvg}</span>${it.label}${it.ext?'<span class="ext">↗</span>':''}</button>`;
    });
    list.innerHTML=html;
  };
  const open=()=>{back.classList.add('show');back.setAttribute('aria-hidden','false');input.value='';sel=0;render('');setTimeout(()=>input.focus(),50);document.body.style.overflow='hidden'};
  const close=()=>{back.classList.remove('show');back.setAttribute('aria-hidden','true');document.body.style.overflow=''};
  const exec=it=>{close();if(it.action){it.action();return}window.location.href=it.href.startsWith('http')||it.href.startsWith('mailto:')?it.href:it.href;if(it.ext)window.open(it.href,'_blank','noopener')};
  input.addEventListener('input',e=>render(e.target.value));
  list.addEventListener('click',e=>{const b=e.target.closest('.cmdk-item');if(!b)return;exec(filtered[+b.dataset.i])});
  back.addEventListener('click',e=>{if(e.target===back)close()});
  document.addEventListener('keydown',e=>{
    const isOpen=back.classList.contains('show');
    if((e.key==='k'||e.key==='K')&&(e.ctrlKey||e.metaKey)){e.preventDefault();isOpen?close():open();return}
    if(!isOpen)return;
    if(e.key==='Escape'){e.preventDefault();close()}
    else if(e.key==='ArrowDown'){e.preventDefault();sel=Math.min(sel+1,filtered.length-1);render(input.value)}
    else if(e.key==='ArrowUp'){e.preventDefault();sel=Math.max(sel-1,0);render(input.value)}
    else if(e.key==='Enter'){e.preventDefault();if(filtered[sel])exec(filtered[sel])}
  });
  /* "⌘K" hint in nav */
  const nav=document.querySelector('.nav-links');
  if(nav){
    const hint=document.createElement('button');hint.type='button';hint.className='nav-kbd';hint.setAttribute('aria-label','Open command palette');
    hint.innerHTML='<span>⌘</span><span>K</span>';
    hint.addEventListener('click',open);
    document.querySelector('.nav').insertBefore(hint,document.querySelector('.nav-btn'));
  }
}

/* ── Hover-only link prefetcher (Firefox/Safari fallback) ── lightweight, no idle bulk fetch */
function initPrefetch(){
  if(HTMLScriptElement.supports&&HTMLScriptElement.supports('speculationrules'))return;
  if(navigator.connection&&(navigator.connection.saveData||/2g/.test(navigator.connection.effectiveType||'')))return;
  const seen=new Set();
  document.addEventListener('mouseover',e=>{
    const a=e.target.closest('a[href]');if(!a)return;
    if(a.target==='_blank')return;
    let url;try{url=new URL(a.href,location.href)}catch{return}
    if(url.origin!==location.origin)return;
    if(url.pathname===location.pathname)return;
    if(seen.has(url.pathname))return;seen.add(url.pathname);
    const l=document.createElement('link');l.rel='prefetch';l.href=url.pathname;l.as='document';
    document.head.appendChild(l);
  },{passive:true,capture:true});
}

/* ── View Transitions on internal nav clicks (kills the tab loading flash) ── */
function initViewTransitions(){
  if(!document.startViewTransition)return; /* Chrome 111+ only — graceful no-op elsewhere */
  document.addEventListener('click',e=>{
    if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    const a=e.target.closest('a[href]');if(!a)return;
    if(a.target==='_blank'||a.hasAttribute('download'))return;
    let url;try{url=new URL(a.href,location.href)}catch{return}
    if(url.origin!==location.origin)return;
    if(url.pathname===location.pathname&&url.hash){return} /* let anchors do their thing */
    e.preventDefault();
    document.startViewTransition(()=>{location.href=url.href});
  });
}

/* ── Per-character title reveal on scroll-in (cheap CSS animation) ── */
function initTitleReveal(){
  if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  const titles=document.querySelectorAll('.stitle, .phero h1');
  if(!titles.length)return;
  titles.forEach(t=>{
    if(t.dataset.split==='1')return;
    /* split children that are pure text into per-char spans, but preserve inline elements */
    const wrap=node=>{
      const out=document.createDocumentFragment();
      node.childNodes.forEach(c=>{
        if(c.nodeType===3){ /* text node */
          c.textContent.split('').forEach(ch=>{
            const s=document.createElement('span');
            s.className='ch';s.textContent=ch;
            if(ch===' ')s.style.display='inline-block';
            out.appendChild(s);
          });
        }else if(c.nodeType===1){
          const clone=c.cloneNode(false);
          clone.appendChild(wrap(c));
          out.appendChild(clone);
        }
      });
      return out;
    };
    const frag=wrap(t);
    t.innerHTML='';t.appendChild(frag);
    t.dataset.split='1';
  });
  const obs=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('rv');obs.unobserve(e.target)}
  }),{threshold:.25,rootMargin:'0px 0px -10% 0px'});
  titles.forEach(t=>obs.observe(t));
}

/* ── Scroll-spy dots (right-side floating section navigator) ── */
function initSpy(){
  if(!matchMedia('(min-width:900px)').matches)return;
  /* find labelable sections — those with aria-labelledby pointing to a heading */
  const sections=[...document.querySelectorAll('section[aria-labelledby]')]
    .map(s=>{
      const h=document.getElementById(s.getAttribute('aria-labelledby'));
      const t=h?h.textContent.trim().split(/[—:.·]/)[0].trim():'';
      return t&&t.length<32?{el:s,label:t}:null;
    }).filter(Boolean);
  if(sections.length<3)return;
  const spy=document.createElement('div');spy.className='spy';spy.setAttribute('aria-hidden','true');
  sections.forEach((s,i)=>{
    const d=document.createElement('button');d.type='button';d.className='spy-dot';
    d.setAttribute('data-l',s.label);d.setAttribute('aria-label','Jump to '+s.label);
    d.addEventListener('click',()=>s.el.scrollIntoView({behavior:'smooth',block:'start'}));
    spy.appendChild(d);
  });
  document.body.appendChild(spy);
  /* show after scroll past hero */
  window.addEventListener('scroll',()=>spy.classList.toggle('show',window.scrollY>window.innerHeight*.4),{passive:true});
  /* active section tracking via IO */
  const dots=spy.querySelectorAll('.spy-dot');
  const obs=new IntersectionObserver(es=>{
    es.forEach(e=>{
      const idx=sections.findIndex(s=>s.el===e.target);
      if(idx<0)return;
      if(e.isIntersecting){dots.forEach(d=>d.classList.remove('active'));dots[idx].classList.add('active')}
    });
  },{rootMargin:'-40% 0px -50% 0px'});
  sections.forEach(s=>obs.observe(s.el));
}

/* ── Skip-to-content link (a11y) ── injected so HTML files stay clean */
function initSkip(){
  const main=document.querySelector('main');if(!main)return;
  if(!main.id)main.id='main';
  const a=document.createElement('a');a.className='skip';a.href='#'+main.id;a.textContent='Skip to content';
  document.body.insertBefore(a,document.body.firstChild);
}

/* ── PWA service worker registration ── */
function initPWA(){
  if(!('serviceWorker' in navigator))return;
  if(location.protocol==='file:')return; /* SW only over http(s) */
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  });
}

/* Konami code: ↑↑↓↓←→←→ B A → toggles CRT mode */
function initKonami(){
  const seq=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let pos=0;
  const toast=(msg)=>{
    const t=document.createElement('div');t.className='crt-toast';t.textContent=msg;
    document.body.appendChild(t);requestAnimationFrame(()=>t.classList.add('show'));
    setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),500)},2400);
  };
  document.addEventListener('keydown',e=>{
    const k=e.key.length===1?e.key.toLowerCase():e.key;
    if(k===seq[pos]){pos++;if(pos===seq.length){pos=0;
      const on=document.body.classList.toggle('crt');
      toast(on?'> crt mode engaged':'> crt mode disengaged');
    }}else{pos=k===seq[0]?1:0}
  });
}

/* duplicate marquee for seamless loop */
function initMarquee(){
  document.querySelectorAll('.marquee-track').forEach(t=>{
    if(t.dataset.dup==='1')return;
    t.innerHTML=t.innerHTML+t.innerHTML;
    t.dataset.dup='1';
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  initNav();initMenu();setActive();
  initFade();initStagger();
  initTyper();initBars();initGlitch();initCount();
  initForm();setYr();
  initMagnetic();initTilt();initParallax();
  initProgress();initToTop();initMarquee();
  initBrackets();initKonami();
  initCmdK();initPWA();
  initPrefetch();initViewTransitions();initTitleReveal();initSkip();initSpy();
});
