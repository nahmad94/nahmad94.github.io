/**
 * Contact form -> Google Sheet + email notification
 * ------------------------------------------------
 * Setup (about 10 minutes):
 * 1. Create a Google Sheet named "Website leads".
 * 2. In the Sheet: Extensions > Apps Script. Delete the sample code and paste this whole file.
 * 3. Change NOTIFY_EMAIL below if you want alerts somewhere else.
 * 4. Click Deploy > New deployment > type "Web app".
 *      Execute as: Me    |    Who has access: Anyone
 *    Approve the permissions prompt (it is your own script).
 * 5. Copy the Web app URL into assets/js/config.js -> form.sheetsUrl, and set form.provider to "sheets".
 * If you edit this script later: Deploy > Manage deployments > Edit > New version (the URL stays the same).
 */
const NOTIFY_EMAIL = 'deevan11@gmail.com';
const COLUMNS = ['submitted', 'source', 'reason', 'name', 'email', 'company', 'message', 'page'];

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p._gotcha) return ContentService.createTextOutput('ok'); // spam honeypot

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);
  sheet.appendRow(COLUMNS.map(function (c) { return String(p[c] || '').slice(0, 5000); }));

  const subject = '[' + (p.source || 'Website') + '] ' + (p.reason || 'Message') + ' from ' + (p.name || 'unknown');
  const body = (p.message || '') + '\n\n' + (p.name || '') + (p.company ? ', ' + p.company : '') + '\n' + (p.email || '') + '\n\nSent from ' + (p.page || '');
  MailApp.sendEmail({ to: NOTIFY_EMAIL, subject: subject, body: body, replyTo: p.email || NOTIFY_EMAIL });

  return ContentService.createTextOutput('ok');
}
