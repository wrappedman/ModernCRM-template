/*!
 * ============================================================================
 *  ModernCRM · warehouse.js — ابزارهای مشترک صفحه‌های «انبار» (فقط UI)
 *  بعد از app.js بارگذاری می‌شود و روی CRM.data.wh* کار می‌کند.
 *  در اتصال به بک‌اند فقط داده‌های CRM_DATA.wh* را از API پر کنید.
 * ============================================================================
 */
window.WH = (function (w, d) {
  'use strict';
  var CRM = w.CRM, D = CRM.data;
  var esc = CRM.esc, fa = CRM.fa, num = CRM.num, icon = CRM.icon;

  /* دسته‌هایی که موجودی فیزیکی ندارند */
  var NON_STOCK = ['software', 'service'];

  function product(code) { code = +code; for (var i = 0; i < D.whProducts.length; i++) if (D.whProducts[i].code === code) return D.whProducts[i]; return null; }
  function category(id) { for (var i = 0; i < D.whCategories.length; i++) if (D.whCategories[i].id === id) return D.whCategories[i]; return { id: id, title: '—', icon: 'package', tone: '' }; }
  function exitType(id) { for (var i = 0; i < D.whExitTypes.length; i++) if (D.whExitTypes[i].id === id) return D.whExitTypes[i]; return D.whExitTypes[0]; }
  function reader(i) { return D.whCardReaders[+i || 0] || D.whCardReaders[0]; }
  function isStocked(p) { return NON_STOCK.indexOf(p.cat) === -1; }
  function stockOf(p, store) {
    if (store === 'sub') return p.sub;
    if (store === 'public') return p.public ? p.main + p.sub : 0;
    if (store === 'all') return p.main + p.sub;
    return p.main;
  }

  /* وضعیت موجودی: موجود / کم‌موجود / ناموجود / نامحدود */
  function stockState(p, store) {
    if (!isStocked(p)) return { key: 'inf', tone: 'info', label: 'نامحدود' };
    var q = stockOf(p, store || 'main');
    var min = store === 'sub' ? Math.ceil(p.min / 3) : p.min;
    if (q <= 0) return { key: 'out', tone: 'danger', label: 'ناموجود' };
    if (q <= min) return { key: 'low', tone: 'warning', label: 'کم‌موجود' };
    return { key: 'ok', tone: 'success', label: 'موجود' };
  }
  function stockBadge(p, store) { var s = stockState(p, store); return '<span class="badge badge-' + s.tone + '">' + s.label + '</span>'; }

  function code(p) { return '<span class="pi-code num">' + fa(p.code) + '</span>'; }
  function productCell(p, sub) {
    var c = category(p.cat);
    return '<div class="d-flex items-center gap-3">' +
      '<span class="stat-icon ' + c.tone + '" style="width:34px;height:34px;border-radius:11px">' + icon(c.icon, 16) + '</span>' +
      '<div><div class="cell-main"><span class="ltr-cell">' + esc(p.name) + '</span></div>' +
      '<div class="fs-2xs text-muted">' + esc(sub != null ? sub : c.title) + '</div></div></div>';
  }

  /* ---------------------------------------------------- پرکردن کنترل‌ها */
  function fillCategories(sel, opts) {
    opts = opts || {};
    sel.innerHTML = (opts.placeholder ? '<option value="">' + esc(opts.placeholder) + '</option>' : '') +
      D.whCategories.map(function (c) { return '<option value="' + c.id + '">' + esc(c.title) + '</option>'; }).join('');
  }
  function fillProducts(sel, catId, opts) {
    opts = opts || {};
    var list = D.whProducts.filter(function (p) { return !catId || p.cat === catId; });
    sel.innerHTML = '<option value="">' + esc(opts.placeholder || (list.length ? 'انتخاب محصول…' : 'محصولی در این مجموعه نیست')) + '</option>' +
      list.map(function (p) {
        var extra = opts.withStock && isStocked(p) ? ' — موجودی ' + fa(stockOf(p, opts.store)) : '';
        return '<option value="' + p.code + '">' + esc(p.name) + extra + '</option>';
      }).join('');
  }
  function fillReaders(sel, selected) {
    sel.innerHTML = D.whCardReaders.map(function (r, i) { return '<option value="' + i + '"' + (i === (selected || 0) ? ' selected' : '') + '>' + esc(r) + '</option>'; }).join('');
  }
  function fillUsers(sel, placeholder) {
    sel.innerHTML = '<option value="">' + esc(placeholder || 'انتخاب مسئول…') + '</option>' +
      ['داوود توکلی'].concat(D.users.map(function (u) { return u.name; })).map(function (n) { return '<option>' + esc(n) + '</option>'; }).join('');
  }
  function fillInvoices(sel) {
    sel.innerHTML = '<option value="">انتخاب فاکتور…</option>' +
      D.invoices.map(function (i) { return '<option value="' + esc(i.no) + '">' + esc(i.no) + ' — ' + esc(i.customer) + '</option>'; }).join('');
  }
  /* «مجموعه» ← «محصول» (انتخاب وابسته) */
  function linkCategoryProduct(catSel, prodSel, opts) {
    fillCategories(catSel, { placeholder: 'همه مجموعه‌ها' });
    fillProducts(prodSel, '', opts);
    catSel.addEventListener('change', function () { fillProducts(prodSel, catSel.value, opts); prodSel.dispatchEvent(new Event('change')); });
    prodSel.addEventListener('change', function () {
      var p = product(prodSel.value);
      if (p && !catSel.value) { catSel.value = p.cat; fillProducts(prodSel, p.cat, opts); prodSel.value = p.code; }
    });
  }

  /* چک‌باکس «از شماره سریال» فیلد سریال را فعال/غیرفعال می‌کند */
  function linkToggle(chk, target, onChange) {
    var sync = function () {
      target.disabled = !chk.checked;
      target.closest('.form-group') && target.closest('.form-group').classList.toggle('is-disabled', !chk.checked);
      if (!chk.checked) target.value = '';
      if (onChange) onChange(chk.checked);
    };
    chk.addEventListener('change', sync); sync();
  }

  /* ------------------------------------------------------- آمار کلی */
  function totals() {
    var t = { products: D.whProducts.length, main: 0, sub: 0, low: 0, out: 0, demos: 0, value: 0 };
    D.whProducts.forEach(function (p) {
      if (!isStocked(p)) return;
      t.main += p.main; t.sub += p.sub; t.value += (p.main + p.sub) * p.cost;
      var s = stockState(p, 'main').key;
      if (s === 'low') t.low++; if (s === 'out') t.out++;
    });
    t.demos = D.whOut.filter(function (o) { return o.type === 'demo'; }).length;
    return t;
  }

  /* ------------------------------------------------ مودال انتخاب مشتری */
  var pickerTarget = null;
  function customerPicker() {
    var ov = d.getElementById('whCustomerPicker');
    if (ov) return ov;
    ov = d.createElement('div');
    ov.className = 'overlay'; ov.id = 'whCustomerPicker'; ov.style.display = 'none';
    ov.innerHTML =
      '<div class="modal" role="dialog" aria-modal="true">' +
        '<div class="modal-head"><div><div class="modal-title">انتخاب مشتری</div><div class="modal-sub">از فهرست مشتریان CRM انتخاب کنید</div></div>' +
        '<button class="tb-icon modal-x" data-modal-close="#whCustomerPicker" data-icon="x" data-icon-size="18"></button></div>' +
        '<div class="modal-body" style="padding-top:6px">' +
          '<div class="input-wrap mb-3"><span class="icon lead" data-icon="search" data-icon-size="16"></span>' +
          '<input class="input" placeholder="جستجو در نام، شرکت یا شماره تماس…" data-cp-search></div>' +
          '<div class="pick-list" style="padding:0;max-height:340px;overflow:auto" data-cp-list></div>' +
        '</div>' +
        '<div class="modal-foot"><a class="btn btn-soft" href="customer-new.html"><span data-icon="user-plus" data-icon-size="15"></span> مشتری جدید</a>' +
        '<button type="button" class="btn" data-modal-close="#whCustomerPicker">انصراف</button></div>' +
      '</div>';
    d.body.appendChild(ov);
    var list = ov.querySelector('[data-cp-list]');
    var render = function (q) {
      q = String(q || '').trim();
      var rows = D.customers.filter(function (c) { return !q || (c.name + c.company + c.phone).indexOf(q) > -1; });
      list.innerHTML = rows.length ? rows.map(function (c) {
        return '<button type="button" class="pick-item" data-cp-name="' + esc(c.company !== 'شخصی' ? c.company : c.name) + '">' +
          CRM.avatar(c.name, 34) +
          '<span class="pi-main"><span class="d-block fw-600 text-strong">' + esc(c.company !== 'شخصی' ? c.company : c.name) + '</span>' +
          '<span class="pi-sub d-block">' + esc(c.name) + ' · ' + esc(c.city) + ' · <span class="num">' + esc(c.phone) + '</span></span></span>' +
          '<span class="badge">' + esc(c.level) + '</span></button>';
      }).join('') : '<div class="empty" style="padding:30px"><div class="empty-ic" data-icon="search" data-icon-size="26"></div><div class="empty-desc">مشتری‌ای با این مشخصات پیدا نشد.</div></div>';
      CRM.renderIcons(list);
    };
    ov.querySelector('[data-cp-search]').addEventListener('input', CRM.debounce(function (e) { render(e.target.value); }, 120));
    list.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cp-name]'); if (!b || !pickerTarget) return;
      pickerTarget.value = b.getAttribute('data-cp-name');
      pickerTarget.dispatchEvent(new Event('change', { bubbles: true }));
      CRM.modal.close(ov);
    });
    render('');
    CRM.init(ov);
    return ov;
  }
  function openCustomerPicker(input) { pickerTarget = input; var ov = customerPicker(); CRM.modal.open(ov); }

  /* -------------------------------------------- خروجی Excel نمایشی */
  function exportToast(name) {
    CRM.toast({ type: 'success', title: 'خروجی Excel آماده شد', msg: 'فایل «' + name + '.xlsx» (نمایشی) ساخته شد.' });
  }

  /* شمارنده‌ی ردیف با اعداد فارسی */
  function row(i) { return '<span class="text-muted num">' + fa(i + 1) + '</span>'; }

  return {
    product: product, category: category, exitType: exitType, reader: reader,
    isStocked: isStocked, stockOf: stockOf, stockState: stockState, stockBadge: stockBadge,
    code: code, productCell: productCell, row: row,
    fillCategories: fillCategories, fillProducts: fillProducts, fillReaders: fillReaders,
    fillUsers: fillUsers, fillInvoices: fillInvoices, linkCategoryProduct: linkCategoryProduct, linkToggle: linkToggle,
    totals: totals, openCustomerPicker: openCustomerPicker, exportToast: exportToast
  };
})(window, document);
