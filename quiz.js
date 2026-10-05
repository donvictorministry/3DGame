(() => {
  const IG = window.IG;
  if (!IG) { console.error('IG framework not found'); return; }
  const box = IG.$('#quizBox');
  if (!box) { console.error('#quizBox not found'); return; }
  const K = 'ig_quiz';

  const S = [
    { n: 'The Basics', qs: [
      ['How many books are in the Old Testament?', ['27','39','66','46'], 1],
      ['Who built the ark?', ['Moses','Noah','Abraham','David'], 1],
      ['In which town was Jesus born?', ['Nazareth','Jerusalem','Bethlehem','Capernaum'], 2],
      ['What is the first book of the Bible?', ['Exodus','Genesis','Psalms','Matthew'], 1],
      ['How many disciples did Jesus choose?', ['7','10','12','40'], 2]
    ]},
    { n: 'People', qs: [
      ['Which giant did David defeat?', ['Goliath','Samson','Og','Nimrod'], 0],
      ['Who was swallowed by a great fish?', ['Elijah','Daniel','Jonah','Moses'], 2],
      ['Who led Israel out of Egypt?', ['Joshua','Moses','Aaron','Samuel'], 1],
      ['Who is called the Apostle to the Gentiles?', ['Peter','John','Paul','James'], 2],
      ['Who was thrown into the lions\' den?', ['Daniel','Joseph','Elijah','Isaiah'], 0]
    ]},
    { n: 'Events', qs: [
      ['In how many days did God create before resting?', ['Five','Six','Seven','Ten'], 1],
      ['How many plagues struck Egypt?', ['7','10','12','40'], 1],
      ['Where did Jesus turn water into wine?', ['Cana','Bethany','Jericho','Emmaus'], 0],
      ['How many days did Jesus fast in the wilderness?', ['7','12','40','3'], 2],
      ['Whose walls fell after Israel marched around them?', ['Jericho','Ai','Babylon','Nineveh'], 0]
    ]},
    { n: 'Scripture', qs: [
      ['Which is the longest chapter in the Bible?', ['Psalm 23','Psalm 119','Genesis 1','Isaiah 53'], 1],
      ['Where is the verse "Jesus wept" found?', ['Matthew 5','John 11','Mark 4','Acts 2'], 1],
      ['What is the last book of the Bible?', ['Jude','Revelation','Malachi','Acts'], 1],
      ['Which book lists the fruit of the Spirit?', ['Galatians','Romans','James','Ephesians'], 0],
      ['Which Psalm begins "The Lord is my shepherd"?', ['Psalm 1','Psalm 23','Psalm 91','Psalm 100'], 1]
    ]},
    { n: 'Mixed', qs: [
      ['Who was the first king of Israel?', ['David','Saul','Solomon','Samuel'], 1],
      ['Who betrayed Jesus?', ['Peter','Thomas','Judas Iscariot','Philip'], 2],
      ['Which king built the first temple?', ['Solomon','Hezekiah','Josiah','Ahab'], 0],
      ['Who was the mother of Jesus?', ['Martha','Mary','Elizabeth','Ruth'], 1],
      ['How many days was Jesus in the tomb before rising?', ['Two','Three','Seven','Forty'], 1]
    ]}
  ];

  let st = IG.ls(K, {}) || {};
  let si, qi, sc, qs, locked;

  const ic = n => `<svg class="i"><use href="#i-${n}"/></svg>`;
  const sh = a => {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.random() * (i + 1) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  function menu() {
    box.innerHTML = `<p class="sub">5 sessions of 5 questions. Score 4 or more to win a badge. Score 5 for gold.</p><div class="grid">` +
      S.map((s, i) => {
        const b = st[i];
        return `<button class="sess" data-s="${i}"><span class="bd ${b >= 5 ? 'gold' : b >= 4 ? 'won' : ''}">${ic('star')}</span><b>Session ${i + 1}</b><span>${s.n}</span><span>${b == null ? 'Not played' : 'Best: ' + b + '/5'}</span></button>`;
      }).join('') + `</div>`;
  }

  function play(i) {
    si = i;
    qi = 0;
    sc = 0;
    qs = sh(S[i].qs.map(q => ({
      t: q[0],
      o: sh(q[1].map((t, k) => ({ t, c: k === q[2] })))
    })));
    ask();
  }

  function ask() {
    locked = false;
    const q = qs[qi];
    box.innerHTML = `<p class="sub">Session ${si + 1} - Question ${qi + 1} of 5</p><div class="bar2"><i style="width:${qi * 20}%"></i></div><h3 class="q">${q.t}</h3>` +
      q.o.map((o, i) => `<button class="opt" data-o="${i}">${o.t}</button>`).join('') +
      `<p id="fb" class="fb"></p><div id="nx"></div>`;
  }

  function done() {
    const win = sc >= 4;
    st[si] = Math.max(st[si] ?? 0, sc);
    IG.lset(K, st);
    if (IG.addRecent) IG.addRecent('Bible Quiz - Session ' + (si + 1), 'quiz', sc + '/5');
    if (win) {
      if (IG.confetti) IG.confetti();
      if (IG.toast) IG.toast('You won Session ' + (si + 1) + '!');
    }
    box.innerHTML = `<div class="res"><div class="bd big ${sc >= 5 ? 'gold' : win ? 'won' : ''}">${ic('star')}</div><h2>${win ? (sc >= 5 ? 'Perfect score!' : 'You won!') : 'Keep going!'}</h2><p class="sub">You scored ${sc} out of 5.${win ? ' Badge earned.' : ' Score 4 or more to earn the badge.'}</p>` +
      (win && si < 4 ? `<button class="btn" data-s="${si + 1}">Next session</button>` : '') +
      `<button class="btn ${win && si < 4 ? 't' : ''}" data-a="retry">Play again</button><button class="btn t" data-a="menu">All sessions</button></div>`;
  }

  box.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.s != null) return play(+b.dataset.s);
    if (b.dataset.o != null) {
      if (locked) return;
      locked = true;
      const q = qs[qi], ok = q.o[+b.dataset.o].c;
      box.querySelectorAll('.opt').forEach((x, i) => {
        x.disabled = true;
        if (q.o[i].c) x.classList.add('ok');
      });
      if (ok) sc++; else b.classList.add('no');
      const fb = IG.$('#fb');
      fb.textContent = ok ? 'Correct!' : 'Not quite. The right answer is highlighted.';
      fb.className = 'fb ' + (ok ? 'g' : 'r');
      IG.$('#nx').innerHTML = `<button class="btn" data-a="next">${qi < 4 ? 'Next question' : 'See result'}</button>`;
      return;
    }
    const a = b.dataset.a;
    if (a === 'next') { qi++; qi < 5 ? ask() : done(); }
    else if (a === 'retry') play(si);
    else if (a === 'menu') menu();
  });

  menu();
})();