/* Shishir Ghimire — NetaNix — Service Worker
   Strategy: stale-while-revalidate for the shell, network-first for the Medium feed. */
const VERSION='v5';
const CORE='netanix-core-'+VERSION;
const SHELL=[
  './',
  './index.html',
  './about.html',
  './projects.html',
  './writeups.html',
  './certs.html',
  './contact.html',
  './css/style.css',
  './js/main.js',
  './js/icons.js',
  './img/shishir.avif',
  './img/shishir.webp',
  './img/shishir.jpg',
  './manifest.webmanifest'
];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CORE).then(c=>c.addAll(SHELL).catch(()=>{})).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CORE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);

  /* network-first for Medium API */
  if(url.host.includes('rss2json.com')||url.host.includes('medium.com')){
    e.respondWith(fetch(req).catch(()=>caches.match(req)));
    return;
  }

  /* same-origin: stale-while-revalidate */
  if(url.origin===location.origin){
    e.respondWith(
      caches.open(CORE).then(cache=>cache.match(req).then(cached=>{
        const network=fetch(req).then(res=>{
          if(res&&res.status===200&&res.type==='basic')cache.put(req,res.clone());
          return res;
        }).catch(()=>cached);
        return cached||network;
      }))
    );
    return;
  }

  /* third-party (fonts/etc): cache-first */
  e.respondWith(
    caches.match(req).then(c=>c||fetch(req).then(res=>{
      if(res&&res.status===200){const copy=res.clone();caches.open(CORE).then(cc=>cc.put(req,copy))}
      return res;
    }).catch(()=>caches.match('./index.html')))
  );
});
