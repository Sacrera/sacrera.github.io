/* sacrera.com — the live Seed of Life in the hero, and the bells of one eyes-closed round. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* bells: 432 Hz, struck, synthesized in the page */
  let ctx;
  function bell(delay = 0) {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      const t0 = ctx.currentTime + delay;
      const out = ctx.createGain();
      out.gain.value = 0.22;
      out.connect(ctx.destination);
      [[1, 0.6, 5], [2.01, 0.28, 3.2], [2.76, 0.2, 2.6], [4.07, 0.1, 1.6], [5.4, 0.06, 1.1]].forEach(([m, g, d]) => {
        const o = ctx.createOscillator(), v = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = 432 * m;
        v.gain.setValueAtTime(0.0001, t0);
        v.gain.exponentialRampToValueAtTime(g, t0 + 0.008);
        v.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
        o.connect(v).connect(out);
        o.start(t0);
        o.stop(t0 + d + 0.05);
      });
    } catch (e) { /* no sound: the words still lead the round */ }
  }

  const live = document.querySelector('.live');
  if (!live) return;
  const seed = live.querySelector('.seed');
  const inks = [...seed.querySelectorAll('.ink')];
  const compass = seed.querySelector('.compass');
  const say = live.querySelector('.say');
  const count = live.querySelector('.count');
  const roundBtn = live.querySelector('.round');
  const againBtn = live.querySelector('.again');
  const lens = inks.map((c) => 2 * Math.PI * +c.getAttribute('r') + 1);
  let step = 0, busy = false, inRound = false;

  const LINES = [
    'The first circle. Tap again: the compass moves to the top of it.',
    'Two circles, and between them the Vesica Piscis. Keep going clockwise.',
    'Each new circle starts where the last one crosses the first.',
    'Halfway. The petals are starting to show.',
    'Two more. Notice how the circles find each other.',
    'Six petals now meet at the center. One last circle holds them all.',
  ];

  const moveCompass = (x, y) => { compass.style.transform = `translate(${x}px, ${y}px)`; };

  function reset() {
    step = 0; busy = false; inRound = false;
    live.classList.remove('bloom', 'eyes-closed');
    inks.forEach((c, i) => {
      c.style.transition = 'none';
      c.style.strokeDasharray = lens[i];
      c.style.strokeDashoffset = lens[i];
      c.classList.remove('now');
    });
    compass.style.display = '';
    moveCompass(0, 0);
    count.textContent = 'Step 1 of 8';
    roundBtn.hidden = true; againBtn.hidden = true;
    seed.setAttribute('aria-label', 'Draw the next circle of the Seed of Life');
    say.textContent = 'Tap the gold point. That is where the compass goes, and the next circle follows.';
  }

  function draw() {
    if (busy || inRound || step > 7) return;
    busy = true;
    const c = inks[step];
    c.classList.add('now');
    c.style.transition = reduce ? 'none' : `stroke-dashoffset ${step === 7 ? 1.6 : 1.1}s cubic-bezier(.45,.05,.3,1)`;
    requestAnimationFrame(() => { c.style.strokeDashoffset = 0; });
    const done = step;
    setTimeout(() => {
      c.classList.remove('now');
      step = done + 1;
      busy = false;
      if (step < 8) {
        if (step === 7) moveCompass(0, 0);
        else moveCompass(+inks[step].getAttribute('cx'), +inks[step].getAttribute('cy'));
        count.textContent = `Step ${step + 1} of 8`;
        say.textContent = step === 7
          ? 'Open the compass wide, to the far edge of a petal circle. Tap to draw the last one.'
          : LINES[step - 1];
      } else {
        compass.style.display = 'none';
        live.classList.add('bloom');
        count.textContent = 'The Seed of Life';
        seed.setAttribute('aria-label', 'The finished Seed of Life');
        say.textContent = 'Look at it for a few breaths. Then close your eyes and keep seeing it.';
        roundBtn.hidden = false;
      }
    }, reduce ? 50 : (done === 7 ? 1650 : 1150));
  }

  function round() {
    if (inRound) return;
    inRound = true;
    roundBtn.hidden = true;
    bell(0);
    say.textContent = 'One bell. Close your eyes now, and see the shape in your mind.';
    setTimeout(() => live.classList.add('eyes-closed'), 900);
    setTimeout(() => {
      bell(0); bell(0.75);
      live.classList.remove('eyes-closed');
      say.textContent = 'Two bells. Open your eyes. Was it still there? In the app this is one round of three, and the shape grows clearer each time.';
      againBtn.hidden = false;
      inRound = false;
    }, 10900);
  }

  seed.addEventListener('click', draw);
  seed.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); draw(); } });
  roundBtn.addEventListener('click', round);
  againBtn.addEventListener('click', reset);
  reset();
})();

