/* ==========================================================================
 * مدرن‌CRM — کمکی‌های بخش پشتیبانی (support.js)  →  window.SUP
 * --------------------------------------------------------------------------
 *  مشترک بین صفحات support-*.html:
 *    • co(code) / plan(no) / type(id) / status(id)        جستجو در داده‌ها
 *    • typeBadges(types) / statusBadge(st)                برچسب‌های نوع و وضعیت فرم
 *    • fill(select, list, placeholder)                    پرکردن select
 *    • pickCompany(cb)                                    مودال انتخاب شرکت (دکمه‌ی «…»)
 *    • viewPlan(no)                                       نمایش فقط‌خواندنی «برنامه کاری» + چاپ
 *    • flow(no)                                           گزارش «گردش فرم»
 *    • people(code) / perf(code) / file(code)             افراد مرتبط، عملکرد، پرونده مشتری
 *    • weekday(date) / daysLeft(date) / now()             کمکی‌های تاریخ
 *  نکته: همه‌ی داده‌ها نمایشی‌اند (CRM_DATA)؛ در نسخه‌ی واقعی از API خوانده می‌شوند.
 * ========================================================================== */
(function (w, d) {
  'use strict';
  var CRM = w.CRM, D = CRM.data, J = CRM.jalali, fa = CRM.fa, esc = CRM.esc;

  var TYPES = {}; D.supFormTypes.forEach(function (t) { TYPES[t.id] = t; });
  var STATUS = {}; D.supStatuses.forEach(function (t) { STATUS[t.id] = t; });
  var WEEK = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];

  function co(code) { code = +code; for (var i = 0; i < D.supCompanies.length; i++) if (D.supCompanies[i].code === code) return D.supCompanies[i]; return null; }
  function plan(no) { no = fa(String(no || '').trim()); for (var i = 0; i < D.supPlans.length; i++) if (D.supPlans[i].no === no) return D.supPlans[i]; return null; }
  function type(id) { return TYPES[id] || { title: id, tone: 'gray', icon: 'file' }; }
  function status(id) { return STATUS[id] || { title: id, tone: 'gray' }; }
  function tone(t) { return t === 'gray' ? '' : ' badge-' + t; }
  function typeBadges(types) {
    return (types || []).map(function (t) { var x = type(t); return '<span class="badge' + tone(x.tone) + '">' + esc(x.title) + '</span>'; }).join(' ');
  }
  function statusBadge(st) { var x = status(st); return '<span class="badge badge-dot' + tone(x.tone) + '">' + esc(x.title) + '</span>'; }
  function fill(sel, list, ph) {
    if (typeof sel === 'string') sel = d.querySelector(sel);
    if (!sel) return;
    sel.innerHTML = (ph !== undefined && ph !== null ? '<option value="">' + esc(ph) + '</option>' : '') +
      list.map(function (x) { var v = typeof x === 'object' ? x.v : x, t = typeof x === 'object' ? x.t : x; return '<option value="' + esc(v) + '">' + esc(t) + '</option>'; }).join('');
  }

  /* ------------------------------------------------ تاریخ */
  function key(s) { var o = J.parse(s); return o ? o.jy * 10000 + o.jm * 100 + o.jd : 0; }
  function weekday(s) { var o = J.parse(s); return o ? WEEK[J.toGregorian(o.jy, o.jm, o.jd).getDay()] : ''; }
  function daysLeft(s) {
    var o = J.parse(s); if (!o) return null;
    var a = J.toGregorian(o.jy, o.jm, o.jd), t = new Date(); t.setHours(0, 0, 0, 0);
    return Math.round((a - t) / 86400000);
  }
  function now() {
    var t = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; };
    var time = fa(p(t.getHours()) + ':' + p(t.getMinutes()));
    return { date: CRM.jDate(), time: time, at: CRM.jDate() + ' ' + time + fa(':' + p(t.getSeconds())) };
  }
  function addDays(s, n) {
    var o = J.parse(s); if (!o) return s;
    var g = J.toGregorian(o.jy, o.jm, o.jd); g.setDate(g.getDate() + n);
    return J.format(J.toJalali(g));
  }

  /* ------------------------------------------------ ساخت مودال */
  function modal(id, size, title, sub, body, foot) {
    /* هر بار یک overlay تازه (تا شنونده‌های رویداد دفعه‌ی قبل باقی نمانند) */
    var old = d.getElementById(id); if (old) old.remove();
    var ov = d.createElement('div'); ov.className = 'overlay'; ov.id = id; ov.style.display = 'none'; d.body.appendChild(ov);
    ov.innerHTML =
      '<div class="modal ' + (size || '') + '" role="dialog" aria-modal="true">' +
        '<div class="modal-head"><div><div class="modal-title">' + title + '</div>' + (sub ? '<div class="modal-sub">' + sub + '</div>' : '') + '</div>' +
        '<button class="tb-icon modal-x" data-modal-close="#' + id + '" data-icon="x" data-icon-size="18"></button></div>' +
        '<div class="modal-body">' + body + '</div>' +
        '<div class="modal-foot">' + (foot || '') + '<button type="button" class="btn" data-modal-close="#' + id + '">بستن</button></div>' +
      '</div>';
    CRM.init(ov);
    CRM.modal.open(ov);
    return ov;
  }
  function empty(msg, ic) {
    return '<div class="empty" style="padding:26px"><div class="empty-ic" data-icon="' + (ic || 'inbox') + '" data-icon-size="24"></div><div class="empty-desc">' + esc(msg) + '</div></div>';
  }
  function table(cols, rows, opt) {
    opt = opt || {};
    if (!rows.length) return empty(opt.empty || 'موردی ثبت نشده است.');
    return '<div class="table-wrap"><table class="table table-compact"><thead><tr>' + (opt.idx ? '<th class="num">ردیف</th>' : '') +
      cols.map(function (c) { return '<th' + (c.num ? ' class="num"' : '') + '>' + esc(c.t) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r, i) {
        return '<tr>' + (opt.idx ? '<td class="num text-muted">' + fa(i + 1) + '</td>' : '') + cols.map(function (c) {
          var v = typeof c.k === 'function' ? c.k(r) : esc(r[c.k] === undefined || r[c.k] === '' ? '—' : r[c.k]);
          return '<td' + (c.cls ? ' class="' + c.cls + '"' : '') + '>' + v + '</td>';
        }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>';
  }

  /* ------------------------------------------------ چاپ یک محتوای مستقل */
  function printHtml(title, html) {
    var css = ['tokens', 'base', 'components'].map(function (n) { return '<link rel="stylesheet" href="assets/css/' + n + '.css">'; }).join('');
    var win = w.open('', '_blank', 'width=1000,height=760');
    if (!win) { CRM.toast({ type: 'warning', title: 'پنجره‌ی چاپ باز نشد', msg: 'اجازه‌ی باز شدن پنجره‌ی جدید را در مرورگر بدهید.' }); return; }
    win.document.write('<!DOCTYPE html><html lang="fa" dir="rtl"><head><meta charset="UTF-8"><title>' + esc(title) + '</title>' + css +
      '<style>body{background:#fff;padding:18px}.rv-paper{box-shadow:none;max-width:none;padding:0}</style></head><body>' + html + '</body></html>');
    win.document.close();
    win.onload = function () { win.focus(); win.print(); };
  }
  function paperHead(title, sub) {
    return '<div class="rp-head"><div class="rp-brand"><span class="rp-logo">' + CRM.icon('headset', 18) + '</span><div class="fs-xs fw-700 text-strong">سامانه‌های بعد پنجم<div class="text-muted fw-400">بخش پشتیبانی</div></div></div>' +
      '<div class="rp-titles"><div class="rp-title">' + esc(title) + '</div>' + (sub ? '<div class="rp-sub">' + sub + '</div>' : '') + '</div>' +
      '<div class="rp-meta">تاریخ چاپ: <span class="num">' + esc(now().date) + '</span><br>کاربر: مدیر سامانه</div></div>';
  }

  /* ------------------------------------------------ انتخاب شرکت */
  var pickCb = null;
  function pickCompany(cb) {
    pickCb = cb;
    var id = 'supCompanyPicker', ov = d.getElementById(id);
    if (!ov) {
      ov = d.createElement('div'); ov.className = 'overlay'; ov.id = id; ov.style.display = 'none';
      ov.innerHTML =
        '<div class="modal modal-lg" role="dialog" aria-modal="true">' +
          '<div class="modal-head"><div><div class="modal-title">انتخاب شرکت</div><div class="modal-sub">جستجو در نام، کد یا تلفن شرکت</div></div>' +
          '<button class="tb-icon modal-x" data-modal-close="#' + id + '" data-icon="x" data-icon-size="18"></button></div>' +
          '<div class="modal-body" style="padding-top:6px">' +
            '<div class="input-wrap mb-3"><span class="icon lead" data-icon="search" data-icon-size="16"></span><input class="input" placeholder="مثلاً آریا گستر یا ۲۶" data-sp-search></div>' +
            '<div class="pick-list" style="padding:0;max-height:380px;overflow:auto" data-sp-list></div>' +
          '</div>' +
          '<div class="modal-foot"><button type="button" class="btn" data-modal-close="#' + id + '">انصراف</button></div>' +
        '</div>';
      d.body.appendChild(ov);
      var list = ov.querySelector('[data-sp-list]');
      var render = function (q) {
        q = String(q || '').trim();
        var rows = D.supCompanies.filter(function (c) { return !q || (c.name + ' ' + fa(c.code) + ' ' + c.phone).indexOf(fa(q)) > -1; });
        list.innerHTML = rows.length ? rows.map(function (c) {
          return '<button type="button" class="pick-item" data-sp-code="' + c.code + '">' + CRM.avatar(c.name.replace(/^(جناب آقای|سرکار خانم|شرکت)\s*/, ''), 34) +
            '<span class="pi-main"><span class="d-block fw-600 text-strong text-truncate">' + esc(c.name) + '</span>' +
            '<span class="pi-sub d-block text-truncate">کد <span class="num">' + fa(c.code) + '</span> · ' + esc(c.address) + '</span></span>' +
            '<span class="badge">' + esc(c.coop) + '</span></button>';
        }).join('') : empty('شرکتی با این مشخصات پیدا نشد.', 'search');
        CRM.renderIcons(list);
      };
      ov.querySelector('[data-sp-search]').addEventListener('input', CRM.debounce(function (e) { render(e.target.value); }, 120));
      list.addEventListener('click', function (e) {
        var b = e.target.closest('[data-sp-code]'); if (!b) return;
        CRM.modal.close(ov);
        if (pickCb) pickCb(co(b.getAttribute('data-sp-code')));
      });
      render('');
      CRM.init(ov);
    }
    var s = ov.querySelector('[data-sp-search]'); s.value = ''; s.dispatchEvent(new Event('input'));
    CRM.modal.open(ov);
    setTimeout(function () { s.focus(); }, 80);
  }
  /* اتصال یک input نام شرکت + دکمه‌ی «…» */
  function bindCompany(input, btn, onPick) {
    if (typeof input === 'string') input = d.querySelector(input);
    if (typeof btn === 'string') btn = d.querySelector(btn);
    btn.addEventListener('click', function () {
      pickCompany(function (c) { input.value = c.name; input.setAttribute('data-code', c.code); input.dispatchEvent(new Event('change', { bubbles: true })); if (onPick) onPick(c); });
    });
  }

  /* ------------------------------------------------ نمایش برنامه کاری */
  function kvRow(k, v) { return '<dt>' + esc(k) + '</dt><dd>' + (v === '' || v === null || v === undefined ? '<span class="text-muted">—</span>' : v) + '</dd>'; }
  function planSheet(p) {
    var c = co(p.company) || {};
    var checks = function (all, sel) { return all.map(function (x) { var on = sel.indexOf(x) > -1; return '<span class="sup-ck' + (on ? ' on' : '') + '">' + CRM.icon(on ? 'check' : 'minus', 12) + esc(x) + '</span>'; }).join(''); };
    return '<div class="sup-sheet">' +
      '<div class="sup-sheet-sec"><div class="sup-sheet-t">نوع فرم</div><div class="sup-cks">' + checks(D.supFormTypes.map(function (t) { return t.title; }), p.types.map(function (t) { return type(t).title; })) + '</div></div>' +
      '<div class="grid-2" style="gap:0 24px">' +
        '<dl class="kv sup-kv">' + kvRow('شماره فرم', '<span class="num fw-700">' + esc(p.no) + '</span>') + kvRow('هماهنگ کننده', esc(p.coord)) +
          kvRow('خریدار / طرف مذاکره', esc(c.name || '')) + kvRow('شخص هماهنگ شده', esc(p.person)) + kvRow('آدرس', esc(c.address || '')) + '</dl>' +
        '<dl class="kv sup-kv">' + kvRow('تاریخ ثبت فرم', '<span class="num">' + esc(p.created) + '</span>') + kvRow('تلفن', '<span class="num">' + esc(c.phone || '') + '</span>') +
          kvRow('موبایل', '<span class="num">' + esc(p.mobile) + '</span>') + kvRow('نحوه تسویه', esc(p.settle)) +
          kvRow('نحوه ارسال', esc(p.send) + (p.freight ? ' <span class="badge">' + (p.freight === 'post' ? 'پس کرایه' : 'پیش کرایه') + '</span>' : '')) + '</dl>' +
      '</div>' +
      '<div class="sup-sheet-sec"><div class="sup-sheet-t">جهت تسویه</div><div class="sup-cks">' + checks(D.supLists.settleDocs, p.docs) + checks(['صورت جلسه رسمی'], p.official ? ['صورت جلسه رسمی'] : []) + '</div></div>' +
      '<div class="sup-sheet-sec"><div class="sup-sheet-t">اقلام مربوط به فرم</div>' +
        table([{ t: 'نام محصول', k: 'product' }, { t: 'نوع کارتخوان', k: 'reader' }, { t: 'تعداد', k: function (r) { return '<span class="num">' + fa(r.qty) + '</span>'; }, num: 1, cls: 'num' }], p.items, { idx: 1, empty: 'قلمی برای این فرم ثبت نشده است.' }) + '</div>' +
      (p.plan ? '<div class="sup-sheet-sec"><div class="sup-sheet-t">زمان‌بندی</div><div class="d-flex flex-wrap gap-2">' +
        '<span class="badge badge-primary">' + CRM.icon('calendar-days', 12) + ' <span class="num">' + esc(weekday(p.plan.date) + ' ' + p.plan.date) + '</span></span>' +
        '<span class="badge badge-primary">' + CRM.icon('clock', 12) + ' <span class="num">' + esc(p.plan.time) + '</span></span>' +
        '<span class="badge">کارشناس: ' + esc(p.plan.expert) + '</span></div></div>' : '') +
      '<div class="sup-sheet-sec"><div class="sup-sheet-t">توضیحات</div><div class="fs-sm" style="line-height:1.9">' + (p.note ? esc(p.note) : '<span class="text-muted">—</span>') + '</div></div>' +
    '</div>';
  }
  function viewPlan(no) {
    var p = typeof no === 'object' ? no : plan(no); if (!p) return;
    var ov = modal('supPlanView', 'modal-lg', 'برنامه کاری <span class="num">' + esc(p.no) + '</span> ' + statusBadge(p.status), typeBadges(p.types) + ' · هماهنگ کننده: ' + esc(p.coord), planSheet(p),
      '<button type="button" class="btn btn-soft" data-sp-flow>' + CRM.icon('history', 15) + ' گردش فرم</button><span class="spacer"></span>' +
      '<button type="button" class="btn btn-primary" data-sp-print>' + CRM.icon('printer', 15) + ' چاپ</button>');
    ov.querySelector('[data-sp-print]').addEventListener('click', function () { printHtml('برنامه کاری ' + p.no, '<div class="rv-paper">' + paperHead('برنامه کاری', 'فرم شماره ' + p.no) + planSheet(p) + '</div>'); });
    ov.querySelector('[data-sp-flow]').addEventListener('click', function () { flow(p.no); });
  }

  /* ------------------------------------------------ گردش فرم */
  function flowPaper(p) {
    var c = co(p.company) || {};
    var rows = p.flow.length ? p.flow.map(function (f, i) {
      return '<tr><td class="rp-idx">' + fa(i + 1) + '</td><td class="t-num">' + esc(f.time || '') + '</td><td class="t-num">' + esc(f.date || '') + '</td><td class="t-wrap">' + esc(f.note || '') + '</td>' +
        '<td>' + esc(f.user) + '</td><td class="t-num">' + esc(f.at) + '</td><td style="text-align:center">' + statusBadge(f.st) + '</td></tr>';
    }).join('') : '<tr><td colspan="7" style="text-align:center;padding:20px" class="text-muted">این فرم هنوز ارسال نشده است.</td></tr>';
    return '<div class="rv-paper" style="min-height:0">' + paperHead('گردش فرم', typeBadges(p.types)) +
      '<div class="grid-2 mb-4" style="gap:0 28px"><dl class="kv sup-kv">' + kvRow('شرکت', esc(c.name || '')) + kvRow('آدرس', esc(c.address || '')) + kvRow('تلفن', '<span class="num">' + esc(c.phone || '') + '</span>') + '</dl>' +
      '<dl class="kv sup-kv">' + kvRow('شخص هماهنگ شده', esc(p.person)) + kvRow('شماره فرم', '<span class="num fw-700">' + esc(p.no) + '</span>') + kvRow('نوع فرم', esc(p.types.map(function (t) { return type(t).title; }).join('، '))) + '</dl></div>' +
      '<div class="rp-table-wrap"><table class="rp-table"><thead><tr><th>ردیف</th><th>ساعت هماهنگ شده</th><th>تاریخ هماهنگ شده</th><th>توضیحات</th><th>کاربر</th><th>تاریخ و زمان ثبت</th><th>وضعیت</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<div class="rp-foot"><span>تعداد مراحل: ' + fa(p.flow.length) + '</span><span>وضعیت فعلی: ' + esc(status(p.status).title) + '</span></div></div>';
  }
  function flow(no) {
    var p = typeof no === 'object' ? no : plan(no); if (!p) return;
    var ov = modal('supFlow', 'modal-xl', 'گردش فرم <span class="num">' + esc(p.no) + '</span>', 'سابقه‌ی ارسال، تأیید، چاپ و انجام فرم', '<div class="rv-stage" style="border-radius:var(--radius)">' + flowPaper(p) + '</div>',
      '<span class="spacer"></span><button type="button" class="btn btn-primary" data-sp-print>' + CRM.icon('printer', 15) + ' چاپ</button>');
    ov.querySelector('[data-sp-print]').addEventListener('click', function () { printHtml('گردش فرم ' + p.no, flowPaper(p)); });
  }

  /* ------------------------------------------------ افراد مرتبط */
  function people(code) {
    var c = co(code); if (!c) return;
    modal('supPeople', 'modal-xl', 'افراد مرتبط', esc(c.name) + ' · ' + fa(c.people.length) + ' نفر',
      table([{ t: 'نام', k: function (r) { return '<span class="fw-600 text-strong">' + esc(r.name) + '</span>'; } }, { t: 'واحد', k: 'unit' }, { t: 'سمت', k: 'role' },
        { t: 'تلفن ۱', k: function (r) { return r.tel1 ? '<span class="num ltr d-inline-block">' + esc(r.tel1) + '</span>' : '—'; } },
        { t: 'تلفن ۲', k: function (r) { return r.tel2 ? '<span class="num ltr d-inline-block">' + esc(r.tel2) + '</span>' : '—'; } },
        { t: 'موبایل', k: function (r) { return r.mobile ? '<span class="num ltr d-inline-block">' + esc(r.mobile) + '</span>' : '—'; } },
        { t: 'ایمیل', k: function (r) { return r.email ? '<span class="ltr d-inline-block fs-xs">' + esc(r.email) + '</span>' : '—'; } }], c.people, { idx: 1 }));
  }

  /* ------------------------------------------------ عملکرد (خدمات انجام‌شده برای یک شرکت) */
  function services(code) { return D.supServices.filter(function (s) { return s.company === +code; }).sort(function (a, b) { return b.at.localeCompare(a.at); }); }
  function perfPaper(c) {
    var list = services(c.code);
    var rows = list.length ? list.map(function (s, i) {
      return '<tr><td class="rp-idx">' + fa(i + 1) + '</td><td>' + esc(s.owner) + '</td><td>' + esc(s.kind) + '</td><td class="t-num">' + esc(s.at) + '</td><td>' + esc(s.expert) + '</td><td>' + esc(s.custExpert || '—') + '</td>' +
        '<td class="t-num">' + fa(s.minutes) + '</td><td>' + esc(s.status || '—') + '</td><td class="t-num">' + esc(s.follow || s.form || '—') + '</td><td class="t-wrap">' + esc(s.note) + '</td></tr>';
    }).join('') : '<tr><td colspan="10" style="text-align:center;padding:20px" class="text-muted">خدمتی برای این شرکت ثبت نشده است.</td></tr>';
    var total = list.reduce(function (a, s) { return a + s.minutes; }, 0);
    return '<div class="rv-paper" style="min-height:0">' + paperHead('گزارش عملکرد پشتیبانی', esc(c.name)) +
      '<dl class="kv sup-kv mb-4">' + kvRow('نام شرکت', esc(c.name)) + kvRow('آدرس', esc(c.address)) + kvRow('تلفن', '<span class="num">' + esc(c.phone) + '</span>') + '</dl>' +
      '<div class="rp-table-wrap"><table class="rp-table"><thead><tr><th>ردیف</th><th>مسئول پشتیبانی</th><th>نوع خدمات</th><th>تاریخ و زمان ثبت</th><th>کارشناس شرکت</th><th>کارشناس مشتری</th><th>زمان صرف شده (دقیقه)</th><th>وضعیت</th><th>پیگیری بعدی / شماره فرم</th><th>توضیحات</th></tr></thead><tbody>' + rows + '</tbody>' +
      (list.length ? '<tfoot><tr><td colspan="6">جمع</td><td class="t-num">' + fa(total) + '</td><td colspan="3"></td></tr></tfoot>' : '') + '</table></div></div>';
  }
  function perf(code) {
    var c = co(code); if (!c) return;
    var ov = modal('supPerf', 'modal-xl', 'عملکرد پشتیبانی', esc(c.name), '<div class="rv-stage" style="border-radius:var(--radius)">' + perfPaper(c) + '</div>',
      '<span class="spacer"></span><button type="button" class="btn btn-primary" data-sp-print>' + CRM.icon('printer', 15) + ' چاپ</button>');
    ov.querySelector('[data-sp-print]').addEventListener('click', function () { printHtml('عملکرد پشتیبانی', perfPaper(c)); });
  }

  /* ------------------------------------------------ پرونده مشتری */
  var FLAGS = [{ v: 'good', t: 'خوش حساب', tone: 'success' }, { v: 'bad', t: 'بد حساب', tone: 'danger' }, { v: 'rude', t: 'بد اخلاق', tone: 'warning' }, { v: 'nowarranty', t: 'بدون گارانتی', tone: 'gray' }, { v: 'nosupport', t: 'بدون پشتیبانی', tone: 'gray' }];
  function flagBadges(c) { return FLAGS.filter(function (f) { return c.flags.indexOf(f.v) > -1; }).map(function (f) { return '<span class="badge' + tone(f.tone) + '">' + f.t + '</span>'; }).join(' '); }
  function file(code, tab) {
    var c = co(code); if (!c) return;
    var forms = D.supPlans.filter(function (p) { return p.company === c.code; });
    var svc = services(c.code);
    var inp = function (lbl, v, span, cls) { return '<div class="form-group' + (span ? '" style="grid-column:span ' + span : '') + '"><label class="form-label">' + lbl + '</label><input class="input ' + (cls || '') + '" value="' + esc(v || '') + '"></div>'; };
    var tabBtn = function (id, ic, t, n) { return '<button type="button" class="tab' + (id === (tab || 'info') ? ' is-active' : '') + '" data-tab="' + id + '"><span data-icon="' + ic + '" data-icon-size="15"></span> ' + t + (n !== undefined ? ' <span class="badge">' + fa(n) + '</span>' : '') + '</button>'; };
    var panel = function (id, html) { return '<div class="sup-file-panel' + (id === (tab || 'info') ? '' : ' d-none') + '" data-tab-panel="' + id + '">' + html + '</div>'; };
    var info =
      '<div class="grid-4" style="gap:0 16px">' +
        inp('نام شرکت', c.name, 2) + inp('کارشناس شرکت', c.expert) + inp('مسئول فرم', c.owner) +
        inp('آدرس', c.address, 4) +
        inp('ایمیل', c.email, 1, 'ltr') + inp('تلفن ۱', c.phone, 1, 'num ltr') + inp('تلفن ۲', '', 1, 'num ltr') + '<div class="form-group"><label class="form-label">شرکت مرجع</label><select class="select" data-ref></select></div>' +
        inp('کد اقتصادی', c.econ, 1, 'num') + inp('کد پستی', c.postal, 1, 'num') + inp('شماره ثبت', c.reg, 1, 'num') + '<div class="form-group"><label class="form-label">نوع فاکتور</label><select class="select" data-inv></select></div>' +
        '<div class="form-group" style="grid-column:span 4"><label class="form-label">توضیحات</label><textarea class="textarea" rows="2" style="min-height:64px">' + esc(c.note) + '</textarea></div>' +
      '</div>' +
      '<div class="d-flex flex-wrap gap-4 items-center p-3" style="background:var(--surface-2);border-radius:var(--radius);border:1px solid var(--border-muted)">' +
        '<span class="fs-xs fw-600 text-muted">وضعیت مشتری:</span>' +
        FLAGS.map(function (f) { return '<label class="check"><input type="checkbox"' + (c.flags.indexOf(f.v) > -1 ? ' checked' : '') + '><span class="box"><span data-icon="check" data-icon-size="12"></span></span><span class="lbl">' + f.t + '</span></label>'; }).join('') +
      '</div>';
    var credit = function (r) { var n = daysLeft(r.credit); return '<span class="num' + (n !== null && n < 0 ? ' text-muted' : n !== null && n < 31 ? ' text-warning fw-600' : '') + '">' + esc(r.credit || '—') + '</span>'; };
    var devices = table([{ t: 'محصول', k: function (r) { return '<span class="ltr d-inline-block fw-600">' + esc(r.product) + '</span>'; } }, { t: 'شماره فاکتور', k: function (r) { return '<span class="num">' + esc(r.invoice || '—') + '</span>'; } },
      { t: 'سریال', k: function (r) { return '<span class="num">' + esc(r.serial) + '</span>'; } }, { t: 'تاریخ خروج', k: function (r) { return '<span class="num">' + esc(r.out) + '</span>'; } }, { t: 'نوع کارتخوان', k: 'reader' },
      { t: 'نوع خروج', k: 'type' }, { t: 'مسئول فرم', k: 'owner' }, { t: 'توضیحات', k: 'note' }, { t: 'تاریخ اعتبار', k: credit }], c.devices, { idx: 1 });
    var invoices = table([{ t: 'شماره فاکتور', k: function (r) { return '<span class="num fw-600">' + esc(r.no) + '</span>'; } }, { t: 'تاریخ فاکتور', k: function (r) { return '<span class="num">' + esc(r.date) + '</span>'; } }, { t: 'مسئول فعالیت', k: 'owner' }], c.invoices, { idx: 1 });
    var formsT = table([{ t: 'شماره فرم', k: function (r) { return '<button type="button" class="sup-link num fw-600" data-sp-view="' + esc(r.no) + '">' + esc(r.no) + '</button>'; } }, { t: 'نوع فرم', k: function (r) { return typeBadges(r.types); } },
      { t: 'نحوه ارسال', k: 'send' }, { t: 'هماهنگ کننده', k: 'coord' }, { t: 'وضعیت', k: function (r) { return statusBadge(r.status); } }], forms, { idx: 1, empty: 'فرمی برای این شرکت ثبت نشده است.' });
    var svcT = table([{ t: 'نوع خدمات', k: 'kind' }, { t: 'تاریخ و زمان ثبت', k: function (r) { return '<span class="num text-nowrap">' + esc(r.at) + '</span>'; } }, { t: 'کارشناس شرکت', k: 'expert' }, { t: 'زمان (دقیقه)', k: function (r) { return '<span class="num">' + fa(r.minutes) + '</span>'; }, num: 1, cls: 'num' }, { t: 'وضعیت', k: 'status' },
      { t: 'توضیحات', k: function (r) { return '<div style="max-width:360px;white-space:normal;line-height:1.8">' + esc(r.note) + '</div>'; } }], svc, { idx: 1, empty: 'خدمتی برای این شرکت ثبت نشده است.' });
    var files = table([{ t: 'نام فایل', k: function (r) { return '<span class="d-inline-flex items-center gap-2">' + CRM.icon('file', 15) + esc(r.name) + '</span>'; } }, { t: 'تاریخ ثبت', k: function (r) { return '<span class="num">' + esc(r.date) + '</span>'; } }, { t: 'ثبت کننده', k: 'by' }, { t: 'توضیحات', k: 'note' },
      { t: 'نمایش فایل', k: function () { return '<button type="button" class="btn btn-sm btn-soft" data-sp-file>' + CRM.icon('eye', 14) + ' نمایش</button>'; } }], c.files, { idx: 1 }) +
      '<div class="d-flex gap-2 mt-3"><button type="button" class="btn btn-sm" data-sp-upload>' + CRM.icon('upload', 14) + ' افزودن فایل</button></div>';
    var ov = modal('supFile', 'modal-xl', 'پرونده مشتری', 'کد <span class="num">' + fa(c.code) + '</span> · ' + esc(c.coop) + (c.flags.length ? ' · ' + flagBadges(c) : ''),
      '<div data-tabs-root><div class="tabs mb-4" data-tabs style="padding:0 0 8px">' + tabBtn('info', 'building', 'مشخصات') + tabBtn('devices', 'fingerprint', 'دستگاه‌ها', c.devices.length) + tabBtn('invoices', 'receipt', 'فاکتورها', c.invoices.length) +
        tabBtn('forms', 'clipboard', 'فرم‌ها', forms.length) + tabBtn('services', 'headset', 'خدمات', svc.length) + tabBtn('files', 'folder', 'فایل‌ها', c.files.length) + '</div>' +
        panel('info', info) + panel('devices', devices) + panel('invoices', invoices) + panel('forms', formsT) + panel('services', svcT) + panel('files', files) + '</div>',
      '<button type="button" class="btn btn-soft" data-sp-people>' + CRM.icon('users', 15) + ' افراد مرتبط</button><span class="spacer"></span>' +
      '<button type="button" class="btn btn-primary" data-sp-save>' + CRM.icon('check', 15) + ' ثبت تغییرات</button>');
    fill(ov.querySelector('[data-ref]'), D.supLists.refCompanies, '—'); ov.querySelector('[data-ref]').value = c.ref || '';
    fill(ov.querySelector('[data-inv]'), ['رسمی کامل', 'رسمی', 'غیررسمی']); ov.querySelector('[data-inv]').value = c.invType;
    ov.querySelector('.modal').style.maxWidth = '1180px';
    ov.addEventListener('click', function (e) {
      var v = e.target.closest('[data-sp-view]'); if (v) viewPlan(v.getAttribute('data-sp-view'));
      if (e.target.closest('[data-sp-file]')) CRM.toast({ type: 'info', title: 'نمایش فایل', msg: 'پیش‌نمایش فایل در نسخه‌ی نهایی از سرور خوانده می‌شود.' });
      if (e.target.closest('[data-sp-upload]')) CRM.toast({ type: 'info', title: 'افزودن فایل', msg: 'بارگذاری فایل در نسخه‌ی نهایی فعال می‌شود.' });
      if (e.target.closest('[data-sp-people]')) people(c.code);
      if (e.target.closest('[data-sp-save]')) { CRM.modal.close(ov); CRM.toast({ type: 'success', title: 'پرونده ذخیره شد', msg: c.name }); }
    });
  }

  w.SUP = {
    co: co, plan: plan, type: type, status: status, typeBadges: typeBadges, statusBadge: statusBadge, fill: fill, flags: FLAGS, flagBadges: flagBadges,
    key: key, weekday: weekday, daysLeft: daysLeft, now: now, addDays: addDays, services: services,
    modal: modal, table: table, empty: empty, printHtml: printHtml, paperHead: paperHead,
    pickCompany: pickCompany, bindCompany: bindCompany, viewPlan: viewPlan, planSheet: planSheet, flow: flow, people: people, perf: perf, file: file
  };
})(window, document);
