/*!
 * ============================================================================
 *  ModernCRM · windows.js — مدیر پنجره‌های شبیه‌سازی‌شده ویندوز
 *  امکانات: باز کردن کارت‌ها به‌صورت پنجره شناور، جابه‌جایی با کشیدن (Drag)،
 *  تغییر اندازه از ۸ جهت، ماکسیمایز، چسبیدن به لبه‌ها (Snap)،
 *  چیدمان از پیش‌تعریف‌شده و چرخه تمرکز (Focus/Z-Index).
 * ============================================================================
 */
(function (w, d) {
  'use strict';
  var CRM = w.CRM;
  if (!CRM) return;

  var $ = CRM.$, $$ = CRM.$$;
  var layer, zTop = 60, seq = 0, wins = {};
  var snapEl = null, snapBadge = null, pickerTimer = null;
  var MIN_W = 320, MIN_H = 200, TITLE_H = 44;

  /* ------------------------------------------------------------------ ابزار */
  function workspace() {
    var topbar = $('.topbar');
    var sidebar = $('.sidebar');
    var top = topbar && topbar.offsetParent !== null ? topbar.getBoundingClientRect().height : 0;
    var sidebarVisible = sidebar && w.innerWidth > 1024 && sidebar.offsetParent !== null;
    var right = sidebarVisible ? sidebar.getBoundingClientRect().width : 0;
    var vw = w.innerWidth, vh = w.innerHeight;
    return {
      left: 0, top: Math.round(top), right: right, bottom: 0,
      x: 0, y: Math.round(top),
      w: Math.round(vw - right), h: Math.round(vh - top),
      vw: vw, vh: vh
    };
  }

  function clampToWork(rect) {
    var ws = workspace();
    rect.w = Math.min(rect.w, ws.vw - 16);
    rect.h = Math.min(rect.h, ws.vh - 16);
    rect.x = Math.max(-rect.w + 120, Math.min(rect.x, ws.vw - 120));
    rect.y = Math.max(0, Math.min(rect.y, ws.vh - TITLE_H - 8));
    return rect;
  }

  function centerRect(width, height) {
    var ws = workspace();
    var cw = Math.min(width || 900, ws.w - 40);
    var ch = Math.min(height || 600, ws.h - 40);
    return clampToWork({
      x: Math.round(ws.x + (ws.w - cw) / 2),
      y: Math.round(ws.y + (ws.h - ch) / 2 + 4),
      w: cw, h: ch
    });
  }

  function setRect(el, r, animate) {
    if (animate) {
      el.classList.add('is-snapping');
      clearTimeout(el.__snapT);
      el.__snapT = setTimeout(function () { el.classList.remove('is-snapping'); }, 240);
    }
    el.style.left = Math.round(r.x) + 'px';
    el.style.top = Math.round(r.y) + 'px';
    el.style.width = Math.round(r.w) + 'px';
    el.style.height = Math.round(r.h) + 'px';
  }

  function readRect(el) {
    return {
      x: parseFloat(el.style.left) || 0,
      y: parseFloat(el.style.top) || 0,
      w: parseFloat(el.style.width) || 800,
      h: parseFloat(el.style.height) || 560
    };
  }

  function focus(id) {
    var win = wins[id];
    if (!win) return;
    Object.keys(wins).forEach(function (k) {
      wins[k].el.classList.toggle('is-active', k === id);
      if (wins[k].el.classList.contains('is-active')) wins[k].el.style.zIndex = ++zTop;
    });
  }

  /* ------------------------------------------------------- ساختن پنجره */
  function templates() {
    var map = {};
    $$('[data-win]').forEach(function (el) { map[el.getAttribute('data-win')] = el; });
    return map;
  }

  function build(id, src, opts) {
    opts = opts || {};
    var tpl = templates()[id];
    if (!tpl) return null;
    var title = tpl.getAttribute('data-win-title') || id;
    var sub = tpl.getAttribute('data-win-sub') || '';
    var ic = tpl.getAttribute('data-win-icon') || 'window';
    var size = (tpl.getAttribute('data-win-size') || '920x620').split('x');

    var contentSel = tpl.getAttribute('data-win-content');
    var contentEl = contentSel ? $(contentSel) : tpl;
    var bodyHTML = contentEl ? contentEl.innerHTML : '';
    var mode = tpl.getAttribute('data-win-mode') || 'card';
    if (mode === 'card') bodyHTML = contentEl.innerHTML; /* درون کارت، بدون پوسته کارت */

    var el = d.createElement('section');
    el.className = 'window anim-pop';
    el.setAttribute('data-win-id', id);
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', title);
    el.innerHTML =
      '<header class="win-titlebar">' +
        '<div class="win-drag-handle">' +
          '<span class="win-ic">' + CRM.icon(ic, 16) + '</span>' +
          '<span style="min-width:0">' +
            '<span class="win-title">' + CRM.esc(title) + '</span>' +
            (sub ? '<span class="win-sub d-block">' + CRM.esc(sub) + '</span>' : '') +
          '</span>' +
        '</div>' +
        '<div class="win-controls">' +
          '<button class="win-btn" data-win-max="' + id + '" data-max-btn data-tip-pos="bottom" data-tip="ماکسیمایز / چیدمان">' + CRM.icon('square', 15) + '</button>' +
          '<button class="win-btn close" data-win-close="' + id + '" data-tip-pos="bottom" data-tip="بستن">' + CRM.icon('x', 16) + '</button>' +
        '</div>' +
        '<div class="snap-picker" data-snap-picker="' + id + '">' +
          '<div class="sp-title">انتخاب چیدمان پنجره</div>' +
          '<div class="snap-grid">' +
            '<div class="snap-zone left" data-snap="left"><i></i></div>' +
            '<div class="snap-zone right" data-snap="right"><i></i></div>' +
            '<div class="snap-zone top" data-snap="top"><i></i></div>' +
            '<div class="snap-zone bottom" data-snap="bottom"><i></i></div>' +
            '<div class="snap-zone full" data-snap="full"><i></i></div>' +
          '</div>' +
        '</div>' +
      '</header>' +
      '<div class="win-body"><div class="win-content">' + bodyHTML + '</div></div>' +
      ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'].map(function (p) {
        return '<div class="win-resize ' + p + '" data-resize="' + p + '"></div>';
      }).join('');
    layer.appendChild(el);

    /* پاک‌سازی نشانه‌های مقداردهی اولیه در محتوای کلون‌شده */
    $$('[data-icon-done]', el).forEach(function (n) { n.removeAttribute('data-icon-done'); n.innerHTML = ''; });
    $$('[data-chart-done]', el).forEach(function (n) { n.removeAttribute('data-chart-done'); });
    $$('.win-open-btn', el).forEach(function (n) { n.remove(); });
    $$('[id]', el).forEach(function (n) { n.removeAttribute('id'); });

    var rect = opts.rect || centerRect(parseInt(size[0], 10), parseInt(size[1], 10));
    if (!opts.rect) {
      var off = (seq++ % 6) * 26;
      rect.x = Math.min(rect.x + off, workspace().vw - rect.w - 12);
      rect.y = Math.min(rect.y + off * 0.6, workspace().vh - rect.h - 12);
      rect = clampToWork(rect);
    }
    setRect(el, rect);
    wins[id] = { id: id, el: el, rect: rect, maximized: false, prev: null, snap: null };

    CRM.init(el.querySelector('.win-content'));
    if (w.CRM.win.onOpen) w.CRM.win.onOpen(id);
    if (tpl.hasAttribute('data-win-detach')) tpl.classList.add('is-floating');
    return wins[id];
  }

  /* ------------------------------------------------------------ عملیات */
  function open(id, opts) {
    var win = wins[id];
    if (win) {
      focus(id); return win;
    }
    var tpl = templates()[id];
    if (!tpl) { CRM.toast({ type: 'warning', title: 'پنجره یافت نشد', msg: 'شناسه «' + id + '» تعریف نشده است.' }); return null; }
    win = build(id, tpl, opts);
    focus(id);
    return win;
  }

  function close(id) {
    var win = wins[id];
    if (!win) return;
    win.el.style.animation = 'pop-out 140ms ease both';
    win.el.style.pointerEvents = 'none';
    setTimeout(function () { win.el.remove(); }, 140);
    delete wins[id];
    var tpl = templates()[id];
    if (tpl) tpl.classList.remove('is-floating');
    if (w.CRM.win.onClose) w.CRM.win.onClose(id);
    var rest = Object.keys(wins);
    if (rest.length) focus(rest[rest.length - 1]);
  }

  function restoreBounds(win, animate) {
    var r = win.prev || centerRect(800, 560);
    win.el.classList.remove('is-maximized');
    setRect(win.el, r, animate);
    win.maximized = false;
    win.snap = null;
    var btn = $('[data-win-max="' + win.id + '"]', win.el);
    if (btn) btn.innerHTML = CRM.icon('square', 15);
  }

  function toggleMax(id, force) {
    var win = wins[id];
    if (!win) return;
    var shouldMax = force === undefined ? !win.maximized : force;
    if (shouldMax) {
      win.prev = readRect(win.el);
      win.el.classList.add('is-maximized');
      var ws = workspace();
      setRect(win.el, { x: ws.x, y: ws.y, w: ws.w, h: ws.h }, true);
      win.maximized = true; win.snap = 'full';
      var btn = $('[data-win-max="' + id + '"]', win.el);
      if (btn) btn.innerHTML = CRM.icon('minimize', 15);
    } else {
      restoreBounds(win, true);
    }
    focus(id);
  }

  function snap(id, zone) {
    var win = wins[id];
    if (!win) return;
    var ws = workspace();
    var r;
    var half = Math.round(ws.w / 2), halfH = Math.round(ws.h / 2);
    switch (zone) {
      case 'left': r = { x: ws.x, y: ws.y, w: half, h: ws.h }; break;
      case 'right': r = { x: ws.x + ws.w - half, y: ws.y, w: half, h: ws.h }; break;
      case 'bottom': r = { x: ws.x, y: ws.y + ws.h - halfH, w: ws.w, h: halfH }; break;
      case 'top':
      case 'full': return toggleMax(id, true);
      default: return;
    }
    if (!win.maximized) win.prev = readRect(win.el);
    if (win.maximized) win.el.classList.remove('is-maximized');
    win.maximized = false;
    win.snap = zone;
    setRect(win.el, r, true);
    focus(id);
  }

  function maximizeAll() {
    var ids = Object.keys(wins);
    if (!ids.length) { CRM.toast({ type: 'info', title: 'پنجره‌ای باز نیست', msg: 'ابتدا یک کارت را به پنجره تبدیل کنید.' }); return; }
    ids.forEach(function (id) { toggleMax(id, true); });
    CRM.toast({ type: 'success', title: 'همه پنجره‌ها ماکسیمایز شدند', msg: fa(ids.length) + ' پنجره فعال' });
    function fa(n) { return CRM.fa(n); }
  }

  function tile() {
    var ids = Object.keys(wins);
    if (ids.length < 2) {
      /* اگر پنجره‌ای باز نیست، ویجت‌های قابل‌جدا‌شدن همین صفحه را باز می‌کنیم
         تا دکمه «چیدمان کاشی» همیشه نتیجه بدهد. */
      var detach = $$('[data-win-detach]').filter(function (el) {
        return !wins[el.getAttribute('data-win')];
      });
      if (detach.length) {
        detach.slice(0, 4).forEach(function (el) { open(el.getAttribute('data-win')); });
        ids = Object.keys(wins);
      }
    }
    if (ids.length < 2) { CRM.toast({ type: 'info', title: 'برای چیدمان حداقل دو پنجره لازم است' }); return; }
    var ws = workspace();
    var cols = Math.ceil(Math.sqrt(ids.length)), rows = Math.ceil(ids.length / cols);
    ids.forEach(function (id, i) {
      var win = wins[id];
      var c = i % cols, r = Math.floor(i / cols);
      win.el.classList.remove('is-maximized');
      win.maximized = false;
      setRect(win.el, {
        x: ws.x + c * (ws.w / cols),
        y: ws.y + r * (ws.h / rows),
        w: ws.w / cols - 6,
        h: ws.h / rows - 6
      }, true);
      win.el.style.zIndex = ++zTop;
    });
    CRM.toast({ type: 'success', title: 'چیدمان کاشی‌ای اعمال شد', msg: CRM.fa(ids.length) + ' پنجره' });
  }

  function closeAll() {
    Object.keys(wins).forEach(function (id) { close(id); });
  }

  /* --------------------------------------------------- کشیدن و رها کردن */
  function bindDrag() {
    var drag = null;
    layer.addEventListener('pointerdown', function (e) {
      var winEl = e.target.closest('.window');
      if (!winEl) return;
      var id = winEl.getAttribute('data-win-id');
      focus(id);

      var resizeHandle = e.target.closest('[data-resize]');
      if (resizeHandle && !winEl.classList.contains('is-maximized')) {
        var dir = resizeHandle.getAttribute('data-resize');
        drag = { mode: 'resize', id: id, dir: dir, startX: e.clientX, startY: e.clientY, rect: readRect(winEl), el: winEl };
        e.preventDefault();
        return;
      }
      var bar = e.target.closest('.win-titlebar');
      if (bar && !e.target.closest('.win-controls') && !e.target.closest('.snap-picker')) {
        drag = { mode: 'move', id: id, startX: e.clientX, startY: e.clientY, rect: readRect(winEl), el: winEl, moved: false };
        e.preventDefault();
      }
    });

    w.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.startX, dy = e.clientY - drag.startY;

      if (drag.mode === 'move') {
        if (Math.abs(dx) + Math.abs(dy) < 3) return;
        if (!drag.moved) {
          drag.moved = true;
          if (wins[drag.id] && wins[drag.id].maximized) {
            /* بازگردانی از حالت ماکسیمایز هنگام کشیدن (مانند ویندوز) */
            var ratio = (e.clientX - drag.rect.x) / Math.max(1, drag.rect.w);
            toggleMax(drag.id, false);
            var r = readRect(drag.el);
            drag.rect = { x: e.clientX - r.w * ratio, y: r.y, w: r.w, h: r.h };
            drag.startX = e.clientX; drag.startY = e.clientY; dx = 0; dy = 0;
          }
          drag.el.classList.add('is-dragging');
        }
        var r2 = { x: drag.rect.x + dx, y: Math.max(0, drag.rect.y + dy), w: drag.rect.w, h: drag.rect.h };
        setRect(drag.el, clampToWork(r2));
        showSnapHint(e);
        return;
      }

      if (drag.mode === 'resize') {
        var r3 = { x: drag.rect.x, y: drag.rect.y, w: drag.rect.w, h: drag.rect.h };
        var has = function (c) { return drag.dir.indexOf(c) > -1; };
        if (has('e')) { var nw = Math.max(MIN_W, drag.rect.w - dx); r3.x = drag.rect.x + (drag.rect.w - nw); r3.w = nw; }
        if (has('w')) { r3.w = Math.max(MIN_W, drag.rect.w + dx); }
        if (has('s')) { var nh = Math.max(MIN_H, drag.rect.h - dy); r3.y = drag.rect.y + (drag.rect.h - nh); r3.h = nh; }
        if (has('n')) { r3.h = Math.max(MIN_H, drag.rect.h + dy); r3.y = drag.rect.y; r3.h = Math.max(MIN_H, drag.rect.h + dy); if (dy < 0) r3.y = drag.rect.y + dy; }
        setRect(drag.el, r3);
      }
    });

    w.addEventListener('pointerup', function () {
      if (!drag) return;
      if (drag.mode === 'move') {
        drag.el.classList.remove('is-dragging');
        var zone = currentSnapZone;
        if (zone) snap(drag.id, zone);
        hideSnapHint();
      }
      drag = null;
    });

    /* چیدمان‌های آماده با ماوس روی دکمه ماکسیمایز */
    layer.addEventListener('mouseover', function (e) {
      var btn = e.target.closest('[data-max-btn]');
      clearTimeout(pickerTimer);
      if (!btn) return;
      pickerTimer = setTimeout(function () {
        var picker = $('.snap-picker', btn.closest('.win-titlebar'));
        $$('.snap-picker.is-open').forEach(function (p) { if (p !== picker) p.classList.remove('is-open'); });
        if (picker) picker.classList.add('is-open');
      }, 600);
    });
    layer.addEventListener('mouseout', function (e) {
      if (e.target.closest && e.target.closest('[data-max-btn]')) clearTimeout(pickerTimer);
    });

    /* دوبار کلیک روی نوار عنوان = ماکسیمایز */
    layer.addEventListener('dblclick', function (e) {
      var bar = e.target.closest('.win-titlebar');
      if (!bar || e.target.closest('.win-controls') || e.target.closest('.snap-picker')) return;
      toggleMax(bar.closest('.window').getAttribute('data-win-id'));
    });
  }

  /* ---------------------------------------------- راهنمای چسبیدن به لبه */
  var currentSnapZone = null;
  function ensureSnapEls() {
    if (!snapEl) { snapEl = d.createElement('div'); snapEl.className = 'snap-preview'; snapEl.style.display = 'none'; d.body.appendChild(snapEl); }
    if (!snapBadge) { snapBadge = d.createElement('div'); snapBadge.className = 'snap-badge'; snapBadge.style.display = 'none'; d.body.appendChild(snapBadge); }
  }
  function showSnapHint(e) {
    ensureSnapEls();
    var ws = workspace();
    var pad = 6;
    var zone = null;
    if (e.clientY < ws.y + 12) zone = 'full';
    else if (e.clientX < ws.x + 12) zone = 'left';
    else if (e.clientX > ws.x + ws.w - 12) zone = 'right';
    else if (e.clientY > ws.y + ws.h - 12) zone = 'bottom';

    var labels = {
      full: { t: 'ماکسیمایز', i: 'maximize' },
      left: { t: 'چسبیدن به نیمه راست صفحه', i: 'columns' },
      right: { t: 'چسبیدن به نیمه چپ صفحه', i: 'columns' },
      bottom: { t: 'چسبیدن به نیمه پایین', i: 'rows' }
    };

    if (zone !== currentSnapZone) {
      currentSnapZone = zone;
      if (!zone) { hideSnapHint(); return; }
      var r;
      if (zone === 'full') r = { x: ws.x, y: ws.y, w: ws.w, h: ws.h };
      else if (zone === 'left') r = { x: ws.x, y: ws.y, w: ws.w / 2, h: ws.h };
      else if (zone === 'right') r = { x: ws.x + ws.w / 2, y: ws.y, w: ws.w / 2, h: ws.h };
      else r = { x: ws.x, y: ws.y + ws.h / 2, w: ws.w, h: ws.h / 2 };
      snapEl.style.display = 'block';
      snapEl.style.left = (r.x + pad / 2) + 'px';
      snapEl.style.top = (r.y + pad / 2) + 'px';
      snapEl.style.width = (r.w - pad) + 'px';
      snapEl.style.height = (r.h - pad) + 'px';
      /* در حالت راست‌چین، نیمه سمت راست از دید کاربر «اول» است */
      snapBadge.style.display = 'flex';
      snapBadge.innerHTML = CRM.icon(labels[zone].i, 15) + '<span>' + labels[zone].t + '</span>';
    }
  }
  function hideSnapHint() {
    currentSnapZone = null;
    if (snapEl) snapEl.style.display = 'none';
    if (snapBadge) snapBadge.style.display = 'none';
  }

  /* --------------------------------------------------- رویدادهای سراسری */
  function bindGlobal() {
    d.addEventListener('click', function (e) {
      var t;
      if ((t = e.target.closest('[data-win-open]'))) {
        e.preventDefault();
        var id = t.getAttribute('data-win-open') || (t.closest('[data-win]') && t.closest('[data-win]').getAttribute('data-win'));
        if (id) open(id);
        return;
      }
      if ((t = e.target.closest('[data-win-close]'))) {
        e.stopPropagation();
        close(t.getAttribute('data-win-close'));
        var menu = t.closest('.dropdown-menu'); if (menu) menu.classList.remove('is-open');
        return;
      }
      if ((t = e.target.closest('[data-win-max]'))) {
        var picker = $('.snap-picker.is-open');
        if (picker) { picker.classList.remove('is-open'); }
        toggleMax(t.getAttribute('data-win-max'));
        return;
      }
      if ((t = e.target.closest('[data-snap]'))) {
        snap(t.closest('.snap-picker').getAttribute('data-snap-picker'), t.getAttribute('data-snap'));
        t.closest('.snap-picker').classList.remove('is-open');
        return;
      }
      if ((t = e.target.closest('[data-win-max-all]'))) { maximizeAll(); return; }
      if ((t = e.target.closest('[data-win-tile]'))) { tile(); return; }
      if ((t = e.target.closest('[data-win-close-all]'))) { closeAll(); return; }
    });

    /* پنجره‌سازی خودکار: هر کارت سربرگ‌داری که data-win ندارد، یکی می‌گیرد
       (برای خارج‌کردن یک کارت از این قاعده، data-win-nobtn بگذارید) */
    var autoSeq = 0;
    var autoOff = d.body.getAttribute('data-win-auto') === 'off';
    $$('.card').forEach(function (card) {
      if (autoOff) return;
      if (card.hasAttribute('data-win') || card.hasAttribute('data-win-nobtn')) return;
      if (card.closest('.window')) return;
      /* اگر کارت داخل عنصری است که خودش data-win دارد (مثل ویجت‌های میزکار)،
         پنجره‌ی همان والد کافی است و نباید دکمه‌ی دومی ساخته شود */
      var owner = card.parentElement && card.parentElement.closest('[data-win]');
      if (owner) return;
      var head0 = card.querySelector('.card-head');
      var titleEl = card.querySelector('.card-title');
      if (!head0 || !titleEl) return;
      card.setAttribute('data-win', 'auto-' + (++autoSeq));
      var t = (titleEl.textContent || '').trim().replace(/\s+/g, ' ');
      if (t) card.setAttribute('data-win-title', t);
      var ic = head0.querySelector('[data-icon]');
      if (ic && ic.getAttribute('data-icon')) card.setAttribute('data-win-icon', ic.getAttribute('data-icon'));
    });

    /* دکمه ⛶ در سربرگ کارت‌ها — هر سربرگ فقط یک دکمه */
    $$('[data-win]').forEach(function (card) {
      if (card.hasAttribute('data-win-nobtn')) return;
      if (card.closest('.window')) return;
      var head = card.querySelector('.card-head');
      if (head && head.querySelector('.win-open-btn')) return;   /* قبلاً ساخته شده */
      var id = card.getAttribute('data-win');
      var btn = d.createElement('button');
      btn.className = 'tb-icon win-open-btn';
      btn.style.width = '30px'; btn.style.height = '30px';
      btn.setAttribute('data-win-open', id);
      btn.setAttribute('data-tip', 'بازکردن به‌صورت پنجره');
      btn.innerHTML = CRM.icon('maximize', 16);

      if (head) {
        var actions = head.querySelector('.card-actions');
        if (!actions) {
          actions = d.createElement('div');
          actions.className = 'card-actions';
          head.appendChild(actions);
        }
        actions.insertBefore(btn, actions.firstChild);
        return;
      }
      /* کارت‌هایی که سربرگ ندارند (KPI، تب‌ها، دموها): دکمه گوشه‌ی کارت، در هاور */
      if (w.getComputedStyle(card).position === 'static') card.style.position = 'relative';
      btn.className += ' win-open-btn--corner';
      btn.setAttribute('data-tip-pos', 'bottom');
      card.appendChild(btn);
    });
  }

  /* ------------------------------------------------------------- mount */
  function mount() {
    layer = $('#winLayer');
    if (!layer) {
      layer = d.createElement('div');
      layer.className = 'win-layer';
      layer.id = 'winLayer';
      d.body.appendChild(layer);
    }
    /* پنجره‌هایی که با data-win-open پیش‌فرض باز می‌شوند */
    bindGlobal();
    bindDrag();
    $$('[data-win-autoopen]').forEach(function (el) {
      setTimeout(function () { open(el.getAttribute('data-win')); }, +(el.getAttribute('data-win-autoopen') || 300));
    });
    w.addEventListener('resize', CRM.debounce(function () {
      var ws = workspace();
      Object.keys(wins).forEach(function (id) {
        var win = wins[id];
        if (win.maximized) setRect(win.el, { x: ws.x, y: ws.y, w: ws.w, h: ws.h });
        else if (win.snap) snap(id, win.snap);
      });
    }, 180));
  }

  w.CRM.win = {
    mount: mount, open: open, close: close, toggleMax: toggleMax, snap: snap,
    tile: tile, maximizeAll: maximizeAll, closeAll: closeAll,
    focus: focus, list: function () { return Object.keys(wins); }, workspace: workspace
  };
})(window, document);
