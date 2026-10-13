/*!
 * ============================================================================
 *  ModernCRM · data.js — مدل منو و داده‌های نمونه (فقط برای نمایش UI)
 *  نکته: در پروژه واقعی این داده‌ها از API بک‌اند تامین می‌شوند.
 * ============================================================================
 */
window.CRM_DATA = (function () {
  'use strict';

  /* ------------------------------------------------------------ منوی اصلی */
  /* --------------------------------------------------------------------------
   * بخش‌های سامانه (ماژول‌ها) — منبع واحد برای «منوی سایدبار» و «پنل بخش‌ها» در داشبورد.
   *  - هر صفحه فقط یک‌بار و فقط در یک بخش می‌آید.
   *  - children: زیرمنوی بخش؛ id باید با data-page صفحه یکی باشد.
   *  - nav: false   → فقط در پنل داشبورد (مثلاً میز کار که در سایدبار گروه جدا دارد)
   *  - soon: true   → هنوز ساخته نشده؛ در سایدبار نمی‌آید و در داشبورد «به‌زودی» است.
   *  - links: پیوندهای اضافه‌ی کارت داشبورد (مثلاً گزارش‌های بخش‌های دیگر)
   * -------------------------------------------------------------------------- */
  var MODULES = [
    {
      id: 'm-workspace', label: 'میز کار', icon: 'layout-grid', tone: 'ink', href: 'desktop.html', nav: false,
      desc: 'تقویم، کارهای روزانه، جریان فعالیت‌ها و میزکار پنجره‌ای',
      children: [
        { id: 'calendar', label: 'تقویم', href: 'calendar.html' },
        { id: 'activity', label: 'فعالیت‌ها', href: 'activity.html' },
        { id: 'desktop', label: 'میزکار پنجره‌ای', href: 'desktop.html' },
        { id: 'notifications', label: 'اعلان‌ها', href: 'notifications.html' }
      ]
    },
    {
      id: 'm-customers', label: 'مشتریان', icon: 'customers', tone: '', href: 'customers.html', badge: '۱۲۴',
      desc: 'پرونده‌ی مشتریان، اطلاعات تماس، سطح و سابقه‌ی تعامل',
      children: [
        { id: 'customers', label: 'فهرست مشتریان', href: 'customers.html' },
        { id: 'customer-new', label: 'افزودن مشتری', href: 'customer-new.html' },
        { id: 'customer-profile', label: 'پروفایل مشتری', href: 'customer-profile.html' }
      ]
    },
    {
      id: 'm-sales', label: 'فروش', icon: 'deals', tone: 'success', href: 'pipeline.html',
      desc: 'قیف فروش، معاملات در جریان، صدور و پیگیری فاکتورها',
      children: [
        { id: 'pipeline', label: 'قیف فروش', href: 'pipeline.html' },
        { id: 'deals', label: 'معاملات', href: 'deals.html' },
        { id: 'invoices', label: 'فاکتورها', href: 'invoices.html' }
      ]
    },
    {
      id: 'm-warehouse', label: 'انبار', icon: 'warehouse', tone: 'sky', href: 'warehouse.html',
      desc: 'تعریف محصولات، ورود و خروج کالا از انبار اصلی و فرعی، موجودی',
      children: [
        { id: 'warehouse', label: 'نمای کلی انبار', href: 'warehouse.html' },
        { id: 'warehouse-products', label: 'تعریف محصولات', href: 'warehouse-products.html' },
        { id: 'products', label: 'کاتالوگ کالا و خدمات', href: 'products.html' },
        { id: 'warehouse-in', label: 'ورود محصول', href: 'warehouse-in.html' },
        { id: 'warehouse-out', label: 'خروج از انبار اصلی', href: 'warehouse-out.html' },
        { id: 'warehouse-out-sub', label: 'خروج از انبار فرعی', href: 'warehouse-out.html?store=sub' },
        { id: 'warehouse-stock', label: 'گزارش موجودی', href: 'warehouse-stock.html' }
      ]
    },
    {
      id: 'm-support', label: 'پشتیبانی', icon: 'headset', tone: 'amber', href: 'tickets.html', badge: '۵',
      desc: 'تیکت‌ها، سفر پرونده تا رضایت مشتری، گفتگو و پایگاه دانش',
      children: [
        { id: 'tickets', label: 'تیکت‌ها', href: 'tickets.html' },
        { id: 'ticket-new', label: 'ثبت تیکت جدید', href: 'ticket-new.html' },
        { id: 'journey', label: 'سفر مشتری (پرونده‌ها)', href: 'journey.html' },
        { id: 'messages', label: 'گفتگو با مشتریان', href: 'messages.html' },
        { id: 'kb', label: 'پایگاه دانش', href: 'kb.html' }
      ]
    },
    {
      id: 'm-accounting', label: 'حسابداری', icon: 'wallet', tone: 'coral', href: '#', soon: true,
      desc: 'دریافت و پرداخت، تسویه‌ی فاکتورها و اسناد مالی',
      children: []
    },
    {
      id: 'm-reports', label: 'گزارشات', icon: 'reports', tone: 'rose', href: 'reports.html',
      desc: 'گزارش‌های تحلیلی فروش، عملکرد تیم و منابع جذب',
      children: [
        { id: 'reports', label: 'گزارش‌های تحلیلی', href: 'reports.html' }
      ],
      links: [
        { label: 'گزارش موجودی انبار', href: 'warehouse-stock.html' }
      ]
    },
    {
      id: 'm-defs', label: 'تعاریف', icon: 'list-tree', tone: 'violet', href: 'defs.html',
      desc: 'کاربران و سطح دسترسی، دوره مالی، تعاریف اولیه و تنظیمات',
      children: [
        { id: 'defs', label: 'نمای کلی تعاریف', href: 'defs.html' },
        { id: 'defs-users', label: 'تعریف کاربران و دسترسی', href: 'defs-users.html' },
        { id: 'users', label: 'نقش‌ها و امنیت ورود', href: 'users.html' },
        { id: 'defs-fiscal', label: 'دوره مالی', href: 'defs-fiscal.html' },
        { id: 'defs-basic', label: 'تعاریف اولیه', href: 'defs-basic.html' },
        { id: 'defs-settings', label: 'تنظیمات فاکتور', href: 'defs-settings.html' },
        { id: 'settings', label: 'تنظیمات سیستم', href: 'settings.html' }
      ]
    }
  ];

  /* منوی سایدبار: «میز کار» تخت + «بخش‌ها» که هرکدام یک زیرمنوی تاشونده است */
  var NAV = [
    {
      group: 'میز کار',
      items: [
        { id: 'dashboard', label: 'داشبورد', icon: 'dashboard', href: 'dashboard.html' },
        { id: 'calendar', label: 'تقویم', icon: 'calendar', href: 'calendar.html' },
        { id: 'activity', label: 'فعالیت‌ها', icon: 'activity', href: 'activity.html' },
        { id: 'desktop', label: 'میزکار پنجره‌ای', icon: 'window', href: 'desktop.html', badge: 'پنجره‌ای', badgeStyle: 'solid' }
      ]
    },
    {
      group: 'بخش‌ها',
      key: 'modules',
      items: MODULES.filter(function (m) { return m.nav !== false && !m.soon; }).map(function (m) {
        /* بخشی که فقط یک صفحه دارد، زیرمنو نمی‌خواهد */
        if (m.children.length === 1) return { id: m.children[0].id, label: m.label, icon: m.icon, href: m.children[0].href, badge: m.badge };
        return { id: m.id, label: m.label, icon: m.icon, href: m.href, badge: m.badge, children: m.children };
      })
    }
  ];

  /* ---------------------------------------------------------------- KPI ها */
  var KPIS = [
    { label: 'مشتریان فعال', value: 1248, unit: 'نفر', delta: '+۱۲٪', up: true, icon: 'users', tone: '', chart: '4,9,7,12,10,16,14,19' },
    { label: 'درآمد این ماه', value: 486500000, unit: 'تومان', delta: '+۸٫۴٪', up: true, icon: 'wallet', tone: 'sky', chart: '10,7,12,9,14,12,17,20' },
    { label: 'معاملات باز', value: 63, unit: 'مورد', delta: '−۳٪', up: false, icon: 'deals', tone: 'violet', chart: '18,14,15,11,13,9,10,8' },
    { label: 'نرخ تبدیل', value: 32.4, unit: '٪', delta: '+۲٫۱٪', up: true, icon: 'target', tone: 'amber', chart: '8,10,9,13,12,15,14,17' }
  ];

  /* ------------------------------------------------------------- مشتریان */
  var CUSTOMERS = [
    { id: 'C-1042', name: 'مریم رضایی', company: 'پارس‌نیکان', phone: '۰۹۱۲۳۴۵۶۷۸۹', email: 'm.rezaei@parsnikan.ir', city: 'تهران', status: 'active', level: 'طلایی', value: 128400000, last: '۱۴۰۴/۰۷/۱۸', tags: ['فعال', 'حقوقی'] },
    { id: 'C-1041', name: 'علی محمدی', company: 'فناوران آبی', phone: '۰۹۳۵۱۱۲۲۳۳۴', email: 'ali@abitech.com', city: 'اصفهان', status: 'active', level: 'نقره‌ای', value: 84200000, last: '۱۴۰۴/۰۷/۱۶', tags: ['حقوقی'] },
    { id: 'C-1040', name: 'زهرا کریمی', company: 'شخصی', phone: '۰۹۱۹۸۸۷۷۶۶۵', email: 'z.karimi@gmail.com', city: 'شیراز', status: 'pending', level: 'برنزی', value: 12900000, last: '۱۴۰۴/۰۷/۱۵', tags: ['حقیقی'] },
    { id: 'C-1039', name: 'حسین نوری', company: 'گروه صنعتی البرز', phone: '۰۹۱۲۴۴۴۵۵۶۶', email: 'h.nouri@alborz.co', city: 'کرج', status: 'active', level: 'طلایی', value: 297500000, last: '۱۴۰۴/۰۷/۱۲', tags: ['کلیدی', 'حقوقی'] },
    { id: 'C-1038', name: 'سارا احمدی', company: 'آتلیه طراحی نور', phone: '۰۹۳۳۷۷۷۸۸۹۹', email: 'sara@noor.studio', city: 'مشهد', status: 'inactive', level: 'نقره‌ای', value: 45600000, last: '۱۴۰۴/۰۶/۰۲', tags: ['حقیقی'] },
    { id: 'C-1037', name: 'محمد صادقی', company: 'تجهیزات پزشکی رها', phone: '۰۹۰۱۲۳۴۵۶۷۸', email: 'm.sadeghi@raha-med.ir', city: 'تبریز', status: 'active', level: 'برنزی', value: 23400000, last: '۱۴۰۴/۰۷/۰۹', tags: ['حقوقی'] },
    { id: 'C-1036', name: 'نگار جعفری', company: 'بوتیک ونوس', phone: '۰۹۱۲۹۹۹۰۰۱۱', email: 'negar@venus.shop', city: 'رشت', status: 'blocked', level: 'برنزی', value: 6900000, last: '۱۴۰۴/۰۵/۲۱', tags: ['حقیقی'] },
    { id: 'C-1035', name: 'امیر شریفی', company: 'هلدینگ داده‌پرداز', phone: '۰۹۱۲۵۵۵۶۶۷۷', email: 'amir@dadeh-pardaz.ir', city: 'تهران', status: 'active', level: 'طلایی', value: 512000000, last: '۱۴۰۴/۰۷/۱۷', tags: ['کلیدی', 'حقوقی'] }
  ];

  /* -------------------------------------------------------------- معاملات */
  var DEAL_STAGES = [
    { id: 'lead', title: 'سرنخ جدید', color: 'var(--info)', tone: 'info' },
    { id: 'contact', title: 'تماس برقرار شد', color: 'var(--violet-500)', tone: 'violet' },
    { id: 'proposal', title: 'ارسال پیش‌فاکتور', color: 'var(--warning)', tone: 'warning' },
    { id: 'negotiation', title: 'مذاکره', color: 'var(--sky-500)', tone: 'sky' },
    { id: 'won', title: 'برنده شده', color: 'var(--brand)', tone: 'success' }
  ];
  var DEALS = [
    { id: 'D-2210', title: 'خرید لایسنس سالانه CRM', customer: 'پارس‌نیکان', value: 180000000, stage: 'negotiation', owner: 'م. رضایی', due: '۱۴۰۴/۰۷/۲۹', priority: 'high', progress: 65 },
    { id: 'D-2209', title: 'پیاده‌سازی ماژول انبار', customer: 'گروه البرز', value: 420000000, stage: 'won', owner: 'ح. نوری', due: '۱۴۰۴/۰۷/۲۱', priority: 'normal', progress: 100 },
    { id: 'D-2208', title: 'پشتیبانی طلایی ۱۲ ماهه', customer: 'داده‌پرداز', value: 96000000, stage: 'proposal', owner: 'ا. شریفی', due: '۱۴۰۴/۰۸/۰۳', priority: 'urgent', progress: 40 },
    { id: 'D-2207', title: 'آموزش تیم فروش', customer: 'فناوران آبی', value: 34000000, stage: 'contact', owner: 'ع. محمدی', due: '۱۴۰۴/۰۸/۱۰', priority: 'normal', progress: 20 },
    { id: 'D-2206', title: 'توسعه ماژول گزارش‌ساز', customer: 'آتلیه نور', value: 58000000, stage: 'lead', owner: 'س. احمدی', due: '۱۴۰۴/۰۸/۱۴', priority: 'low', progress: 10 },
    { id: 'D-2205', title: 'مهاجرت داده‌ها', customer: 'رها‌مد', value: 74000000, stage: 'contact', owner: 'م. صادقی', due: '۱۴۰۴/۰۸/۰۶', priority: 'high', progress: 30 },
    { id: 'D-2204', title: 'قرارداد نگهداری نرم‌افزار', customer: 'بوتیک ونوس', value: 21000000, stage: 'proposal', owner: 'ن. جعفری', due: '۱۴۰۴/۰۷/۲۵', priority: 'normal', progress: 45 }
  ];

  /* ----------------------------------------------------------------- تیکت‌ها */
  var TICKETS = [
    { id: 'TK-5521', subject: 'خطا در ارسال فاکتور گروهی', customer: 'پارس‌نیکان', priority: 'urgent', status: 'open', agent: 'مهدی ک.', updated: '۱۰ دقیقه پیش', channel: 'ایمیل' },
    { id: 'TK-5520', subject: 'درخواست افزودن کاربر جدید', customer: 'فناوران آبی', priority: 'normal', status: 'pending', agent: 'سمیرا ر.', updated: '۴۵ دقیقه پیش', channel: 'پنل' },
    { id: 'TK-5519', subject: 'فیلتر تاریخ در گزارش فروش کار نمی‌کند', customer: 'گروه البرز', priority: 'high', status: 'in_progress', agent: 'رضا پ.', updated: '۲ ساعت پیش', channel: 'تلفن' },
    { id: 'TK-5518', subject: 'سؤال درباره صورت‌حساب‌ها', customer: 'شخصی', priority: 'low', status: 'answered', agent: 'نیما ع.', updated: 'دیروز', channel: 'چت' },
    { id: 'TK-5517', subject: 'کندی بارگذاری داشبورد', customer: 'داده‌پرداز', priority: 'high', status: 'closed', agent: 'مهدی ک.', updated: '۳ روز پیش', channel: 'ایمیل' }
  ];

  /* ------------------------------------------------------------- فاکتورها */
  var INVOICES = [
    { no: '۱۴۰۴-۰۵۲۱', customer: 'گروه صنعتی البرز', date: '۱۴۰۴/۰۷/۱۸', due: '۱۴۰۴/۰۸/۰۲', amount: 420000000, tax: 37800000, status: 'paid', items: 6 },
    { no: '۱۴۰۴-۰۵۲۰', customer: 'پارس‌نیکان', date: '۱۴۰۴/۰۷/۱۶', due: '۱۴۰۴/۰۷/۳۰', amount: 180000000, tax: 16200000, status: 'partial', items: 3 },
    { no: '۱۴۰۴-۰۵۱۹', customer: 'داده‌پرداز', date: '۱۴۰۴/۰۷/۱۲', due: '۱۴۰۴/۰۷/۲۶', amount: 96000000, tax: 8640000, status: 'unpaid', items: 2 },
    { no: '۱۴۰۴-۰۵۱۸', customer: 'فناوران آبی', date: '۱۴۰۴/۰۷/۰۸', due: '۱۴۰۴/۰۷/۲۲', amount: 34000000, tax: 3060000, status: 'paid', items: 4 },
    { no: '۱۴۰۴-۰۵۱۷', customer: 'آتلیه طراحی نور', date: '۱۴۰۴/۰۷/۰۳', due: '۱۴۰۴/۰۷/۱۷', amount: 58000000, tax: 5220000, status: 'overdue', items: 5 }
  ];

  /* ------------------------------------------------- محصولات (بخشی از لیست) */
  var PRODUCTS = [
    { sku: 'PRD-101', name: 'لایسنس سالانه CRM — نسخه سازمانی', price: 180000000, stock: '∞', cat: 'نرم‌افزار', sold: 128 },
    { sku: 'PRD-102', name: 'ماژول مدیریت انبار', price: 96000000, stock: '∞', cat: 'نرم‌افزار', sold: 74 },
    { sku: 'PRD-103', name: 'بسته آموزش حضوری تیم فروش', price: 34000000, stock: 12, cat: 'خدمات', sold: 41 },
    { sku: 'PRD-104', name: 'پشتیبانی طلایی ۱۲ ماهه', price: 96000000, stock: '∞', cat: 'خدمات', sold: 63 },
    { sku: 'PRD-105', name: 'دستگاه کارتخوان هوشمند', price: 18500000, stock: 26, cat: 'سخت‌افزار', sold: 152 },
    { sku: 'PRD-106', name: 'هندزفری اپراتور حرفه‌ای', price: 8900000, stock: 8, cat: 'سخت‌افزار', sold: 96 }
  ];

  /* ------------------------------------------------------------ گفتگوها */
  var THREADS = [
    { id: 'TH-1', name: 'مریم رضایی', company: 'پارس‌نیکان', last: 'فایل پیش‌فاکتور را ارسال کردم، لطفاً بررسی بفرمایید.', time: '۱۰:۲۴', unread: 2, online: true, active: true },
    { id: 'TH-2', name: 'حسین نوری', company: 'گروه البرز', last: 'برای جلسه فردا ساعت ۱۱ هماهنگ شد.', time: '۰۹:۵۸', unread: 0, online: true },
    { id: 'TH-3', name: 'زهرا کریمی', company: 'شخصی', last: 'ممنون از پیگیری شما 🙏', time: 'دیروز', unread: 0, online: false },
    { id: 'TH-4', name: 'امیر شریفی', company: 'داده‌پرداز', last: 'قرارداد را امضا کردیم و اسکن آن را فرستادم.', time: 'دیروز', unread: 1, online: false },
    { id: 'TH-5', name: 'سارا احمدی', company: 'آتلیه نور', last: 'نسخه جدید را تست کردیم، عالی بود.', time: '۳ روز پیش', unread: 0, online: false }
  ];

  /* --------------------------------------------------------- فعالیت‌ها */
  var ACTIVITIES = [
    { icon: 'user-plus', tone: '', title: 'مشتری جدید ثبت شد', desc: '«نگار جعفری» از بوتیک ونوس به فهرست مشتریان اضافه شد.', time: '۱۰ دقیقه پیش' },
    { icon: 'deals', tone: 'violet', title: 'معامله برنده شد', desc: 'معامله «پیاده‌سازی ماژول انبار» با ارزش ۴۲۰ میلیون تومان برنده شد.', time: '۱ ساعت پیش' },
    { icon: 'invoice', tone: 'sky', title: 'فاکتور صادر شد', desc: 'فاکتور ۱۴۰۴-۰۵۲۱ برای گروه صنعتی البرز صادر گردید.', time: '۳ ساعت پیش' },
    { icon: 'shield-alert', tone: 'amber', title: 'تیکت با اولویت فوری', desc: 'تیکت TK-۵۵۲۱ از طرف پارس‌نیکان با اولویت فوری ثبت شد.', time: '۴ ساعت پیش' },
    { icon: 'check-circle', tone: '', title: 'تسک انجام شد', desc: '«ارسال پیش‌فاکتور به داده‌پرداز» توسط سارا احمدی تکمیل شد.', time: 'دیروز' }
  ];

  var NOTIFICATIONS = [
    { icon: 'ticket', tone: 'amber', title: '۵ تیکت در انتظار پاسخ', time: '۵ دقیقه پیش', unread: true },
    { icon: 'invoice', tone: 'sky', title: 'فاکتور ۱۴۰۴-۰۵۱۹ پرداخت نشده است', time: '۱ ساعت پیش', unread: true },
    { icon: 'user-plus', tone: '', title: 'درخواست دسترسی جدید برای «رضا پ.»', time: '۳ ساعت پیش', unread: true },
    { icon: 'check', tone: '', title: 'پشتیبان‌گیری خودکار با موفقیت انجام شد', time: 'دیروز', unread: false }
  ];

  var TASKS = [
    { title: 'تماس پیگیری با گروه البرز', due: 'امروز', done: false, priority: 'high' },
    { title: 'ارسال پیش‌فاکتور به داده‌پرداز', due: 'امروز', done: false, priority: 'urgent' },
    { title: 'به‌روزرسانی اطلاعات تماس مشتریان', due: 'فردا', done: false, priority: 'normal' },
    { title: 'آماده‌سازی گزارش هفتگی فروش', due: 'امروز', done: true, priority: 'normal' },
    { title: 'بررسی تیکت‌های بسته‌شده', due: 'پنجشنبه', done: true, priority: 'low' }
  ];

  var TEAM = [
    { name: 'مهدی کریمی', role: 'مدیر فروش', load: 82, online: true, deals: 18 },
    { name: 'سمیرا رحیمی', role: 'کارشناس پشتیبانی', load: 64, online: true, deals: 9 },
    { name: 'رضا پورمند', role: 'توسعه‌دهنده', load: 45, online: true, deals: 4 },
    { name: 'نیما عباسی', role: 'کارشناس فروش', load: 91, online: false, deals: 22 }
  ];

  var USERS = [
    { name: 'مهدی کریمی', email: 'm.karimi@moderncrm.ir', role: 'مدیر سیستم', roleTone: 'primary', status: 'active', last: '۲ دقیقه پیش', twoFA: true },
    { name: 'سمیرا رحیمی', email: 's.rahimi@moderncrm.ir', role: 'سرپرست پشتیبانی', roleTone: 'info', status: 'active', last: '۱ ساعت پیش', twoFA: true },
    { name: 'رضا پورمند', email: 'r.pourmand@moderncrm.ir', role: 'توسعه‌دهنده', roleTone: 'violet', status: 'active', last: 'دیروز', twoFA: false },
    { name: 'نیما عباسی', email: 'n.abbasi@moderncrm.ir', role: 'کارشناس فروش', roleTone: 'warning', status: 'pending', last: '۳ روز پیش', twoFA: false },
    { name: 'لیلا مستوفی', email: 'l.mostofi@moderncrm.ir', role: 'حسابدار', roleTone: 'success', status: 'suspended', last: '۲ هفته پیش', twoFA: true }
  ];

  var MESSAGES = [
    { me: false, text: 'سلام، وقت شما بخیر. درخواست پیش‌فاکتور برای ماژول انبار را ثبت کردم، امکان ارسال امروز وجود دارد؟', time: '۱۰:۰۲', author: 'مریم رضایی' },
    { me: true, text: 'سلام و وقت بخیر. بله حتماً، پیش‌فاکتور را تا پایان امروز برایتان ارسال می‌کنم.', time: '۱۰:۱۴', author: 'مهدی کریمی' },
    { me: false, text: 'ممنون. فقط لطفاً تخفیف حجمی را هم در محاسبه لحاظ کنید.', time: '۱۰:۱۶', author: 'مریم رضایی' },
    { me: true, text: 'چشم. برای سفارش‌های بالای ۲۰۰ میلیون تومان ۷٪ تخفیف در نظر گرفته شده است. پیش‌فاکتور به‌روزشده را ضمیمه کردم.', time: '۱۰:۲۱', author: 'مهدی کریمی', attach: { name: 'pishe-factor-2210.pdf', size: '۲۴۰ کیلوبایت', kind: 'pdf' } }
  ];

  var FILES = [
    { name: 'قرارداد-پشتیبانی-طلایی.pdf', size: '۱٫۲ مگابایت', kind: 'pdf', date: '۱۴۰۴/۰۷/۱۶' },
    { name: 'نمودار-فروش-مهر.xlsx', size: '۳۴۵ کیلوبایت', kind: 'xls', date: '۱۴۰۴/۰۷/۱۵' },
    { name: 'گزارش-بازدید-سایت.pdf', size: '۸۹۰ کیلوبایت', kind: 'pdf', date: '۱۴۰۴/۰۷/۱۲' },
    { name: 'لوگو-شرکت.png', size: '۱۱۰ کیلوبایت', kind: 'img', date: '۱۴۰۴/۰۷/۰۹' },
    { name: 'پشتیبان-دیتابیس.zip', size: '۱۲٫۴ مگابایت', kind: 'zip', date: '۱۴۰۴/۰۷/۰۵' }
  ];

  var FAQ = [
    { q: 'چگونه مشتری جدید به سیستم اضافه کنم؟', a: 'از منوی «مدیریت مشتریان» گزینه «افزودن مشتری» را انتخاب کرده و فرم را تکمیل کنید. فیلدهای ستاره‌دار الزامی هستند.' },
    { q: 'تفاوت «سرنخ» و «مشتری» چیست؟', a: 'سرنخ‌ها افرادی هستند که هنوز خریدی انجام نداده‌اند؛ به‌محض اولین خرید، وضعیت آن‌ها به «مشتری» تغییر می‌کند.' },
    { q: 'آیا امکان صدور فاکتور رسمی با کد اقتصادی وجود دارد؟', a: 'بله. در تنظیمات «اطلاعات مالی» می‌توانید کد اقتصادی و امضای دیجیتال شرکت را وارد کنید تا در فاکتورها درج شود.' },
    { q: 'چطور می‌توانم گزارش‌ها را خروجی اکسل بگیرم؟', a: 'در هر صفحه گزارش، از دکمه «خروجی» در نوار ابزار بالای جدول، فرمت CSV یا Excel را انتخاب کنید.' },
    { q: 'محدودیت تعداد کاربران در پلن حرفه‌ای چقدر است؟', a: 'پلن حرفه‌ای تا ۵۰ کاربر فعال پشتیبانی می‌کند و برای تعداد بیشتر، پلن سازمانی پیشنهاد می‌شود.' }
  ];


  /* ==========================================================================
   *  انبار — داده‌های نمایشی
   *  (ساختار برگرفته از برنامه فعلی «بعد پنجم»؛ در اتصال واقعی از API می‌آیند)
   * ========================================================================== */
  /* مجموعه محصولات */
  var WH_CATEGORIES = [
    { id: 'main', title: 'دستگاه‌های اصلی', icon: 'fingerprint', tone: '' },
    { id: 'main-acc', title: 'قطعات جانبی دستگاه‌های اصلی', icon: 'box', tone: 'sky' },
    { id: 'software', title: 'نرم‌افزار', icon: 'monitor', tone: 'violet' },
    { id: 'service', title: 'خدمات پشتیبانی', icon: 'life-buoy', tone: 'success' },
    { id: 'security', title: 'دستگاه‌های حفاظتی', icon: 'shield', tone: 'amber' },
    { id: 'security-acc', title: 'قطعات جانبی دستگاه‌های حفاظتی', icon: 'shield-check', tone: 'coral' },
    { id: 'obsolete', title: 'دستگاه‌های منسوخ‌شده', icon: 'archive', tone: 'ink' },
    { id: 'antenna', title: 'آنتن', icon: 'antenna', tone: 'sky' }
  ];

  /* انواع کارتخوان */
  var WH_CARD_READERS = ['بدون کارتخوان', 'کارتخوان EM (۱۲۵ کیلوهرتز)', 'کارتخوان Mifare', 'کارتخوان HID'];

  /* واحدهای شمارش */
  var WH_UNITS = ['دستگاه', 'عدد', 'بسته', 'لایسنس', 'ماه', 'سری'];

  /* انواع خروج کالا (رادیوهای فرم خروج) */
  var WH_EXIT_TYPES = [
    { id: 'sale', title: 'فروش', icon: 'receipt', tone: 'success', desc: 'تحویل به مشتری با فاکتور' },
    { id: 'demo', title: 'دمو', icon: 'presentation', tone: 'info', desc: 'امانی؛ با تاریخ بازگشت' },
    { id: 'present', title: 'پرزنت', icon: 'gift', tone: 'violet', desc: 'هدیه یا نمونه رایگان' },
    { id: 'broken', title: 'خراب', icon: 'x-circle', tone: 'danger', desc: 'خروج کالای معیوب' },
    { id: 'support', title: 'پشتیبانی', icon: 'headset', tone: 'warning', desc: 'تعویض یا تعمیر' }
  ];

  /* انبارها */
  var WH_STORES = [
    { id: 'main', title: 'انبار اصلی', icon: 'boxes' },
    { id: 'sub', title: 'انبار فرعی', icon: 'archive' },
    { id: 'public', title: 'انبار عمومی', icon: 'globe' }
  ];

  /* محصولات (فیلدها مطابق فرم «تعریف محصولات») */
  function P(code, name, cat, corp, unit, consumer, partner, agent, cost, main, sub, min, pub, feature) {
    return {
      code: code, name: name, cat: cat, corp: corp, unit: unit,
      consumer: consumer, partner: partner, agent: agent, cost: cost,
      main: main, sub: sub, min: min, public: pub, feature: feature || '',
      invoiceName: name, proformaName: name
    };
  }
  var WH_PRODUCTS = [
    P(1, 'HP - 510', 'main', 'دستگاه حضور و غیاب اثر انگشتی HP510', 'دستگاه', 18500000, 16200000, 15400000, 11800000, 42, 9, 10, true, 'اثر انگشت + کارت، ظرفیت ۳۰۰۰ اثر انگشت، شبکه TCP/IP'),
    P(2, 'HP - 310', 'main', 'دستگاه حضور و غیاب اثر انگشتی HP310', 'دستگاه', 14200000, 12500000, 11900000, 9100000, 27, 6, 10, true, 'اثر انگشت، ظرفیت ۱۵۰۰ اثر انگشت'),
    P(3, 'HP - 210', 'main', 'دستگاه حضور و غیاب HP210', 'دستگاه', 9800000, 8600000, 8100000, 6300000, 6, 2, 8, true, 'مدل اقتصادی؛ کارت و رمز'),
    P(4, 'EP - 810', 'main', 'دستگاه تشخیص چهره EP810', 'دستگاه', 32500000, 28900000, 27400000, 21000000, 18, 4, 6, true, 'تشخیص چهره و کف دست، نمایشگر ۵ اینچ لمسی'),
    P(5, 'EP - 710', 'main', 'دستگاه تشخیص چهره EP710', 'دستگاه', 27400000, 24300000, 23000000, 17600000, 11, 3, 6, true, 'تشخیص چهره، دوربین دوگانه'),
    P(6, 'EB - 420 C', 'main', 'دستگاه کنترل تردد EB420C', 'دستگاه', 12600000, 11100000, 10500000, 8000000, 34, 12, 10, true, 'کنترل درب و تردد با کارت'),
    P(7, 'EB - 320 C', 'main', 'دستگاه کنترل تردد EB320C', 'دستگاه', 10900000, 9600000, 9100000, 6900000, 22, 5, 10, true),
    P(8, 'EB - 220 C', 'main', 'دستگاه کنترل تردد EB220C', 'دستگاه', 8700000, 7700000, 7300000, 5600000, 4, 1, 8, false),
    P(9, 'EB - 820 C', 'main', 'دستگاه کنترل تردد EB820C', 'دستگاه', 21300000, 18900000, 17900000, 13700000, 15, 3, 6, true),
    P(10, 'EB - 720 C', 'main', 'دستگاه کنترل تردد EB720C', 'دستگاه', 18800000, 16700000, 15800000, 12100000, 9, 2, 6, true),
    P(11, 'EB - 120 TC', 'main', 'دستگاه حضور و غیاب EB120TC', 'دستگاه', 7400000, 6500000, 6200000, 4700000, 31, 8, 10, true),
    P(12, 'EB - 920 TC', 'main', 'دستگاه حضور و غیاب EB920TC', 'دستگاه', 24600000, 21800000, 20700000, 15800000, 7, 0, 6, true),
    P(13, 'EB - 100', 'obsolete', 'دستگاه حضور و غیاب EB100 (منسوخ)', 'دستگاه', 5200000, 4600000, 4300000, 3300000, 3, 0, 0, false, 'تولید متوقف شده؛ فقط برای پشتیبانی'),
    P(14, 'HB - 630 A', 'main', 'دستگاه حضور و غیاب HB630A', 'دستگاه', 16900000, 15000000, 14200000, 10900000, 19, 4, 8, true),
    P(15, 'HB - 530 A', 'main', 'دستگاه حضور و غیاب HB530A', 'دستگاه', 14800000, 13100000, 12400000, 9500000, 23, 6, 8, true),
    P(16, 'HB - 430 A', 'main', 'دستگاه حضور و غیاب HB430A', 'دستگاه', 12300000, 10900000, 10300000, 7900000, 5, 2, 8, true),
    P(17, 'HB - 330', 'main', 'دستگاه حضور و غیاب HB330', 'دستگاه', 10100000, 8900000, 8400000, 6500000, 14, 3, 8, true),
    P(18, 'HB - 230', 'main', 'دستگاه حضور و غیاب HB230', 'دستگاه', 8400000, 7400000, 7000000, 5400000, 26, 7, 8, true),
    P(19, 'HB - 130 BA', 'main', 'دستگاه حضور و غیاب HB130BA', 'دستگاه', 6900000, 6100000, 5800000, 4400000, 2, 0, 8, true),
    P(20, 'MB - 200', 'security', 'دستگاه دزدگیر اماکن MB200', 'دستگاه', 11500000, 10200000, 9600000, 7400000, 17, 5, 6, true, 'دزدگیر سیم‌کارتی با ۸ زون'),
    P(21, 'MB - 300', 'security', 'دستگاه دزدگیر اماکن MB300', 'دستگاه', 14900000, 13200000, 12500000, 9600000, 12, 2, 6, true, 'دزدگیر سیم‌کارتی و تلفن ثابت با ۱۶ زون'),
    P(22, 'MP - 100', 'security-acc', 'آژیر داخلی MP100', 'عدد', 1450000, 1280000, 1210000, 930000, 64, 20, 20, true),
    P(23, 'MP - 51 A', 'security-acc', 'چشمی حرکتی MP51A', 'عدد', 980000, 860000, 820000, 630000, 88, 30, 20, true),
    P(24, 'HB - 1000 A', 'main', 'دستگاه حضور و غیاب HB1000A', 'دستگاه', 29700000, 26300000, 24900000, 19100000, 8, 1, 4, true),
    P(25, 'آداپتور ۱۲ ولت', 'main-acc', 'آداپتور ۱۲ ولت ۲ آمپر', 'عدد', 450000, 390000, 370000, 280000, 140, 40, 30, true),
    P(26, 'کارت RFID (بسته ۱۰۰ عددی)', 'main-acc', 'کارت تردد RFID 125KHz', 'بسته', 2100000, 1850000, 1750000, 1300000, 36, 10, 10, true),
    P(27, 'نرم‌افزار حضور و غیاب تحت وب', 'software', 'نرم‌افزار تایم‌شیت بعد پنجم', 'لایسنس', 24000000, 21000000, 20000000, 0, 0, 0, 0, true, 'نامحدود — بدون موجودی فیزیکی'),
    P(28, 'پشتیبانی سالانه', 'service', 'قرارداد پشتیبانی ۱۲ ماهه', 'ماه', 1500000, 1300000, 1250000, 0, 0, 0, 0, false, 'خدمت — بدون موجودی فیزیکی'),
    P(29, 'آنتن خارجی GSM', 'antenna', 'آنتن تقویتی GSM با کابل ۳ متری', 'عدد', 620000, 540000, 510000, 390000, 3, 6, 10, true)
  ];

  /* ورودی‌های انبار (فرم «ورود محصول به انبار») */
  var WH_IN = [
    { id: 'IN-3108', product: 1, serial: '510-24-00811', qty: 20, date: '۱۴۰۵/۰۷/۲۰', reader: 1, store: 'main', by: 'داوود توکلی' },
    { id: 'IN-3107', product: 4, serial: '810-24-00301', qty: 10, date: '۱۴۰۵/۰۷/۱۸', reader: 2, store: 'main', by: 'داوود توکلی' },
    { id: 'IN-3106', product: 25, serial: '', qty: 100, date: '۱۴۰۵/۰۷/۱۶', reader: 0, store: 'main', by: 'لیلا مستوفی' },
    { id: 'IN-3105', product: 6, serial: '420-24-01250', qty: 15, date: '۱۴۰۵/۰۷/۱۴', reader: 1, store: 'main', by: 'داوود توکلی' },
    { id: 'IN-3104', product: 20, serial: '200-24-00090', qty: 12, date: '۱۴۰۵/۰۷/۱۲', reader: 0, store: 'main', by: 'رضا پورمند' },
    { id: 'IN-3103', product: 23, serial: '', qty: 60, date: '۱۴۰۵/۰۷/۰۹', reader: 0, store: 'main', by: 'لیلا مستوفی' },
    { id: 'IN-3102', product: 15, serial: '530-24-00410', qty: 10, date: '۱۴۰۵/۰۷/۰۵', reader: 3, store: 'main', by: 'داوود توکلی' },
    { id: 'IN-3101', product: 11, serial: '120-24-02001', qty: 25, date: '۱۴۰۵/۰۷/۰۲', reader: 1, store: 'main', by: 'رضا پورمند' }
  ];

  /* خروجی‌های انبار (فرم «خروج محصول» اصلی و فرعی) */
  var WH_OUT = [
    { form: '۷۸۴۱', store: 'main', type: 'sale', customer: 'گروه صنعتی البرز', product: 1, serial: '510-24-00790', reader: 1, inDate: '۱۴۰۵/۰۶/۲۸', qty: 4, invoice: '۱۴۰۴-۰۵۲۱', date: '۱۴۰۵/۰۷/۲۰', owner: 'مهدی کریمی', replace: false },
    { form: '۷۸۴۰', store: 'main', type: 'demo', customer: 'پارس‌نیکان', product: 4, serial: '810-24-00295', reader: 2, inDate: '۱۴۰۵/۰۶/۱۵', qty: 1, date: '۱۴۰۵/۰۷/۱۹', owner: 'نیما عباسی', returnDate: '۱۴۰۵/۰۸/۰۴' },
    { form: '۷۸۳۹', store: 'main', type: 'support', customer: 'هلدینگ داده‌پرداز', product: 6, serial: '420-24-01102', reader: 1, inDate: '۱۴۰۵/۰۵/۳۰', qty: 1, date: '۱۴۰۵/۰۷/۱۸', owner: 'سمیرا رحیمی' },
    { form: '۷۸۳۸', store: 'main', type: 'sale', customer: 'فناوران آبی', product: 15, serial: '530-24-00399', reader: 3, inDate: '۱۴۰۵/۰۶/۰۲', qty: 2, invoice: '۱۴۰۴-۰۵۱۸', date: '۱۴۰۵/۰۷/۱۶', owner: 'مهدی کریمی', replace: true },
    { form: '۷۸۳۷', store: 'main', type: 'present', customer: 'آتلیه طراحی نور', product: 26, serial: '', reader: 0, inDate: '۱۴۰۵/۰۶/۱۰', qty: 1, date: '۱۴۰۵/۰۷/۱۴', owner: 'نیما عباسی' },
    { form: '۷۸۳۶', store: 'main', type: 'broken', customer: '—', product: 3, serial: '210-23-00544', reader: 0, inDate: '۱۴۰۵/۰۲/۱۱', qty: 1, date: '۱۴۰۵/۰۷/۱۱', owner: 'رضا پورمند' },
    { form: '۷۸۳۵', store: 'main', type: 'demo', customer: 'تجهیزات پزشکی رها', product: 9, serial: '820-24-00117', reader: 1, inDate: '۱۴۰۵/۰۵/۲۲', qty: 1, date: '۱۴۰۵/۰۷/۰۶', owner: 'مهدی کریمی', returnDate: '۱۴۰۵/۰۷/۲۰' },
    { form: '۵۲۱۴', store: 'sub', type: 'sale', customer: 'بوتیک ونوس', product: 11, serial: '120-24-01980', reader: 1, inDate: '۱۴۰۵/۰۶/۲۰', qty: 3, date: '۱۴۰۵/۰۷/۱۹', owner: 'نیما عباسی' },
    { form: '۵۲۱۳', store: 'sub', type: 'support', customer: 'گروه صنعتی البرز', product: 6, serial: '420-24-01251', reader: 1, inDate: '۱۴۰۵/۰۷/۱۴', qty: 1, date: '۱۴۰۵/۰۷/۱۷', owner: 'سمیرا رحیمی' },
    { form: '۵۲۱۲', store: 'sub', type: 'demo', customer: 'هلدینگ داده‌پرداز', product: 18, serial: '230-24-00620', reader: 0, inDate: '۱۴۰۵/۰۶/۰۸', qty: 1, date: '۱۴۰۵/۰۷/۱۰', owner: 'مهدی کریمی', returnDate: '۱۴۰۵/۰۷/۲۴' },
    { form: '۵۲۱۱', store: 'sub', type: 'broken', customer: '—', product: 22, serial: '', reader: 0, inDate: '۱۴۰۵/۰۴/۰۱', qty: 2, date: '۱۴۰۵/۰۷/۰۳', owner: 'رضا پورمند' }
  ];


  /* ==========================================================================
   *  تعاریف — داده‌های نمایشی (کاربران، سطح دسترسی، دوره مالی، تعاریف اولیه، تنظیمات)
   * ========================================================================== */
  var DEF_USER_TYPES = ['مدیر سیستم', 'مدیر فروش', 'کارشناس فروش', 'کارشناس پشتیبانی', 'حسابدار', 'انباردار'];
  var DEF_USER_KINDS = ['پرسنل داخلی', 'نماینده', 'همکار'];

  function U(code, first, last, username, type, kind, gender, active, email) {
    return { code: code, first: first, last: last, username: username, type: type, kind: kind, gender: gender, active: active, email: email || (username + '@bodpanjom.ir') };
  }
  var DEF_USERS = [
    U(1, 'داوود', 'توکلی', 'd.tavakoli', 'مدیر سیستم', 'پرسنل داخلی', 'm', true),
    U(85, 'مریم', 'صفری', 'm.safari', 'کارشناس فروش', 'پرسنل داخلی', 'f', true),
    U(86, 'معصومه', 'مهدی‌پور', 'm.mahdipour', 'حسابدار', 'پرسنل داخلی', 'f', true),
    U(87, 'پرهام', 'پناهی‌ها', 'p.panahiha', 'کارشناس پشتیبانی', 'پرسنل داخلی', 'm', true),
    U(88, 'نیلوفر', 'شعبانی', 'n.shabani', 'کارشناس فروش', 'پرسنل داخلی', 'f', true),
    U(89, 'متین', 'انصاری', 'm.ansari', 'انباردار', 'پرسنل داخلی', 'm', true),
    U(90, 'داریوش', 'گل‌بو', 'd.golbou', 'کارشناس پشتیبانی', 'پرسنل داخلی', 'm', false),
    U(91, 'علی', 'سحرخیز', 'a.saharkhiz', 'مدیر فروش', 'پرسنل داخلی', 'm', true),
    U(92, 'تینا', 'لشکریان', 't.lashkarian', 'کارشناس فروش', 'پرسنل داخلی', 'f', true),
    U(94, 'امیر', 'باصری', 'a.baseri', 'کارشناس فروش', 'پرسنل داخلی', 'm', true),
    U(95, 'یاسمین', 'معصومی', 'y.masoumi', 'کارشناس پشتیبانی', 'پرسنل داخلی', 'f', false),
    U(96, 'رضا', 'دایجی', 'r.dayeji', 'کارشناس فروش', 'نماینده', 'm', true),
    U(97, 'کارشناس', 'فروش ۲', 'sales2', 'کارشناس فروش', 'همکار', 'm', true)
  ];

  /* فرم‌های سامانه برای سطح دسترسی (گروه‌بندی بر اساس منوی اصلی) */
  var PERM_MODULES = [
    { id: 'defs', title: 'تعاریف', icon: 'list-tree', forms: [
      { id: 'f-users', title: 'تعریف کاربران' }, { id: 'f-fiscal', title: 'تعریف دوره مالی' },
      { id: 'f-basic', title: 'تعاریف اولیه' }, { id: 'f-settings', title: 'تنظیمات' }] },
    { id: 'sales', title: 'فروش', icon: 'deals', forms: [
      { id: 'f-plan', title: 'برنامه کاری' }, { id: 'f-letter', title: 'نامه و قرارداد' }, { id: 'f-sms', title: 'پیامک' },
      { id: 'f-cust', title: 'مشخصات مشتری' }, { id: 'f-cinfo', title: 'اطلاعات مشتری' }, { id: 'f-sale', title: 'فروش' },
      { id: 'f-inv', title: 'فاکتور' }, { id: 'f-invview', title: 'مشاهده فاکتور' }, { id: 'f-perf', title: 'گزارش عملکرد' },
      { id: 'f-settle', title: 'تسویه فاکتور' }, { id: 'f-reserved', title: 'فاکتورهای رزرو شده' }, { id: 'f-agents', title: 'لیست نماینده‌ها' }] },
    { id: 'wh', title: 'انبار', icon: 'warehouse', forms: [
      { id: 'f-whprod', title: 'تعریف محصولات' }, { id: 'f-whin', title: 'ورود محصول به انبار' },
      { id: 'f-whout', title: 'خروج محصول (اصلی)' }, { id: 'f-whsub', title: 'خروج محصول (فرعی)' }, { id: 'f-whstock', title: 'گزارش موجودی انبار' }] },
    { id: 'support', title: 'پشتیبانی', icon: 'headset', forms: [{ id: 'f-support', title: 'پشتیبانی' }] },
    { id: 'acc', title: 'حسابداری', icon: 'wallet', forms: [{ id: 'f-acc', title: 'اسناد حسابداری' }] },
    { id: 'rep', title: 'گزارشات', icon: 'reports', forms: [{ id: 'f-rep', title: 'گزارشات مدیریتی' }] }
  ];

  /* سطح دسترسی هر کاربر: { formId: 'v' دسترسی + 'c' ثبت + 'e' ویرایش + 'd' حذف } */
  var PERM_PRESETS = {
    'مدیر سیستم': '*',
    'مدیر فروش': { 'f-plan': 'vced', 'f-letter': 'vced', 'f-sms': 'vce', 'f-cust': 'vced', 'f-cinfo': 'vce', 'f-sale': 'vced', 'f-inv': 'vced', 'f-invview': 'vce', 'f-perf': 'vce', 'f-settle': 'vce', 'f-reserved': 'vce', 'f-agents': 'vced', 'f-whstock': 'v', 'f-rep': 'v' },
    'کارشناس فروش': { 'f-plan': 'vc', 'f-cust': 'vce', 'f-sale': 'vce', 'f-inv': 'vce', 'f-invview': 'vce', 'f-perf': 'vce', 'f-agents': 'vce', 'f-support': 'vce' },
    'کارشناس پشتیبانی': { 'f-plan': 'vc', 'f-cust': 'v', 'f-cinfo': 'v', 'f-support': 'vced', 'f-whstock': 'v' },
    'حسابدار': { 'f-inv': 'vce', 'f-invview': 'v', 'f-settle': 'vced', 'f-reserved': 'vce', 'f-acc': 'vced', 'f-rep': 'v', 'f-settings': 'vce' },
    'انباردار': { 'f-whprod': 'vce', 'f-whin': 'vced', 'f-whout': 'vced', 'f-whsub': 'vced', 'f-whstock': 'v' }
  };
  var DEF_PERMS = {};
  DEF_USERS.forEach(function (u) {
    var preset = PERM_PRESETS[u.type] || {}, map = {};
    PERM_MODULES.forEach(function (m) { m.forms.forEach(function (f) { map[f.id] = preset === '*' ? 'vced' : (preset[f.id] || ''); }); });
    DEF_PERMS[u.code] = map;
  });

  /* دوره‌های مالی */
  var FISCAL_PERIODS = [
    { code: 2, title: 'دوره مالی ۹۳', from: '۱۳۹۳/۰۱/۰۱', to: '۱۳۹۳/۱۲/۲۹', active: true },
    { code: 3, title: 'دوره مالی ۹۴', from: '۱۳۹۴/۰۱/۰۱', to: '۱۳۹۴/۱۲/۲۹', active: true },
    { code: 4, title: 'دوره مالی ۹۵', from: '۱۳۹۵/۰۱/۰۱', to: '۱۳۹۵/۱۲/۳۰', active: true },
    { code: 6, title: 'دوره مالی ۹۷', from: '۱۳۹۷/۰۱/۰۱', to: '۱۳۹۷/۱۲/۲۹', active: true },
    { code: 7, title: 'دوره مالی ۹۸', from: '۱۳۹۸/۰۱/۰۱', to: '۱۳۹۸/۱۲/۲۹', active: true },
    { code: 8, title: 'دوره مالی ۹۹', from: '۱۳۹۹/۰۱/۰۲', to: '۱۳۹۹/۱۲/۳۰', active: true },
    { code: 10, title: 'دوره مالی ۱۴۰۱', from: '۱۴۰۱/۰۱/۰۱', to: '۱۴۰۱/۱۲/۲۹', active: true },
    { code: 11, title: 'دوره مالی ۱۴۰۲', from: '۱۴۰۲/۰۱/۰۱', to: '۱۴۰۲/۱۲/۲۹', active: true },
    { code: 12, title: 'دوره مالی ۱۴۰۳', from: '۱۴۰۳/۰۱/۰۱', to: '۱۴۰۳/۱۲/۳۰', active: true },
    { code: 13, title: 'دوره مالی ۱۴۰۴', from: '۱۴۰۴/۰۱/۰۱', to: '۱۴۰۴/۱۲/۲۹', active: true },
    { code: 9, title: 'دوره مالی ۱۴۰۵ (آزمایشی)', from: '۱۴۰۵/۰۱/۰۱', to: '۱۴۰۵/۱۲/۲۷', active: false },
    { code: 14, title: 'دوره مالی ۱۴۰۵', from: '۱۴۰۵/۰۱/۰۱', to: '۱۴۰۵/۱۲/۲۹', active: true },
    { code: 15, title: 'دوره مالی ۱۴۰۶', from: '۱۴۰۶/۰۱/۰۱', to: '۱۴۰۶/۱۲/۲۹', active: true }
  ];

  /* تعاریف اولیه: انواع + آیتم‌ها (آیتم با parent = زیرشاخه) */
  var BASIC_TYPES = [
    { id: 'install', title: 'نصب', icon: 'zap' },
    { id: 'support', title: 'پشتیبانی', icon: 'headset' },
    { id: 'software', title: 'نرم‌افزار', icon: 'monitor' },
    { id: 'install-gap', title: 'نواقص نصب', icon: 'alert' },
    { id: 'incomplete', title: 'علت کامل انجام نشدن', icon: 'x-circle' },
    { id: 'remote', title: 'علت ریموت شدن', icon: 'wifi-off' },
    { id: 'delay', title: 'علت تاخیر', icon: 'hourglass' },
    { id: 'satisfaction', title: 'میزان رضایت مشتری', icon: 'star' },
    { id: 'daily', title: 'برنامه روزانه', icon: 'calendar-check' },
    { id: 'shipping', title: 'نحوه ارسال', icon: 'truck' },
    { id: 'source', title: 'نحوه آشنایی', icon: 'megaphone' },
    { id: 'coop', title: 'نوع همکاری', icon: 'briefcase' },
    { id: 'province', title: 'استان', icon: 'map-pin' },
    { id: 'product-group', title: 'گروه محصولات', icon: 'boxes' },
    { id: 'cancel', title: 'توضیحات کنسلی فاکتور', icon: 'receipt' }
  ];
  var BASIC_ITEMS = [];
  (function () {
    var code = 1;
    function add(type, title, parent) { var c = code++; BASIC_ITEMS.push({ code: c, type: type, title: title, parent: parent || null }); return c; }
    function many(type, list) { list.forEach(function (t) { if (typeof t === 'string') add(type, t); else { var p = add(type, t[0]); t[1].forEach(function (x) { add(type, x, p); }); } }); }
    many('source', ['روزنامه', 'اینترنت', 'معرفی مشتری', 'بازاریابی تلفنی', 'فایل قدیمی', 'آشنایان',
      ['معرفی همکار', ['چارگون', 'کسری', 'رایان محاسب', 'رایور', 'همکاران سیستم', 'هلو', 'مروارید', 'تیمار', 'ZK']],
      'مجله', 'مناقصه', ['نمایشگاه', ['نمایشگاه الکامپ', 'نمایشگاه امنیت']], 'ایمیل مارکتینگ', 'نمایندگان شرکت']);
    many('install', ['نصب حضوری', 'نصب از راه دور', 'نصب توسط نماینده']);
    many('support', ['پشتیبانی تلفنی', 'پشتیبانی حضوری', 'پشتیبانی از راه دور']);
    many('software', ['نرم‌افزار حضور و غیاب تحت وب', 'نرم‌افزار ویندوزی', 'اپلیکیشن موبایل']);
    many('install-gap', ['آماده نبودن بستر شبکه', 'نبود برق اضطراری', 'عدم حضور مسئول مشتری']);
    many('incomplete', ['کمبود قطعه', 'عدم هماهنگی مشتری', 'مشکل فنی دستگاه']);
    many('remote', ['درخواست مشتری', 'فاصله جغرافیایی', 'فوریت کار']);
    many('delay', ['ترافیک', 'تأخیر در تأمین کالا', 'تغییر زمان توسط مشتری']);
    many('satisfaction', ['عالی', 'خوب', 'متوسط', 'ضعیف']);
    many('daily', ['تماس پیگیری', 'جلسه حضوری', 'دمو آنلاین', 'ارسال پیش‌فاکتور']);
    many('shipping', ['پست پیشتاز', 'تیپاکس', 'پیک موتوری', 'باربری', 'تحویل حضوری']);
    many('coop', ['نماینده', 'همکار فروش', 'عمده‌فروش']);
    many('province', [['تهران', ['تهران', 'شهریار', 'ورامین']], ['اصفهان', ['اصفهان', 'کاشان']], ['خراسان رضوی', ['مشهد', 'نیشابور']], 'فارس', 'آذربایجان شرقی', 'البرز', 'گیلان']);
    many('product-group', ['دستگاه‌های اصلی', 'قطعات جانبی', 'نرم‌افزار', 'خدمات پشتیبانی', 'دستگاه‌های حفاظتی', 'آنتن']);
    many('cancel', ['انصراف مشتری', 'عدم تأمین موجودی', 'تکرار فاکتور', 'تغییر شرایط پرداخت']);
  })();

  /* تنظیمات سالانه‌ی فاکتور */
  var SETTING_TYPES = [
    { id: 'letter', title: 'حرف فاکتور', icon: 'type', input: 'text', unit: '', desc: 'پیشوند شماره فاکتورهای هر سال' },
    { id: 'vat', title: 'ارزش افزوده', icon: 'percent', input: 'percent', unit: '٪', desc: 'نرخ کل مالیات بر ارزش افزوده' },
    { id: 'tax', title: 'مالیات', icon: 'receipt', input: 'percent', unit: '٪', desc: 'سهم مالیات از ارزش افزوده' },
    { id: 'toll', title: 'عوارض', icon: 'coins', input: 'percent', unit: '٪', desc: 'سهم عوارض از ارزش افزوده' },
    { id: 'inv-note', title: 'توضیحات فاکتور', icon: 'invoice', input: 'textarea', unit: '', desc: 'متن پایین فاکتور رسمی' },
    { id: 'pro-note', title: 'توضیحات پیش‌فاکتور', icon: 'file', input: 'textarea', unit: '', desc: 'متن پایین پیش‌فاکتور' }
  ];
  var SETTING_VALUES = [];
  (function () {
    var code = 1, letters = { 1392: 'ج', 1393: 'م', 1394: 'ن', 1395: 'و', 1396: 'پ', 1397: 'ت', 1398: 'ج', 1399: 'د', 1400: 'ر', 1401: 'ح', 1402: 'ط', 1403: 'ک', 1404: 'ل', 1405: 'س' };
    function add(type, year, value) { SETTING_VALUES.push({ code: code++, type: type, year: year, value: String(value) }); }
    Object.keys(letters).forEach(function (y) { add('letter', +y, letters[y]); });
    for (var y = 1395; y <= 1405; y++) {
      var vat = y < 1397 ? 8 : y < 1403 ? 9 : 10;
      add('vat', y, vat); add('tax', y, y < 1397 ? 5 : y < 1403 ? 6 : 7); add('toll', y, 3);
    }
    add('inv-note', 1404, 'کالای فروخته‌شده تا ۷ روز پس از تحویل در صورت سالم بودن بسته‌بندی قابل مرجوع است. گارانتی دستگاه‌ها ۱۸ ماه از تاریخ فاکتور می‌باشد.');
    add('inv-note', 1405, 'کالای فروخته‌شده تا ۷ روز پس از تحویل در صورت سالم بودن بسته‌بندی قابل مرجوع است. گارانتی دستگاه‌ها ۲۴ ماه از تاریخ فاکتور می‌باشد.');
    add('pro-note', 1404, 'اعتبار این پیش‌فاکتور ۷ روز کاری است. قیمت‌ها با احتساب ارزش افزوده می‌باشد.');
    add('pro-note', 1405, 'اعتبار این پیش‌فاکتور ۵ روز کاری است. هزینه نصب و راه‌اندازی در تهران رایگان است.');
  })();

  return {
    nav: NAV, modules: MODULES, kpis: KPIS, customers: CUSTOMERS, dealStages: DEAL_STAGES, deals: DEALS,
    tickets: TICKETS, invoices: INVOICES, products: PRODUCTS, threads: THREADS,
    activities: ACTIVITIES, notifications: NOTIFICATIONS, tasks: TASKS, team: TEAM,
    users: USERS, messages: MESSAGES, files: FILES, faq: FAQ,
    whCategories: WH_CATEGORIES, whCardReaders: WH_CARD_READERS, whUnits: WH_UNITS,
    whExitTypes: WH_EXIT_TYPES, whStores: WH_STORES, whProducts: WH_PRODUCTS, whIn: WH_IN, whOut: WH_OUT,
    defUserTypes: DEF_USER_TYPES, defUserKinds: DEF_USER_KINDS, defUsers: DEF_USERS, permModules: PERM_MODULES,
    permPresets: PERM_PRESETS, defPerms: DEF_PERMS, fiscalPeriods: FISCAL_PERIODS, basicTypes: BASIC_TYPES,
    basicItems: BASIC_ITEMS, settingTypes: SETTING_TYPES, settingValues: SETTING_VALUES
  };
})();
