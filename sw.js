const V='2026-11-13-1794736462';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','data/screen.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open('shell-'+V).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('shell-')&&k!=='shell-'+V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const fresh=(req,store)=>fetch(req).then(r=>{if(r.ok){const c=r.clone();caches.open(store).then(x=>x.put(req,c))}return r}).catch(()=>caches.match(req));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
 if(u.pathname.includes('/data/stocks/'))return e.respondWith(fresh(e.request,'stocks'));
 if(u.pathname.endsWith('/')||u.pathname.endsWith('index.html')||u.pathname.endsWith('screen.js'))return e.respondWith(fresh(e.request,'shell-'+V));
 e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
