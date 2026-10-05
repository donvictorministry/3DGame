/* PLACEHOLDER - replace this whole file with your 3D game.
   Contract: define window.Game3D with:
     mount(container, IG)  - build your game inside container (called each time the 3D tab opens)
     unmount()             - stop loops, remove listeners (called when leaving the tab)
   IG gives you: IG.toast(msg), IG.addRecent(name,'3d',info), IG.confetti(), IG.ls/IG.lset */
window.Game3D={
  mount(el){el.innerHTML='<div class="ph"><h2>3D Game</h2><p>Your 3D game loads here. Replace game3d.js with your upload.</p></div>'},
  unmount(){}
};
