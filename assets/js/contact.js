(function () {
  var cfg = window.SITE_CONFIG || {};
  var form = cfg.form || {};
  var ctx = window.CONTACT_CTX || 'personal';
  var el = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  var reason = document.getElementById('f-reason');
  if (!el) return;
  if (ctx === 'acg') reason.value = 'Consulting project';
  document.querySelectorAll('.yr').forEach(function (n) { n.textContent = new Date().getFullYear(); });

  function say(msg, kind) { status.textContent = msg; status.className = 'form-status ' + (kind || ''); }
  function toAddr() { return ctx === 'acg' ? cfg.acgEmail : cfg.personalEmail; }

  function collect() {
    return {
      name: el.name.value.trim(),
      email: el.email.value.trim(),
      company: el.company.value.trim(),
      reason: el.reason.value,
      message: el.message.value.trim(),
      source: ctx === 'acg' ? 'ACG site' : 'Personal site',
      page: location.href,
      submitted: new Date().toISOString()
    };
  }

  function viaMailto(d) {
    var subject = (ctx === 'acg' ? 'ACG inquiry' : 'Website message') + ': ' + d.reason;
    var body = d.message + '\n\n' + d.name + (d.company ? ', ' + d.company : '') + '\n' + d.email;
    location.href = 'mailto:' + toAddr() + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    return Promise.resolve('mailto');
  }

  function viaSheets(d) {
    // Apps Script web apps don't return CORS headers, so send as a simple request and trust delivery.
    var body = new URLSearchParams(d);
    return fetch(form.sheetsUrl, { method: 'POST', mode: 'no-cors', body: body }).then(function () { return 'sent'; });
  }

  function loadEmailJs() {
    if (window.emailjs) return Promise.resolve();
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
      s.onload = function () { window.emailjs.init({ publicKey: form.emailjs.publicKey }); res(); };
      s.onerror = rej; document.head.appendChild(s);
    });
  }
  function viaEmailJs(d) {
    return loadEmailJs().then(function () {
      return window.emailjs.send(form.emailjs.serviceId, form.emailjs.templateId, d);
    }).then(function () { return 'sent'; });
  }

  el.addEventListener('submit', function (e) {
    e.preventDefault();
    if (el._gotcha && el._gotcha.value) return; // bot filled the hidden field
    var d = collect();
    if (!d.name || !d.email || !d.message) { say('Add your name, email and a message, then send again.', 'err'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) { say('Check the email address. It should look like name@company.com.', 'err'); return; }

    var p = form.provider;
    if (p === 'sheets' && !form.sheetsUrl) console.warn('Contact form: sheetsUrl is empty in assets/js/config.js, using email fallback.');
    var send = (p === 'sheets' && form.sheetsUrl) ? viaSheets
             : (p === 'emailjs' && form.emailjs && form.emailjs.publicKey) ? viaEmailJs
             : viaMailto;

    var btn = el.querySelector('button'); btn.disabled = true;
    if (send !== viaMailto) say('Sending...');
    send(d).then(function (r) {
      if (r === 'mailto') { say('Your email app should open with the message filled in. If it does not, email ' + toAddr() + ' directly.', 'ok'); return; }
      el.reset(); if (ctx === 'acg') reason.value = 'Consulting project';
      say('Message sent. You will get a reply within two business days.', 'ok');
    }).catch(function () {
      say('The message did not send. Email ' + toAddr() + ' directly instead.', 'err');
    }).finally(function () { btn.disabled = false; });
  });
})();
