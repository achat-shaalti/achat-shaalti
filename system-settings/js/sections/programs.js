/* sections/programs.js - quick launcher for the allowed study programs (works in lock mode too) */
(function () {
  'use strict';
  var SS = (window.SS = window.SS || {});
  var ui = SS.ui;
  SS.sections = SS.sections || [];

  SS.sections.push({
    id: 'programs', title: 'תוכנות לימוד', icon: 'computer',
    mount: function (body) { body.innerHTML = ui.loading('טוען תוכנות…'); },
    load: load
  });

  /* #60: טאב מאוחד — רשימה מלאה (פתיחה/"העבר לחזית"/הוספה/הסרה/הצעות זיהוי) + מתג זיהוי אוטומטי */
  async function load(body) {
    var r, found = [];
    try { r = await SS.bridge.call('/kiosk/programs'); }
    catch (e) { body.innerHTML = ui.errorBox(e, function () { load(body); }); return; }
    var progs = r.programs || [];
    try { found = (await SS.bridge.call('/kiosk/programs/detect')).found || []; } catch (e) { found = []; }
    found = found.filter(function (f) { return !progs.some(function (p) { return p.path.toLowerCase() === f.path.toLowerCase(); }); });
    var auto = !!r.autoTorah, K = SS.kioskProg;
    var html = K ? K.card(progs, found, auto) : '';
    html += '<div class="card"><div class="setting-row"><div class="setting-text"><b>זיהוי אוטומטי של תוכנות תורניות</b><span class="muted">אוצר החכמה, בר אילן, כתבי הקודש, חבורתא, הנקדן, עדכוני אוצריא, עדכון ספרים אישיים ו-Word שנמצאים במחשב נוספים לרשימה מעצמם</span></div>' +
      ui.switchHtml('sw-auto', auto, 'זיהוי אוטומטי') + '</div></div>';
    var wr = !!r.allowWritable;
    html += '<div class="card"><div class="setting-row"><div class="setting-text"><b>תוכנות שמותקנות בתיקיית המשתמש</b><span class="muted">יש תוכנות (למשל כתבי הקודש) שמותקנות ב-AppData בלי אפשרות לבחור מיקום. ' +
      'כשהמתג דלוק — אפשר להוסיף אותן ולזהות אותן אוטומטית. הקובץ ננעץ (טביעה ומפרסם) ונבדק בכל פתיחה, אבל תיקייה שהמשתמש יכול לכתוב אליה פחות מוגנת מ-Program Files.</span></div>' +
      ui.switchHtml('sw-writable', wr, 'תוכנות בתיקיית המשתמש') + '</div></div>';
    body.innerHTML = html;
    body.querySelector('#sw-writable').addEventListener('click', async function () {
      var ok = await ui.dialog({
        title: wr ? 'רק תוכנות בתיקייה מוגנת' : 'לאפשר תוכנות בתיקיית המשתמש', icon: 'computer',
        body: '<p>' + (wr ? 'תוכנות חדשות יתקבלו רק מתיקייה שרק מנהל יכול לכתוב אליה (Program Files). תוכנות שכבר ברשימה יישארו.' : 'תוכנות שמותקנות בתיקיית המשתמש (כמו כתבי הקודש) יתקבלו לרשימה ולזיהוי האוטומטי. הקובץ ייבדק בכל פתיחה מול הטביעה שנשמרה.') + '</p>',
        fields: [{ name: 'pw', label: 'סיסמת נעילה', type: 'password', dir: 'ltr' }],
        actions: [{ label: 'ביטול', value: false }, { label: wr ? 'כיבוי' : 'הדלקה', value: true, kind: 'primary' }],
        validate: function (x) { return x.pw ? '' : 'יש להקליד את סיסמת הנעילה'; },
        onSubmit: async function (x) { await SS.bridge.call('/kiosk/programs/writable', { password: x.pw, enabled: !wr }, { timeoutMs: 30000 }); return true; }
      });
      if (ok) { ui.toast('נשמר', 'success'); load(body); }
    });
    body.querySelector('#sw-auto').addEventListener('click', function () { if (SS.kioskToggleAuto) SS.kioskToggleAuto(body, auto, load); });
    function on(act, fn) { var b = body.querySelector('[data-act="' + act + '"]'); if (b) b.addEventListener('click', fn); }
    if (!K) return;
    on('prog-add', function () { K.add(body, {}, load); });
    found.forEach(function (f, i) { on('prog-found-' + i, function () { K.add(body, f, load); }); });
    progs.forEach(function (p) {
      on('prog-open-' + p.id, function () { K.open(p); setTimeout(function () { load(body); }, 3000); });
      on('prog-del-' + p.id, function () { K.remove(body, p, load); });
      on('prog-close-' + p.id, function () { /* מנהל משימות פשוט */
        SS.bridge.call('/kiosk/programs/close', { id: p.id }).then(function () { ui.toast('התוכנה נסגרת…', 'success'); setTimeout(function () { load(body); }, 3500); },
          function (err) { ui.toast(ui.errText(err), 'error'); });
      });
    });
  }
})();
