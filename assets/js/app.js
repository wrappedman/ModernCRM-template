/*!
 * ============================================================================
 *  ModernCRM · app.js — هسته رابط کاربری
 *  شامل: ابزارهای کمکی، تم روشن/تیره، پوسته برنامه (سایدبار، تاپ‌بار، نوار وظیفه)،
 *  اجزای تعاملی (مودال، دراور، تب، آکاردئون، توست، پالت فرمان) و موتور نمودار SVG
 * ============================================================================
 */
window.CRM = (function (w, d) {
  'use strict';

  var DATA = w.CRM_DATA || {};

  /* ==========================================================================
   *  1) ابزارهای کمکی
   * ========================================================================== */
  function $(sel, root) { return (root || d).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || d).querySelectorAll(sel)); }

  var FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  var AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

  function fa(v) {
    if (v === null || v === undefined) return '';
    return String(v).replace(/[0-9]/g, function (c) { return FA_DIGITS[+c]; })
      .replace(/[٠-٩]/g, function (c) { return FA_DIGITS[AR_DIGITS.indexOf(c)]; });
  }
  function en(v) {
    return String(v === null || v === undefined ? '' : v)
      .replace(/[۰-۹]/g, function (c) { return FA_DIGITS.indexOf(c); })
      .replace(/[٠-٩]/g, function (c) { return AR_DIGITS.indexOf(c); });
  }
  function num(n, digits) {
    var x = typeof n === 'string' ? Number(en(n).replace(/[^\d.-]/g, '')) : n;
    if (isNaN(x)) return fa(n);
    return new Intl.NumberFormat('fa-IR', {
      minimumFractionDigits: digits || 0,
      maximumFractionDigits: digits === undefined ? 0 : digits
    }).format(x);
  }
  function money(n, withUnit) {
    var s = num(n) + (withUnit === false ? '' : ' تومان');
    return s;
  }
  function moneyShort(n) {
    var v = Number(n) || 0;
    if (v >= 1e9) return num(v / 1e9, 1) + ' میلیارد';
    if (v >= 1e6) return num(v / 1e6, 1) + ' میلیون';
    if (v >= 1e3) return num(v / 1e3, 1) + ' هزار';
    return num(v);
  }
  function pct(n) { return fa(n); }

  /* تاریخ شمسی بر پایه Intl (تقویم فارسی) */
  var JParts = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric', month: 'numeric', day: 'numeric' });
  var JFull = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  var JWeekday = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
  var JMonthNames = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
  var JWeekNames = ['شنبه', 'یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];

  function jParts(date) {
    var p = JParts.formatToParts(date || new Date());
    var o = {};
    p.forEach(function (x) { if (x.type !== 'literal') o[x.type] = x.value; });
    return { day: Number(en(o.day)), month: Number(en(o.month)), year: Number(en(o.year)), monthName: o.month };
  }
  function jDate(date) { var o = jParts(date); return fa(o.year) + '/' + fa(pad(o.month)) + '/' + fa(pad(o.day)); }
  function jLong(date) { return JFull.format(date || new Date()); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function jsWeekday(date) { return JWeekNames[(date.getDay() + 1) % 7]; } /* شنبه=۰ */
  function todayJalali() { return jParts(new Date()); }

  /* شبکه ماه شمسی برای صفحه تقویم (بدون وابستگی خارجی) */
  function jalaliMonthGrid(year, month) {
    var today = new Date();
    var start = new Date(today.getTime() - 200 * 864e5);
    var out = [], seen = false;
    for (var i = 0; i < 400; i++) {
      var day = new Date(start.getTime() + i * 864e5);
      var p = jParts(day);
      if (p.year === year && p.month === month && !seen) seen = true;
      if (seen) {
        if (p.year !== year || p.month !== month) break;
        out.push({ date: day, day: p.day, weekday: (day.getDay() + 1) % 7, isToday: sameDay(day, today) });
      }
    }
    return out;
  }
  function sameDay(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }

  function rel(date) {
    var diff = (new Date(date).getTime() - Date.now()) / 1000;
    var rtf = new Intl.RelativeTimeFormat('fa', { numeric: 'auto' });
    var abs = Math.abs(diff);
    if (abs < 60) return rtf.format(Math.round(diff), 'second');
    if (abs < 3600) return rtf.format(Math.round(diff / 60), 'minute');
    if (abs < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
    if (abs < 604800) return rtf.format(Math.round(diff / 86400), 'day');
    return jDate(date);
  }

  /* ------------------------------------------------------------------
   * تبدیل دقیق جلالی ⇄ میلادی (الگوریتم jalaali-js — بدون وابستگی)
   * ------------------------------------------------------------------ */
  var jalali = (function () {
    var BREAKS = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
    function div(a, b) { return ~~(a / b); }
    function mod(a, b) { return a - ~~(a / b) * b; }
    function jalCal(jy) {
      var gy = jy + 621, leapJ = -14, jp = BREAKS[0], jm, jump = 0, leap, leapG, march, n, i;
      for (i = 1; i < BREAKS.length; i++) {
        jm = BREAKS[i]; jump = jm - jp;
        if (jy < jm) break;
        leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
        jp = jm;
      }
      n = jy - jp;
      leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
      if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;
      leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
      march = 20 + leapJ - leapG;
      if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
      leap = mod(mod(n + 1, 33) - 1, 4);
      if (leap === -1) leap = 4;
      return { leap: leap, gy: gy, march: march };
    }
    function g2d(gy, gm, gd) {
      var x = div((gy + div(gm - 8, 6) + 100100) * 1461, 4) + div(153 * mod(gm + 9, 12) + 2, 5) + gd - 34840408;
      return x - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
    }
    function d2g(jdn) {
      var j = 4 * jdn + 139361631;
      j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
      var i = div(mod(j, 1461), 4) * 5 + 308;
      var gd = div(mod(i, 153), 5) + 1, gm = mod(div(i, 153), 12) + 1;
      return { gy: div(j, 1461) - 100100 + div(8 - gm, 6), gm: gm, gd: gd };
    }
    function j2d(jy, jm, jd) { var r = jalCal(jy); return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1; }
    function d2j(jdn) {
      var gy = d2g(jdn).gy, jy = gy - 621, r = jalCal(jy), k = jdn - g2d(gy, 3, r.march);
      if (k >= 0) {
        if (k <= 185) return { jy: jy, jm: 1 + div(k, 31), jd: mod(k, 31) + 1 };
        k -= 186;
      } else { jy -= 1; k += 179; if (r.leap === 1) k += 1; }
      return { jy: jy, jm: 7 + div(k, 30), jd: mod(k, 30) + 1 };
    }
    function isLeap(jy) { return jalCal(jy).leap === 0; }
    function monthLength(jy, jm) { return jm <= 6 ? 31 : jm <= 11 ? 30 : (isLeap(jy) ? 30 : 29); }
    function toGregorian(jy, jm, jd) { var g = d2g(j2d(jy, jm, jd)); return new Date(g.gy, g.gm - 1, g.gd); }
    function toJalali(date) { date = date || new Date(); return d2j(g2d(date.getFullYear(), date.getMonth() + 1, date.getDate())); }
    /* «۱۴۰۵/۰۷/۲۰» ⇄ {jy, jm, jd} */
    function parse(str) {
      var m = String(en(str || '')).match(/(\d{4})\D(\d{1,2})\D(\d{1,2})/);
      if (!m) return null;
      var o = { jy: +m[1], jm: +m[2], jd: +m[3] };
      if (o.jm < 1 || o.jm > 12 || o.jd < 1 || o.jd > monthLength(o.jy, o.jm)) return null;
      return o;
    }
    function format(o) { return fa(o.jy) + '/' + fa(pad(o.jm)) + '/' + fa(pad(o.jd)); }
    return { toGregorian: toGregorian, toJalali: toJalali, monthLength: monthLength, isLeap: isLeap, parse: parse, format: format };
  })();

  function esc(s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function debounce(fn, wait) {
    var t; return function () { var a = arguments, self = this; clearTimeout(t); t = setTimeout(function () { fn.apply(self, a); }, wait || 200); };
  }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function uid(p) { return (p || 'id') + '-' + Math.random().toString(36).slice(2, 8); }

  /* آیکون */
  function icon(name, size, cls) {
    if (w.Icons) return w.Icons.svg(name, { size: size || 18, cls: cls || '' });
    return '';
  }
  function renderIcons(scope) {
    $$('[data-icon]', scope || d).forEach(function (el) {
      if (el.getAttribute('data-icon-done') === '1') return;
      /* متن کنار آیکون (مثل <div class="card-title" data-icon="table"> عنوان</div>) حفظ می‌شود */
      var txt = el.getAttribute('data-icon-text');
      /* عنصر دارای فرزند (مثل <div data-icon="x"> <span id="title">…</span></div>): آیکون به ابتدا اضافه و فرزندان حفظ می‌شوند */
      if (txt === null && el.children.length && !el.querySelector('svg')) {
        el.insertAdjacentHTML('afterbegin', icon(el.getAttribute('data-icon'), +(el.getAttribute('data-icon-size') || 18), el.getAttribute('data-icon-class') || ''));
        el.setAttribute('data-icon-done', '1');
        return;
      }
      if (txt === null) { txt = el.children.length ? '' : el.textContent.trim(); if (txt) el.setAttribute('data-icon-text', txt); }
      el.innerHTML = icon(el.getAttribute('data-icon'), +(el.getAttribute('data-icon-size') || 18), el.getAttribute('data-icon-class') || '') +
        (txt ? '<span class="icon-text">' + esc(txt) + '</span>' : '');
      el.setAttribute('data-icon-done', '1');
    });
  }
  function avatar(name, size, cls) {
    var initials = String(name || '؟').trim().split(/\s+/).slice(0, 2).map(function (x) { return x.charAt(0); }).join('');
    var palette = ['', 'sky', 'violet', 'amber', 'rose'];
    var i = 0; for (var k = 0; k < String(name).length; k++) i += String(name).charCodeAt(k);
    var tone = palette[i % palette.length];
    var bg = {
      '': 'background:var(--brand-soft);color:var(--brand)',
      sky: 'background:var(--info-soft);color:var(--info)',
      violet: 'background:rgba(139,92,246,.14);color:var(--violet-500)',
      amber: 'background:var(--warning-soft);color:var(--warning)',
      rose: 'background:var(--danger-soft);color:var(--rose-500)'
    }[tone];
    return '<span class="avatar ' + (cls || '') + '" style="' + bg + (size ? ';--size:' + size + 'px' : '') + '">' + esc(fa(initials)) + '</span>';
  }

  /* ==========================================================================
   *  2) تولتیپ سراسری
   *  همه‌ی منوها، دکمه‌ها و عناصر [data-tip] به‌صورت خودکار تولتیپ می‌گیرند.
   *  تولتیپ در یک لایه‌ی مشترک روی <body> ساخته می‌شود تا هرگز زیر پنل‌ها
   *  نرود یا توسط کادرها بریده/پنهان نشود.
   * ========================================================================== */
  var tip = (function () {
    var el = null, target = null, showTimer = null, hideTimer = null;
    /* هر عنصری که «تولتیپ‌پذیر» است: منوها، دکمه‌ها، تب‌ها، آیتم‌های جدول و… */
    var TIP_SELECTOR = 'button, a.btn, a.tb-icon, .nav-item, .dropdown-item, .chip, .tab, .seg, .task-item, .tray-btn, .task-start, .start-app, .cal-cell, .pagination button, .list-item, [data-tip]';
    /* برای دکمه‌های فقط-آیکون، نام آیکون به برچسب فارسی تبدیل می‌شود
       تا هیچ دکمه‌ای بدون tooltip نماند. */
    var ICON_LABEL = {
      'more': 'گزینه‌های بیشتر', 'more-horizontal': 'گزینه‌های بیشتر', 'more-vertical': 'گزینه‌های بیشتر',
      'x': 'بستن', 'circle-x': 'بستن', 'trash': 'حذف', 'pencil': 'ویرایش', 'edit': 'ویرایش',
      'eye': 'مشاهده', 'search': 'جستجو', 'copy': 'کپی', 'files': 'کپی', 'download': 'دانلود',
      'upload': 'بارگذاری', 'plus': 'افزودن', 'minus': 'کاستن', 'refresh': 'به‌روزرسانی',
      'chevron-right': 'بعدی', 'chevron-left': 'قبلی', 'chevron-down': 'باز کردن', 'chevron-up': 'بستن',
      'arrow-right': 'بعدی', 'arrow-left': 'قبلی', 'invoice': 'فاکتور', 'receipt': 'رسید',
      'filter': 'فیلتر', 'list-filter': 'فیلتر فهرست', 'sliders': 'تنظیمات نمایش',
      'bell': 'اعلان‌ها', 'message': 'پیام‌ها', 'messages': 'پیام‌ها', 'mail': 'ایمیل',
      'settings': 'تنظیمات', 'user': 'کاربر', 'users': 'کاربران', 'print': 'چاپ',
      'share': 'اشتراک‌گذاری', 'link': 'پیوند', 'external-link': 'باز کردن در پنجره تازه',
      'calendar': 'تقویم', 'clock': 'زمان', 'phone': 'تماس', 'star': 'نشان‌گذاری',
      'check': 'تأیید', 'check-circle': 'تأیید', 'lock': 'قفل', 'key': 'کلید',
      'maximize': 'بزرگ‌نمایی', 'minimize': 'کوچک‌کردن', 'move': 'جابه‌جایی', 'grip-vertical': 'جابه‌جایی',
      'layout-grid': 'چیدمان شبکه‌ای', 'list': 'نمایش فهرستی', 'table': 'نمایش جدولی',
      'sun': 'روشن', 'palette': 'رنگ‌ها', 'send': 'ارسال', 'paperclip': 'پیوست',
      'archive': 'بایگانی', 'tag': 'برچسب', 'wallet': 'مالی', 'chart-line': 'نمودار',
      'help-circle': 'راهنما', 'circle-help': 'راهنما', 'info': 'اطلاعات', 'alert': 'هشدار',
      'menu': 'منو', 'window': 'پنجره', 'layers': 'لایه‌ها', 'grid': 'شبکه', 'star-off': 'برداشتن نشان'
    };

    function node() {
      if (!el) {
        el = d.createElement('div');
        el.className = 'tip';
        el.setAttribute('role', 'tooltip');
        d.body.appendChild(el);
      }
      return el;
    }

    function iconName(t) {
      var own = t.getAttribute('data-icon');
      if (own) return own;
      var child = t.querySelector('[data-icon]');
      if (child) return child.getAttribute('data-icon');
      /* نوع دکمه‌های استاندارد */
      if (t.classList.contains('modal-x') || t.closest('.modal-x')) return 'x';
      return '';
    }

    function label(t) {
      var text = t.getAttribute('data-tip');
      if (!text) {
        var aria = t.getAttribute('aria-label');
        if (aria) text = aria;
      }
      if (!text) {
        var alt = t.querySelector('img[alt]');
        if (alt) text = alt.getAttribute('alt');
      }
      if (!text) {
        var raw = (t.textContent || '').replace(/\s+/g, ' ').trim();
        /* اگر متن دکمه فقط آیکون/عدد/نماد است، از نام آیکون استفاده کن */
        var meaningful = raw.replace(/[\u200c\s۰-۹0-9٪%._,،\-–—()/]+/g, '');
        if (raw && meaningful.length >= 2) text = raw.length > 56 ? raw.slice(0, 53) + '…' : raw;
      }
      if (!text) {
        /* دکمه‌های نمادی مثل ± و × در فرم‌ها */
        var sym = (t.textContent || '').trim();
        var SYM = { '−': 'کاهش تعداد', '-': 'کاهش تعداد', '+': 'افزایش تعداد', '×': 'حذف', '✕': 'بستن', '؟': 'راهنما' };
        if (SYM[sym]) text = SYM[sym];
      }
      if (!text) {
        var digits = (t.textContent || '').replace(/\s+/g, ' ').trim();
        if (/^[۰-۹0-9]+$/.test(digits)) {
          text = t.closest('.pagination') ? 'صفحه ' + digits : digits;
        }
      }
      if (!text) text = ICON_LABEL[iconName(t)] || '';
      return text || '';
    }

    function tippable(t) {
      if (!t || t.closest('[data-no-tip]')) return null;
      var owner = t.closest('[data-tip]');
      if (owner) return owner;
      if (!t.matches(TIP_SELECTOR)) return null;
      /* دکمه‌های خیلی بزرگ (مثل کل یک کارت) تولتیپ نمی‌گیرند */
      var r = t.getBoundingClientRect();
      if (r.height > 90 || r.width > 380) return null;
      return t;
    }

    function place(t) {
      var n = node();
      n.textContent = label(t);
      if (!n.textContent) { hide(true); return; }
      var pos = t.getAttribute('data-tip-pos') || 'top';
      var r = t.getBoundingClientRect();
      var nr = n.getBoundingClientRect();
      var gap = 9;
      var x, y;
      var fitsTop = r.top - nr.height - gap > 6;
      var fitsBottom = r.bottom + nr.height + gap < w.innerHeight - 6;
      if (pos === 'top' && !fitsTop && fitsBottom) pos = 'bottom';
      else if (pos === 'bottom' && !fitsBottom && fitsTop) pos = 'top';
      if (pos === 'left') {
        if (r.left - nr.width - gap < 6) pos = 'right';
      } else if (pos === 'right') {
        if (r.right + nr.width + gap > w.innerWidth - 6) pos = 'left';
      }
      if (pos === 'left') { x = r.left - nr.width - gap; y = r.top + r.height / 2 - nr.height / 2; }
      else if (pos === 'right') { x = r.right + gap; y = r.top + r.height / 2 - nr.height / 2; }
      else if (pos === 'bottom') { x = r.left + r.width / 2 - nr.width / 2; y = r.bottom + gap; }
      else { x = r.left + r.width / 2 - nr.width / 2; y = r.top - nr.height - gap; }
      x = Math.max(6, Math.min(x, w.innerWidth - nr.width - 6));
      y = Math.max(6, Math.min(y, w.innerHeight - nr.height - 6));
      n.setAttribute('data-pos', pos);
      n.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)';
      n.classList.add('is-on');
      w.dispatchEvent(new CustomEvent('crm:tip', { detail: { target: t } }));
    }

    function hide(now) {
      clearTimeout(showTimer);
      if (target) target.removeAttribute('aria-describedby');
      target = null;
      if (now) {
        if (el) el.classList.remove('is-on');
        return;
      }
      hideTimer = setTimeout(function () { if (el) el.classList.remove('is-on'); }, 70);
    }

    function show(t) {
      clearTimeout(hideTimer);
      if (target === t) return;
      hide(true);
      target = t;
      var n = node();
      n.textContent = label(t);           /* برای اندازه‌گیری قبل از نمایش */
      n.classList.add('is-on');
      n.style.transform = 'translate(-9999px,-9999px)';
      requestAnimationFrame(function () { if (target === t) place(t); });
      if (n.textContent) n.setAttribute('id', 'crmTip');
      if (n.textContent) { t.setAttribute('aria-describedby', 'crmTip'); }
    }

    function fromEvent(e) {
      var t = e.target;
      if (!t || !t.closest) return;
      var hit = tippable(t);
      if (!hit) { if (target) hide(); return; }
      if (hit === target) return;
      clearTimeout(showTimer);
      var delay = hit.hasAttribute('data-tip') ? 40 : 260;   /* متن‌های صریح سریع‌تر از متن‌های استنباطی */
      showTimer = setTimeout(function () { show(hit); }, delay);
    }

    d.addEventListener('mouseover', fromEvent);
    d.addEventListener('mouseout', function (e) {
      if (!target) return;
      if (target.contains(e.target) && (e.relatedTarget && target.contains(e.relatedTarget))) return;
      hide();
    });
    d.addEventListener('focusin', fromEvent);
    d.addEventListener('focusout', function () { hide(); });
    d.addEventListener('click', function () { hide(true); }, true);
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(true); });
    w.addEventListener('scroll', function () { hide(true); }, true);
    w.addEventListener('resize', function () { hide(true); });
    /* اگر کاربر با انگشت (لمس) کار می‌کند، تولتیپ روی هاور نمایش داده نمی‌شود */
    if (w.matchMedia && w.matchMedia('(hover: none)').matches) {
      d.addEventListener('touchstart', function () { hide(true); }, { passive: true });
    }

    return { show: show, hide: hide, label: label };
  })();

  /* ==========================================================================
   *  3) توست (پیام شناور)
   * ========================================================================== */
  function toast(opts) {
    opts = typeof opts === 'string' ? { msg: opts } : (opts || {});
    var wrap = $('#toastWrap');
    if (!wrap) { wrap = d.createElement('div'); wrap.className = 'toast-wrap'; wrap.id = 'toastWrap'; d.body.appendChild(wrap); }
    var type = opts.type || 'info';
    var ic = { success: 'check-circle', danger: 'x-circle', warning: 'alert', info: 'info' }[type] || 'info';
    var toneStyle = { success: 'color:var(--success)', danger: 'color:var(--danger)', warning: 'color:var(--warning)', info: 'color:var(--info)' }[type];
    var el = d.createElement('div');
    el.className = 'toast ' + type;
    el.innerHTML =
      '<span class="toast-ic" style="' + toneStyle + '">' + icon(ic, 20) + '</span>' +
      '<div class="flex-1">' +
        '<div class="toast-title">' + esc(opts.title || '') + '</div>' +
        (opts.msg ? '<div class="toast-msg">' + esc(opts.msg) + '</div>' : '') +
      '</div>' +
      '<button class="toast-x" data-toast-close>' + icon('x', 15) + '</button>';
    wrap.appendChild(el);
    var kill = function () {
      el.classList.add('closing');
      setTimeout(function () { el.remove(); }, 180);
    };
    el.querySelector('[data-toast-close]').addEventListener('click', kill);
    setTimeout(kill, opts.duration || 4200);
    return el;
  }

  /* ==========================================================================
   *  4) مودال / دراور
   * ========================================================================== */
  var modal = {
    open: function (target) {
      var el = typeof target === 'string' ? $(target) : target;
      if (!el) return;
      var overlay = el.classList.contains('overlay') ? el : el.closest('.overlay');
      if (!overlay) return;
      overlay.classList.remove('closing');
      overlay.style.display = 'grid';
      d.body.style.overflow = 'hidden';
      init(overlay);
      var focusable = overlay.querySelector('input,select,textarea,button');
      if (focusable && !overlay.hasAttribute('data-no-autofocus')) setTimeout(function () { focusable.focus(); }, 60);
      return overlay;
    },
    close: function (target) {
      var el = target ? (typeof target === 'string' ? $(target) : target) : $('.overlay[style*="grid"]') || $('.overlay');
      if (!el) return;
      var overlay = el.classList.contains('overlay') ? el : el.closest('.overlay');
      if (!overlay) return;
      overlay.classList.add('closing');
      setTimeout(function () {
        overlay.style.display = 'none';
        overlay.classList.remove('closing');
        if (!$('.overlay[style*="grid"]')) d.body.style.overflow = '';
      }, 150);
    },
    confirm: function (opts) {
      opts = opts || {};
      return new Promise(function (resolve) {
        var ov = d.createElement('div');
        ov.className = 'overlay';
        ov.style.display = 'grid';
        ov.innerHTML =
          '<div class="modal modal-sm" role="dialog" aria-modal="true">' +
            '<div class="modal-body text-center">' +
              '<div class="modal-icon ' + (opts.tone || 'warn') + '">' + icon(opts.icon || 'alert', 26) + '</div>' +
              '<div class="fs-xl fw-700 text-strong mb-2">' + esc(opts.title || 'آیا مطمئن هستید؟') + '</div>' +
              '<div class="fs-md text-muted">' + esc(opts.msg || '') + '</div>' +
            '</div>' +
            '<div class="modal-foot">' +
              '<button class="btn btn-primary ' + (opts.danger ? 'btn-danger' : '') + '" data-ok>' + esc(opts.okText || 'بله، انجام بده') + '</button>' +
              '<button class="btn" data-cancel>' + esc(opts.cancelText || 'انصراف') + '</button>' +
            '</div>' +
          '</div>';
        d.body.appendChild(ov);
        var done = function (v) { ov.remove(); d.body.style.overflow = ''; resolve(v); };
        ov.querySelector('[data-ok]').addEventListener('click', function () { done(true); });
        ov.querySelector('[data-cancel]').addEventListener('click', function () { done(false); });
        ov.addEventListener('click', function (e) { if (e.target === ov) done(false); });
        setTimeout(function () { ov.querySelector('[data-ok]').focus(); }, 50);
      });
    }
  };

  var drawer = {
    open: function (target) {
      var el = typeof target === 'string' ? $(target) : target;
      if (!el) return;
      var ov = $('#drawerOverlay');
      if (ov) ov.style.display = 'block';
      el.classList.add('is-open');
      el.style.display = 'flex';
      d.body.style.overflow = 'hidden';
      init(el);
    },
    close: function (target) {
      var el = target ? (typeof target === 'string' ? $(target) : target) : $('.drawer.is-open');
      if (!el) return;
      el.classList.remove('is-open');
      el.style.display = 'none';
      var ov = $('#drawerOverlay');
      if (ov) ov.style.display = 'none';
      d.body.style.overflow = '';
    }
  };

  /* ==========================================================================
   *  5) ابزارهای فرم
   * ========================================================================== */
  function passwordStrength(pw) {
    var s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
    if (/[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++;
    if (pw.length >= 12 && /[^A-Za-z0-9]/.test(pw) && /[A-Z]/.test(pw)) s++;
    return clamp(s, 0, 4);
  }

  function initForms(scope) {
    /* نمایش/پنهان کردن رمز */
    $$('[data-password-toggle]', scope).forEach(function (btn) {
      if (btn.__bound) return; btn.__bound = true;
      btn.addEventListener('click', function () {
        var input = btn.closest('.input-wrap').querySelector('input');
        var show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.innerHTML = icon(show ? 'eye-off' : 'eye', 18);
      });
    });

    /* سنجه قدرت رمز */
    $$('[data-strength-for]', scope).forEach(function (bar) {
      if (bar.__bound) return; bar.__bound = true;
      var input = $(bar.getAttribute('data-strength-for'), scope) || $(bar.getAttribute('data-strength-for'));
      if (!input) return;
      var label = bar.parentElement.querySelector('[data-strength-label]');
      var texts = ['خیلی ضعیف', 'ضعیف', 'متوسط', 'خوب', 'بسیار قوی'];
      var colors = ['var(--danger)', 'var(--danger)', 'var(--warning)', 'var(--c5)', 'var(--success)'];
      input.addEventListener('input', function () {
        var s = passwordStrength(input.value);
        bar.className = 'strength s' + s;
        if (label) {
          label.textContent = input.value ? texts[s] : '—';
          label.style.color = input.value ? colors[s] : '';
        }
      });
    });

    /* ورودی کد یکبار مصرف */
    $$('[data-otp]', scope).forEach(function (group) {
      if (group.__bound) return; group.__bound = true;
      var inputs = $$('input', group);
      inputs.forEach(function (inp, i) {
        inp.addEventListener('input', function () {
          inp.value = fa(en(inp.value).replace(/\D/g, '').slice(-1));
          if (en(inp.value) && inputs[i + 1]) inputs[i + 1].focus();
        });
        inp.addEventListener('keydown', function (e) {
          if (e.key === 'Backspace' && !inp.value && inputs[i - 1]) { inputs[i - 1].focus(); inputs[i - 1].value = ''; }
          if (e.key === 'ArrowLeft' && inputs[i + 1]) inputs[i + 1].focus();
          if (e.key === 'ArrowRight' && inputs[i - 1]) inputs[i - 1].focus();
        });
        inp.addEventListener('paste', function (e) {
          var t = en((e.clipboardData || w.clipboardData).getData('text')).replace(/\D/g, '');
          if (t.length > 1) {
            e.preventDefault();
            inputs.forEach(function (x, k) { if (t[k]) x.value = fa(t[k]); });
            inputs[Math.min(t.length, inputs.length - 1)].focus();
          }
        });
      });
    });

    /* فرم نمایشی: جلوگیری از ارسال + بازخورد */
    $$('form[data-demo-form]', scope).forEach(function (form) {
      if (form.__bound) return; form.__bound = true;
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var btn = form.querySelector('[type="submit"]');
        if (btn) {
          btn.classList.add('is-loading');
          setTimeout(function () {
            btn.classList.remove('is-loading');
            toast({ type: 'success', title: 'اطلاعات با موفقیت ذخیره شد', msg: form.getAttribute('data-demo-form') || 'این یک نمایش است؛ داده‌ای ارسال نشد.' });
            if (form.hasAttribute('data-reset-on-submit')) form.reset();
            var closeSel = form.getAttribute('data-close-modal');
            if (closeSel) modal.close(closeSel);
          }, 850);
        }
      });
    });

    /* کپی در کلیپ‌بورد */
    $$('[data-copy]', scope).forEach(function (btn) {
      if (btn.__bound) return; btn.__bound = true;
      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-copy');
        if (navigator.clipboard) navigator.clipboard.writeText(text);
        toast({ type: 'success', title: 'کپی شد', msg: text, duration: 2200 });
      });
    });

    /* چاپ */
    $$('[data-print]', scope).forEach(function (btn) {
      if (btn.__bound) return; btn.__bound = true;
      btn.addEventListener('click', function () { w.print(); });
    });
  }

  /* ==========================================================================
   *  6) تب، آکاردئون، منوها، جدول
   * ========================================================================== */
  function initTabs(scope) {
    $$('[data-tabs]', scope).forEach(function (group) {
      if (group.__bound) return; group.__bound = true;
      var btns = $$('[data-tab]', group);
      var root = group.closest('[data-tabs-root]') || d;
      group.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-tab]');
        if (!btn) return;
        var id = btn.getAttribute('data-tab');
        btns.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
        $$('[data-tab-panel]', root).forEach(function (p) {
          p.classList.toggle('d-none', p.getAttribute('data-tab-panel') !== id);
        });
      });
    });
  }

  function initAccordions(scope) {
    $$('[data-accordion]', scope).forEach(function (acc) {
      if (acc.__bound) return; acc.__bound = true;
      $$('.acc-head', acc).forEach(function (head) {
        head.addEventListener('click', function () {
          var item = head.closest('.acc-item');
          var open = item.classList.contains('is-open');
          if (!acc.hasAttribute('data-multi')) {
            $$('.acc-item', acc).forEach(function (i) { i.classList.remove('is-open'); });
          }
          item.classList.toggle('is-open', !open);
        });
      });
    });
  }

  function initDropdowns(scope) {
    $$('[data-dropdown-toggle]', scope).forEach(function (btn) {
      if (btn.__bound) return; btn.__bound = true;
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var menu = btn.parentElement.querySelector('.dropdown-menu');
        if (!menu) return;
        var open = menu.classList.contains('is-open');
        $$('.dropdown-menu.is-open').forEach(function (m) { m.classList.remove('is-open'); });
        $$('.snap-picker.is-open').forEach(function (m) { m.classList.remove('is-open'); });
        menu.classList.toggle('is-open', !open);
      });
    });
  }

  function initTables(scope) {
    /* جستجوی زنده در جدول */
    $$('[data-table-search]', scope).forEach(function (inp) {
      if (inp.__bound) return; inp.__bound = true;
      var table = $(inp.getAttribute('data-table-search'), scope);
      inp.addEventListener('input', debounce(function () {
        var q = en(inp.value.trim().toLowerCase());
        var count = 0;
        $$('tbody tr', table).forEach(function (tr) {
          var match = !q || en(tr.textContent.toLowerCase()).indexOf(q) > -1;
          tr.classList.toggle('d-none', !match);
          if (match) count++;
        });
        var empty = table.parentElement.querySelector('[data-table-empty]');
        if (empty) empty.classList.toggle('d-none', count > 0);
      }, 160));
    });

    /* انتخاب همه سطرها */
    $$('[data-select-all]', scope).forEach(function (all) {
      if (all.__bound) return; all.__bound = true;
      var table = all.closest('table');
      all.addEventListener('change', function () {
        $$('tbody [data-row-check]', table).forEach(function (c) {
          c.checked = all.checked;
          c.closest('tr').classList.toggle('is-selected', all.checked);
        });
        updateBulkBar(table);
      });
      $$('tbody [data-row-check]', table).forEach(function (c) {
        c.addEventListener('change', function () {
          c.closest('tr').classList.toggle('is-selected', c.checked);
          updateBulkBar(table);
        });
      });
    });

    /* مرتب‌سازی سرستون‌ها */
    $$('th[data-sort]', scope).forEach(function (th) {
      if (th.__bound) return; th.__bound = true;
      th.addEventListener('click', function () {
        var table = th.closest('table');
        var idx = Array.prototype.indexOf.call(th.parentElement.children, th);
        var asc = th.getAttribute('data-sort-dir') !== 'asc';
        $$('th', th.parentElement).forEach(function (x) { x.removeAttribute('data-sort-dir'); x.querySelector('.icon') && x.querySelector('.icon').remove(); });
        th.setAttribute('data-sort-dir', asc ? 'asc' : 'desc');
        th.querySelector('.th-in').insertAdjacentHTML('beforeend', icon(asc ? 'chevron-up' : 'chevron-down', 14));
        var rows = $$('tbody tr', table);
        rows.sort(function (a, b) {
          var av = en(a.children[idx].textContent.trim()).replace(/[^\d.-]/g, '');
          var bv = en(b.children[idx].textContent.trim()).replace(/[^\d.-]/g, '');
          if (av !== '' && bv !== '' && !isNaN(+av) && !isNaN(+bv)) return asc ? +av - +bv : +bv - +av;
          return asc ? a.children[idx].textContent.localeCompare(b.children[idx].textContent, 'fa')
                     : b.children[idx].textContent.localeCompare(a.children[idx].textContent, 'fa');
        });
        var tbody = table.tBodies[0];
        rows.forEach(function (r) { tbody.appendChild(r); });
      });
    });
  }

  function updateBulkBar(table) {
    var bar = table.closest('[data-table-root]') && table.closest('[data-table-root]').querySelector('[data-bulk-bar]');
    if (!bar) return;
    var n = $$('tbody [data-row-check]:checked', table).length;
    bar.classList.toggle('d-none', n === 0);
    var counter = bar.querySelector('[data-bulk-count]');
    if (counter) counter.textContent = fa(n);
  }

  /* ==========================================================================
   *  7) موتور نمودار (SVG سبک، بدون کتابخانه)
   * ========================================================================== */
  var charts = (function () {
    function parse(attr) {
      return String(attr || '').split(',').map(function (x) { return Number(en(x).trim()) || 0; });
    }
    function smooth(points) {
      if (!points.length) return '';
      var dstr = 'M' + points[0][0].toFixed(2) + ',' + points[0][1].toFixed(2);
      for (var i = 1; i < points.length - 1; i++) {
        var xc = (points[i][0] + points[i + 1][0]) / 2;
        var yc = (points[i][1] + points[i + 1][1]) / 2;
        dstr += ' Q' + points[i][0].toFixed(2) + ',' + points[i][1].toFixed(2) + ' ' + xc.toFixed(2) + ',' + yc.toFixed(2);
      }
      var last = points[points.length - 1];
      dstr += ' L' + last[0].toFixed(2) + ',' + last[1].toFixed(2);
      return dstr;
    }
    function area(el) {
      var vals = parse(el.getAttribute('data-values'));
      var vals2 = parse(el.getAttribute('data-values2'));
      var labels = String(el.getAttribute('data-labels') || '').split(',').filter(Boolean);
      var W = 600, H = 220, PT = 16, PB = 10;
      var n = vals.length;
      var max = Math.max.apply(null, vals.concat(vals2).concat([1])) * 1.15;
      function pt(v, i) { return [W - (i / Math.max(1, n - 1)) * W, H - PB - (v / max) * (H - PT - PB)]; }
      var p1 = vals.map(pt), p2 = vals2.map(pt);
      var id = uid('grad');
      var html = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" class="chart-svg">' +
        '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="var(--brand)" stop-opacity=".28"/>' +
        '<stop offset="100%" stop-color="var(--brand)" stop-opacity="0"/></linearGradient>' +
        '<linearGradient id="' + id + 'b" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="var(--c3)" stop-opacity=".22"/>' +
        '<stop offset="100%" stop-color="var(--c3)" stop-opacity="0"/></linearGradient></defs>';
      /* خطوط راهنما */
      for (var g = 0; g <= 4; g++) {
        var y = PT + (g / 4) * (H - PT - PB);
        html += '<line x1="0" y1="' + y.toFixed(1) + '" x2="' + W + '" y2="' + y.toFixed(1) + '" stroke="var(--border)" stroke-width="1" vector-effect="non-scaling-stroke" stroke-dasharray="4 6" opacity=".7"/>';
      }
      if (p2.length) {
        html += '<path d="' + smooth(p2) + ' L0,' + (H - PB) + '" fill="url(#' + id + 'b)" stroke="none"/>';
        html += '<path d="' + smooth(p2) + '" fill="none" stroke="var(--c3)" stroke-width="2" vector-effect="non-scaling-stroke" stroke-dasharray="5 4"/>';
      }
      html += '<path d="' + smooth(p1) + ' L' + W + ',' + (H - PB) + ' L0,' + (H - PB) + '" fill="url(#' + id + ')" stroke="none"/>';
      html += '<path d="' + smooth(p1) + '" fill="none" stroke="var(--brand)" stroke-width="2.4" vector-effect="non-scaling-stroke" stroke-linecap="round"/>';
      p1.forEach(function (p, i) {
        html += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="3.2" fill="var(--surface)" stroke="var(--brand)" stroke-width="2" vector-effect="non-scaling-stroke">' +
          (labels[i] ? '<title>' + esc(labels[i]) + ': ' + esc(num(vals[i])) + '</title>' : '') + '</circle>';
      });
      html += '</svg>';
      if (labels.length) {
        html += '<div class="chart-x">' + labels.map(function (l) { return '<span>' + esc(l) + '</span>'; }).join('') + '</div>';
      }
      el.innerHTML = html;
    }
    function bars(el) {
      var vals = parse(el.getAttribute('data-values'));
      var labels = String(el.getAttribute('data-labels') || '').split(',').filter(Boolean);
      var colors = String(el.getAttribute('data-colors') || '').split(',').filter(Boolean);
      var W = 600, H = 220, PB = 8, PT = 14;
      var n = vals.length;
      var max = Math.max.apply(null, vals.concat([1])) * 1.12;
      var gap = 10, bw = (W - gap * (n + 1)) / Math.max(1, n);
      var html = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" class="chart-svg">';
      for (var g = 0; g <= 4; g++) {
        var y = PT + (g / 4) * (H - PT - PB);
        html += '<line x1="0" y1="' + y.toFixed(1) + '" x2="' + W + '" y2="' + y.toFixed(1) + '" stroke="var(--border)" stroke-width="1" vector-effect="non-scaling-stroke" stroke-dasharray="4 6" opacity=".7"/>';
      }
      vals.forEach(function (v, i) {
        var h = (v / max) * (H - PT - PB);
        var x = W - (gap + i * (bw + gap)) - bw; /* چیدمان راست‌به‌چپ */
        var color = colors[i] || 'var(--brand)';
        html += '<rect x="' + x.toFixed(1) + '" y="' + (H - PB - h).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + Math.max(2, h).toFixed(1) +
          '" rx="4" fill="' + color + '" opacity=".9">' + (labels[i] ? '<title>' + esc(labels[i]) + ': ' + esc(num(v)) + '</title>' : '') + '</rect>';
      });
      html += '</svg>';
      if (labels.length) html += '<div class="chart-x">' + labels.map(function (l) { return '<span>' + esc(l) + '</span>'; }).join('') + '</div>';
      el.innerHTML = html;
    }
    function donut(el) {
      var vals = parse(el.getAttribute('data-values'));
      var labels = String(el.getAttribute('data-labels') || '').split(',').filter(Boolean);
      var colors = String(el.getAttribute('data-colors') || 'var(--c1),var(--c3),var(--c4),var(--c5),var(--c6)').split(',');
      var total = vals.reduce(function (a, b) { return a + b; }, 0) || 1;
      var R = 60, C = 2 * Math.PI * R, acc = 0;
      var html = '<svg viewBox="0 0 160 160" class="donut-svg">' +
        '<circle cx="80" cy="80" r="' + R + '" fill="none" stroke="var(--surface-inset)" stroke-width="18"/>';
      vals.forEach(function (v, i) {
        var len = (v / total) * C;
        html += '<circle cx="80" cy="80" r="' + R + '" fill="none" stroke="' + (colors[i] || 'var(--brand)') + '" stroke-width="18" ' +
          'stroke-dasharray="' + Math.max(0.01, len - 2).toFixed(2) + ' ' + (C - Math.max(0.01, len - 2)).toFixed(2) + '" ' +
          'stroke-dashoffset="' + (-acc).toFixed(2) + '" stroke-linecap="round" transform="rotate(-90 80 80)">' +
          (labels[i] ? '<title>' + esc(labels[i]) + '</title>' : '') + '</circle>';
        acc += len;
      });
      var center = el.getAttribute('data-center') || num(total);
      var sub = el.getAttribute('data-center-sub') || '';
      html += '<text x="80" y="78" text-anchor="middle" font-size="20" font-weight="700" fill="var(--text-strong)" style="font-family:var(--font)">' + esc(center) + '</text>' +
        (sub ? '<text x="80" y="96" text-anchor="middle" font-size="10" fill="var(--text-soft)" style="font-family:var(--font)">' + esc(sub) + '</text>' : '') +
        '</svg>';
      html += '<div class="chart-legend">' + vals.map(function (v, i) {
        return '<div class="legend-row"><span class="legend-dot" style="background:' + (colors[i] || 'var(--brand)') + '"></span>' +
          '<span class="legend-lbl">' + esc(labels[i] || '') + '</span>' +
          '<span class="legend-val">' + esc(num(v)) + '</span></div>';
      }).join('') + '</div>';
      el.innerHTML = html;
    }
    function radial(el) {
      var v = clamp(parse(el.getAttribute('data-values'))[0] || 0, 0, 100);
      var R = 54, C = 2 * Math.PI * R;
      var color = el.getAttribute('data-color') || 'var(--brand)';
      el.innerHTML = '<svg viewBox="0 0 140 140" class="donut-svg">' +
        '<circle cx="70" cy="70" r="' + R + '" fill="none" stroke="var(--surface-inset)" stroke-width="13"/>' +
        '<circle cx="70" cy="70" r="' + R + '" fill="none" stroke="' + color + '" stroke-width="13" stroke-linecap="round" ' +
        'stroke-dasharray="' + (C * v / 100).toFixed(2) + ' ' + C.toFixed(2) + '" transform="rotate(-90 70 70)"/>' +
        '<text x="70" y="74" text-anchor="middle" font-size="24" font-weight="700" fill="var(--text-strong)" style="font-family:var(--font)">' + esc(fa(v) + '٪') + '</text>' +
        '<text x="70" y="92" text-anchor="middle" font-size="10" fill="var(--text-soft)" style="font-family:var(--font)">' + esc(el.getAttribute('data-label') || '') + '</text>' +
        '</svg>';
    }
    function spark(el) {
      var vals = parse(el.getAttribute('data-values'));
      var color = el.getAttribute('data-color') || 'var(--brand)';
      var W = 120, H = 40;
      var max = Math.max.apply(null, vals.concat([1])), min = Math.min.apply(null, vals);
      var span = (max - min) || 1;
      var pts = vals.map(function (v, i) {
        return [W - (i / Math.max(1, vals.length - 1)) * W, H - 3 - ((v - min) / span) * (H - 8)];
      });
      el.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" class="chart-svg">' +
        '<path d="' + smooth(pts) + '" fill="none" stroke="' + color + '" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linecap="round"/></svg>';
    }
    function render(scope) {
      $$('[data-chart]', scope || d).forEach(function (el) {
        if (el.getAttribute('data-chart-done') === '1') return;
        var type = el.getAttribute('data-chart');
        if (type === 'line' || type === 'area') area(el);
        else if (type === 'bar') bars(el);
        else if (type === 'donut') donut(el);
        else if (type === 'radial') radial(el);
        else if (type === 'spark') spark(el);
        el.setAttribute('data-chart-done', '1');
      });
    }
    return { render: render };
  })();

  /* ==========================================================================
   *  8) کانبان با کشیدن و رها کردن
   * ========================================================================== */
  /* ==========================================================================
   *  سوییچ نما: جدولی / کارتی / تخته
   *  دکمه‌ها: [data-view-btn="cards|table|board"]
   *  پنل‌ها: [data-view-panel="cards|table|board"]
   *  پیش از نمایش یک پنل، رویداد crm:view روی آن ارسال می‌شود تا صفحه‌های
   *  دارای محتوای تنبل (lazy) خودشان را بسازند.
   * ========================================================================== */
  function initViews(scope) {
    var s = scope || d;

    var allBtns0 = $$('[data-view-btn]', d);
    var viewName = allBtns0.length ? (allBtns0[0].getAttribute('data-view-name') || '') : '';

    function apply(key) {
      var panels = $$('[data-view-panel]', d);
      if (!panels.length) return;
      panels.forEach(function (p) {
        var on = p.getAttribute('data-view-panel') === key;
        p.classList.toggle('d-none', !on);
        p.hidden = !on;
        if (on) {
          /* محتوای تنبل: صفحه خودش را می‌سازد (رویداد crm:view) */
          if (!p.__filled) {
            p.__filled = true;
            p.dispatchEvent(new CustomEvent('crm:view', { bubbles: true, detail: { key: key } }));
          }
          /* آیکون‌ها و نمودارهای پنل تازه‌نمایش‌داده‌شده دوباره ساخته می‌شوند */
          renderIcons(p);
          charts.render(p);
        }
      });
      $$('[data-view-btn]', d).forEach(function (b) {
        var isOn = b.getAttribute('data-view-btn') === key;
        b.classList.toggle('is-active', isOn);
        b.setAttribute('aria-pressed', isOn ? 'true' : 'false');
      });
      try { localStorage.setItem('moderncrm-view:' + (viewName || 'page'), key); } catch (e) { }
    }

    $$('[data-view-btn]', s).forEach(function (b) {
      if (b.__bound) return; b.__bound = true;
      b.addEventListener('click', function (e) {
        e.preventDefault();
        apply(b.getAttribute('data-view-btn'));
      });
    });

    /* اگر همه‌ی دکمه‌های نما در صفحه هستند، نما را از حافظه بازیابی کن */
    var btns = allBtns0;
    if (btns.length && btns[0].getAttribute('data-view-name')) {
      var saved = null;
      try { saved = localStorage.getItem('moderncrm-view:' + (viewName || 'page')); } catch (e) { }
      if (saved && btns.some(function (b) { return b.getAttribute('data-view-btn') === saved; })) apply(saved);
    }
  }

  function initKanban(scope) {
    $$('[data-kanban]', scope).forEach(function (board) {
      if (board.__bound) return; board.__bound = true;
      var dragEl = null, placeholder = null;
      $$('.kanban-card', board).forEach(function (card) {
        card.setAttribute('draggable', 'true');
        card.addEventListener('dragstart', function (e) {
          dragEl = card;
          card.classList.add('is-dragging');
          e.dataTransfer.effectAllowed = 'move';
          try { e.dataTransfer.setData('text/plain', card.getAttribute('data-id') || ''); } catch (err) { }
        });
        card.addEventListener('dragend', function () {
          card.classList.remove('is-dragging');
          $$('.kanban-col', board).forEach(function (c) { c.classList.remove('is-over'); });
          dragEl = null;
        });
      });
      $$('.kanban-col-body', board).forEach(function (zone) {
        zone.addEventListener('dragover', function (e) {
          e.preventDefault();
          zone.parentElement.classList.add('is-over');
          if (!dragEl) return;
          var after = $$('.kanban-card:not(.is-dragging)', zone).filter(function (c) {
            var box = c.getBoundingClientRect();
            return e.clientY < box.top + box.height / 2;
          })[0];
          if (after) zone.insertBefore(dragEl, after); else zone.appendChild(dragEl);
        });
        zone.addEventListener('dragleave', function () { zone.parentElement.classList.remove('is-over'); });
        zone.addEventListener('drop', function (e) {
          e.preventDefault();
          zone.parentElement.classList.remove('is-over');
          var title = zone.parentElement.querySelector('.kanban-col-title');
          var count = zone.querySelectorAll('.kanban-card').length;
          var badge = zone.parentElement.querySelector('[data-col-count]');
          if (badge) badge.textContent = fa(count);
          toast({ type: 'success', title: 'معامله منتقل شد', msg: 'به ستون «' + (title ? title.textContent.trim() : '') + '»', duration: 2400 });
        });
      });
    });
  }

  /* ==========================================================================
   *  9) شمارنده‌ها و ظاهر شدن عناصر
   * ========================================================================== */
  function initCounters(scope) {
    $$('[data-counter]', scope).forEach(function (el) {
      if (el.__bound) return; el.__bound = true;
      var target = Number(en(el.getAttribute('data-counter'))) || 0;
      var dec = Number(el.getAttribute('data-decimals') || 0);
      var dur = Number(el.getAttribute('data-duration') || 900);
      var start = performance.now();
      function frame(now) {
        var p = clamp((now - start) / dur, 0, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = num(target * eased, dec);
        if (p < 1) requestAnimationFrame(frame);
        else el.textContent = num(target, dec);
      }
      requestAnimationFrame(frame);
    });
  }

  /* ==========================================================================
   * 10) پالت فرمان (Ctrl + K)
   * ========================================================================== */
  var palette = (function () {
    var el, input, list, items = [], index = 0, built = false;

    function build() {
      var navItems = [];
      (DATA.nav || []).forEach(function (g) {
        g.items.forEach(function (it) {
          if (it.children) navItems.push({ label: it.label, icon: it.icon, href: it.href, group: g.group });
          else navItems.push({ label: it.label, icon: it.icon, href: it.href, group: g.group });
        });
      });
      var actions = [
        { label: 'افزودن مشتری جدید', icon: 'user-plus', href: 'customer-new.html', group: 'میان‌بر' },
        { label: 'ثبت معامله جدید', icon: 'deals', href: 'deals.html', group: 'میان‌بر' },
        { label: 'صدور فاکتور', icon: 'invoice', href: 'invoices.html', group: 'میان‌بر' },
        { label: 'ثبت تیکت پشتیبانی', icon: 'ticket', href: 'ticket-new.html', group: 'میان‌بر' },
        { label: 'ورود به میزکار پنجره‌ای', icon: 'window', href: 'desktop.html', group: 'فرمان' },
        { label: 'خروج از حساب کاربری', icon: 'logout', href: 'login.html', group: 'فرمان' }
      ];
      items = navItems.concat(actions);
      el = d.createElement('div');
      el.className = 'overlay cmdk-overlay';
      el.style.display = 'none';
      el.innerHTML =
        '<div class="cmdk" role="dialog" aria-modal="true">' +
          '<div class="cmdk-input">' + icon('search', 19) +
            '<input type="text" placeholder="جستجو در صفحات، مشتریان و فرمان‌ها…" aria-label="جستجو">' +
            '<span class="kbd">Esc</span>' +
          '</div>' +
          '<div class="cmdk-list"></div>' +
          '<div class="cmdk-foot">' +
            '<span>' + icon('corner-down-left', 14) + ' انتخاب</span>' +
            '<span>' + icon('arrow-up', 13) + ' ' + icon('arrow-down', 13) + ' جابه‌جایی</span>' +
            '<span class="ms-auto">' + icon('sparkles', 14) + ' جستجوی هوشمند مدرن‌CRM</span>' +
          '</div>' +
        '</div>';
      d.body.appendChild(el);
      input = $('input', el);
      list = $('.cmdk-list', el);

      el.addEventListener('click', function (e) { if (e.target === el) close(); });
      input.addEventListener('input', render);
      input.addEventListener('keydown', function (e) {
        var visible = $$('.cmdk-item', list);
        if (e.key === 'ArrowDown') { e.preventDefault(); index = Math.min(index + 1, visible.length - 1); paint(visible); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); index = Math.max(index - 1, 0); paint(visible); }
        else if (e.key === 'Enter') { e.preventDefault(); if (visible[index]) visible[index].click(); }
        else if (e.key === 'Escape') { close(); }
      });
      built = true;
    }

    function paint(visible) {
      visible.forEach(function (n, i) { n.classList.toggle('is-cursor', i === index); });
      if (visible[index]) visible[index].scrollIntoView({ block: 'nearest' });
    }

    function render() {
      var q = en(input.value.trim().toLowerCase());
      var filtered = items.filter(function (it) { return !q || en(it.label.toLowerCase()).indexOf(q) > -1 || en((it.group || '').toLowerCase()).indexOf(q) > -1; });
      if (!filtered.length) {
        list.innerHTML = '<div class="cmdk-empty">' + icon('search', 26) + '<div class="mt-2">نتیجه‌ای یافت نشد</div></div>';
        return;
      }
      index = 0;
      var html = '', lastGroup = '';
      filtered.forEach(function (it, i) {
        if (it.group !== lastGroup) { html += '<div class="cmdk-group">' + esc(it.group || '') + '</div>'; lastGroup = it.group; }
        html += '<button class="cmdk-item' + (i === 0 ? ' is-cursor' : '') + '" data-href="' + esc(it.href || '') + '" data-action="' + esc(it.action || '') + '">' +
          '<span class="ci-ic">' + icon(it.icon || 'circle-dot', 18) + '</span>' +
          '<span class="ci-lbl">' + esc(it.label) + '</span>' +
          '<span class="ci-go">' + icon('arrow-left', 16) + '</span></button>';
      });
      list.innerHTML = html;
    }

    list && null;
    function open() {
      if (!built) build();
      el.style.display = 'grid';
      input.value = '';
      render();
      setTimeout(function () { input.focus(); }, 40);
    }
    function close() { if (built) el.style.display = 'none'; }

    d.addEventListener('click', function (e) {
      var item = e.target.closest && e.target.closest('.cmdk-item');
      if (!item) return;
      var action = item.getAttribute('data-action');
      var href = item.getAttribute('data-href');
      close();
      if (href) setTimeout(function () { w.location.href = href; }, 120);
    });

    return { open: open, close: close, build: build };
  })();

  /* ==========================================================================
   * 11) پوسته برنامه: سایدبار، تاپ‌بار، نوار وظیفه، منوی شروع
   * ========================================================================== */
  var shell = (function () {

    function sidebarHTML(active) {
      var groups = '';
      (DATA.nav || []).forEach(function (g) {
        groups += '<div class="nav-group"><div class="nav-group-title">' + esc(g.group) + '</div>';
        g.items.forEach(function (it) {
          var isActive = it.id === active || (it.children && it.children.some(function (c) { return c.id === active; }));
          var badge = it.badge ? '<span class="nav-badge ' + (it.badgeStyle === 'solid' ? '' : 'soft') + '">' + esc(fa(it.badge)) + '</span>' : '';
          if (it.children) {
            var opened = it.open || isActive; /* زیرمنوی صفحه‌ی فعال همیشه باز است */
            groups += '<button class="nav-item' + (opened ? ' is-open' : '') + '" data-nav-toggle data-tip="' + esc(it.label) + '">' +
              '<span data-icon="' + it.icon + '" data-icon-size="19"></span>' +
              '<span class="nav-label">' + esc(it.label) + '</span>' + badge +
              '<span class="nav-caret" data-icon="chevron-down" data-icon-size="15"></span></button>';
            groups += '<div class="nav-sub" ' + (opened ? '' : 'style="display:none"') + '>' +
              it.children.map(function (c) {
                return '<a class="nav-item' + (c.id === active ? ' is-active' : '') + '" href="' + c.href + '" data-tip="' + esc(c.label) + '">' +
                  '<span data-icon="' + (c.icon || 'dot') + '" data-icon-size="15"></span>' +
                  '<span class="nav-label">' + esc(c.label) + '</span></a>';
              }).join('') + '</div>';
          } else {
            groups += '<a class="nav-item' + (isActive ? ' is-active' : '') + '" href="' + it.href + '" data-tip="' + esc(it.label) + '">' +
              '<span data-icon="' + it.icon + '" data-icon-size="19"></span>' +
              '<span class="nav-label">' + esc(it.label) + '</span>' + badge + '</a>';
          }
        });
        groups += '</div>';
      });
      return '' +
        '<div class="sidebar-brand">' +
          '<span class="brand-mark" data-icon="sparkles" data-icon-size="21"></span>' +
          '<span class="brand-text">' +
            '<span class="brand-name">مدرن‌CRM<small>سامانه مدیریت ارتباط با مشتری</small></span>' +
          '</span>' +
        '</div>' +
        '<div class="sidebar-scroll">' + groups + '</div>' +
        '<div class="sidebar-foot">' +
          '<div class="side-card">' +
            '<div class="sc-title">پلن حرفه‌ای</div>' +
            '<div class="sc-desc">۹۰٪ از ظرفیت کاربران فعال شما استفاده شده است.</div>' +
            '<div class="progress" style="background:rgba(255,255,255,.28)"><i style="width:90%;background:#fff"></i></div>' +
            '<a class="btn btn-glass btn-sm btn-block mt-3" href="settings.html">ارتقا به پلن سازمانی</a>' +
          '</div>' +
        '</div>';
    }

    function topbarHTML() {
      return '' +
        '<button class="tb-icon topbar-mobile-btn" data-sidebar-toggle data-tip="نمایش منو" aria-label="منو" data-icon="menu" data-icon-size="21"></button>' +
        '<div class="tb-search">' +
          '<button class="search-box" data-palette-open data-tip="جستجو در همه بخش‌ها (Ctrl+K)">' +
            '<span data-icon="search" data-icon-size="18"></span>' +
            '<span class="sb-text">جستجو در مشتریان، معاملات، فاکتورها…</span>' +
            '<span class="kbd">Ctrl</span><span class="kbd">K</span>' +
          '</button>' +
        '</div>' +
        '<div class="tb-actions">' +
          '<div class="dropdown">' +
            '<button class="btn btn-primary btn-sm" data-dropdown-toggle data-tip="ایجاد سریع">' +
              '<span data-icon="plus" data-icon-size="15"></span> ایجاد سریع' +
              '<span data-icon="chevron-down" data-icon-size="14"></span></button>' +
            '<div class="dropdown-menu">' +
              '<div class="dropdown-label">ایجاد جدید</div>' +
              '<a class="dropdown-item" href="customer-new.html"><span data-icon="user-plus" data-icon-size="17"></span> مشتری جدید</a>' +
              '<a class="dropdown-item" href="deals.html"><span data-icon="deals" data-icon-size="17"></span> معامله جدید</a>' +
              '<a class="dropdown-item" href="ticket-new.html"><span data-icon="ticket" data-icon-size="17"></span> تیکت پشتیبانی</a>' +
              '<a class="dropdown-item" href="invoices.html"><span data-icon="invoice" data-icon-size="17"></span> صدور فاکتور</a>' +
            '</div>' +
          '</div>' +
          '<button class="tb-icon" data-tip="تنظیمات" aria-label="تنظیمات" onclick="location.href=\'settings.html\'" data-icon="settings" data-icon-size="19"></button>' +
          '<button class="tb-icon" data-palette-open data-tip="جستجوی سراسری (Ctrl+K)" aria-label="جستجو" data-icon="search" data-icon-size="19"></button>' +
          '<div class="dropdown">' +
            '<button class="tb-icon" data-dropdown-toggle data-tip="پیام‌های اخیر" aria-label="پیام‌ها" data-icon="message" data-icon-size="19">' +
              '<span class="badge-dot-red"></span></button>' +
            '<div class="dropdown-menu" style="min-width:290px">' +
              '<div class="dropdown-label">آخرین پیام‌ها</div>' +
              (DATA.threads || []).slice(0, 3).map(function (t) {
                return '<a class="dropdown-item" href="messages.html" style="align-items:flex-start">' +
                  '<span data-icon="message" data-icon-size="17"></span>' +
                  '<span style="min-width:0"><span class="d-block fw-600 text-strong fs-sm">' + esc(t.name) + '</span>' +
                  '<span class="fs-xs text-muted text-truncate d-block">' + esc(t.last) + '</span></span>' +
                  '<span class="fs-xs text-soft ms-auto text-nowrap">' + esc(t.time) + '</span></a>';
              }).join('') +
              '<div class="dropdown-sep"></div>' +
              '<a class="dropdown-item" href="messages.html">' + icon('arrow-left', 16) + ' مشاهده همه گفتگوها</a>' +
            '</div>' +
          '</div>' +
          '<div class="dropdown">' +
            '<button class="tb-icon" data-dropdown-toggle data-tip="اعلان‌ها" aria-label="اعلان‌ها" data-icon="bell" data-icon-size="19">' +
              '<span class="badge-dot-red"></span></button>' +
            '<div class="dropdown-menu" style="min-width:330px">' +
              '<div class="dropdown-label">اعلان‌ها (۳ خوانده‌نشده)</div>' +
              (DATA.notifications || []).map(function (n) {
                return '<a class="dropdown-item" href="notifications.html" style="align-items:flex-start">' +
                  '<span data-icon="' + n.icon + '" data-icon-size="17"></span>' +
                  '<span style="min-width:0"><span class="d-block fs-sm ' + (n.unread ? 'fw-600 text-strong' : 'text-muted') + '">' + esc(n.title) + '</span>' +
                  '<span class="fs-xs text-soft">' + esc(n.time) + '</span></span></a>';
              }).join('') +
              '<div class="dropdown-sep"></div>' +
              '<a class="dropdown-item" href="notifications.html">' + icon('arrow-left', 16) + ' مرکز اعلان‌ها</a>' +
            '</div>' +
          '</div>' +
          '<div class="dropdown">' +
            '<button class="tb-user" data-dropdown-toggle data-tip="حساب کاربری">' +
              avatar('مهدی کریمی', 36) +
              '<span class="u-meta u-name">مهدی کریمی<span class="u-role d-block">مدیر فروش</span></span>' +
              '<span data-icon="chevron-down" data-icon-size="14"></span>' +
            '</button>' +
            '<div class="dropdown-menu">' +
              '<div class="dropdown-label">حساب کاربری</div>' +
              '<a class="dropdown-item" href="profile.html"><span data-icon="user-round" data-icon-size="17"></span> پروفایل من</a>' +
              '<a class="dropdown-item" href="settings.html"><span data-icon="settings" data-icon-size="17"></span> تنظیمات حساب</a>' +
              '<a class="dropdown-item" href="change-password.html"><span data-icon="key" data-icon-size="17"></span> تغییر رمز عبور</a>' +
              '<a class="dropdown-item" href="lock.html"><span data-icon="lock" data-icon-size="17"></span> قفل صفحه</a>' +
              '<a class="dropdown-item" href="help.html"><span data-icon="help" data-icon-size="17"></span> راهنما و پشتیبانی</a>' +
              '<div class="dropdown-sep"></div>' +
              '<a class="dropdown-item danger" href="login.html"><span data-icon="logout" data-icon-size="17"></span> خروج از حساب</a>' +
            '</div>' +
          '</div>' +
        '</div>';
    }

    function taskbarHTML() {
      return '' +
        '<button class="task-start" data-start-toggle data-tip="منوی شروع">' +
          '<span class="brand-mark" data-icon="sparkles" data-icon-size="15"></span><span>میزکار</span>' +
        '</button>' +
        '<div class="task-items" id="taskItems"></div>' +
        '<div class="task-tray">' +
          '<button class="tray-btn" data-tray-openwin data-tip="پنجره‌های شناور"><span data-icon="window" data-icon-size="17"></span><span id="trayWinCount">۰</span></button>' +
          '<button class="tray-btn" data-tray-fullscreen data-tip="تمام‌صفحه"><span data-icon="maximize" data-icon-size="17"></span></button>' +
          '<div class="tray-clock"><div class="tc-time" id="trayTime">۰۰:۰۰</div><div class="tc-date" id="trayDate">—</div></div>' +
        '</div>';
    }

    function startMenuHTML() {
      var apps = [];
      (DATA.nav || []).forEach(function (g) { g.items.forEach(function (i) { apps.push(i); }); });
      var tones = ['', 'v2', 'v3', 'v4', 'v5'];
      return '' +
        '<div class="start-head">' +
          avatar('مهدی کریمی', 46) +
          '<div><div class="fw-700 text-strong">مهدی کریمی</div>' +
          '<div class="fs-xs text-muted">m.karimi@moderncrm.ir</div></div>' +
          '<a class="tb-icon ms-auto" href="lock.html" data-tip="قفل صفحه" data-icon="lock" data-icon-size="19"></a>' +
        '</div>' +
        '<div class="start-body">' +
          '<div class="start-apps">' +
            apps.slice(0, 12).map(function (a, i) {
              return '<a class="start-app ' + tones[i % tones.length] + '" href="' + a.href + '">' +
                '<span class="sa-ic" data-icon="' + a.icon + '" data-icon-size="21"></span>' + esc(a.label) + '</a>';
            }).join('') +
          '</div>' +
          '<div class="start-side">' +
            '<div class="nav-group-title">دسترسی سریع</div>' +
            '<a class="dropdown-item" href="profile.html"><span data-icon="user-round" data-icon-size="17"></span> پروفایل من</a>' +
            '<a class="dropdown-item" href="notifications.html"><span data-icon="bell" data-icon-size="17"></span> اعلان‌ها</a>' +
            '<a class="dropdown-item" href="design-system.html"><span data-icon="palette" data-icon-size="17"></span> راهنمای طراحی</a>' +
            '<a class="dropdown-item" href="help.html"><span data-icon="help" data-icon-size="17"></span> راهنما</a>' +
            '<div class="dropdown-sep"></div>' +
            '<div class="nav-group-title mt-2">نمایش</div>' +
            '<label class="dropdown-item" style="cursor:pointer" data-tip="نمایش کارت‌ها به‌صورت پنجره شناور">' +
              '<span data-icon="panels" data-icon-size="17"></span> پنجره‌های شناور' +
              '<span class="switch ms-auto"><input type="checkbox" data-float-toggle checked><span class="track"></span></span>' +
            '</label>' +
            '<div class="dropdown-sep"></div>' +
            '<a class="dropdown-item danger" href="login.html"><span data-icon="logout" data-icon-size="17"></span> خروج از حساب</a>' +
          '</div>' +
        '</div>';
    }

    function bind() {
      /* جمع/باز کردن سایدبار */
      $$('[data-sidebar-toggle]').forEach(function (b) {
        b.addEventListener('click', function () { d.body.classList.toggle('sidebar-open'); });
      });
      var shellEl = $('#appShell');

      /* بستن کشوی موبایل: کلیک بیرون از کشو، کلید Escape، و بازگشت به دسکتاپ */
      d.addEventListener('click', function (e) {
        if (!d.body.classList.contains('sidebar-open')) return;
        if (e.target.closest && e.target.closest('.sidebar')) return;
        if (e.target.closest && e.target.closest('[data-sidebar-toggle]')) return;
        d.body.classList.remove('sidebar-open');
      });
      d.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') d.body.classList.remove('sidebar-open');
      });
      w.addEventListener('resize', debounce(function () {
        if (w.innerWidth > 1024) d.body.classList.remove('sidebar-open');
      }, 150));

      function paintCollapseBtn() {
        var collapsed = shellEl && shellEl.classList.contains('sidebar-collapsed');
        var b = $('[data-sidebar-collapse]');
        if (!b) return;
        /* در RTL سایدبار سمت راست است: پیکان رو به راست = جمع‌شدن، رو به چپ = باز شدن */
        b.innerHTML = icon(collapsed ? 'chevron-left' : 'chevron-right', 18);
        b.setAttribute('data-tip', collapsed ? 'باز کردن منو' : 'جمع کردن منو');
        b.setAttribute('aria-label', collapsed ? 'باز کردن منو' : 'جمع کردن منو');
      }
      $$('[data-sidebar-collapse]').forEach(function (b) {
        b.addEventListener('click', function (e) {
          e.preventDefault();
          shellEl.classList.toggle('sidebar-collapsed');
          try { localStorage.setItem('moderncrm-sidebar', shellEl.classList.contains('sidebar-collapsed') ? '1' : '0'); } catch (e) { }
          paintCollapseBtn();
        });
      });
      if (shellEl && (function () { try { return localStorage.getItem('moderncrm-sidebar') === '1'; } catch (e) { return false; } })()) {
        shellEl.classList.add('sidebar-collapsed');
      }
      paintCollapseBtn();

      /* زیرمنوهای سایدبار */
      $$('[data-nav-toggle]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var sub = btn.nextElementSibling;
          var open = btn.classList.toggle('is-open');
          if (sub) sub.style.display = open ? '' : 'none';
        });
      });

      /* منوی شروع */
      var start = $('#startMenu');
      $$('[data-start-toggle]').forEach(function (b) {
        b.addEventListener('click', function (e) {
          e.stopPropagation();
          var willOpen = !start.classList.contains('is-open');
          $$('.dropdown-menu.is-open').forEach(function (m) { m.classList.remove('is-open'); });
          start.classList.toggle('is-open', willOpen);
          b.classList.toggle('is-open', willOpen);
        });
      });

      /* ساعت و تاریخ نوار وظیفه */
      function tick() {
        var now = new Date();
        var t = $('#trayTime'), dd = $('#trayDate');
        if (t) t.textContent = fa(pad(now.getHours()) + ':' + pad(now.getMinutes()));
        if (dd) dd.textContent = jsWeekday(now) + '، ' + jLong(now).replace(/^\S+\s*/, '');
      }
      tick(); setInterval(tick, 20000);

      /* تمام‌صفحه */
      $$('[data-tray-fullscreen]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (!d.fullscreenElement) { d.documentElement.requestFullscreen && d.documentElement.requestFullscreen(); }
          else { d.exitFullscreen && d.exitFullscreen(); }
        });
      });

      /* بستن منوها با کلیک بیرون */
      d.addEventListener('click', function (e) {
        if (!e.target.closest('.dropdown')) $$('.dropdown-menu.is-open').forEach(function (m) { m.classList.remove('is-open'); });
        if (!e.target.closest('.snap-picker') && !e.target.closest('[data-max-btn]')) $$('.snap-picker.is-open').forEach(function (m) { m.classList.remove('is-open'); });
        if (!e.target.closest('#startMenu') && !e.target.closest('[data-start-toggle]')) {
          var s = $('#startMenu'); if (s) s.classList.remove('is-open');
          $$('[data-start-toggle]').forEach(function (b) { b.classList.remove('is-open'); });
        }
      });
    }

    function mount() {
      var body = d.body;
      if (body.getAttribute('data-shell') === 'none') return;
      var active = body.getAttribute('data-page') || '';
      var sb = $('#sidebar'); if (sb) sb.innerHTML = sidebarHTML(active);
      var tb = $('#topbar'); if (tb) tb.innerHTML = topbarHTML();
      var task = $('#taskbar'); if (task) task.innerHTML = taskbarHTML();
      var sm = $('#startMenu'); if (sm) sm.innerHTML = startMenuHTML();
      /* دکمه جمع‌کردن سایدبار باید قبل از bind ساخته شود */
      var brand = $('.sidebar-brand');
      if (brand && sb && !brand.querySelector('[data-sidebar-collapse]')) {
        var btn = d.createElement('button');
        btn.className = 'sidebar-collapse-btn';
        btn.setAttribute('data-sidebar-collapse', '');
        btn.setAttribute('aria-label', 'جمع کردن منو');
        btn.setAttribute('data-tip', 'جمع / باز کردن منو');
        btn.setAttribute('data-tip-pos', 'bottom');
        brand.appendChild(btn);
      }
      bind();
      body.classList.toggle('has-taskbar', body.hasAttribute('data-taskbar'));
    }

    return { mount: mount, sidebarHTML: sidebarHTML, topbarHTML: topbarHTML, startMenuHTML: startMenuHTML };
  })();

  /* ==========================================================================
   * 11-ب) انتخابگر تاریخ شمسی — <input data-jdate>
   *  - data-jdate="today"  مقدار پیش‌فرض امروز
   *  - data-jdate-min / data-jdate-max  (اختیاری، به شکل ۱۴۰۵/۰۷/۰۱)
   *  لایه‌ی تقویم مثل تولتیپ فرزند <body> است تا در مودال و کارت‌ها بریده نشود.
   *  رویداد change روی input پس از انتخاب ارسال می‌شود.
   * ========================================================================== */
  var datePicker = (function () {
    var pop = null, input = null, view = null;
    var WD = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
    function el() {
      if (pop) return pop;
      pop = d.createElement('div');
      pop.className = 'jdp';
      pop.setAttribute('role', 'dialog');
      pop.setAttribute('aria-label', 'انتخاب تاریخ');
      d.body.appendChild(pop);
      pop.addEventListener('mousedown', function (e) { e.preventDefault(); }); /* فوکوس روی input بماند */
      pop.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        if (b.hasAttribute('data-jdp-prev')) shift(-1);
        else if (b.hasAttribute('data-jdp-next')) shift(1);
        else if (b.hasAttribute('data-jdp-today')) pick(jalali.toJalali(new Date()));
        else if (b.hasAttribute('data-jdp-clear')) { input.value = ''; fire(); close(); }
        else if (b.hasAttribute('data-jdp-day')) pick({ jy: view.jy, jm: view.jm, jd: +b.getAttribute('data-jdp-day') });
      });
      return pop;
    }
    function fire() { input.dispatchEvent(new Event('change', { bubbles: true })); input.dispatchEvent(new Event('input', { bubbles: true })); }
    function pick(o) { input.value = jalali.format(o); fire(); close(); input.focus(); }
    function shift(n) {
      var m = view.jm + n, y = view.jy;
      if (m < 1) { m = 12; y--; } if (m > 12) { m = 1; y++; }
      view = { jy: y, jm: m }; render();
    }
    function cmp(a, b) { return (a.jy - b.jy) || (a.jm - b.jm) || (a.jd - b.jd); }
    function render() {
      var today = jalali.toJalali(new Date());
      var sel = jalali.parse(input.value);
      var min = jalali.parse(input.getAttribute('data-jdate-min'));
      var max = jalali.parse(input.getAttribute('data-jdate-max'));
      var first = jalali.toGregorian(view.jy, view.jm, 1);
      var lead = (first.getDay() + 1) % 7; /* شنبه = ۰ */
      var len = jalali.monthLength(view.jy, view.jm);
      var cells = '';
      for (var i = 0; i < lead; i++) cells += '<span class="jdp-pad"></span>';
      for (var dd = 1; dd <= len; dd++) {
        var o = { jy: view.jy, jm: view.jm, jd: dd };
        var cls = 'jdp-day';
        if (cmp(o, today) === 0) cls += ' is-today';
        if (sel && cmp(o, sel) === 0) cls += ' is-selected';
        if ((lead + dd - 1) % 7 === 6) cls += ' is-holiday';
        var dis = (min && cmp(o, min) < 0) || (max && cmp(o, max) > 0);
        cells += '<button type="button" class="' + cls + '" data-jdp-day="' + dd + '"' + (dis ? ' disabled' : '') + '>' + fa(dd) + '</button>';
      }
      el().innerHTML =
        '<div class="jdp-head">' +
          '<button type="button" class="jdp-nav" data-jdp-prev data-tip="ماه قبل">' + icon('chevron-right', 16) + '</button>' +
          '<div class="jdp-title">' + JMonthNames[view.jm - 1] + ' <span class="num">' + fa(view.jy) + '</span></div>' +
          '<button type="button" class="jdp-nav" data-jdp-next data-tip="ماه بعد">' + icon('chevron-left', 16) + '</button>' +
        '</div>' +
        '<div class="jdp-week">' + WD.map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div>' +
        '<div class="jdp-grid">' + cells + '</div>' +
        '<div class="jdp-foot">' +
          '<button type="button" class="btn btn-sm btn-soft" data-jdp-today>' + icon('calendar-check', 14) + ' امروز</button>' +
          '<button type="button" class="btn btn-sm btn-ghost" data-jdp-clear>پاک کردن</button>' +
        '</div>';
    }
    function place() {
      if (!pop || !input) return;
      var r = (input.closest('.input-wrap') || input).getBoundingClientRect();
      var pw = pop.offsetWidth, ph = pop.offsetHeight;
      var top = r.bottom + 6;
      if (top + ph > w.innerHeight - 8 && r.top - ph - 6 > 8) top = r.top - ph - 6;
      var left = r.right - pw; /* راست‌چین با فیلد */
      left = clamp(left, 8, w.innerWidth - pw - 8);
      pop.style.top = top + 'px'; pop.style.left = left + 'px';
    }
    function open(inp) {
      if (inp.disabled || inp.hasAttribute('data-jdate-off')) return;
      input = inp;
      var cur = jalali.parse(inp.value) || jalali.toJalali(new Date());
      view = { jy: cur.jy, jm: cur.jm };
      render();
      el().classList.add('is-open');
      inp.setAttribute('aria-expanded', 'true');
      place();
    }
    function close() {
      if (pop) pop.classList.remove('is-open');
      if (input) input.setAttribute('aria-expanded', 'false');
      input = null;
    }
    function bindAll(scope) {
      $$('[data-jdate]', scope).forEach(function (inp) {
        if (inp.__jdp) return; inp.__jdp = true;
        inp.setAttribute('autocomplete', 'off');
        inp.setAttribute('aria-haspopup', 'dialog');
        if (!inp.placeholder) inp.placeholder = '۱۴۰۵/۰۱/۰۱';
        if (inp.getAttribute('data-jdate') === 'today' && !inp.value) inp.value = jalali.format(jalali.toJalali(new Date()));
        inp.addEventListener('focus', function () { open(inp); });
        inp.addEventListener('click', function () { if (input !== inp) open(inp); });
        inp.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' || e.key === 'Tab') close();
          if (e.key === 'ArrowDown' && input !== inp) { e.preventDefault(); open(inp); }
        });
        inp.addEventListener('blur', function () { setTimeout(function () { if (input === inp && d.activeElement !== inp) close(); }, 120); });
        inp.addEventListener('input', function () { if (input === inp) { var o = jalali.parse(inp.value); if (o) { view = { jy: o.jy, jm: o.jm }; render(); } } });
        /* دکمه‌ی تقویم کنار فیلد */
        var wrap = inp.closest('.input-wrap');
        var trig = wrap && wrap.querySelector('[data-jdate-trigger]');
        if (trig) trig.addEventListener('click', function (e) { e.preventDefault(); if (input === inp) close(); else inp.focus(); open(inp); });
      });
    }
    d.addEventListener('mousedown', function (e) {
      if (!input || !pop) return;
      if (pop.contains(e.target) || e.target === input || e.target.closest('[data-jdate-trigger]')) return;
      close();
    });
    w.addEventListener('resize', place);
    w.addEventListener('scroll', function (e) { if (pop && !pop.contains(e.target)) place(); }, true);
    return { bind: bindAll, open: open, close: close };
  })();

  /* قالب‌بندی عددی هنگام تایپ: <input data-num-mask> → ۱۲٫۵۰۰٫۰۰۰ */
  function initNumMasks(scope) {
    $$('[data-num-mask]', scope).forEach(function (inp) {
      if (inp.__nm) return; inp.__nm = true;
      inp.setAttribute('inputmode', 'numeric');
      var fmt = function () {
        var raw = String(en(inp.value)).replace(/[^\d]/g, '');
        inp.value = raw ? num(+raw) : '';
      };
      inp.addEventListener('input', fmt);
      if (inp.value) fmt();
    });
  }

  /* ==========================================================================
   * 12) مقداردهی کلی
   * ========================================================================== */
  function init(scope) {
    var s = scope || d;
    renderIcons(s);
    initDropdowns(s);
    initTabs(s);
    initAccordions(s);
    initForms(s);
    initTables(s);
    initKanban(s);
    initViews(s);
    initCounters(s);
    datePicker.bind(s);
    initNumMasks(s);
    charts.render(s);

    /* باز/بسته کردن مودال‌ها و دراورها */
    $$('[data-modal-open]', s).forEach(function (b) {
      if (b.__bound) return; b.__bound = true;
      b.addEventListener('click', function (e) { e.preventDefault(); modal.open(b.getAttribute('data-modal-open')); });
    });
    $$('[data-modal-close]', s).forEach(function (b) {
      if (b.__bound) return; b.__bound = true;
      b.addEventListener('click', function (e) { e.preventDefault(); modal.close(b.getAttribute('data-modal-close') || undefined); });
    });
    $$('[data-drawer-open]', s).forEach(function (b) {
      if (b.__bound) return; b.__bound = true;
      b.addEventListener('click', function (e) { e.preventDefault(); drawer.open(b.getAttribute('data-drawer-open')); });
    });
    $$('[data-drawer-close]', s).forEach(function (b) {
      if (b.__bound) return; b.__bound = true;
      b.addEventListener('click', function (e) { e.preventDefault(); drawer.close(b.getAttribute('data-drawer-close') || undefined); });
    });
    $$('[data-palette-open]', s).forEach(function (b) {
      if (b.__bound) return; b.__bound = true;
      b.addEventListener('click', function (e) { e.preventDefault(); palette.open(); });
    });
    $$('[data-confirm]', s).forEach(function (b) {
      if (b.__bound) return; b.__bound = true;
      b.addEventListener('click', function () {
        modal.confirm({
          title: b.getAttribute('data-confirm-title') || 'حذف آیتم',
          msg: b.getAttribute('data-confirm') || 'این عملیات قابل بازگشت نیست. آیا مطمئن هستید؟',
          danger: true, okText: b.getAttribute('data-confirm-ok') || 'بله، حذف کن', icon: 'trash'
        }).then(function (ok) {
          if (ok) toast({ type: 'success', title: 'انجام شد', msg: 'آیتم مورد نظر با موفقیت حذف شد.' });
        });
      });
    });
    $$('[data-tooltip]', s).forEach(function (b) {
      if (b.__bound) return; b.__bound = true;
      if (!b.hasAttribute('data-tip')) {
        var txt = b.getAttribute('data-tooltip') || b.getAttribute('title');
        if (txt) b.setAttribute('data-tip', txt);
      }
      b.removeAttribute('title');
    });
    $$('.overlay', s).forEach(function (ov) {
      if (ov.__bound) return; ov.__bound = true;
      if (ov.classList.contains('cmdk-overlay')) return;
      ov.addEventListener('click', function (e) { if (e.target === ov) modal.close(ov); });
    });
    $$('[data-toggle-visibility]', s).forEach(function (b) {
      if (b.__bound) return; b.__bound = true;
      b.addEventListener('click', function (e) {
        e.preventDefault();
        var t = $(b.getAttribute('data-toggle-visibility'));
        if (t) t.classList.toggle('d-none');
      });
    });
    $$('[data-segmented]', s).forEach(function (grp) {
      if (grp.__bound) return; grp.__bound = true;
      grp.addEventListener('click', function (e) {
        var b = e.target.closest('.seg');
        if (!b) return;
        $$('.seg', grp).forEach(function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active');
      });
    });
    $$('[data-chip-group]', s).forEach(function (grp) {
      if (grp.__bound) return; grp.__bound = true;
      grp.addEventListener('click', function (e) {
        var c = e.target.closest('.chip');
        if (!c) return;
        c.classList.toggle('is-active');
      });
    });
    /* ورودی‌های عددی/تاریخی: اعداد فارسی در placeholder و مقدار */
    $$('[data-fa-mask]', s).forEach(function (inp) {
      if (inp.__bound) return; inp.__bound = true;
      inp.addEventListener('input', function () { inp.value = fa(inp.value); });
    });

    /* ------------------------------------------------------------------
     * واسطه‌ی سراسری برای محتوای پویا
     * هر دکمه‌ای که بعد از راه‌اندازی (رندر جدول/کانبان/کارت‌ها) اضافه شود،
     * با همین شنونده‌ی سطح سند کار می‌کند و «کار نکردن دکمه» پیش نمی‌آید.
     * عناصری که مستقیم بایند شده‌اند (__bound) دوباره اجرا نمی‌شوند.
     * ------------------------------------------------------------------ */
    if (!d.__crmDelegated) {
      d.__crmDelegated = true;
      d.addEventListener('click', function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        var hook = function (sel) { var el = t.closest(sel); return el && !el.__bound ? el : null; };
        var el;
        if ((el = hook('[data-modal-open]'))) { e.preventDefault(); modal.open(el.getAttribute('data-modal-open')); return; }
        if ((el = hook('[data-modal-close]'))) { e.preventDefault(); modal.close(el.getAttribute('data-modal-close') || undefined); return; }
        if ((el = hook('[data-drawer-open]'))) { e.preventDefault(); drawer.open(el.getAttribute('data-drawer-open')); return; }
        if ((el = hook('[data-drawer-close]'))) { e.preventDefault(); drawer.close(el.getAttribute('data-drawer-close') || undefined); return; }
        if ((el = hook('[data-copy]'))) {
          e.preventDefault();
          var txt = el.getAttribute('data-copy') || '';
          if (w.navigator && navigator.clipboard) navigator.clipboard.writeText(txt);
          toast({ type: 'success', title: 'کپی شد', msg: txt, duration: 2200 });
          return;
        }
        if ((el = hook('[data-print]'))) { e.preventDefault(); w.print(); return; }
        if ((el = hook('[data-password-toggle]'))) {
          e.preventDefault();
          var inp = $(el.getAttribute('data-password-toggle'));
          if (inp) { var show = inp.type === 'password'; inp.type = show ? 'text' : 'password'; el.innerHTML = icon(show ? 'eye-off' : 'eye', 17); }
          return;
        }
        if ((el = hook('[data-confirm]'))) {
          e.preventDefault();
          modal.confirm({
            title: el.getAttribute('data-confirm-title') || 'حذف آیتم',
            msg: el.getAttribute('data-confirm') || 'این عملیات قابل بازگشت نیست. آیا مطمئن هستید؟',
            danger: true, okText: el.getAttribute('data-confirm-ok') || 'بله، حذف کن', icon: 'trash'
          }).then(function (ok) {
            if (ok) toast({ type: 'success', title: 'انجام شد', msg: 'آیتم مورد نظر با موفقیت حذف شد.' });
          });
          return;
        }
        /* منوهای بازشو (تیک‌شو) هم برای محتوای پویا */
        if ((el = hook('[data-dropdown-toggle]'))) {
          e.preventDefault(); e.stopPropagation();
          var menu = el.parentElement ? el.parentElement.querySelector('.dropdown-menu') : null;
          if (!menu) return;
          var willOpen = !menu.classList.contains('is-open');
          $$('.dropdown-menu.is-open').forEach(function (m) { m.classList.remove('is-open'); });
          menu.classList.toggle('is-open', willOpen);
          el.classList.toggle('is-open', willOpen);
          return;
        }
      });
    }
  }

  /* ==========================================================================
   * 13) راه‌اندازی
   * ========================================================================== */
  function boot() {
    /* قالب تک‌حالته است (روشن)؛ فقط اثر تم قدیمی پاک می‌شود */
    d.documentElement.removeAttribute('data-theme');
    try { localStorage.removeItem('moderncrm-theme'); } catch (e) { }
    shell.mount();
    init(d);
    if (w.CRM && w.CRM.win && w.CRM.win.mount) w.CRM.win.mount();

    /* میان‌برهای صفحه‌کلید (در صفحات بدون پوسته مانند ورود، غیرفعال است) */
    var noShell = d.body.getAttribute('data-shell') === 'none';
    d.addEventListener('keydown', function (e) {
      if (noShell) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); palette.open(); }
      if (e.key === 'Escape') {
        var open = $('.overlay[style*="grid"]');
        if (open && !open.classList.contains('cmdk-overlay')) modal.close(open);
        palette.close();
      }
    });

    /* نمایش پیام خوش‌آمد فقط در داشبورد */
    if (d.body.getAttribute('data-page') === 'dashboard') {
      setTimeout(function () {
        toast({ type: 'info', title: 'به مدرن‌CRM خوش آمدید 👋', msg: 'با کلیک روی آیکون ⛶ هر کارت، آن را به پنجره شناور تبدیل کنید.' });
      }, 1400);
    }
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot);
  else boot();

  /* API عمومی */
  return {
    $: $, $$: $$, fa: fa, en: en, num: num, money: money, moneyShort: moneyShort, esc: esc,
    icon: icon, renderIcons: renderIcons, avatar: avatar, rel: rel, debounce: debounce, clamp: clamp, uid: uid,
    jDate: jDate, jLong: jLong, jsWeekday: jsWeekday, jalaliMonthGrid: jalaliMonthGrid,
    jalali: jalali, datePicker: datePicker,
    todayJalali: todayJalali, JMonthNames: JMonthNames, JWeekNames: JWeekNames,
    tip: tip, toast: toast, modal: modal, drawer: drawer,
    charts: charts, palette: palette, shell: shell, init: init, boot: boot, data: DATA
  };
})(window, document);
