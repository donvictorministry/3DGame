(()=>{
const IG=window.IG,cv=IG.$('#cv2d'),cx=cv.getContext('2d'),ov=IG.$('#ov2d'),t2=IG.$('#t2d'),p2=IG.$('#p2d'),go=IG.$('#go2d');
let W=0,H=0,run=false,raf=0,items=[],px=0,score=0,lives=3,last=0,sp=0,best=IG.ls('ig_best2d',0);
function fit(){const r=cv.parentElement.getBoundingClientRect(),d=window.devicePixelRatio||1;W=r.width;H=r.height;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0);px=px?Math.min(Math.max(px,45),W-45):W/2}
function move(e){const r=cv.getBoundingClientRect();px=Math.min(Math.max(e.clientX-r.left,45),W-45)}
cv.addEventListener('pointerdown',move);cv.addEventListener('pointermove',move);
addEventListener('resize',()=>{if(IG.$('#v-2d').classList.contains('on'))fit()});

function start(){fit();items=[];score=0;lives=3;sp=0;run=true;ov.hidden=true;last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)}
function over(){run=false;cancelAnimationFrame(raf);const nb=score>best;if(nb){best=score;IG.lset('ig_best2d',best);IG.toast('New best: '+best)}
IG.addRecent('Light Catcher','2d','Score '+score);
t2.textContent='Game over';p2.textContent='You caught '+score+' lights. Best: '+best+'.';go.lastChild.textContent='Play again';ov.hidden=false}
function loop(now){if(!run)return;const dt=Math.min((now-last)/1000,.05);last=now;
sp-=dt;if(sp<=0){sp=Math.max(.35,.9-score*.012);items.push({x:30+Math.random()*(W-60),y:-20,v:140+score*3+Math.random()*60,g:Math.random()>.3,r:18})}
for(let i=items.length-1;i>=0;i--){const o=items[i];o.y+=o.v*dt;
if(o.y+o.r>=H-70&&o.y<=H-40&&Math.abs(o.x-px)<45+o.r*.6){items.splice(i,1);if(o.g)score++;else if(--lives<=0){draw();return over()}continue}
if(o.y>H+30)items.splice(i,1)}
draw();raf=requestAnimationFrame(loop)}
function draw(){const d=document.documentElement.classList.contains('dark'),g=cx.createLinearGradient(0,0,0,H);
g.addColorStop(0,d?'#0b1220':'#cfe3ff');g.addColorStop(1,d?'#1a2640':'#fff8e1');cx.fillStyle=g;cx.fillRect(0,0,W,H);
items.forEach(o=>{cx.beginPath();cx.arc(o.x,o.y,o.r,0,7);cx.fillStyle=o.g?'#fbbc04':'#455a64';if(o.g){cx.shadowColor='#fbbc04';cx.shadowBlur=18}cx.fill();cx.shadowBlur=0});
cx.fillStyle='#1a73e8';cx.beginPath();cx.roundRect?cx.roundRect(px-45,H-70,90,28,12):cx.rect(px-45,H-70,90,28);cx.fill();
cx.fillStyle=d?'#e8eaed':'#1f1f1f';cx.font='bold 20px Roboto,sans-serif';cx.textAlign='left';cx.fillText('Light: '+score,16,32);cx.textAlign='right';cx.fillText('Lives: '+lives,W-16,32)}
go.onclick=start;
window.Game2D={ready(){fit();if(!run){t2.textContent=score?'Game over':'Light Catcher';ov.hidden=false}},stop(){if(run){run=false;cancelAnimationFrame(raf);t2.textContent='Paused';p2.textContent='Score: '+score;go.lastChild.textContent='Restart';ov.hidden=false}}};
})();
