/*!
 * ============================================================================
 *  ModernCRM · sales.js — ابزارهای مشترک ماژول فروش (فقط رابط کاربری)
 *
 *  این فایل بعد از app.js بارگذاری می‌شود و رفتارهای تکرارشونده‌ی صفحه‌های
 *  فروش را یک‌جا نگه می‌دارد:
 *    - «انتخاب فیلتر»: افزودن/حذف فیلدهای فیلتر اختیاری    [data-fpick] / [data-fkey]
 *    - انتخابگر مشتری (مودال جستجوی شرکت‌ها)               [data-pick-customer]
 *    - انتخاب گروهی ردیف‌ها + نوار عملیات                  [data-s-root] [data-s-all] [data-s-row]
 *    - ردیف جزئیات بازشونده                               [data-row-toggle]
 *    - پیشوند جنسیت (جناب آقای / سرکار خانم)               [data-gender-root]
 *    - خروجی اکسل نمایشی                                 [data-excel]
 *    - موتور فرم فاکتور / پیش‌فاکتور (محاسبه زنده)         SALES.invoiceForm(el, opts)
 *    - عدد به حروف فارسی                                  SALES.words(n)
 *
 *  همه‌چیز نمایشی است؛ هیچ درخواست شبکه‌ای ارسال نمی‌شود.
 * ============================================================================
 */
window.SALES = (function (w, d) {
  'use strict';

  var CRM = w.CRM;
  var D = (CRM.data && CRM.data.sales) || {};
  var $ = CRM.$, $$ = CRM.$$, fa = CRM.fa, en = CRM.en, esc = CRM.esc, num = CRM.num, icon = CRM.icon;
  var VAT = 0.10; /* نرخ مالیات بر ارزش افزوده */

  /* ------------------------------------------------------------- کمکی‌ها */
  function toInt(v) {
    var x = Number(en(String(v === undefined || v === null ? '' : v)).replace(/[^\d.-]/g, ''));
    return isNaN(x) ? 0 : x;
  }
  function money(n) { return num(Math.round(n || 0)); }
  function options(list, selected, placeholder) {
    var h = placeholder ? '<option value="">' + esc(placeholder) + '</option>' : '';
    (list || []).forEach(function (o) {
      var v = typeof o === 'object' ? o.id : o;
      var l = typeof o === 'object' ? o.name : o;
      h += '<option value="' + esc(v) + '"' + (String(v) === String(selected) ? ' selected' : '') + '>' + esc(l) + '</option>';
    });
    return h;
  }
  function dateField(value, attrs) {
    return '<div class="date-field"><span data-icon="calendar" data-icon-size="16"></span>' +
      '<input class="input num" placeholder="۱۴۰۵/۰۷/۲۱" value="' + esc(value || '') + '" ' + (attrs || '') + ' data-fa-mask></div>';
  }
  function today() { return CRM.jDate(new Date()); }
  function product(pid) { return (D.catalog || []).filter(function (p) { return p.id === pid; })[0]; }
  function company(nameOrCode) {
    return (D.companies || []).filter(function (c) { return c.name === nameOrCode || c.code === nameOrCode; })[0];
  }
  function busy(btn, fn, ms) {
    if (!btn) { fn && fn(); return; }
    btn.classList.add('is-loading');
    setTimeout(function () { btn.classList.remove('is-loading'); fn && fn(); }, ms || 420);
  }
  function refresh(el) { if (el) CRM.init(el); }

  /* وضعیت تسویه فاکتور */
  function settleState(v) {
    if (v.cancelled) return { key: 'cancel', l: 'کنسل شده', c: 'badge-gray' };
    var rem = (v.amount || 0) - (v.paid || 0);
    if (rem <= 0) return { key: 'paid', l: 'تسویه شده', c: 'badge-success' };
    if (v.paid > 0) return { key: 'partial', l: 'تسویه جزئی', c: 'badge-warning' };
    return { key: 'unpaid', l: 'تسویه نشده', c: 'badge-danger' };
  }

  /* --------------------------------------------------- عدد به حروف فارسی */
  function words(n) {
    n = Math.floor(Math.abs(Number(n) || 0));
    if (n === 0) return 'صفر';
    var ones = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
    var teens = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
    var tens = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
    var hundreds = ['', 'یکصد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
    var scales = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون'];
    function three(x) {
      var p = [], h = Math.floor(x / 100), r = x % 100;
      if (h) p.push(hundreds[h]);
      if (r) {
        if (r < 10) p.push(ones[r]);
        else if (r < 20) p.push(teens[r - 10]);
        else { p.push(tens[Math.floor(r / 10)]); if (r % 10) p.push(ones[r % 10]); }
      }
      return p.join(' و ');
    }
    var out = [], i = 0;
    while (n > 0) {
      var c = n % 1000;
      if (c) out.unshift(three(c) + (scales[i] ? ' ' + scales[i] : ''));
      n = Math.floor(n / 1000); i++;
    }
    return out.join(' و ');
  }

  /* ==========================================================================
   *  1) انتخاب فیلتر: هر گزینه‌ی تیک‌خورده، فیلد متناظرش را نمایش می‌دهد
   *     <div data-filter-root> … <input type=checkbox data-fpick="province"> …
   *     <div class="form-group d-none" data-fkey="province"> … </div>
   * ========================================================================== */
  function fpickHTML(items, label) {
    return '<div class="dropdown">' +
      '<button type="button" class="btn" data-dropdown-toggle data-tip="افزودن فیلترهای بیشتر">' +
        '<span data-icon="list-filter" data-icon-size="16"></span> ' + esc(label || 'انتخاب فیلتر') +
        ' <span class="tag-counter fpick-count"></span>' +
        '<span data-icon="chevron-down" data-icon-size="14"></span></button>' +
      '<div class="dropdown-menu fpick-menu align-start">' +
        '<div class="dropdown-label">فیلترهای قابل افزودن</div>' +
        items.map(function (it) {
          return '<label class="check"><input type="checkbox" data-fpick="' + esc(it[0]) + '"' + (it[2] ? ' checked' : '') + '>' +
            '<span class="box"><span data-icon="check" data-icon-size="12"></span></span><span class="lbl">' + esc(it[1]) + '</span></label>';
        }).join('') +
      '</div></div>';
  }
  function syncFilters(root) {
    var n = 0;
    $$('[data-fpick]', root).forEach(function (c) {
      if (c.checked) n++;
      $$('[data-fkey="' + c.getAttribute('data-fpick') + '"]', root).forEach(function (f) { f.classList.toggle('d-none', !c.checked); });
    });
    $$('.fpick-count', root).forEach(function (b) { b.textContent = n ? fa(n) : ''; });
  }
  d.addEventListener('change', function (e) {
    var c = e.target.closest && e.target.closest('[data-fpick]');
    if (!c) return;
    syncFilters(c.closest('[data-filter-root]') || d);
  });

  /* ==========================================================================
   *  2) انتخاب گروهی ردیف‌ها (برای جدول‌هایی که بعداً دوباره ساخته می‌شوند)
   * ========================================================================== */
  function syncSelection(root) {
    var rows = $$('[data-s-row]', root);
    var on = rows.filter(function (c) { return c.checked; });
    rows.forEach(function (c) { var tr = c.closest('tr'); if (tr) tr.classList.toggle('is-selected', c.checked); });
    var all = $('[data-s-all]', root);
    if (all) { all.checked = rows.length > 0 && on.length === rows.length; all.indeterminate = on.length > 0 && on.length < rows.length; }
    $$('[data-s-bulk]', root).forEach(function (b) { b.classList.toggle('d-none', on.length === 0); });
    $$('[data-s-count]', root).forEach(function (b) { b.textContent = fa(on.length); });
    $$('[data-s-need]', root).forEach(function (b) { b.disabled = on.length === 0; });
  }
  d.addEventListener('change', function (e) {
    var t = e.target;
    if (!t.closest) return;
    var root = t.closest('[data-s-root]');
    if (!root) return;
    if (t.hasAttribute('data-s-all')) {
      $$('[data-s-row]', root).forEach(function (c) { c.checked = t.checked; });
      syncSelection(root);
    } else if (t.hasAttribute('data-s-row')) {
      syncSelection(root);
    }
  });
  function checkCell(attr) {
    return '<label class="check"><input type="checkbox" ' + attr + '><span class="box"><span data-icon="check" data-icon-size="12"></span></span></label>';
  }

  /* ==========================================================================
   *  3) ردیف جزئیات + پیشوند جنسیت + خروجی اکسل (واسطه‌ی سطح سند)
   * ========================================================================== */
  d.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-row-toggle]');
    if (t) {
      var tr = t.closest('tr'), next = tr && tr.nextElementSibling;
      if (next && next.classList.contains('row-detail')) {
        next.classList.toggle('d-none');
        t.classList.toggle('is-open', !next.classList.contains('d-none'));
      }
      return;
    }
    var x = e.target.closest && e.target.closest('[data-excel]');
    if (x) {
      busy(x, function () {
        CRM.toast({ type: 'success', title: 'خروجی اکسل آماده شد', msg: 'فایل «' + (x.getAttribute('data-excel') || 'گزارش') + '.xlsx» دانلود شد (نمایشی).' });
      }, 650);
    }
  });
  d.addEventListener('change', function (e) {
    var r = e.target.closest && e.target.closest('[data-gender]');
    if (!r) return;
    var root = r.closest('[data-gender-root]');
    if (!root) return;
    $$('.prefix', root).forEach(function (p) { p.textContent = r.value === 'f' ? 'سرکار خانم' : 'جناب آقای'; });
  });

  /* ==========================================================================
   *  4) انتخابگر مشتری (مودال «جستجوی مشتری» برنامه قبلی)
   *     <div class="picker"><input readonly data-pick-customer …><button data-pick-customer>…</button></div>
   *     پس از انتخاب: مقدار ورودی پر می‌شود و رویداد sales:customer روی آن ارسال می‌شود.
   * ========================================================================== */
  var picker = (function () {
    var el, target, cb;
    function rowsHTML(list) {
      if (!list.length) {
        return '<tr><td colspan="5"><div class="empty" style="padding:26px"><div class="empty-ic" data-icon="search" data-icon-size="28"></div>' +
          '<div class="empty-title fs-md">شرکتی یافت نشد</div><div class="empty-desc fs-sm">عبارت دیگری را جستجو کنید.</div></div></td></tr>';
      }
      return list.map(function (c) {
        return '<tr>' +
          '<td class="num text-muted fs-sm">' + fa(c.code) + '</td>' +
          '<td><div class="cell-main">' + esc(c.name) + '</div><div class="cell-sub">' + esc(c.owner) + ' · ' + esc(c.coop) + '</div></td>' +
          '<td class="fs-sm">' + esc(c.city) + '</td>' +
          '<td class="fs-xs text-muted" style="max-width:280px;white-space:normal">' + esc(c.address) + '</td>' +
          '<td class="table-row-actions"><button type="button" class="btn btn-sm btn-soft" data-pick-row="' + c.code + '">' +
            '<span data-icon="check" data-icon-size="14"></span> انتخاب</button></td>' +
        '</tr>';
      }).join('');
    }
    function build() {
      if (el) return;
      el = d.createElement('div');
      el.className = 'overlay';
      el.id = 'mdlPickCustomer';
      el.style.display = 'none';
      el.innerHTML =
        '<div class="modal modal-xl" role="dialog" aria-modal="true">' +
          '<div class="modal-head">' +
            '<span class="stat-icon" style="width:40px;height:40px"><span data-icon="building" data-icon-size="19"></span></span>' +
            '<div><div class="modal-title">جستجوی مشتری</div><div class="modal-sub">شرکت مورد نظر را جستجو و انتخاب کنید</div></div>' +
            '<button type="button" class="tb-icon modal-x" data-modal-close="#mdlPickCustomer" data-icon="x" data-icon-size="18"></button>' +
          '</div>' +
          '<div class="modal-body" data-filter-root>' +
            '<div class="filter-grid">' +
              '<div class="form-group"><label class="form-label">نام شرکت</label>' +
                '<div class="input-wrap"><span class="icon lead" data-icon="search" data-icon-size="16"></span>' +
                '<input class="input" data-pk-q placeholder="بخشی از نام شرکت…"></div></div>' +
              '<div class="form-group"><label class="form-label">شرکت مرجع</label><select class="select" data-pk-ref>' +
                options((D.companies || []).map(function (c) { return c.name; }), '', 'همه') + '</select></div>' +
              '<div class="form-group d-none" data-fkey="owner"><label class="form-label">مسئول فایل</label><select class="select" data-pk-owner>' + options(D.owners, '', 'همه') + '</select></div>' +
              '<div class="form-group d-none" data-fkey="province"><label class="form-label">استان</label><select class="select" data-pk-prov>' + options(D.provinces, '', 'همه') + '</select></div>' +
              '<div class="form-group d-none" data-fkey="coop"><label class="form-label">نوع همکاری</label><select class="select" data-pk-coop>' + options(D.coopTypes, '', 'همه') + '</select></div>' +
            '</div>' +
            '<div class="filter-actions">' +
              fpickHTML([['owner', 'مسئول فایل'], ['province', 'استان'], ['coop', 'نوع همکاری']]) +
              '<div class="end"><button type="button" class="btn btn-primary" data-pk-search><span data-icon="search" data-icon-size="16"></span> جستجو</button></div>' +
            '</div>' +
            '<div class="table-wrap mt-4" style="border:1px solid var(--border);max-height:360px">' +
              '<table class="table table-compact"><thead><tr><th>کد</th><th>نام شرکت</th><th>شهر</th><th>آدرس شرکت</th><th></th></tr></thead>' +
              '<tbody data-pk-body></tbody></table>' +
            '</div>' +
          '</div>' +
          '<div class="modal-foot"><span class="fs-xs text-muted" data-pk-count></span>' +
            '<button type="button" class="btn ms-auto" data-modal-close="#mdlPickCustomer">بستن</button></div>' +
        '</div>';
      d.body.appendChild(el);
      var q = $('[data-pk-q]', el);
      q.addEventListener('input', CRM.debounce(run, 160));
      $('[data-pk-search]', el).addEventListener('click', function (e) { busy(e.currentTarget, run); });
      el.addEventListener('click', function (e) {
        var b = e.target.closest('[data-pick-row]');
        if (!b) return;
        choose(company(Number(b.getAttribute('data-pick-row'))));
      });
      el.addEventListener('dblclick', function (e) {
        var tr = e.target.closest('tbody tr');
        var b = tr && $('[data-pick-row]', tr);
        if (b) choose(company(Number(b.getAttribute('data-pick-row'))));
      });
    }
    function run() {
      var q = $('[data-pk-q]', el).value.trim();
      var ref = $('[data-pk-ref]', el).value, own = $('[data-pk-owner]', el).value;
      var prov = $('[data-pk-prov]', el).value, coop = $('[data-pk-coop]', el).value;
      var list = (D.companies || []).filter(function (c) {
        return (!q || c.name.indexOf(q) > -1) && (!ref || c.ref === ref) && (!own || c.owner === own) &&
          (!prov || c.province === prov) && (!coop || c.coop === coop);
      });
      var body = $('[data-pk-body]', el);
      body.innerHTML = rowsHTML(list);
      $('[data-pk-count]', el).textContent = fa(list.length) + ' شرکت یافت شد — برای انتخاب سریع روی ردیف دوبار کلیک کنید';
      refresh(body);
    }
    function choose(c) {
      if (!c) return;
      CRM.modal.close(el);
      if (target) {
        target.value = c.name;
        target.setAttribute('data-code', c.code);
        target.dispatchEvent(new CustomEvent('sales:customer', { bubbles: true, detail: c }));
      }
      if (cb) cb(c);
      CRM.toast({ type: 'success', title: 'مشتری انتخاب شد', msg: c.name });
    }
    function open(input, callback) {
      build();
      target = input || null; cb = callback || null;
      $('[data-pk-q]', el).value = input && input.value ? input.value : '';
      run();
      CRM.modal.open(el);
      setTimeout(function () { $('[data-pk-q]', el).focus(); }, 80);
    }
    d.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-pick-customer]');
      if (!t) return;
      e.preventDefault();
      var sel = t.getAttribute('data-pick-customer');
      var input = sel ? $(sel) : (t.closest('.picker') && $('input', t.closest('.picker')));
      open(input);
    });
    return { open: open };
  })();

  function pickerHTML(id, value, placeholder) {
    return '<div class="picker">' +
      '<input class="input" id="' + id + '" readonly data-pick-customer="#' + id + '" value="' + esc(value || '') + '" placeholder="' + esc(placeholder || 'انتخاب مشتری…') + '">' +
      '<button type="button" class="btn" data-pick-customer="#' + id + '" data-tip="جستجو و انتخاب مشتری" data-icon="more-h" data-icon-size="16"></button>' +
    '</div>';
  }

  /* ==========================================================================
   *  5) موتور فرم فاکتور / پیش‌فاکتور
   *     SALES.invoiceForm(container, { mode: 'new'|'edit', invoice: {...}, idp: 'nf' })
   *     — مالیات ارزش افزوده فقط برای فاکتورهای «رسمی» و «رسمی کامل» محاسبه می‌شود
   *       (رفتار برنامه قبلی). هزینه نصب نیز مشمول ارزش افزوده است.
   * ========================================================================== */
  function invoiceForm(root, opts) {
    opts = opts || {};
    var p = opts.idp || 'inv';
    var inv = opts.invoice || {};
    var edit = opts.mode === 'edit';
    var cust = company(inv.customer) || null;
    var rows = (opts.items || (edit ? D.sampleItems : []) || []).map(function (r) {
      var pr = product(r.pid) || {};
      return { pid: r.pid, name: pr.name, unit: pr.unit, group: pr.group, qty: r.qty, price: r.price, discount: r.discount || 0, install: !!r.install };
    });

    var groupOpts = options(D.productGroups, '', 'همه مجموعه‌ها');
    var kind = inv.kind || 'رسمی کامل';
    var isPro = inv.type === 'proforma';

    root.innerHTML =
      /* --------- مشتری و نوع سند --------- */
      '<div class="card mb-4" data-win-nobtn>' +
        '<div class="card-head flex-wrap" style="gap:10px">' +
          '<div class="card-title" data-icon="building" data-icon-size="18"> مشتری و نوع سند</div>' +
          '<div class="card-actions flex-wrap">' +
            '<div class="segmented" data-segmented data-inv-type>' +
              '<button type="button" class="seg' + (isPro ? '' : ' is-active') + '" data-type="invoice"><span data-icon="invoice" data-icon-size="14"></span> فاکتور</button>' +
              '<button type="button" class="seg' + (isPro ? ' is-active' : '') + '" data-type="proforma"><span data-icon="file" data-icon-size="14"></span> پیش‌فاکتور</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="card-body">' +
          '<div class="grid-3">' +
            '<div class="form-group"><label class="form-label">نمایندگی / مشتری <span class="req">*</span></label>' + pickerHTML(p + 'Cust', cust ? cust.name : '', 'برای انتخاب کلیک کنید…') + '</div>' +
            '<div class="form-group"><label class="form-label">مسئول فعالیت</label><select class="select" id="' + p + 'Owner">' + options(D.owners, inv.owner || 'مهدی کریمی') + '</select></div>' +
            '<div class="form-group"><label class="form-label">اشخاص شرکت</label><select class="select" id="' + p + 'Person"></select></div>' +
          '</div>' +
          '<div class="grid-3">' +
            '<div class="form-group"><label class="form-label">نام شخص</label><input class="input" id="' + p + 'PName" readonly placeholder="—"></div>' +
            '<div class="form-group"><label class="form-label">تلفن</label><input class="input num" id="' + p + 'Phone" readonly placeholder="—"></div>' +
            '<div class="form-group"><label class="form-label">نوع حساب</label><input class="input" id="' + p + 'Acc" readonly placeholder="—"></div>' +
          '</div>' +
          '<div class="grid-2-1">' +
            '<div class="form-group" style="margin-bottom:0"><label class="form-label">آدرس</label><input class="input" id="' + p + 'Addr" readonly placeholder="—"></div>' +
            '<div class="form-group" style="margin-bottom:0"><label class="form-label">نوع فاکتور مشتری</label><input class="input" id="' + p + 'CKind" readonly placeholder="—"></div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      /* --------- مشخصات فاکتور --------- */
      '<div class="card mb-4" data-win-nobtn>' +
        '<div class="card-head"><div class="card-title" data-icon="invoice" data-icon-size="18"> مشخصات <span data-inv-word>' + (isPro ? 'پیش‌فاکتور' : 'فاکتور') + '</span></div>' +
          '<div class="card-actions"><span class="badge badge-primary num" id="' + p + 'NoBadge">' + (inv.no ? 'شماره: ' + esc(inv.no) : 'شماره: خودکار') + '</span></div></div>' +
        '<div class="card-body">' +
          '<div class="filter-grid">' +
            '<div class="form-group"><label class="form-label">شماره‌گذاری</label>' +
              '<div class="segmented w-100" data-segmented data-numbering style="justify-content:stretch">' +
                '<button type="button" class="seg is-active" data-num="auto" style="flex:1;justify-content:center">اتوماتیک</button>' +
                '<button type="button" class="seg" data-num="manual" style="flex:1;justify-content:center">دستی</button>' +
              '</div></div>' +
            '<div class="form-group"><label class="form-label">شماره فاکتور</label><input class="input num" id="' + p + 'No" disabled placeholder="تخصیص خودکار" value="' + esc(inv.no || '') + '"></div>' +
            '<div class="form-group"><label class="form-label">نوع فاکتور</label><select class="select" id="' + p + 'Kind">' + options(D.invoiceKinds, kind) + '</select></div>' +
            '<div class="form-group"><label class="form-label">تاریخ فاکتور</label>' + dateField(inv.date || today(), 'id="' + p + 'Date"') + '</div>' +
            '<div class="form-group' + (isPro ? '' : ' d-none') + '" data-pro-only><label class="form-label">اعتبار پیش‌فاکتور</label>' +
              '<div class="input-wrap"><input class="input num" value="۳" style="padding-inline-end:46px"><span class="fs-xs text-muted" style="position:absolute;inset-inline-end:12px">روز</span></div></div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      /* --------- افزودن کالا --------- */
      '<div class="card mb-4" data-win-nobtn>' +
        '<div class="card-head"><div class="card-title" data-icon="package" data-icon-size="18"> افزودن کالا یا خدمت</div></div>' +
        '<div class="card-body">' +
          '<div class="grid-2-1" style="align-items:start">' +
            '<div>' +
              '<div class="filter-grid">' +
                '<div class="form-group"><label class="form-label">نام مجموعه</label><select class="select" id="' + p + 'Group">' + groupOpts + '</select></div>' +
                '<div class="form-group span-2"><label class="form-label">نام محصول</label><select class="select" id="' + p + 'Prod"></select></div>' +
                '<div class="form-group"><label class="form-label">تعداد</label><input class="input num" id="' + p + 'Qty" value="۱" data-fa-mask></div>' +
                '<div class="form-group"><label class="form-label">تخفیف به ازای یک محصول</label><input class="input num" id="' + p + 'Disc" placeholder="۰" data-fa-mask></div>' +
                '<div class="form-group"><label class="check" style="min-height:40px;align-items:center"><input type="checkbox" id="' + p + 'Inst">' +
                  '<span class="box" style="margin-top:0"><span data-icon="check" data-icon-size="13"></span></span><span class="lbl">هزینه نصب محاسبه شود</span></label></div>' +
              '</div>' +
              '<div class="d-flex gap-2 mt-4 items-center flex-wrap">' +
                '<button type="button" class="btn btn-ink" id="' + p + 'Add"><span data-icon="plus" data-icon-size="16"></span> افزودن به فاکتور</button>' +
                '<span class="fs-xs text-muted" id="' + p + 'Price"></span>' +
              '</div>' +
            '</div>' +
            '<div class="panel" style="padding:12px">' +
              '<div class="panel-title d-flex items-center gap-2"><span data-icon="boxes" data-icon-size="15"></span> ترکیب اقلام</div>' +
              '<div class="table-wrap"><table class="table table-compact"><thead><tr><th>نوع</th><th class="num">تعداد</th></tr></thead><tbody id="' + p + 'Mix"></tbody></table></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      /* --------- اقلام فاکتور --------- */
      '<div class="card mb-4" data-win-nobtn>' +
        '<div class="card-head"><div class="card-title" data-icon="list-checks" data-icon-size="18"> اقلام فاکتور</div>' +
          '<div class="card-actions"><span class="legend-chip"><i style="background:var(--brand-50);border-color:var(--brand-300)"></i> فیلدهای رنگی قابل ویرایش‌اند</span></div></div>' +
        '<div class="card-body flush"><div class="table-wrap">' +
          '<table class="table table-compact table-wide"><thead><tr>' +
            '<th style="width:40px">#</th><th style="min-width:230px">نام محصول</th><th style="width:96px">تعداد</th><th>واحد</th>' +
            '<th style="width:140px">قیمت واحد</th><th style="width:130px">تخفیف واحد</th><th class="num">ارزش افزوده</th><th class="num">قیمت نهایی</th>' +
            '<th class="text-center">نصب</th><th style="width:44px"></th>' +
          '</tr></thead><tbody id="' + p + 'Rows"></tbody></table>' +
        '</div></div>' +
      '</div>' +

      /* --------- هزینه نصب، توضیحات و جمع --------- */
      '<div class="grid-2 mb-4" style="align-items:start">' +
        '<div class="card" data-win-nobtn>' +
          '<div class="card-head"><div class="card-title" data-icon="settings" data-icon-size="18"> هزینه نصب و توضیحات</div></div>' +
          '<div class="card-body">' +
            '<label class="switch mb-4"><input type="checkbox" id="' + p + 'InstOn"' + (inv.install ? ' checked' : '') + '><span class="track"></span><span class="lbl">هزینه نصب، آموزش و راه‌اندازی</span></label>' +
            '<div class="grid-2" id="' + p + 'InstBox">' +
              '<div class="form-group"><label class="form-label">نوع محاسبه</label><select class="select" id="' + p + 'InstType"><option value="fixed">ثابت</option><option value="percent">درصد از اقلام دارای نصب</option></select></div>' +
              '<div class="form-group"><label class="form-label" id="' + p + 'InstLbl">مبلغ (تومان)</label><input class="input num" id="' + p + 'InstVal" value="' + fa(inv.install || 1000000) + '" data-fa-mask></div>' +
              '<div class="form-group"><label class="form-label">محاسبه‌شده</label><input class="input num" id="' + p + 'InstCalc" readonly></div>' +
              '<div class="form-group"><label class="form-label">تأییدشده</label><input class="input num" id="' + p + 'InstOk" data-fa-mask></div>' +
            '</div>' +
            '<div class="form-group"><label class="form-label">توضیحات فاکتور</label>' +
              '<textarea class="textarea" rows="4">در صورت استفاده در شرایط متعارف، سیستم‌ها دارای یک‌سال گارانتی می‌باشند.\n' + (isPro ? 'اعتبار پیش‌فاکتور فوق ۳ روز می‌باشد.\n' : '') + 'تسویه فاکتور به صورت نقدی می‌باشد.</textarea></div>' +
            '<label class="check"><input type="checkbox"><span class="box"><span data-icon="check" data-icon-size="13"></span></span>' +
              '<span class="lbl">نمایش لیست قیمت / هزینه چاپ کارت در چاپ فاکتور</span></label>' +
          '</div>' +
        '</div>' +
        '<div class="card" data-win-nobtn>' +
          '<div class="card-head"><div class="card-title" data-icon="wallet" data-icon-size="18"> جمع فاکتور</div>' +
            '<div class="card-actions"><button type="button" class="btn btn-sm btn-soft" id="' + p + 'Calc"><span data-icon="refresh" data-icon-size="14"></span> محاسبه نهایی</button></div></div>' +
          '<div class="card-body">' +
            '<div class="stat-inline"><span class="text-muted">جمع کل اقلام</span><span class="fw-600 num" id="' + p + 'TGross">۰</span></div>' +
            '<div class="stat-inline"><span class="text-muted">جمع تخفیف</span><span class="fw-600 num text-danger" id="' + p + 'TDisc">۰</span></div>' +
            '<div class="stat-inline"><span class="text-muted">جمع پس از تخفیف</span><span class="fw-600 num" id="' + p + 'TNet">۰</span></div>' +
            '<div class="stat-inline"><span class="text-muted">هزینه نصب و راه‌اندازی</span><span class="fw-600 num" id="' + p + 'TInst">۰</span></div>' +
            '<div class="stat-inline"><span class="text-muted">مالیات بر ارزش افزوده (<span id="' + p + 'VatRate">۱۰٪</span>)</span><span class="fw-600 num" id="' + p + 'TVat">۰</span></div>' +
            '<div class="total-box mt-3"><span class="lbl">جمع قیمت نهایی</span><span class="val"><span id="' + p + 'TAll">۰</span> <small>تومان</small></span></div>' +
            '<div class="fs-xs text-muted mt-3" style="line-height:2"><span data-icon="type" data-icon-size="13"></span> به حروف: <span class="text-strong fw-600" id="' + p + 'TWords">صفر</span> تومان</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    var $id = function (s) { return $('#' + p + s, root); };

    /* ---------- مشتری ---------- */
    function fillCustomer(c) {
      cust = c;
      var people = (D.contacts || []).filter(function (x) { return x.companyCode === (c && c.code); });
      $id('Person').innerHTML = people.length
        ? people.map(function (x) { return '<option value="' + x.code + '">' + (x.gender === 'f' ? 'سرکار خانم ' : 'جناب آقای ') + esc(x.name) + ' — ' + esc(x.role) + '</option>'; }).join('')
        : '<option value="">— شخصی ثبت نشده —</option>';
      fillPerson();
      $id('Addr').value = c ? c.address : '';
      $id('Acc').value = c ? (c.flags && c.flags.length ? c.flags.join('، ') : 'عادی') : '';
      $id('CKind').value = c ? c.kind : '';
      if (c && !edit) { $id('Kind').value = c.kind; recalc(); }
    }
    function fillPerson() {
      var code = Number($id('Person').value);
      var x = (D.contacts || []).filter(function (y) { return y.code === code; })[0];
      $id('PName').value = x ? x.name : (cust ? '—' : '');
      $id('Phone').value = x ? x.mobile : (cust ? cust.phone1 : '');
    }
    $id('Cust').addEventListener('sales:customer', function (e) { fillCustomer(e.detail); });
    $id('Person').addEventListener('change', fillPerson);
    fillCustomer(cust);

    /* ---------- نوع سند ---------- */
    $('[data-inv-type]', root).addEventListener('click', function (e) {
      var b = e.target.closest('[data-type]'); if (!b) return;
      var pro = b.getAttribute('data-type') === 'proforma';
      $$('[data-inv-word]', root).forEach(function (x) { x.textContent = pro ? 'پیش‌فاکتور' : 'فاکتور'; });
      $$('[data-pro-only]', root).forEach(function (x) { x.classList.toggle('d-none', !pro); });
      root.dispatchEvent(new CustomEvent('sales:type', { bubbles: true, detail: { proforma: pro } }));
    });
    $('[data-numbering]', root).addEventListener('click', function (e) {
      var b = e.target.closest('[data-num]'); if (!b) return;
      var manual = b.getAttribute('data-num') === 'manual';
      $id('No').disabled = !manual;
      $id('No').placeholder = manual ? 'مثلاً ۴۰۷۹۰-ل' : 'تخصیص خودکار';
      if (manual) $id('No').focus();
    });

    /* ---------- افزودن کالا ---------- */
    function fillProducts() {
      var g = $id('Group').value;
      var list = (D.catalog || []).filter(function (x) { return !g || x.group === g; });
      $id('Prod').innerHTML = list.map(function (x) { return '<option value="' + x.id + '">' + esc(x.name) + '</option>'; }).join('');
      showPrice();
    }
    function showPrice() {
      var pr = product($id('Prod').value);
      $id('Price').innerHTML = pr ? 'قیمت پایه: <b class="num text-strong">' + money(pr.price) + '</b> تومان / ' + esc(pr.unit) : '';
      if (pr) $id('Inst').checked = !!pr.install;
    }
    $id('Group').addEventListener('change', fillProducts);
    $id('Prod').addEventListener('change', showPrice);
    $id('Add').addEventListener('click', function () {
      var pr = product($id('Prod').value);
      if (!pr) return;
      var qty = Math.max(1, toInt($id('Qty').value));
      var ex = rows.filter(function (r) { return r.pid === pr.id; })[0];
      if (ex) ex.qty += qty;
      else rows.push({ pid: pr.id, name: pr.name, unit: pr.unit, group: pr.group, qty: qty, price: pr.price, discount: toInt($id('Disc').value), install: $id('Inst').checked });
      $id('Qty').value = '۱'; $id('Disc').value = '';
      renderRows();
      CRM.toast({ type: 'success', title: ex ? 'تعداد به‌روزرسانی شد' : 'به فاکتور اضافه شد', msg: pr.name });
    });
    fillProducts();

    /* ---------- اقلام ---------- */
    function taxable() { return $id('Kind').value !== 'غیررسمی'; }
    function renderRows() {
      var body = $id('Rows');
      if (!rows.length) {
        body.innerHTML = '<tr><td colspan="10"><div class="empty" style="padding:28px"><div class="empty-ic" data-icon="package" data-icon-size="28"></div>' +
          '<div class="empty-title fs-md">هنوز کالایی اضافه نشده است</div><div class="empty-desc fs-sm">از بخش «افزودن کالا یا خدمت» محصول را انتخاب کنید.</div></div></td></tr>';
      } else {
        body.innerHTML = rows.map(function (r, i) {
          return '<tr data-i="' + i + '">' +
            '<td class="text-muted num">' + fa(i + 1) + '</td>' +
            '<td><div class="cell-main fs-sm">' + esc(r.name) + '</div></td>' +
            '<td><input class="cell-input" data-f="qty" value="' + fa(r.qty) + '"></td>' +
            '<td class="fs-sm text-muted">' + esc(r.unit) + '</td>' +
            '<td><input class="cell-input" data-f="price" value="' + money(r.price) + '"></td>' +
            '<td><input class="cell-input" data-f="discount" value="' + money(r.discount) + '"></td>' +
            '<td class="num text-muted" data-o="vat"></td>' +
            '<td class="num cell-strong" data-o="final"></td>' +
            '<td class="text-center">' + checkCell('data-f="install"' + (r.install ? ' checked' : '')) + '</td>' +
            '<td><button type="button" class="tb-icon icon-btn-sm" data-del data-tip="حذف ردیف" data-icon="trash" data-icon-size="15"></button></td>' +
          '</tr>';
        }).join('');
      }
      refresh(body);
      recalc();
    }
    $id('Rows').addEventListener('input', function (e) {
      var inp = e.target.closest('[data-f]'); if (!inp || inp.type === 'checkbox') return;
      var r = rows[+inp.closest('tr').getAttribute('data-i')];
      r[inp.getAttribute('data-f')] = inp.getAttribute('data-f') === 'qty' ? Math.max(0, toInt(inp.value)) : toInt(inp.value);
      recalc();
    });
    $id('Rows').addEventListener('focusout', function (e) {
      var inp = e.target.closest('[data-f]'); if (!inp || inp.type === 'checkbox') return;
      var r = rows[+inp.closest('tr').getAttribute('data-i')];
      inp.value = inp.getAttribute('data-f') === 'qty' ? fa(r.qty) : money(r[inp.getAttribute('data-f')]);
    });
    $id('Rows').addEventListener('change', function (e) {
      var c = e.target.closest('[data-f="install"]'); if (!c) return;
      rows[+c.closest('tr').getAttribute('data-i')].install = c.checked;
      recalc();
    });
    $id('Rows').addEventListener('click', function (e) {
      var b = e.target.closest('[data-del]'); if (!b) return;
      var i = +b.closest('tr').getAttribute('data-i');
      var name = rows[i].name;
      rows.splice(i, 1);
      renderRows();
      CRM.toast({ type: 'warning', title: 'ردیف حذف شد', msg: name });
    });

    /* ---------- هزینه نصب ---------- */
    function instAmount(net) {
      if (!$id('InstOn').checked) return 0;
      var ok = toInt($id('InstOk').value);
      var calc;
      if ($id('InstType').value === 'percent') {
        var base = rows.filter(function (r) { return r.install; }).reduce(function (s, r) { return s + r.qty * (r.price - r.discount); }, 0);
        calc = Math.round(base * toInt($id('InstVal').value) / 100);
      } else calc = toInt($id('InstVal').value);
      $id('InstCalc').value = money(calc);
      return ok || calc;
    }
    function syncInst() {
      var on = $id('InstOn').checked;
      $$('input,select', $id('InstBox')).forEach(function (x) { if (x.id !== p + 'InstCalc') x.disabled = !on; });
      $id('InstBox').style.opacity = on ? '1' : '.5';
      $id('InstLbl').textContent = $id('InstType').value === 'percent' ? 'درصد' : 'مبلغ (تومان)';
      recalc();
    }
    ['InstOn', 'InstType'].forEach(function (k) { $id(k).addEventListener('change', syncInst); });
    ['InstVal', 'InstOk'].forEach(function (k) { $id(k).addEventListener('input', recalc); });
    $id('Kind').addEventListener('change', recalc);
    $id('Calc').addEventListener('click', function (e) {
      busy(e.currentTarget, function () { recalc(); CRM.toast({ type: 'info', title: 'محاسبه نهایی انجام شد', msg: 'جمع قیمت نهایی: ' + $id('TAll').textContent + ' تومان' }); });
    });

    /* ---------- محاسبه ---------- */
    function recalc() {
      var tax = taxable() ? VAT : 0;
      var gross = 0, disc = 0;
      rows.forEach(function (r, i) {
        var g = r.qty * r.price, dd = r.qty * r.discount, net = g - dd, vat = Math.round(net * tax);
        gross += g; disc += dd;
        var tr = $('tr[data-i="' + i + '"]', $id('Rows'));
        if (tr) { $('[data-o="vat"]', tr).textContent = money(vat); $('[data-o="final"]', tr).textContent = money(net + vat); }
      });
      var net = gross - disc;
      var inst = instAmount(net);
      var vatAll = Math.round((net + inst) * tax);
      var all = net + inst + vatAll;
      $id('TGross').textContent = money(gross);
      $id('TDisc').textContent = disc ? '− ' + money(disc) : '۰';
      $id('TNet').textContent = money(net);
      $id('TInst').textContent = money(inst);
      $id('TVat').textContent = money(vatAll);
      $id('VatRate').textContent = tax ? '۱۰٪' : 'معاف — فاکتور غیررسمی';
      $id('TAll').textContent = money(all);
      $id('TWords').textContent = words(all);
      /* ترکیب اقلام بر اساس مجموعه */
      var mix = {};
      rows.forEach(function (r) { mix[r.group] = (mix[r.group] || 0) + r.qty; });
      var keys = Object.keys(mix);
      $id('Mix').innerHTML = keys.length ? keys.map(function (k) {
        var g = (D.productGroups || []).filter(function (x) { return x.id === k; })[0];
        return '<tr><td class="fs-sm">' + esc(g ? g.name : k) + '</td><td class="num fw-600">' + fa(mix[k]) + '</td></tr>';
      }).join('') : '<tr><td colspan="2" class="text-center text-soft fs-xs">—</td></tr>';
      return all;
    }

    renderRows();
    syncInst();
    if (d.readyState !== 'loading') refresh(root);
    return { recalc: recalc, rows: rows, setCustomer: fillCustomer };
  }

  return {
    data: D, VAT: VAT,
    toInt: toInt, money: money, options: options, dateField: dateField, today: today,
    product: product, company: company, busy: busy, refresh: refresh, words: words,
    settleState: settleState, fpickHTML: fpickHTML, syncFilters: syncFilters,
    syncSelection: syncSelection, checkCell: checkCell,
    picker: picker, pickerHTML: pickerHTML, invoiceForm: invoiceForm
  };
})(window, document);
