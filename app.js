(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const IG=window.IG={$,$$};
const R=['home','quiz','2d','3d'];
const ls=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
const lset=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
IG.ls=ls;IG.lset=lset;

let tt;IG.toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),2200)};

IG.confetti=()=>{const c=$('#confetti'),x=c.getContext('2d');c.width=innerWidth;c.height=innerHeight;c.style.display='block';
const cols=['#ea4335','#fbbc04','#34a853','#4285f4','#ffffff'];
const P=Array.from({length:160},(_,i)=>({x:c.width*(i%2?.2:.8),y:c.height*.75,vx:(Math.random()-.5)*18+(i%2?5:-5),vy:-Math.random()*20-8,s:7+Math.random()*8,r:Math.random()*6,c:cols[Math.random()*5|0]}));
let f=0;(function t(){x.clearRect(0,0,c.width,c.height);P.forEach(p=>{p.vy+=.4;p.x+=p.vx;p.y+=p.vy;p.r+=.2;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.s/2,-p.s/2,p.s,p.s*.6);x.restore()});
if(++f<190)requestAnimationFrame(t);else{x.clearRect(0,0,c.width,c.height);c.style.display='none'}})()};

function theme(d){document.documentElement.classList.toggle('dark',d);$('meta[name=theme-color]').content=d?'#1e1f22':'#ffffff';try{localStorage.setItem('ig_dark',d?1:0)}catch(e){}}

IG.addRecent=(name,route,info)=>{const a=ls('ig_recent',[]).filter(x=>x.name!==name);a.unshift({name,route,info});lset('ig_recent',a.slice(0,4));renderRecent()};
function renderRecent(){const a=ls('ig_recent',[]),el=$('#recent');
el.innerHTML=a.length?a.map(x=>`<button class="rc" data-go="${x.route}"><b>${x.name}</b><span>${x.info}</span></button>`).join(''):'<p class="empty">No games played yet. Tap a quick action to start.</p>'}

let cur;
function show(r){if(!R.includes(r))r='home';if(cur===r)return;
if(cur==='2d'&&window.Game2D)Game2D.stop();
if(cur==='3d'&&window.Game3D&&Game3D.unmount)Game3D.unmount();
cur=r;$$('.view').forEach(v=>v.classList.toggle('on',v.id==='v-'+r));$$('#nav a').forEach(a=>a.classList.toggle('on',a.dataset.r===r));
if(r==='2d'&&window.Game2D)Game2D.ready();
if(r==='3d'&&window.Game3D)Game3D.mount($('#box3d'),IG);
if(r==='home')bioCheck()}
const route=()=>show(location.hash.slice(1));

function bioCheck(){const b=$('#bio'),btn=$('#bioBtn');if(b.classList.contains('x'))return;requestAnimationFrame(()=>{btn.hidden=!(b.scrollHeight>b.clientHeight+1)})}

IG.start=()=>{
theme(document.documentElement.classList.contains('dark'));
$('#themeBtn').onclick=()=>theme(!document.documentElement.classList.contains('dark'));
$('#bioBtn').onclick=e=>{const b=$('#bio');b.classList.toggle('x');e.target.textContent=b.classList.contains('x')?'Show less':'Show more'};
document.addEventListener('click',e=>{
const g=e.target.closest('[data-go]');if(g){location.hash=g.dataset.go;return}
if(e.target.closest('[data-share]')){share()}});
addEventListener('hashchange',route);addEventListener('resize',bioCheck);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&cur==='2d'&&window.Game2D)Game2D.stop()});
renderRecent();route();if(!cur)show('home');
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
};

async function share(){const url=location.origin+location.pathname+'#'+cur,title='Inspiration Games';
try{if(navigator.share){await navigator.share({title,url});return}}catch(e){if(e&&e.name==='AbortError')return}
try{await navigator.clipboard.writeText(url);IG.toast('Link copied')}catch(e){IG.toast(url)}}
})();
