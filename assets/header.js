(function(){
  const ready = (fn) => (document.readyState !== 'loading') ? fn() : document.addEventListener('DOMContentLoaded', fn);
  ready(async () => {
    try {
      const res = await fetch('partials/header.html', {cache:'no-store'});
      if(!res.ok) return;
      const html = await res.text();
      const parser = document.createElement('div');
      parser.innerHTML = html.trim();
      const newHeader = parser.querySelector('header.site-header');
      if(!newHeader) return;
      const oldHeader = document.querySelector('header.site-header');
      if(oldHeader){
        oldHeader.replaceWith(newHeader);
      } else {
        document.body.prepend(newHeader);
      }

      // Active link highlight
      const setActive = () => {
        const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
        const links = newHeader.querySelectorAll('nav#siteNav a[href]');
        links.forEach(a => a.classList.remove('active'));
        const map = [
          {match:['', 'index.html'], href:'index.html#home'},
          {match:['projects.html'], href:'projects.html'},
          {match:['writeups.html'], href:'writeups.html'},
          {match:['skills.html'], href:'skills.html'},
          {match:['experiences.html'], href:'experiences.html'}
        ];
        let targetHref = 'index.html#home';
        for(const m of map){ if(m.match.includes(path)){ targetHref = m.href; break; } }
        const target = Array.from(links).find(a => a.getAttribute('href').toLowerCase() === targetHref);
        if(target){ target.classList.add('active'); }
      };
      setActive();

      // Mobile menu toggle (duplicate of logic in main.js to ensure binding post-injection)
      const menuBtn = document.getElementById('menuBtn');
      const siteNav = document.getElementById('siteNav');
      if(menuBtn && siteNav){
        const closeNav = ()=>{ siteNav.classList.remove('open'); };
        const toggleNav = ()=>{ siteNav.classList.toggle('open'); };
        if(!menuBtn.dataset.bound){
          menuBtn.dataset.bound = '1';
          menuBtn.addEventListener('click', toggleNav);
          siteNav.querySelectorAll('a').forEach(a=> a.addEventListener('click', closeNav));
          window.addEventListener('resize', ()=>{ if(window.innerWidth>840) closeNav(); });
          document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeNav(); });
        }
      }

      // Mode toggle button: delegate to main.js via a key event (so logic stays single-source)
      const modeBtn = document.getElementById('modeToggle');
      if(modeBtn && !modeBtn.dataset.bound){
        modeBtn.dataset.bound = '1';
        modeBtn.addEventListener('click', ()=>{
          const ev = new KeyboardEvent('keydown', {key:'m'});
          document.dispatchEvent(ev);
        });
      }
    } catch(e){
      // Fail silently to avoid breaking page
    }
  });
})();
