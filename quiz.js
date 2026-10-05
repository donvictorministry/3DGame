(() => {
  const IG = window.IG;
  if (!IG) { console.error('IG framework not found'); return; }
  const box = IG.$('#quizBox');
  if (!box) { console.error('#quizBox not found'); return; }
  const K = 'ig_quiz';
  const Q_TIME = 25;
  const VERSE_TIME = 5000;

  // 5 sessions · 5 questions · full verse + reference per question
  const S = [
    { n:'The Basics', qs:[
      ['How many books are in the Old Testament?',['27','39','66','46'],1,
        'All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness.','2 Timothy 3:16'],
      ['Who built the ark?',['Moses','Noah','Abraham','David'],1,
        'So make yourself an ark of cypress wood; make rooms in it and coat it with pitch inside and out.','Genesis 6:14'],
      ['In which town was Jesus born?',['Nazareth','Jerusalem','Bethlehem','Capernaum'],2,
        'So Joseph also went up from the town of Nazareth in Galilee to Judea, to Bethlehem the town of David, because he belonged to the house and line of David.','Luke 2:4'],
      ['What is the first book of the Bible?',['Exodus','Genesis','Psalms','Matthew'],1,
        'In the beginning God created the heavens and the earth.','Genesis 1:1'],
      ['How many disciples did Jesus choose?',['7','10','12','40'],2,
        'When morning came, he called his disciples to him and chose twelve of them, whom he also designated apostles.','Luke 6:13']
    ]},
    { n:'People', qs:[
      ['Which giant did David defeat?',['Goliath','Samson','Og','Nimrod'],0,
        'So David triumphed over the Philistine with a sling and a stone; without a sword in his hand he struck down the Philistine and killed him.','1 Samuel 17:50'],
      ['Who was swallowed by a great fish?',['Elijah','Daniel','Jonah','Moses'],2,
        'Now the Lord provided a huge fish to swallow Jonah, and Jonah was in the belly of the fish three days and three nights.','Jonah 1:17'],
      ['Who led Israel out of Egypt?',['Joshua','Moses','Aaron','Samuel'],1,
        'So now, go. I am sending you to Pharaoh to bring my people the Israelites out of Egypt.','Exodus 3:10'],
      ['Who is called the Apostle to the Gentiles?',['Peter','John','Paul','James'],2,
        'I am talking to you Gentiles. Inasmuch as I am the apostle to the Gentiles, I take pride in my ministry.','Romans 11:13'],
      ["Who was thrown into the lions' den?",['Daniel','Joseph','Elijah','Isaiah'],0,
        'So the king gave the order, and they brought Daniel and threw him into the lions\u2019 den. The king said to Daniel, \u201cMay your God, whom you serve continually, rescue you!\u201d','Daniel 6:16']
    ]},
    { n:'Events', qs:[
      ['In how many days did God create before resting?',['Five','Six','Seven','Ten'],1,
        'By the seventh day God had finished the work he had been doing; so on the seventh day he rested from all his work.','Genesis 2:2'],
      ['How many plagues struck Egypt?',['7','10','12','40'],1,
        'The Lord said to Moses, \u201cPharaoh will not listen to you, so that my wonders may be multiplied in Egypt.\u201d The ten plagues revealed God\u2019s power over Egypt\u2019s gods.','Exodus 7\u201312'],
      ['Where did Jesus turn water into wine?',['Cana','Bethany','Jericho','Emmaus'],0,
        'What Jesus did here in Cana of Galilee was the first of the signs through which he revealed his glory; and his disciples believed in him.','John 2:11'],
      ['How many days did Jesus fast in the wilderness?',['7','12','40','3'],2,
        'After fasting forty days and forty nights, he was hungry.','Matthew 4:2'],
      ['Whose walls fell after Israel marched around them?',['Jericho','Ai','Babylon','Nineveh'],0,
        'When the trumpets sounded, the army shouted, and at the sound of the trumpet, when the men gave a loud shout, the wall collapsed; so everyone charged straight in, and they took the city.','Joshua 6:20']
    ]},
    { n:'Scripture', qs:[
      ['Which is the longest chapter in the Bible?',['Psalm 23','Psalm 119','Genesis 1','Isaiah 53'],1,
        'Blessed are those whose ways are blameless, who walk according to the law of the Lord.','Psalm 119:1'],
      ['Where is the verse "Jesus wept" found?',['Matthew 5','John 11','Mark 4','Acts 2'],1,
        'Jesus wept.','John 11:35'],
      ['What is the last book of the Bible?',['Jude','Revelation','Malachi','Acts'],1,
        'The grace of the Lord Jesus be with God\u2019s people. Amen.','Revelation 22:21'],
      ['Which book lists the fruit of the Spirit?',['Galatians','Romans','James','Ephesians'],0,
        'But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. Against such things there is no law.','Galatians 5:22\u201323'],
      ['Which Psalm begins "The Lord is my shepherd"?',['Psalm 1','Psalm 23','Psalm 91','Psalm 100'],1,
        'The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.','Psalm 23:1\u20133']
    ]},
    { n:'Mixed', qs:[
      ['Who was the first king of Israel?',['David','Saul','Solomon','Samuel'],1,
        'Then Samuel took a flask of olive oil and poured it on Saul\u2019s head and kissed him, saying, \u201cHas not the Lord anointed you ruler over his inheritance?\u201d','1 Samuel 10:1'],
      ['Who betrayed Jesus?',['Peter','Thomas','Judas Iscariot','Philip'],2,
        'But Jesus asked him, \u201cJudas, are you betraying the Son of Man with a kiss?\u201d','Luke 22:48'],
      ['Which king built the first temple?',['Solomon','Hezekiah','Josiah','Ahab'],0,
        'In the four hundred and eightieth year after the Israelites came out of Egypt, in the fourth year of Solomon\u2019s reign over Israel, he began to build the temple of the Lord.','1 Kings 6:1'],
      ['Who was the mother of Jesus?',['Martha','Mary','Elizabeth','Ruth'],1,
        'You will conceive and give birth to a son, and you are to call him Jesus. He will be great and will be called the Son of the Most High.','Luke 1:31\u201332'],
      ['How many days was Jesus in the tomb before rising?',['Two','Three','Seven','Forty'],1,
        'For what I received I passed on to you as of first importance: that Christ died for our sins according to the Scriptures, that he was buried, that he was raised on the third day according to the Scriptures.','1 Corinthians 15:3\u20134']
    ]}
  ];

  let st = IG.ls(K, {}) || {};
  let si, qi, sc, deck, locked, tick, remaining, verseTO;

  const ic = n => `<svg class="i"><use href="#i-${n}"/></svg>`;
  const sh = a => {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.random() * (i + 1) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const clearAll = () => { clearInterval(tick); clearTimeout(verseTO); };

  function menu() {
    clearAll();
    box.innerHTML = `<p class="sub">5 sessions of 5 questions. Score 4 or more to win a badge. Score 5 for gold.</p><div class="grid">` +
      S.map((s, i) => {
        const b = st[i];
        return `<button class="sess" data-s="${i}"><span class="bd ${b >= 5 ? 'gold' : b >= 4 ? 'won' : ''}">${ic('star')}</span><b>Session ${i + 1}</b><span>${s.n}</span><span>${b == null ? 'Not played' : 'Best: ' + b + '/5'}</span></button>`;
      }).join('') + `</div>`;
  }

  function play(i) {
    clearAll();
    si = i;
    qi = 0;
    sc = 0;
    deck = sh(S[i].qs).map(q => ({
      t: q[0],
      v: q[3],
      vr: q[4],
      o: sh(q[1].map((t, k) => ({ t, c: k === q[2] })))
    }));
    ask();
  }

  function ask() {
    clearAll();
    locked = false;
    const q = deck[qi];
    box.innerHTML =
      `<p class="sub">Session ${si + 1} - Question ${qi + 1} of 5 · <b id="tm">${Q_TIME}s</b></p>` +
      `<div class="bar2"><i style="width:${qi * 20}%"></i></div>` +
      `<h3 class="q">${q.t}</h3>` +
      q.o.map((o, i) => `<button class="opt" data-o="${i}">${o.t}</button>`).join('') +
      `<p id="fb" class="fb"></p><div id="nx"></div>`;
    startTimer();
  }

  function startTimer() {
    remaining = Q_TIME;
    const el = IG.$('#tm');
    if (el) el.textContent = remaining + 's';
    tick = setInterval(() => {
      remaining--;
      const t = IG.$('#tm');
      if (t) t.textContent = remaining + 's';
      if (remaining <= 0) {
        clearInterval(tick);
        if (!locked) answer(-1);
      }
    }, 1000);
  }

  function answer(idx) {
    if (locked) return;
    locked = true;
    clearInterval(tick);
    const q = deck[qi];
    let ok = false;
    box.querySelectorAll('.opt').forEach((el, i) => {
      el.disabled = true;
      if (q.o[i].c) { el.classList.add('ok'); if (i === idx) ok = true; }
      else if (i === idx) el.classList.add('no');
    });
    if (ok) sc++;
    const fb = IG.$('#fb');
    if (fb) {
      fb.textContent = idx < 0 ? 'Time up! The right answer is highlighted.' : ok ? 'Correct!' : 'Not quite. The right answer is highlighted.';
      fb.className = 'fb ' + (ok ? 'g' : 'r');
    }
    showVerse(q);
  }

  function showVerse(q) {
    const ov = document.createElement('div');
    ov.className = 'ov';
    ov.style.cssText = 'background:rgba(0,0,0,.72);z-index:10;padding:28px;text-align:center';
    ov.innerHTML =
      `<div class="card" style="max-width:560px;width:100%;background:var(--sf);color:var(--tx);text-align:left">` +
        `<p class="role" style="margin:0 0 8px;color:var(--p);font-weight:600">${q.vr}</p>` +
        `<p style="line-height:1.5;margin:0 0 14px">${q.v}</p>` +
        `<div class="bar2" style="margin:0"><i style="width:100%;transition:width ${VERSE_TIME}ms linear"></i></div>` +
      `</div>`;
    box.style.position = 'relative';
    box.appendChild(ov);
    requestAnimationFrame(() => {
      const bar = ov.querySelector('.bar2 i');
      if (bar) bar.style.width = '0%';
    });
    verseTO = setTimeout(() => {
      ov.remove();
      qi++;
      qi < 5 ? ask() : done();
    }, VERSE_TIME);
  }

  function done() {
    clearAll();
    const win = sc >= 4;
    st[si] = Math.max(st[si] ?? 0, sc);
    IG.lset(K, st);
    if (IG.addRecent) IG.addRecent('Bible Quiz \u00b7 ' + S[si].n, 'quiz', sc + '/5');
    if (win) {
      if (IG.confetti) IG.confetti();
      if (IG.toast) IG.toast(sc >= 5 ? 'Perfect score! \ud83c\udfc6' : 'Badge earned! \ud83c\udf89');
    }
    box.innerHTML =
      `<div class="res">` +
        `<div class="bd big ${sc >= 5 ? 'gold' : win ? 'won' : ''}">${ic('star')}</div>` +
        `<h2>${win ? (sc >= 5 ? 'Perfect score!' : 'You won!') : 'Keep going!'}</h2>` +
        `<p class="sub">You scored ${sc} out of 5.${win ? ' Badge earned.' : ' Score 4 or more to earn the badge.'}</p>` +
        (win && si < 4 ? `<button class="btn" data-s="${si + 1}">Next session</button>` : '') +
        `<button class="btn ${win && si < 4 ? 't' : ''}" data-a="retry">Play again</button>` +
        `<button class="btn t" data-a="menu">All sessions</button>` +
      `</div>`;
  }

  box.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.s != null) return play(+b.dataset.s);
    if (b.dataset.o != null) return answer(+b.dataset.o);
    const a = b.dataset.a;
    if (a === 'retry') play(si);
    else if (a === 'menu') menu();
  });

  menu();
})();