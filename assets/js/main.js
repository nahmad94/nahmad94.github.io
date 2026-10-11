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
