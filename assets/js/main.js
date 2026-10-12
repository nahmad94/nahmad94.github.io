(function () {
  var cfg = window.SITE_CONFIG || {};
  document.documentElement.classList.add('js');

  // Fill every link marked data-link="resume|linkedin|personal-email|acg-email"
  var map = {
    'resume': /^https?:\/\//.test(cfg.resumeUrl || '') ? cfg.resumeUrl : null,
    'linkedin': cfg.linkedinUrl,
    'personal-email': cfg.personalEmail ? 'mailto:' + cfg.personalEmail : null,
    'acg-email': cfg.acgEmail ? 'mailto:' + cfg.acgEmail : null
  };
  document.querySelectorAll('[data-link]').forEach(function (a) {
    var url = map[a.getAttribute('data-link')];
    if (url) a.setAttribute('href', url);
  });
  document.querySelectorAll('[data-text]').forEach(function (el) {
    var key = el.getAttribute('data-text');
    if (key === 'personal-email' && cfg.personalEmail) el.textContent = cfg.personalEmail;
    if (key === 'acg-email' && cfg.acgEmail) el.textContent = cfg.acgEmail;
  });

  // Highlighter swipe: one orchestrated moment when a ledger scrolls into view
  var ledgers = document.querySelectorAll('.ledger');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('inked'); io.unobserve(e.target); }
      });
    }, { threshold: 0.35 });
    ledgers.forEach(function (l) { io.observe(l); });
  } else {
    ledgers.forEach(function (l) { l.classList.add('inked'); });
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

/* Stage chart in the home page hero (sample data, drawn once on load) */
(function () {
  var cv = document.getElementById('stage-chart');
  if (!cv || !cv.getContext) return;
  var css = getComputedStyle(document.documentElement);
  var tok = function (n) { return css.getPropertyValue(n).trim(); };
  var C = { p: tok('--pressure'), r: tok('--rate'), c: tok('--prop'), grid: tok('--rule'), ink: tok('--ink-2'), mono: tok('--mono') };
  var N = 360, T = 90;
  function noise(i) { var x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); }
  var data = [];
  for (var i = 0; i <= N; i++) {
    var m = i / N * T, rate, pres, prop = 0;
    if (m < 4) rate = m / 4 * 80;
    else if (m < 78) rate = 80 + (noise(i) - 0.5) * 1.6;
    else if (m < 84) rate = 80 - (m - 78) / 6 * 80;
    else rate = 0;
    if (m < 3.2) pres = 1200 + m / 3.2 * 8200;
    else if (m < 6) pres = 9400 - (m - 3.2) / 2.8 * 1500;
    else if (m < 78) pres = 7900 - (m - 6) * 6 + Math.sin(m / 4) * 120 + (noise(i + 7) - 0.5) * 160;
    else if (m < 84) pres = 7470 - (m - 78) / 6 * 2600;
    else pres = 4870 - (m - 84) * 90;
    if (m >= 10 && m < 74) prop = Math.min(3, 0.5 + Math.floor((m - 10) / 8) * 0.5);
    data.push({ m: m, rate: rate, pres: pres, prop: prop });
  }
  var ctx = cv.getContext('2d');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var progress = reduce ? 1 : 0, t0 = null;
  function draw() {
    var dpr = window.devicePixelRatio || 1, W = cv.clientWidth, H = cv.clientHeight;
    if (!W || !H) return;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    var L = 52, R = 40, Tp = 14, B = 30, w = W - L - R, h = H - Tp - B;
    var X = function (m) { return L + m / T * w; };
    var YP = function (p) { return Tp + h - p / 10000 * h; };
    var YR = function (r) { return Tp + h - r / 125 * h; };
    var YC = function (c) { return Tp + h - c / 4 * h; };
    ctx.font = '11px ' + C.mono; ctx.fillStyle = C.ink; ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
    for (var k = 0; k <= 5; k++) {
      var y = Tp + h - k / 5 * h;
      ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(L + w, y); ctx.stroke();
      ctx.textAlign = 'right'; ctx.fillText((k * 2000).toLocaleString(), L - 6, y + 4);
      ctx.textAlign = 'left'; ctx.fillText(k * 25, L + w + 6, y + 4);
    }
    for (var mm = 0; mm <= T; mm += 15) { ctx.textAlign = 'center'; ctx.fillText(mm, X(mm), Tp + h + 18); }
    ctx.textAlign = 'left'; ctx.fillText('min', L + w + 6, Tp + h + 18);
    var upto = Math.max(1, Math.floor(progress * N));
    function line(fn, color, width, step) {
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath();
      for (var j = 0; j <= upto; j++) {
        var x = X(data[j].m), yy = fn(data[j]);
        if (j === 0) ctx.moveTo(x, yy);
        else if (step) { ctx.lineTo(x, fn(data[j - 1])); ctx.lineTo(x, yy); }
        else ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
    line(function (d) { return YC(d.prop); }, C.c, 1.5, true);
    line(function (d) { return YR(d.rate); }, C.r, 1.8, false);
    line(function (d) { return YP(d.pres); }, C.p, 2, false);
    var last = data[upto];
    ctx.fillStyle = C.p; ctx.beginPath(); ctx.arc(X(last.m), YP(last.pres), 3.5, 0, Math.PI * 2); ctx.fill();
  }
  function tick(ts) { if (t0 === null) t0 = ts; progress = Math.min(1, (ts - t0) / 3200); draw(); if (progress < 1) requestAnimationFrame(tick); }
  if (reduce) draw(); else requestAnimationFrame(tick);
  window.addEventListener('resize', draw);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
})();
