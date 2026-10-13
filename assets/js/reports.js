/* ==========================================================================
 * مدرن‌CRM — موتور گزارش‌ها (reports.js)
 * --------------------------------------------------------------------------
 *  • CRM_REPORTS.list   رجیستری گزارش‌ها (عنوان، دسته، فیلترها، تابع build)
 *  • CRM_REPORTS.mount  ساخت صفحه‌ی report.html?r=<id>: کارت فیلتر + نمایشگر گزارش
 *
 *  هر گزارش:
 *    { id, title, cat, icon, tone, desc, crumb?, filters: [...], build: function (f) {...} }
 *  build(f) خروجی می‌دهد:
 *    { title, subtitle?, columns: [...], rows: [...], groupBy?, groupLabel?, groupSum?, totals?, note? }
 *
 *  انواع فیلتر (type):
 *    daterange {from,to}  ·  radio (option.note)  ·  checks (cols, search, dependsOn, options:fn)
 *    flags (disabledWhen)  ·  select  ·  text          — span: ۱ تا ۴ ستون از شبکه‌ی ۴تایی
 *
 *  انواع ستون (type):
 *    text · num · money · date · ltr · wrap · badge ({text,tone}) · bar (درصد)
 *    group: عنوان سرستون گروهی (هدر دوردیفه) — total: true یعنی جمع در ردیف پایانی
 * ========================================================================== */
(function (w, d) {
  'use strict';
  var CRM = w.CRM, D = CRM.data, J = CRM.jalali, fa = CRM.fa, en = CRM.en, esc = CRM.esc;

  /* ------------------------------------------------ کمکی‌ها */
  function key(s) { var o = J.parse(s); return o ? o.jy * 10000 + o.jm * 100 + o.jd : 0; }
  function inRange(s, r) {
    if (!r) return true;
    var k = key(s), a = key(r.from), b = key(r.to);
    return (!a || k >= a) && (!b || k <= b);
  }
  function today() { return J.format(J.toJalali(new Date())); }
  function uniq(arr) { var m = {}, out = []; arr.forEach(function (x) { if (x && !m[x]) { m[x] = 1; out.push(x); } }); return out; }
  function sum(arr, k) { return arr.reduce(function (s, x) { return s + (+x[k] || 0); }, 0); }
  function pct(a, b) { return b ? Math.round(a / b * 1000) / 10 : 0; }
  var MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
  var ACC_T = {}; D.accTypes.forEach(function (t) { ACC_T[t.id] = t; });
  var EXIT_T = {}; D.whExitTypes.forEach(function (t) { EXIT_T[t.id] = t; });
  var PAY_T = { cash: 'نقدی', cheque: 'چک', transfer: 'واریز به حساب' };
  function accAmount(x) { return Math.max(0, x.base * (x.qty || 1) - (x.discount || 0)); }
  function accParty(x) { return x.company || x.seller || x.person || x.consumer || '—'; }
  function rangeText(r) {
    if (!r || (!r.from && !r.to)) return 'همه‌ی تاریخ‌ها';
    return (r.from ? 'از ' + fa(r.from) : 'از ابتدا') + ' تا ' + (r.to ? fa(r.to) : 'امروز');
  }
  function listText(arr, all) {
    if (!arr.length) return 'هیچ‌کدام';
    if (all && arr.length === all) return 'همه';
    return arr.length > 4 ? arr.slice(0, 4).join('، ') + ' و ' + fa(arr.length - 4) + ' مورد دیگر' : arr.join('، ');
  }

  var CATS = [
    { id: 'finance', title: 'مالی', icon: 'coins', desc: 'فروش، پرداخت‌ها و هزینه‌ها' },
    { id: 'sales', title: 'فروش و مشتریان', icon: 'users', desc: 'نمایندگان، شرکت‌ها و عملکرد مسئولان فروش' },
    { id: 'ops', title: 'عملیات و ارتباطات', icon: 'activity', desc: 'پیامک‌ها و سابقه‌ی دستگاه‌ها' }
  ];

  /* ==========================================================================
   * رجیستری گزارش‌ها
   * ========================================================================== */
  var REPORTS = [
    /* ---------------------------------------------------------------- ۱) مالی و آماری */
    {
      id: 'finance', cat: 'finance', icon: 'chart-column', tone: '',
      title: 'گزارش مالی و آماری',
      desc: 'فروش هر مسئول فایل، آمار فاکتور و پیش‌فاکتور، و فروش ماه‌به‌ماه سال',
      filters: [
        { id: 'date', type: 'daterange', label: 'بازه‌ی زمانی', from: '۱۴۰۵/۰۷/۰۱', to: 'today', span: 2 },
        { id: 'variant', type: 'radio', label: 'نوع گزارش', span: 2, value: 'sale', options: [
          { v: 'stat', t: 'آماری تعداد فاکتور و پیش‌فاکتور', note: 'فیلترهای «نماینده» و «همکار» در گزارش آماری تأثیری ندارد.' },
          { v: 'sale', t: 'مالی فروش' },
          { v: 'year', t: 'مالی سال', note: 'سالِ «از تاریخ» ملاک است و فروش به تفکیک ماه نمایش داده می‌شود.' }
        ] },
        { id: 'owners', type: 'checks', label: 'مسئول فعالیت', span: 3, cols: 4, options: D.repOwners, value: ['کاظمی', 'باصری', 'میلاد فتاحی'] },
        { id: 'who', type: 'flags', label: 'شامل فروش', span: 1, options: [{ v: 'agent', t: 'نماینده' }, { v: 'partner', t: 'همکار' }], value: [],
          disabledWhen: function (f) { return f.variant === 'stat'; } }
      ],
      build: function (f) {
        var base = D.repInvoices.filter(function (x) { return f.owners.indexOf(x.owner) > -1; });
        var withWho = function (x) { return (!x.agent || f.who.indexOf('agent') > -1) && (!x.partner || f.who.indexOf('partner') > -1); };
        var owners = D.repOwners.filter(function (o) { return f.owners.indexOf(o) > -1; });
        var sub = 'مسئول فعالیت: ' + listText(owners, D.repOwners.length);
        var whoTxt = f.who.length ? ' · شامل فروش ' + f.who.map(function (x) { return x === 'agent' ? 'نماینده' : 'همکار'; }).join(' و ') : ' · بدون فروش نماینده و همکار';

        if (f.variant === 'stat') {
          var st = base.filter(function (x) { return inRange(x.date, f.date); });
          return {
            title: 'گزارش آماری تعداد فاکتور و پیش‌فاکتور در بازه‌ی زمانی مشخص‌شده',
            subtitle: rangeText(f.date) + ' · ' + sub,
            columns: [
              { key: 'owner', title: 'مسئول فایل' },
              { key: 'preO', title: 'تعداد پیش‌فاکتور رسمی', type: 'num', total: true },
              { key: 'preU', title: 'تعداد پیش‌فاکتور غیررسمی', type: 'num', total: true },
              { key: 'oAll', title: 'کل', type: 'num', group: 'تعداد فاکتور رسمی', total: true },
              { key: 'oOk', title: 'تأییدشده', type: 'num', group: 'تعداد فاکتور رسمی', total: true },
              { key: 'oCan', title: 'کنسل‌شده', type: 'num', group: 'تعداد فاکتور رسمی', total: true },
              { key: 'uAll', title: 'کل', type: 'num', group: 'تعداد فاکتور غیررسمی', total: true },
              { key: 'uOk', title: 'تأییدشده', type: 'num', group: 'تعداد فاکتور غیررسمی', total: true },
              { key: 'uCan', title: 'کنسل‌شده', type: 'num', group: 'تعداد فاکتور غیررسمی', total: true }
            ],
            rows: owners.map(function (o) {
              var x = st.filter(function (i) { return i.owner === o; });
              var c = function (fn) { return x.filter(fn).length; };
              return {
                owner: o,
                preO: c(function (i) { return i.kind === 'pre' && i.official; }), preU: c(function (i) { return i.kind === 'pre' && !i.official; }),
                oAll: c(function (i) { return i.kind === 'inv' && i.official; }), oOk: c(function (i) { return i.kind === 'inv' && i.official && i.status === 'ok'; }), oCan: c(function (i) { return i.kind === 'inv' && i.official && i.status === 'cancel'; }),
                uAll: c(function (i) { return i.kind === 'inv' && !i.official; }), uOk: c(function (i) { return i.kind === 'inv' && !i.official && i.status === 'ok'; }), uCan: c(function (i) { return i.kind === 'inv' && !i.official && i.status === 'cancel'; })
              };
            }),
            totals: true
          };
        }
        var sales = base.filter(function (x) { return x.kind === 'inv' && x.status === 'ok' && withWho(x); });
        if (f.variant === 'year') {
          var jy = (J.parse(f.date.from) || J.toJalali(new Date())).jy;
          var ys = sales.filter(function (x) { return +en(x.date).slice(0, 4) === jy; });
          var yearTotal = sum(ys, 'total');
          return {
            title: 'گزارش مالی سال ' + fa(jy),
            subtitle: 'فروش تأییدشده به تفکیک ماه · ' + sub + whoTxt,
            columns: [
              { key: 'm', title: 'ماه' },
              { key: 'n', title: 'تعداد فاکتور', type: 'num', total: true },
              { key: 'total', title: 'جمع کل', type: 'money', total: true },
              { key: 'net', title: 'جمع خالص فاکتور', type: 'money', total: true },
              { key: 'vat', title: 'ارزش افزوده', type: 'money', total: true },
              { key: 'install', title: 'هزینه نصب', type: 'money', total: true },
              { key: 'remain', title: 'مانده', type: 'money', total: true },
              { key: 'share', title: 'سهم از فروش سال', type: 'bar' }
            ],
            rows: MONTHS.map(function (name, i) {
              var x = ys.filter(function (r) { return +en(r.date).slice(5, 7) === i + 1; });
              var t = sum(x, 'total');
              return { m: name, n: x.length, total: t, net: sum(x, 'net'), vat: sum(x, 'vat'), install: sum(x, 'install'), remain: t - sum(x, 'paid'), share: pct(t, yearTotal) };
            }),
            totals: true
          };
        }
        var sr = sales.filter(function (x) { return inRange(x.date, f.date); });
        return {
          title: 'گزارش مالی فروش در بازه‌ی زمانی مشخص‌شده',
          subtitle: rangeText(f.date) + ' · ' + sub + whoTxt,
          columns: [
            { key: 'owner', title: 'مسئول فایل' },
            { key: 'total', title: 'جمع کل', type: 'money', total: true },
            { key: 'net', title: 'جمع خالص فاکتور', type: 'money', total: true },
            { key: 'vat', title: 'ارزش افزوده', type: 'money', total: true },
            { key: 'install', title: 'هزینه نصب', type: 'money', total: true },
            { key: 'remain', title: 'مانده', type: 'money', total: true }
          ],
          rows: owners.map(function (o) {
            var x = sr.filter(function (i) { return i.owner === o; }), t = sum(x, 'total');
            return { owner: o, total: t, net: sum(x, 'net'), vat: sum(x, 'vat'), install: sum(x, 'install'), remain: t - sum(x, 'paid') };
          }),
          totals: true, note: 'مبالغ به تومان · فقط فاکتورهای تأییدشده'
        };
      }
    },

    /* ---------------------------------------------------------------- ۲) پیامک */
    {
      id: 'sms', cat: 'ops', icon: 'smartphone', tone: 'sky',
      title: 'گزارش پیامک',
      desc: 'پیامک‌های ارسالی و دریافتی سامانه با شماره، متن و وضعیت تحویل',
      filters: [
        { id: 'date', type: 'daterange', label: 'بازه‌ی زمانی', from: '۱۴۰۵/۰۶/۰۱', to: 'today', span: 2 },
        { id: 'dir', type: 'radio', label: 'نوع پیامک', span: 1, value: 'out', options: [{ v: 'out', t: 'ارسالی' }, { v: 'in', t: 'دریافتی' }] },
        { id: 'user', type: 'select', label: 'کاربر', span: 1, options: [{ v: '', t: 'همه‌ی کاربران' }].concat(uniq(D.repSms.map(function (x) { return x.user; })).map(function (u) { return { v: u, t: u }; })) },
        { id: 'q', type: 'text', label: 'جستجو در متن یا شماره', span: 2, placeholder: 'مثلاً نصب یا ۰۹۱۲…' }
      ],
      build: function (f) {
        var out = f.dir === 'out', q = en(f.q.trim());
        var rows = D.repSms.filter(function (x) {
          return x.dir === f.dir && inRange(x.date, f.date) && (!f.user || x.user === f.user) && (!q || (x.text + x.number + x.name).indexOf(q) > -1 || x.text.indexOf(f.q.trim()) > -1);
        }).map(function (x) {
          var party = x.name || '—';
          return {
            from: out ? x.user : party, to: out ? party : x.user, number: x.number, text: x.text, date: x.date + ' ' + x.time,
            status: { text: x.status, tone: x.status === 'ناموفق' ? 'badge-danger' : x.status === 'تحویل شد' ? 'badge-success' : 'badge-info' }
          };
        });
        return {
          title: out ? 'گزارش پیامک‌های ارسالی' : 'گزارش پیامک‌های دریافتی',
          subtitle: rangeText(f.date) + (f.user ? ' · کاربر: ' + f.user : ''),
          columns: [
            { key: 'from', title: 'فرستنده' },
            { key: 'to', title: 'گیرنده' },
            { key: 'number', title: out ? 'شماره گیرنده' : 'شماره فرستنده', type: 'ltr' },
            { key: 'text', title: out ? 'متن ارسالی' : 'متن دریافتی', type: 'wrap' },
            { key: 'date', title: out ? 'تاریخ ارسال' : 'تاریخ دریافت', type: 'date' },
            { key: 'status', title: 'وضعیت', type: 'badge' }
          ],
          rows: rows
        };
      }
    },

    /* ---------------------------------------------------------------- ۳) لیست نماینده‌ها */
    {
      id: 'agents', cat: 'sales', icon: 'id-card', tone: 'violet',
      title: 'لیست نماینده‌ها',
      desc: 'نمایندگان و عاملان فروش به تفکیک استان با مسئول خرید و اطلاعات تماس',
      filters: [
        { id: 'kind', type: 'radio', label: 'نوع', span: 1, value: '', options: [{ v: '', t: 'همه' }, { v: 'نماینده', t: 'نماینده' }, { v: 'عامل', t: 'عامل' }] },
        { id: 'q', type: 'text', label: 'نام شرکت یا مسئول خرید', span: 1, placeholder: 'جستجو…' },
        { id: 'prov', type: 'checks', label: 'استان', span: 2, cols: 3, search: true, options: uniq(D.repAgents.map(function (a) { return a.province; })), value: 'all' }
      ],
      build: function (f) {
        var q = f.q.trim();
        var all = uniq(D.repAgents.map(function (a) { return a.province; }));
        return {
          title: 'لیست نماینده‌ها' + (f.kind === 'عامل' ? ' (عاملان فروش)' : f.kind === 'نماینده' ? ' (نمایندگان)' : ''),
          subtitle: 'استان: ' + listText(f.prov, all.length) + (q ? ' · جستجو: «' + q + '»' : ''),
          columns: [
            { key: 'kind', title: 'نوع', type: 'badge' },
            { key: 'name', title: 'نام شرکت' },
            { key: 'province', title: 'استان' },
            { key: 'city', title: 'شهر' },
            { key: 'buyer', title: 'مسئول خرید' },
            { key: 'mobile', title: 'تلفن همراه', type: 'ltr' },
            { key: 'phone', title: 'تلفن شرکت', type: 'ltr' },
            { key: 'address', title: 'آدرس شرکت', type: 'wrap' }
          ],
          rows: D.repAgents.filter(function (a) {
            return (!f.kind || a.kind === f.kind) && f.prov.indexOf(a.province) > -1 && (!q || (a.name + a.buyer + a.city).indexOf(q) > -1);
          }).map(function (a) {
            return Object.assign({}, a, { kind: { text: a.kind, tone: a.kind === 'عامل' ? 'badge-warning' : 'badge-violet' } });
          }),
          groupBy: 'province'
        };
      }
    },

    /* ---------------------------------------------------------------- ۴) مشخصات شرکت‌ها */
    {
      id: 'companies', cat: 'sales', icon: 'building', tone: 'amber',
      title: 'مشخصات شرکت‌ها',
      desc: 'فهرست کامل شرکت‌ها با استان، نوع همکاری، نحوه‌ی آشنایی و مسئول فروش',
      filters: [
        { id: 'prov', type: 'select', label: 'استان', span: 1, options: [{ v: '', t: 'همه‌ی استان‌ها' }].concat(uniq(D.repCompanies.map(function (c) { return c.province; })).map(function (p) { return { v: p, t: p }; })) },
        { id: 'source', type: 'select', label: 'نحوه‌ی آشنایی', span: 1, options: [{ v: '', t: 'همه' }].concat(uniq(D.repCompanies.map(function (c) { return c.source; })).map(function (p) { return { v: p, t: p }; })) },
        { id: 'q', type: 'text', label: 'نام شرکت یا رابط', span: 2, placeholder: 'جستجو…' },
        { id: 'coop', type: 'checks', label: 'نوع همکاری', span: 2, cols: 2, options: uniq(D.repCompanies.map(function (c) { return c.coop; })), value: 'all' },
        { id: 'owner', type: 'checks', label: 'مسئول فروش', span: 2, cols: 3, options: uniq(D.repCompanies.map(function (c) { return c.owner; })), value: 'all' }
      ],
      build: function (f) {
        var q = f.q.trim();
        return {
          title: 'مشخصات شرکت‌ها',
          subtitle: (f.prov ? 'استان ' + f.prov : 'همه‌ی استان‌ها') + (f.source ? ' · آشنایی: ' + f.source : '') + ' · همکاری: ' + listText(f.coop) + ' · مسئول: ' + listText(f.owner),
          columns: [
            { key: 'code', title: 'کد', type: 'num' },
            { key: 'name', title: 'نام شرکت' },
            { key: 'province', title: 'استان' },
            { key: 'city', title: 'شهر' },
            { key: 'coop', title: 'نوع همکاری' },
            { key: 'source', title: 'نحوه آشنایی' },
            { key: 'owner', title: 'مسئول فروش' },
            { key: 'contact', title: 'رابط' },
            { key: 'phone', title: 'تلفن', type: 'ltr' },
            { key: 'devices', title: 'دستگاه‌ها', type: 'num', total: true },
            { key: 'since', title: 'تاریخ ثبت', type: 'date' }
          ],
          rows: D.repCompanies.filter(function (c) {
            return (!f.prov || c.province === f.prov) && (!f.source || c.source === f.source) && f.coop.indexOf(c.coop) > -1 && f.owner.indexOf(c.owner) > -1 && (!q || (c.name + c.contact).indexOf(q) > -1);
          }),
          totals: true
        };
      }
    },

    /* ---------------------------------------------------------------- ۵) آمار شرکت‌ها */
    {
      id: 'company-stats', cat: 'sales', icon: 'chart-pie', tone: 'coral',
      title: 'آمار شرکت‌ها',
      desc: 'تعداد شرکت‌ها و دستگاه‌ها به تفکیک استان، نحوه‌ی آشنایی، نوع همکاری یا مسئول',
      filters: [
        { id: 'by', type: 'radio', label: 'تفکیک بر اساس', span: 2, value: 'province', options: [
          { v: 'province', t: 'استان' }, { v: 'source', t: 'نحوه آشنایی' }, { v: 'coop', t: 'نوع همکاری' }, { v: 'owner', t: 'مسئول فروش' }
        ] },
        { id: 'date', type: 'daterange', label: 'تاریخ ثبت شرکت', from: '', to: '', span: 2 }
      ],
      build: function (f) {
        var LBL = { province: 'استان', source: 'نحوه آشنایی', coop: 'نوع همکاری', owner: 'مسئول فروش' };
        var list = D.repCompanies.filter(function (c) { return inRange(c.since, f.date); });
        var groups = uniq(list.map(function (c) { return c[f.by]; }));
        var rows = groups.map(function (g) {
          var x = list.filter(function (c) { return c[f.by] === g; }), dv = sum(x, 'devices');
          return { g: g, n: x.length, dev: dv, avg: x.length ? Math.round(dv / x.length * 10) / 10 : 0, share: pct(x.length, list.length) };
        }).sort(function (a, b) { return b.n - a.n; });
        return {
          title: 'آمار شرکت‌ها به تفکیک ' + LBL[f.by],
          subtitle: 'تاریخ ثبت: ' + rangeText(f.date) + ' · ' + fa(list.length) + ' شرکت',
          columns: [
            { key: 'g', title: LBL[f.by] },
            { key: 'n', title: 'تعداد شرکت', type: 'num', total: true },
            { key: 'dev', title: 'تعداد دستگاه', type: 'num', total: true },
            { key: 'avg', title: 'میانگین دستگاه', type: 'num' },
            { key: 'share', title: 'سهم از کل شرکت‌ها', type: 'bar' }
          ],
          rows: rows, totals: true
        };
      }
    },

    /* ---------------------------------------------------------------- ۶) آمار مسئول فروش */
    {
      id: 'owner-stats', cat: 'sales', icon: 'award', tone: 'success',
      title: 'آمار مسئول فروش',
      desc: 'پیش‌فاکتور، فاکتور، نرخ تبدیل، مبلغ فروش و مانده‌ی مطالبات هر مسئول',
      filters: [
        { id: 'date', type: 'daterange', label: 'بازه‌ی زمانی', from: '۱۴۰۵/۰۱/۰۱', to: 'today', span: 2 },
        { id: 'owners', type: 'checks', label: 'مسئول فروش', span: 2, cols: 4, options: D.repOwners, value: 'all' }
      ],
      build: function (f) {
        var x = D.repInvoices.filter(function (i) { return f.owners.indexOf(i.owner) > -1 && inRange(i.date, f.date); });
        var allSales = sum(x.filter(function (i) { return i.kind === 'inv' && i.status === 'ok'; }), 'total');
        var rows = D.repOwners.filter(function (o) { return f.owners.indexOf(o) > -1; }).map(function (o) {
          var m = x.filter(function (i) { return i.owner === o; });
          var pre = m.filter(function (i) { return i.kind === 'pre'; }).length;
          var ok = m.filter(function (i) { return i.kind === 'inv' && i.status === 'ok'; });
          var t = sum(ok, 'total');
          return {
            owner: o, companies: D.repCompanies.filter(function (c) { return c.owner === o; }).length, pre: pre, inv: ok.length,
            cancel: m.filter(function (i) { return i.status === 'cancel'; }).length,
            conv: pre ? Math.min(100, Math.round(ok.length / pre * 100)) + '٪' : '—', total: t, avg: ok.length ? Math.round(t / ok.length) : 0, remain: t - sum(ok, 'paid'), share: pct(t, allSales)
          };
        }).sort(function (a, b) { return b.total - a.total; });
        return {
          title: 'آمار مسئول فروش',
          subtitle: rangeText(f.date) + ' · مسئول: ' + listText(f.owners, D.repOwners.length),
          columns: [
            { key: 'owner', title: 'مسئول فروش' },
            { key: 'companies', title: 'شرکت‌ها', type: 'num', total: true },
            { key: 'pre', title: 'پیش‌فاکتور', type: 'num', group: 'تعداد', total: true },
            { key: 'inv', title: 'فاکتور تأییدشده', type: 'num', group: 'تعداد', total: true },
            { key: 'cancel', title: 'کنسلی', type: 'num', group: 'تعداد', total: true },
            { key: 'conv', title: 'نرخ تبدیل', type: 'num' },
            { key: 'total', title: 'مبلغ فروش', type: 'money', group: 'مبالغ (تومان)', total: true },
            { key: 'avg', title: 'میانگین فاکتور', type: 'money', group: 'مبالغ (تومان)' },
            { key: 'remain', title: 'مانده مطالبات', type: 'money', group: 'مبالغ (تومان)', total: true },
            { key: 'share', title: 'سهم از فروش', type: 'bar' }
          ],
          rows: rows, totals: true
        };
      }
    },

    /* ---------------------------------------------------------------- ۷) ریز وضعیت دستگاه‌ها */
    {
      id: 'devices', cat: 'ops', icon: 'fingerprint', tone: '',
      title: 'ریز وضعیت دستگاه‌ها',
      desc: 'سابقه‌ی هر شماره سریال: تاریخ ورود، وضعیت خروج، مشتری و تاریخ خروج',
      filters: [
        { id: 'cat', type: 'select', label: 'مجموعه محصولات', span: 1, value: 'main', options: D.whCategories.filter(function (c) { return c.id === 'main' || c.id === 'security'; }).map(function (c) { return { v: c.id, t: c.title }; }) },
        { id: 'status', type: 'radio', label: 'وضعیت', span: 3, value: '', options: [{ v: '', t: 'همه' }, { v: 'sale', t: 'فروش' }, { v: 'demo', t: 'دمو' }, { v: 'present', t: 'پرزنت' }, { v: 'broken', t: 'خرابی' }, { v: 'support', t: 'پشتیبانی' }] },
        { id: 'products', type: 'checks', label: 'محصولات', span: 2, cols: 3, search: true, dependsOn: 'cat', value: 'all',
          options: function (f) { return D.whProducts.filter(function (p) { return p.cat === f.cat; }).map(function (p) { return { v: String(p.code), t: p.name, sub: 'کد ' + fa(p.code) }; }); } },
        { id: 'date', type: 'daterange', label: 'تاریخ خروج', from: '', to: '', span: 1 },
        { id: 'q', type: 'text', label: 'نام مشتری', span: 1, placeholder: 'مثلاً آریا جم' }
      ],
      build: function (f) {
        var q = f.q.trim();
        var cat = D.whCategories.filter(function (c) { return c.id === f.cat; })[0];
        return {
          title: 'ریز وضعیت دستگاه‌ها — ' + (cat ? cat.title : ''),
          subtitle: (f.status ? 'وضعیت: ' + EXIT_T[f.status].title : 'همه‌ی وضعیت‌ها') + ' · تاریخ خروج: ' + rangeText(f.date) + ' · ' + fa(f.products.length) + ' محصول' + (q ? ' · مشتری: «' + q + '»' : ''),
          columns: [
            { key: 'name', title: 'نام محصول' },
            { key: 'serial', title: 'شماره سریال', type: 'ltr' },
            { key: 'reader', title: 'نوع کارتخوان', type: 'ltr' },
            { key: 'inDate', title: 'تاریخ ورود', type: 'date' },
            { key: 'status', title: 'وضعیت', type: 'badge' },
            { key: 'customer', title: 'نام مشتری' },
            { key: 'outDate', title: 'تاریخ خروج', type: 'date' }
          ],
          rows: D.repDevices.filter(function (x) {
            return f.products.indexOf(String(x.product)) > -1 && (!f.status || x.status === f.status) && inRange(x.outDate, f.date) && (!q || x.customer.indexOf(q) > -1);
          }).map(function (x) {
            var t = EXIT_T[x.status];
            return Object.assign({}, x, { status: { text: x.status === 'broken' ? 'خرابی' : t.title, tone: 'badge-' + t.tone } });
          }).sort(function (a, b) { return a.product - b.product || key(b.outDate) - key(a.outDate); }),
          groupBy: 'name'
        };
      }
    },

    /* ---------------------------------------------------------------- ۸) مالی پرداختی‌ها */
    {
      id: 'payments', cat: 'finance', icon: 'banknote', tone: 'coral',
      title: 'مالی پرداختی‌ها',
      desc: 'همه‌ی اسناد پرداخت حسابداری به تفکیک نوع و روش پرداخت (نقد، چک، واریز)',
      filters: [
        { id: 'date', type: 'daterange', label: 'بازه‌ی زمانی', from: '۱۴۰۵/۰۶/۰۱', to: 'today', span: 2 },
        { id: 'pay', type: 'radio', label: 'نحوه پرداخت', span: 2, value: '', options: [{ v: '', t: 'همه' }, { v: 'cash', t: 'نقدی' }, { v: 'cheque', t: 'چک' }, { v: 'transfer', t: 'واریز به حساب' }] },
        { id: 'types', type: 'checks', label: 'نوع سند', span: 3, cols: 5, options: D.accTypes.map(function (t) { return { v: t.id, t: t.title }; }), value: ['buy', 'expense', 'agent', 'damage'] },
        { id: 'opt', type: 'flags', label: 'گزینه‌ها', span: 1, options: [{ v: 'agentOnly', t: 'فقط پرداخت به نماینده' }], value: [] }
      ],
      build: function (f) {
        var rows = D.accDocs.filter(function (x) {
          return inRange(x.date, f.date) && f.types.indexOf(x.type) > -1 && (!f.pay || x.pay === f.pay) && (f.opt.indexOf('agentOnly') < 0 || x.agent);
        }).sort(function (a, b) { return key(b.date) - key(a.date); }).map(function (x) {
          var t = ACC_T[x.type];
          return {
            code: x.code, date: x.date, type: { text: t.title, tone: t.tone }, item: x.item, party: accParty(x), pay: PAY_T[x.pay],
            ref: x.pay === 'cheque' ? x.chequeNo : x.pay === 'transfer' ? x.account : '—', bank: x.bank || '—', due: x.pay === 'cheque' ? x.chequeDate : '—', amount: accAmount(x)
          };
        });
        return {
          title: 'گزارش مالی پرداختی‌ها',
          subtitle: rangeText(f.date) + ' · ' + (f.pay ? PAY_T[f.pay] : 'همه‌ی روش‌ها') + ' · نوع: ' + listText(f.types.map(function (t) { return ACC_T[t].title; }), D.accTypes.length),
          columns: [
            { key: 'code', title: 'کد سند', type: 'num' },
            { key: 'date', title: 'تاریخ', type: 'date' },
            { key: 'type', title: 'نوع', type: 'badge' },
            { key: 'item', title: 'شرح', type: 'wrap' },
            { key: 'party', title: 'طرف حساب' },
            { key: 'pay', title: 'روش', group: 'پرداخت' },
            { key: 'ref', title: 'شماره چک / حساب', type: 'ltr', group: 'پرداخت' },
            { key: 'bank', title: 'بانک', group: 'پرداخت' },
            { key: 'due', title: 'سررسید چک', type: 'date', group: 'پرداخت' },
            { key: 'amount', title: 'مبلغ (تومان)', type: 'money', total: true }
          ],
          rows: rows, totals: true
        };
      }
    },

    /* ---------------------------------------------------------------- ۹) هزینه‌ها و خسارت */
    {
      id: 'expenses', cat: 'finance', icon: 'shield-alert', tone: 'rose',
      title: 'هزینه‌ها و خسارت',
      desc: 'هزینه‌های جاری و خسارت‌ها به تفکیک نوع، با سهم پرداخت از تنخواه',
      filters: [
        { id: 'date', type: 'daterange', label: 'بازه‌ی زمانی', from: '۱۴۰۵/۰۶/۰۱', to: 'today', span: 2 },
        { id: 'types', type: 'checks', label: 'نوع', span: 1, cols: 2, options: [{ v: 'expense', t: 'هزینه جاری' }, { v: 'damage', t: 'خسارت' }], value: 'all' },
        { id: 'petty', type: 'radio', label: 'تنخواه', span: 1, value: '', options: [{ v: '', t: 'همه' }, { v: 'out', t: 'فقط از تنخواه' }, { v: 'no', t: 'خارج از تنخواه' }] }
      ],
      build: function (f) {
        var rows = D.accDocs.filter(function (x) {
          return f.types.indexOf(x.type) > -1 && inRange(x.date, f.date) && (!f.petty || (f.petty === 'out' ? x.petty === 'out' : x.petty !== 'out'));
        }).sort(function (a, b) { return (a.type === b.type ? 0 : a.type === 'expense' ? -1 : 1) || key(b.date) - key(a.date); }).map(function (x) {
          return {
            group: ACC_T[x.type].title, date: x.date, item: x.item, consumer: x.consumer || '—', seller: x.seller || x.person || '—', pay: PAY_T[x.pay],
            petty: x.petty === 'out' ? { text: 'از تنخواه', tone: 'badge-warning' } : { text: '—', tone: '' }, amount: accAmount(x)
          };
        });
        return {
          title: 'گزارش هزینه‌ها و خسارت',
          subtitle: rangeText(f.date) + ' · ' + listText(f.types.map(function (t) { return ACC_T[t].title; })),
          columns: [
            { key: 'date', title: 'تاریخ', type: 'date' },
            { key: 'item', title: 'شرح', type: 'wrap' },
            { key: 'consumer', title: 'مصرف‌کننده' },
            { key: 'seller', title: 'فروشنده / دریافت‌کننده' },
            { key: 'pay', title: 'نحوه پرداخت' },
            { key: 'petty', title: 'تنخواه', type: 'badge' },
            { key: 'amount', title: 'مبلغ (تومان)', type: 'money', total: true }
          ],
          rows: rows, groupBy: 'group', groupSum: 'amount', totals: true
        };
      }
    },

    /* ---------------------------------------------------------------- ۱۰) عملکرد پشتیبانی */
    {
      id: 'support-perf', cat: 'ops', icon: 'headset', tone: 'amber', crumb: { label: 'پشتیبانی', href: 'support.html' },
      title: 'عملکرد پشتیبانی',
      desc: 'خدمات ثبت‌شده برای مشتریان به تفکیک مسئول پشتیبانی با زمان صرف‌شده و وضعیت قرارداد',
      filters: [
        { id: 'ref', type: 'select', label: 'شرکت مرجع', span: 1, options: [{ v: '', t: 'همه' }].concat(D.supLists.refCompanies.map(function (x) { return { v: x, t: x }; })) },
        { id: 'q', type: 'text', label: 'نام شرکت', span: 1, placeholder: 'مثلاً آریا گستر' },
        { id: 'date', type: 'daterange', label: 'بازه‌ی زمانی', from: '', to: '', span: 2 },
        { id: 'owners', type: 'checks', label: 'مسئول فعالیت', span: 3, cols: 5, search: true, options: uniq(D.supExperts.concat(D.repOwners)), value: 'all' },
        { id: 'kinds', type: 'checks', label: 'نوع خدمات', span: 1, cols: 2, options: D.supLists.serviceKinds, value: 'all' }
      ],
      build: function (f) {
        var q = f.q.trim(), CO = {};
        D.supCompanies.forEach(function (c) { CO[c.code] = c; });
        var rows = D.supServices.filter(function (x) {
          var c = CO[x.company] || {};
          return f.owners.indexOf(x.owner) > -1 && f.kinds.indexOf(x.kind) > -1 && inRange(x.at.split(' ')[0], f.date) &&
            (!q || (c.name || '').indexOf(q) > -1) && (!f.ref || (c.ref || 'سامانه‌های بعد پنجم') === f.ref);
        }).sort(function (a, b) { return a.owner.localeCompare(b.owner, 'fa') || key(b.at.split(' ')[0]) - key(a.at.split(' ')[0]); }).map(function (x) {
          return {
            owner: x.owner, customer: (CO[x.company] || {}).name || '—', kind: { text: x.kind, tone: x.kind === 'حضوری' ? 'badge-primary' : x.kind === 'تعمیرات' || x.kind === 'گزارش تعمیرات' ? 'badge-danger' : x.kind === 'ریموت' ? 'badge-violet' : 'badge-info' },
            at: x.at, expert: x.expert, cust: x.custExpert || '—', minutes: x.minutes, status: x.status || '—', contract: x.contract || '—', note: x.note
          };
        });
        return {
          title: 'گزارش عملکرد پشتیبانی',
          subtitle: rangeText(f.date) + ' · مسئول: ' + listText(f.owners) + (q ? ' · شرکت: «' + q + '»' : '') + (f.ref ? ' · مرجع: ' + f.ref : ''),
          columns: [
            { key: 'customer', title: 'مشتری', type: 'wrap' },
            { key: 'kind', title: 'نوع خدمات', type: 'badge' },
            { key: 'at', title: 'تاریخ و زمان ثبت', type: 'date' },
            { key: 'expert', title: 'کارشناس شرکت' },
            { key: 'cust', title: 'کارشناس مشتری' },
            { key: 'minutes', title: 'زمان صرف شده (دقیقه)', type: 'num', total: true },
            { key: 'status', title: 'وضعیت' },
            { key: 'contract', title: 'پشتیبانی' },
            { key: 'note', title: 'توضیحات', type: 'wrap' }
          ],
          rows: rows, groupBy: 'owner', groupLabel: 'مسئول پشتیبانی', groupSum: 'minutes', totals: true
        };
      }
    }
  ];
  var BY_ID = {}; REPORTS.forEach(function (r) { BY_ID[r.id] = r; });

  /* ==========================================================================
   * ساخت کارت فیلتر
   * ========================================================================== */
  function optList(fl, f) {
    var o = typeof fl.options === 'function' ? fl.options(f || {}) : fl.options;
    return o.map(function (x) { return typeof x === 'string' ? { v: x, t: x } : x; });
  }
  function checkHtml(type, name, v, label, checked, sub) {
    return '<label class="check"><input type="' + type + '" name="' + name + '" value="' + esc(v) + '"' + (checked ? ' checked' : '') + '>' +
      '<span class="box' + (type === 'radio' ? ' round' : '') + '">' + (type === 'checkbox' ? CRM.icon('check', 12) : '') + '</span>' +
      '<span class="lbl">' + esc(label) + (sub ? ' <small class="d-inline text-soft">' + esc(sub) + '</small>' : '') + '</span></label>';
  }
  function checksBody(fl, f, keep) {
    var opts = optList(fl, f), val = keep || (fl.value === 'all' ? opts.map(function (o) { return o.v; }) : fl.value || []);
    return opts.map(function (o) { return '<div class="rf-ck" data-t="' + esc(o.t + ' ' + (o.sub || '')) + '">' + checkHtml('checkbox', fl.id, o.v, o.t, val.indexOf(o.v) > -1, o.sub) + '</div>'; }).join('') ||
      '<div class="fs-xs text-muted">موردی وجود ندارد.</div>';
  }
  function filterHtml(fl) {
    var h = '<div class="rf" data-f="' + fl.id + '" data-type="' + fl.type + '" style="grid-column:span ' + (fl.span || 1) + '">';
    var lbl = '<div class="form-label">' + esc(fl.label) + '</div>';
    if (fl.type === 'daterange') {
      var to = fl.to === 'today' ? today() : (fl.to || '');
      h += lbl + '<div class="rf-range">' +
        '<div class="input-wrap"><span class="icon lead fs-2xs text-muted" style="font-style:normal">از</span><input class="input num" data-k="from" data-jdate value="' + esc(fl.from || '') + '" placeholder="از ابتدا" aria-label="از تاریخ"><button type="button" class="icon-btn trail" data-jdate-trigger data-icon="calendar" data-icon-size="15"></button></div>' +
        '<div class="input-wrap"><span class="icon lead fs-2xs text-muted" style="font-style:normal">تا</span><input class="input num" data-k="to" data-jdate value="' + esc(to) + '" placeholder="تا امروز" aria-label="تا تاریخ"><button type="button" class="icon-btn trail" data-jdate-trigger data-icon="calendar" data-icon-size="15"></button></div>' +
        '</div><div class="rf-quick">' +
        '<button type="button" class="chip" data-q="month">این ماه</button><button type="button" class="chip" data-q="prev">ماه قبل</button>' +
        '<button type="button" class="chip" data-q="year">امسال</button><button type="button" class="chip" data-q="all">همه</button></div>';
    } else if (fl.type === 'radio') {
      h += lbl + '<div class="rf-radios">' + optList(fl).map(function (o) { return checkHtml('radio', fl.id, o.v, o.t, (fl.value || '') === o.v); }).join('') + '</div>' +
        '<div class="rf-note d-none"></div>';
    } else if (fl.type === 'flags') {
      h += lbl + '<div class="rf-radios rf-flags">' + optList(fl).map(function (o) { return checkHtml('checkbox', fl.id, o.v, o.t, (fl.value || []).indexOf(o.v) > -1); }).join('') + '</div>';
    } else if (fl.type === 'checks') {
      h += '<div class="rf-checks-head"><span class="form-label mb-0">' + esc(fl.label) + '</span><span class="rf-count fs-2xs text-muted"></span>' +
        (fl.search ? '<div class="input-wrap rf-search"><span class="icon lead" data-icon="search" data-icon-size="13"></span><input class="input input-sm" placeholder="جستجو…" aria-label="جستجو در ' + esc(fl.label) + '"></div>' : '') +
        '<label class="check ms-auto rf-all"><input type="checkbox"><span class="box">' + CRM.icon('check', 12) + '</span><span class="lbl fs-xs">انتخاب همه</span></label></div>' +
        '<div class="rf-checks" style="--rf-cols:' + (fl.cols || 3) + '">' + checksBody(fl, defaults()) + '</div>';
    } else if (fl.type === 'select') {
      h += '<label class="form-label" for="rf-' + fl.id + '">' + esc(fl.label) + '</label><select class="select" id="rf-' + fl.id + '">' +
        optList(fl).map(function (o) { return '<option value="' + esc(o.v) + '"' + ((fl.value || '') === o.v ? ' selected' : '') + '>' + esc(o.t) + '</option>'; }).join('') + '</select>';
    } else if (fl.type === 'text') {
      h += '<label class="form-label" for="rf-' + fl.id + '">' + esc(fl.label) + '</label><div class="input-wrap"><span class="icon lead" data-icon="search" data-icon-size="15"></span><input class="input" id="rf-' + fl.id + '" placeholder="' + esc(fl.placeholder || '') + '"></div>';
    }
    return h + '</div>';
  }

  /* مقادیر پیش‌فرض (برای گزینه‌های وابسته در اولین رندر) */
  var CUR = null;
  function defaults() {
    var f = {};
    (CUR ? CUR.filters : []).forEach(function (fl) {
      if (fl.type === 'select' || fl.type === 'radio') f[fl.id] = fl.value || (fl.type === 'select' ? optList(fl)[0].v : '');
    });
    return f;
  }

  /* ==========================================================================
   * mount — صفحه‌ی report.html
   * ========================================================================== */
  function mount(root) {
    var id = (location.search.match(/[?&]r=([\w-]+)/) || [])[1];
    var R = BY_ID[id];
    if (!R) {
      root.innerHTML = '<div class="card"><div class="empty" style="padding:60px 20px"><div class="empty-ic" data-icon="reports" data-icon-size="28"></div>' +
        '<div class="empty-title">گزارش پیدا نشد</div><div class="empty-desc">شناسه‌ی گزارش معتبر نیست؛ از فهرست گزارش‌ها یکی را انتخاب کنید.</div>' +
        '<a class="btn btn-primary mt-4" href="reports-hub.html">همه‌ی گزارش‌ها</a></div></div>';
      return;
    }
    CUR = R;
    d.title = R.title + ' | مدرن‌CRM';
    var cat = CATS.filter(function (c) { return c.id === R.cat; })[0];

    root.innerHTML =
      '<div class="page-head">' +
        '<div><div class="breadcrumb"><a href="dashboard.html">خانه</a><span class="sep" data-icon="chevron-left" data-icon-size="13"></span>' +
        '<a href="' + (R.crumb ? R.crumb.href : 'reports-hub.html') + '">' + (R.crumb ? esc(R.crumb.label) : 'گزارشات') + '</a><span class="sep" data-icon="chevron-left" data-icon-size="13"></span><span class="current">' + esc(R.title) + '</span></div>' +
        '<h1 class="page-title">' + esc(R.title) + ' <span class="badge badge-lg" style="vertical-align:middle">' + esc(cat.title) + '</span></h1>' +
        '<p class="page-desc">' + esc(R.desc) + '</p></div>' +
        '<div class="head-actions">' +
          '<div class="dropdown"><button class="btn" type="button" data-dropdown-toggle><span data-icon="reports" data-icon-size="16"></span> گزارش دیگر <span data-icon="chevron-down" data-icon-size="14"></span></button>' +
          '<div class="dropdown-menu" style="min-width:230px">' + REPORTS.map(function (x) {
            return '<a class="dropdown-item' + (x === R ? ' is-active' : '') + '" href="report.html?r=' + x.id + '"><span data-icon="' + x.icon + '" data-icon-size="16"></span> ' + esc(x.title) + '</a>';
          }).join('') + '</div></div>' +
          '<a class="btn" href="reports-hub.html"><span data-icon="layout-grid" data-icon-size="16"></span> همه‌ی گزارش‌ها</a>' +
        '</div>' +
      '</div>' +

      /* کارت فیلتر */
      '<form class="card mb-5 rep-filters" id="repFilters" data-win-nobtn novalidate>' +
        '<div class="card-head"><div class="card-title"><span data-icon="list-filter" data-icon-size="18"></span> فیلترهای گزارش</div>' +
        '<div class="card-actions"><button type="button" class="tb-icon" id="rfToggle" data-tip="جمع / باز کردن فیلترها" data-icon="chevron-up" data-icon-size="17"></button></div></div>' +
        '<div class="card-body" id="rfBody"><div class="rf-grid">' + R.filters.map(filterHtml).join('') + '</div></div>' +
        '<div class="form-actions" id="rfActions">' +
          '<button type="submit" class="btn btn-primary"><span data-icon="eye" data-icon-size="16"></span> مشاهده</button>' +
          '<button type="button" class="btn" id="rfReset"><span data-icon="eraser" data-icon-size="16"></span> جدید</button>' +
          '<span class="spacer"></span><span class="fs-xs text-muted" id="rfSummary"></span>' +
        '</div>' +
      '</form>' +

      /* نمایشگر */
      '<div class="card rep-viewer" id="repViewer">' +
        '<div class="rv-toolbar">' +
          '<div class="rv-grp">' +
            '<button type="button" class="tb-icon" data-pg="first" data-tip="صفحه‌ی اول" data-icon="chevron-right" data-icon-size="16"></button>' +
            '<button type="button" class="tb-icon" data-pg="prev" data-tip="صفحه‌ی قبل" data-icon="arrow-right" data-icon-size="15"></button>' +
            '<input class="input input-sm num rv-page" id="rvPage" value="۱" aria-label="شماره صفحه"><span class="fs-xs text-muted text-nowrap">از <b class="num" id="rvPages">۱</b></span>' +
            '<button type="button" class="tb-icon" data-pg="next" data-tip="صفحه‌ی بعد" data-icon="arrow-left" data-icon-size="15"></button>' +
            '<button type="button" class="tb-icon" data-pg="last" data-tip="صفحه‌ی آخر" data-icon="chevron-left" data-icon-size="16"></button>' +
          '</div>' +
          '<span class="rv-sep"></span>' +
          '<div class="rv-grp">' +
            '<select class="select select-sm" id="rvSize" aria-label="تعداد ردیف در صفحه" style="width:auto"><option value="15">۱۵ ردیف</option><option value="25" selected>۲۵ ردیف</option><option value="50">۵۰ ردیف</option><option value="0">همه</option></select>' +
            '<select class="select select-sm" id="rvZoom" aria-label="بزرگ‌نمایی" style="width:auto"><option value="0.75">۷۵٪</option><option value="0.9">۹۰٪</option><option value="1" selected>۱۰۰٪</option><option value="1.1">۱۱۰٪</option><option value="1.25">۱۲۵٪</option></select>' +
          '</div>' +
          '<span class="rv-sep"></span>' +
          '<div class="rv-grp">' +
            '<div class="input-wrap" style="width:170px"><span class="icon lead" data-icon="search" data-icon-size="14"></span><input class="input input-sm" id="rvFind" placeholder="یافتن در گزارش…" aria-label="یافتن"></div>' +
            '<button type="button" class="btn btn-sm" id="rvNext">بعدی</button><span class="fs-2xs text-muted text-nowrap num" id="rvHits"></span>' +
          '</div>' +
          '<span class="spacer"></span>' +
          '<div class="rv-grp">' +
            '<button type="button" class="tb-icon" id="rvRefresh" data-tip="بازخوانی" data-icon="refresh" data-icon-size="16"></button>' +
            '<button type="button" class="tb-icon" id="rvPrint" data-tip="چاپ" data-icon="printer" data-icon-size="16"></button>' +
            '<div class="dropdown"><button type="button" class="btn btn-sm" data-dropdown-toggle><span data-icon="download" data-icon-size="15"></span> خروجی <span data-icon="chevron-down" data-icon-size="13"></span></button>' +
              '<div class="dropdown-menu">' +
                '<button type="button" class="dropdown-item" data-exp="Excel|xlsx"><span data-icon="file-spreadsheet" data-icon-size="16"></span> Excel</button>' +
                '<button type="button" class="dropdown-item" data-exp="PDF|pdf"><span data-icon="file" data-icon-size="16"></span> PDF</button>' +
                '<button type="button" class="dropdown-item" data-exp="Word|docx"><span data-icon="files" data-icon-size="16"></span> Word</button>' +
              '</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="rv-stage"><div class="rv-paper" id="rvPaper"></div></div>' +
      '</div>';

    var form = root.querySelector('#repFilters'), paper = root.querySelector('#rvPaper');
    var $ = function (s) { return root.querySelector(s); }, $$ = function (s, el) { return Array.prototype.slice.call((el || root).querySelectorAll(s)); };
    var state = { out: null, page: 0, size: 25, zoom: 1, q: '', hits: [], hi: -1, printing: false };

    /* ---------- خواندن فیلترها */
    function read() {
      var f = {};
      R.filters.forEach(function (fl) {
        var el = form.querySelector('.rf[data-f="' + fl.id + '"]');
        if (fl.type === 'daterange') f[fl.id] = { from: el.querySelector('[data-k="from"]').value.trim(), to: el.querySelector('[data-k="to"]').value.trim() };
        else if (fl.type === 'radio') { var r = el.querySelector('input:checked'); f[fl.id] = r ? r.value : ''; }
        else if (fl.type === 'checks' || fl.type === 'flags') f[fl.id] = $$('.rf-checks input:checked, .rf-flags input:checked', el).map(function (i) { return i.value; });
        else f[fl.id] = el.querySelector('select, input').value;
      });
      return f;
    }
    /* ---------- حالت‌های وابسته: یادداشت گزینه‌ها، غیرفعال‌سازی، شمارنده‌ی چک‌ها */
    function sync() {
      var f = read();
      R.filters.forEach(function (fl) {
        var el = form.querySelector('.rf[data-f="' + fl.id + '"]');
        if (fl.type === 'radio') {
          var o = optList(fl).filter(function (x) { return x.v === f[fl.id]; })[0], note = el.querySelector('.rf-note');
          note.classList.toggle('d-none', !(o && o.note));
          note.innerHTML = o && o.note ? CRM.icon('info', 13) + ' ' + esc(o.note) : '';
        }
        if (fl.disabledWhen) {
          var off = fl.disabledWhen(f);
          el.classList.toggle('is-off', off);
          $$('input', el).forEach(function (i) { i.disabled = off; });
        }
        if (fl.type === 'checks') {
          var all = $$('.rf-checks input', el), on = all.filter(function (i) { return i.checked; });
          el.querySelector('.rf-count').textContent = fa(on.length) + ' از ' + fa(all.length);
          var a = el.querySelector('.rf-all input'); a.checked = all.length > 0 && on.length === all.length; a.indeterminate = on.length > 0 && on.length < all.length;
        }
      });
    }
    form.addEventListener('change', function (e) {
      var rf = e.target.closest('.rf'); if (!rf) return;
      var fl = R.filters.filter(function (x) { return x.id === rf.getAttribute('data-f'); })[0];
      if (e.target.closest('.rf-all')) $$('.rf-checks .rf-ck:not(.d-none) input', rf).forEach(function (i) { i.checked = e.target.checked; });
      /* گزینه‌های وابسته */
      R.filters.forEach(function (dep) {
        if (dep.dependsOn === fl.id) {
          var box = form.querySelector('.rf[data-f="' + dep.id + '"] .rf-checks');
          box.innerHTML = checksBody(dep, read());
          var s = form.querySelector('.rf[data-f="' + dep.id + '"] .rf-search input'); if (s) s.value = '';
        }
      });
      sync();
    });
    form.addEventListener('input', function (e) {
      var s = e.target.closest('.rf-search'); if (!s) return;
      var q = e.target.value.trim();
      $$('.rf-ck', s.closest('.rf')).forEach(function (c) { c.classList.toggle('d-none', !!q && c.getAttribute('data-t').indexOf(q) < 0); });
    });
    form.addEventListener('click', function (e) {
      var b = e.target.closest('[data-q]'); if (!b) return;
      var rf = b.closest('.rf'), t = J.toJalali(new Date()), from = '', to = '';
      var fmt = function (y, m, dd) { return J.format({ jy: y, jm: m, jd: dd }); };
      var q = b.getAttribute('data-q');
      if (q === 'month') { from = fmt(t.jy, t.jm, 1); to = today(); }
      if (q === 'prev') { var y = t.jm === 1 ? t.jy - 1 : t.jy, m = t.jm === 1 ? 12 : t.jm - 1; from = fmt(y, m, 1); to = fmt(y, m, J.monthLength(y, m)); }
      if (q === 'year') { from = fmt(t.jy, 1, 1); to = today(); }
      rf.querySelector('[data-k="from"]').value = from; rf.querySelector('[data-k="to"]').value = to;
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); run(true); });
    $('#rfReset').addEventListener('click', function () {
      $('.rf-grid').innerHTML = R.filters.map(filterHtml).join(''); CRM.init($('.rf-grid')); sync(); run(true);
    });
    $('#rfToggle').addEventListener('click', function () {
      var hide = !$('#rfBody').classList.contains('d-none');
      $('#rfBody').classList.toggle('d-none', hide); $('#rfActions').classList.toggle('d-none', hide);
      this.innerHTML = CRM.icon(hide ? 'chevron-down' : 'chevron-up', 17);
    });

    /* ---------- اجرا */
    function run(toast) {
      var f = read();
      R.filters.forEach(function (fl) {
        if (fl.type === 'daterange') {
          var bad = [f[fl.id].from, f[fl.id].to].some(function (v) { return v && !J.parse(v); });
          form.querySelector('.rf[data-f="' + fl.id + '"]').classList.toggle('is-invalid', bad);
          if (bad) f[fl.id] = { from: '', to: '' };
        }
      });
      state.out = R.build(f);
      state.at = new Date(); state.page = 0; state.hits = []; state.hi = -1;
      $('#rvFind').value = ''; state.q = ''; $('#rvHits').textContent = '';
      $('#rfSummary').textContent = fa(state.out.rows.length) + ' ردیف';
      render();
      if (toast) CRM.toast({ type: 'success', title: 'گزارش به‌روز شد', msg: fa(state.out.rows.length) + ' ردیف', duration: 1600 });
    }

    /* ---------- رندر کاغذ گزارش */
    function cell(c, row) {
      var v = row[c.key];
      if (v == null || v === '') return '<span class="text-soft">—</span>';
      switch (c.type) {
        case 'num': return typeof v === 'number' ? CRM.num(v) : fa(v);
        case 'money': return CRM.num(v);
        case 'date': return '<span class="num text-nowrap">' + fa(v) + '</span>';
        case 'ltr': return v === '-' || v === '—' ? '<span class="text-soft">—</span>' : '<span class="ltr-cell num">' + fa(esc(v)) + '</span>';
        case 'badge': return v.text === '—' ? '<span class="text-soft">—</span>' : '<span class="badge ' + (v.tone || '') + '">' + esc(v.text) + '</span>';
        case 'bar': return '<div class="rp-bar"><span class="rp-track"><i style="width:' + Math.min(100, v) + '%"></i></span><span class="num">' + fa(v) + '٪</span></div>';
        default: return esc(v);
      }
    }
    function headHtml(cols) {
      var hasGroup = cols.some(function (c) { return c.group; });
      var cls = function (c) { return c.type === 'num' || c.type === 'money' ? ' class="t-num"' : ''; };
      if (!hasGroup) return '<tr><th class="rp-idx">ردیف</th>' + cols.map(function (c) { return '<th' + cls(c) + '>' + esc(c.title) + '</th>'; }).join('') + '</tr>';
      var top = '<tr><th class="rp-idx" rowspan="2">ردیف</th>', bottom = '<tr>';
      for (var i = 0; i < cols.length; i++) {
        var c = cols[i];
        if (!c.group) { top += '<th rowspan="2"' + cls(c) + '>' + esc(c.title) + '</th>'; continue; }
        var span = 1; while (cols[i + span] && cols[i + span].group === c.group) span++;
        top += '<th colspan="' + span + '" class="rp-group-h">' + esc(c.group) + '</th>';
        for (var k = 0; k < span; k++) bottom += '<th' + cls(cols[i + k]) + '>' + esc(cols[i + k].title) + '</th>';
        i += span - 1;
      }
      return top + '</tr>' + bottom + '</tr>';
    }
    function render() {
      var o = state.out, cols = o.columns, rows = o.rows;
      var size = state.printing ? 0 : state.size;
      var pages = size ? Math.max(1, Math.ceil(rows.length / size)) : 1;
      state.page = Math.max(0, Math.min(state.page, pages - 1));
      var start = size ? state.page * size : 0, slice = size ? rows.slice(start, start + size) : rows;
      var body = '', prevG = null, hitRow = state.hi > -1 ? state.hits[state.hi] : -1;
      slice.forEach(function (row, i) {
        if (o.groupBy && row[o.groupBy] !== prevG) {
          prevG = row[o.groupBy];
          var gr = rows.filter(function (r) { return r[o.groupBy] === prevG; });
          body += '<tr class="rp-grp"><td colspan="' + (cols.length + 1) + '">' + (o.groupLabel ? '<span class="text-muted fw-500">' + esc(o.groupLabel) + ': </span>' : '') + '<bdi>' + esc(prevG) + '</bdi> <span class="rp-grp-n">' + fa(gr.length) + ' ردیف' +
            (o.groupSum ? ' · جمع ' + CRM.num(sum(gr, o.groupSum)) : '') + '</span></td></tr>';
        }
        body += '<tr' + (start + i === hitRow ? ' class="rp-hit"' : '') + ' data-ri="' + (start + i) + '"><td class="rp-idx">' + fa(start + i + 1) + '</td>' +
          cols.map(function (c) {
            var cls = (c.type === 'num' || c.type === 'money') ? 't-num' : c.type === 'wrap' ? 't-wrap' : c.type === 'bar' ? 't-bar' : '';
            return '<td' + (cls ? ' class="' + cls + '"' : '') + '>' + cell(c, row) + '</td>';
          }).join('') + '</tr>';
      });
      if (!rows.length) body = '<tr><td colspan="' + (cols.length + 1) + '"><div class="empty" style="padding:40px 10px"><div class="empty-ic" data-icon="search" data-icon-size="24"></div><div class="empty-title">داده‌ای برای نمایش نیست</div><div class="empty-desc">فیلترها را تغییر دهید و دوباره «مشاهده» را بزنید.</div></div></td></tr>';
      var foot = '';
      if (o.totals && rows.length) {
        foot = '<tfoot><tr><td class="rp-idx"></td>' + cols.map(function (c, i) {
          if (c.total) return '<td class="t-num">' + CRM.num(sum(rows, c.key)) + '</td>';
          return '<td>' + (i === 0 ? 'جمع کل' : '') + '</td>';
        }).join('') + '</tr></tfoot>';
      }
      var at = state.at, tj = J.toJalali(at), p2 = function (n) { return (n < 10 ? '0' : '') + n; };
      paper.innerHTML =
        '<div class="rp-head">' +
          '<div class="rp-brand"><span class="rp-logo">' + CRM.icon('sparkles', 18) + '</span><div><div class="fw-700 text-strong">مدرن‌CRM</div><div class="fs-2xs text-muted">سامانه‌ی مدیریت ارتباط با مشتری</div></div></div>' +
          '<div class="rp-titles"><div class="rp-title">' + esc(o.title) + '</div>' + (o.subtitle ? '<div class="rp-sub">' + esc(fa(o.subtitle)) + '</div>' : '') + '</div>' +
          '<div class="rp-meta"><div>تاریخ گزارش: <span class="num">' + J.format(tj) + '</span></div><div>ساعت: <span class="num">' + fa(p2(at.getHours()) + ':' + p2(at.getMinutes())) + '</span></div><div>کاربر: ' + esc(D.msgMe) + '</div></div>' +
        '</div>' +
        '<div class="rp-table-wrap"><table class="rp-table"><thead>' + headHtml(cols) + '</thead><tbody>' + body + '</tbody>' + foot + '</table></div>' +
        '<div class="rp-foot"><span>تعداد ردیف‌ها: <b class="num">' + fa(rows.length) + '</b>' + (o.note ? ' · ' + esc(o.note) : '') + '</span>' +
        '<span>صفحه‌ی <span class="num">' + fa(state.page + 1) + '</span> از <span class="num">' + fa(pages) + '</span></span></div>';
      paper.style.zoom = state.printing ? 1 : state.zoom;
      CRM.renderIcons(paper);
      $('#rvPage').value = fa(state.page + 1); $('#rvPages').textContent = fa(pages);
      $$('[data-pg]').forEach(function (b) {
        var g = b.getAttribute('data-pg');
        b.disabled = (g === 'first' || g === 'prev') ? state.page === 0 : state.page >= pages - 1;
      });
      if (state.q) highlight();
    }

    /* ---------- یافتن */
    function highlight() {
      var q = state.q, walker = d.createTreeWalker(paper.querySelector('tbody'), NodeFilter.SHOW_TEXT), nodes = [];
      while (walker.nextNode()) if (walker.currentNode.nodeValue.indexOf(q) > -1) nodes.push(walker.currentNode);
      nodes.forEach(function (n) {
        var parts = n.nodeValue.split(q), frag = d.createDocumentFragment();
        parts.forEach(function (p, i) {
          if (p) frag.appendChild(d.createTextNode(p));
          if (i < parts.length - 1) { var m = d.createElement('mark'); m.className = 'rp-mark'; m.textContent = q; frag.appendChild(m); }
        });
        n.parentNode.replaceChild(frag, n);
      });
    }
    function rowText(row) {
      return state.out.columns.map(function (c) { var v = row[c.key]; return v && typeof v === 'object' ? v.text : (c.type === 'money' || (c.type === 'num' && typeof v === 'number') ? CRM.num(v) : fa(v == null ? '' : v)); }).join(' ');
    }
    function find(next) {
      var q = fa($('#rvFind').value.trim());
      if (q !== state.q) { state.q = q; state.hits = q ? state.out.rows.map(function (r, i) { return rowText(r).indexOf(q) > -1 ? i : -1; }).filter(function (i) { return i > -1; }) : []; state.hi = -1; }
      if (next && state.hits.length) state.hi = (state.hi + 1) % state.hits.length;
      if (state.hi > -1 && state.size) state.page = Math.floor(state.hits[state.hi] / state.size);
      $('#rvHits').textContent = q ? (state.hits.length ? fa(state.hi + 1 > 0 ? state.hi + 1 : 0) + ' از ' + fa(state.hits.length) : 'یافت نشد') : '';
      render();
      var hit = paper.querySelector('.rp-hit'); if (hit && next) hit.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
    $('#rvFind').addEventListener('input', CRM.debounce(function () { find(false); }, 200));
    $('#rvFind').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); find(true); } });
    $('#rvNext').addEventListener('click', function () { find(true); });

    /* ---------- صفحه‌بندی، بزرگ‌نمایی، چاپ، خروجی */
    root.querySelector('.rv-toolbar').addEventListener('click', function (e) {
      var b = e.target.closest('[data-pg]'); if (!b) return;
      var g = b.getAttribute('data-pg'), pages = state.size ? Math.ceil(state.out.rows.length / state.size) : 1;
      state.page = g === 'first' ? 0 : g === 'prev' ? state.page - 1 : g === 'next' ? state.page + 1 : pages - 1;
      render();
    });
    $('#rvPage').addEventListener('change', function () { state.page = (+en(this.value) || 1) - 1; render(); });
    $('#rvSize').addEventListener('change', function () { state.size = +this.value; state.page = 0; render(); });
    $('#rvZoom').addEventListener('change', function () { state.zoom = +this.value; paper.style.zoom = state.zoom; });
    $('#rvRefresh').addEventListener('click', function () { run(true); });
    $('#rvPrint').addEventListener('click', function () { w.print(); });
    w.addEventListener('beforeprint', function () { state.printing = true; render(); });
    w.addEventListener('afterprint', function () { state.printing = false; render(); });
    $$('[data-exp]').forEach(function (b) {
      b.addEventListener('click', function () {
        var x = b.getAttribute('data-exp').split('|');
        CRM.toast({ type: 'success', title: 'خروجی ' + x[0] + ' آماده شد', msg: 'فایل «' + R.title + '.' + x[1] + '» (نمایشی) با ' + fa(state.out.rows.length) + ' ردیف ساخته شد.' });
      });
    });

    sync();
    run(false);
  }

  w.CRM_REPORTS = { list: REPORTS, cats: CATS, get: function (id) { return BY_ID[id]; }, mount: mount };
})(window, document);
