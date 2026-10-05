const V='ig-v1.1',A=['./','./index.html','./styles.css','./app.js','./quiz.js','./game2d.js','./game3d.js','./manifest.json','./404.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(A)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{const r=e.request;
if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
if(r.mode==='navigate'){e.respondWith(fetch(r).catch(()=>caches.match('./index.html')));return}
e.respondWith(caches.open(V).then(c=>c.match(r).then(h=>{const f=fetch(r).then(n=>{if(n.ok)c.put(r,n.clone());return n}).catch(()=>h);return h||f})))});
