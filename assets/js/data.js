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
      desc: 'پیغام‌های داخلی، تقویم، جریان فعالیت‌ها و میزکار پنجره‌ای',
      children: [
        { id: 'inbox', label: 'پیغام‌ها', href: 'inbox.html' },
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
      id: 'm-support', label: 'پشتیبانی', icon: 'headset', tone: 'amber', href: 'support.html', badge: '۵',
      desc: 'برنامه کاری و برنامه‌ریزی کارشناسان، خدمات مشتریان، تیکت‌ها و پایگاه دانش',
      children: [
        { id: 'support', label: 'نمای کلی پشتیبانی', href: 'support.html' },
        { id: 'support-workplan', label: 'برنامه کاری', href: 'support-workplan.html' },
        { id: 'support-planning', label: 'برنامه‌ریزی', href: 'support-planning.html' },
        { id: 'support-formdata', label: 'ثبت اطلاعات فرم', href: 'support-formdata.html' },
        { id: 'support-desk', label: 'پشتیبانی مشتریان', href: 'support-desk.html' },
        { id: 'rep-support-perf', label: 'عملکرد پشتیبانی', href: 'report.html?r=support-perf' },
        { id: 'support-userperf', label: 'ثبت عملکرد کاربر', href: 'support-userperf.html' },
        { id: 'tickets', label: 'تیکت‌ها', href: 'tickets.html' },
        { id: 'ticket-new', label: 'ثبت تیکت جدید', href: 'ticket-new.html' },
        { id: 'journey', label: 'سفر مشتری (پرونده‌ها)', href: 'journey.html' },
        { id: 'messages', label: 'گفتگو با مشتریان', href: 'messages.html' },
        { id: 'kb', label: 'پایگاه دانش', href: 'kb.html' }
      ]
    },
    {
      id: 'm-accounting', label: 'حسابداری', icon: 'wallet', tone: 'coral', href: 'accounting.html',
      desc: 'اسناد پرداخت و هزینه، چک‌ها، تنخواه و پرداخت به نمایندگان',
      children: [
        { id: 'accounting', label: 'حسابداری', href: 'accounting.html' }
      ],
      links: [
        { label: 'مالی پرداختی‌ها', href: 'report.html?r=payments' },
        { label: 'هزینه‌ها و خسارت', href: 'report.html?r=expenses' }
      ]
    },
    {
      id: 'm-reports', label: 'گزارشات', icon: 'reports', tone: 'rose', href: 'reports-hub.html',
      desc: 'گزارش مالی و آماری، پیامک، نمایندگان، شرکت‌ها، دستگاه‌ها و پرداخت‌ها',
      children: [
        { id: 'reports-hub', label: 'همه‌ی گزارش‌ها', href: 'reports-hub.html' },
        { id: 'rep-finance', label: 'گزارش مالی و آماری', href: 'report.html?r=finance' },
        { id: 'rep-sms', label: 'گزارش پیامک', href: 'report.html?r=sms' },
        { id: 'rep-agents', label: 'لیست نماینده‌ها', href: 'report.html?r=agents' },
        { id: 'rep-companies', label: 'مشخصات شرکت‌ها', href: 'report.html?r=companies' },
        { id: 'rep-company-stats', label: 'آمار شرکت‌ها', href: 'report.html?r=company-stats' },
        { id: 'rep-owner-stats', label: 'آمار مسئول فروش', href: 'report.html?r=owner-stats' },
        { id: 'rep-devices', label: 'ریز وضعیت دستگاه‌ها', href: 'report.html?r=devices' },
        { id: 'rep-payments', label: 'مالی پرداختی‌ها', href: 'report.html?r=payments' },
        { id: 'rep-expenses', label: 'هزینه‌ها و خسارت', href: 'report.html?r=expenses' },
        { id: 'reports', label: 'داشبورد تحلیلی', href: 'reports.html' }
      ],
      links: [
        { label: 'گزارش موجودی انبار', href: 'warehouse-stock.html' },
        { label: 'عملکرد پشتیبانی', href: 'report.html?r=support-perf' }
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
        { id: 'inbox', label: 'پیغام‌ها', icon: 'inbox', href: 'inbox.html', badge: '۴' },
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

  /* ==========================================================================
   * پیغام‌ها (پیام‌رسان داخلی بین کاربران)
   * from/to: نام کاربر؛ «مهدی کریمی» کاربر واردشده‌ی قالب است.
   * ========================================================================== */
  var MSG_ME = 'مهدی کریمی';
  var MSG_TYPES = [
    { id: 'msg', title: 'پیغام', tone: 'badge-info' },
    { id: 'cancel', title: 'کنسلی برنامه کاری', tone: 'badge-danger' },
    { id: 'pay', title: 'گزارش واریزی', tone: 'badge-success' },
    { id: 'remind', title: 'یادآوری', tone: 'badge-warning' }
  ];
  var MSGS = [
    { code: 115169, from: 'داوود توکلی', to: MSG_ME, type: 'cancel', text: 'کنسلی برنامه به شماره فرم ۰۵۷۵۱ برای مشتری شرکت سامانه‌های بعد پنجم. لطفاً زمان جدید نصب را با مشتری هماهنگ کنید.', date: '۱۴۰۵/۰۷/۲۰', time: '۱۱:۰۹', remind: null, wait: true, seen: false },
    { code: 115168, from: 'امیر باصری', to: MSG_ME, type: 'msg', text: 'پیش‌فاکتور گروه صنعتی البرز آماده است؛ قبل از ارسال، تخفیف ۸٪ را تأیید می‌کنید؟', date: '۱۴۰۵/۰۷/۲۰', time: '۰۹:۴۲', remind: null, wait: true, seen: false },
    { code: 115166, from: MSG_ME, to: 'تینا لشکریان', type: 'msg', text: 'جلسه‌ی دموی داده‌پرداز به شنبه ساعت ۱۰ منتقل شد. دستگاه EP-810 را از انبار تحویل بگیرید.', date: '۱۴۰۵/۰۷/۱۹', time: '۱۶:۲۰', remind: { date: '۱۴۰۵/۰۷/۲۶', time: '۰۹:۰۰' }, wait: false, seen: true },
    { code: 115163, from: 'رضا دایجی', to: MSG_ME, type: 'remind', text: 'یادآوری: قرارداد پشتیبانی سالانه‌ی شهرداری خرم‌دره تا پایان ماه تمدید شود.', date: '۱۴۰۵/۰۷/۱۸', time: '۱۰:۰۵', remind: { date: '۱۴۰۵/۰۷/۲۸', time: '۱۰:۰۰' }, wait: false, seen: false },
    { code: 115160, from: MSG_ME, to: 'داوود توکلی', type: 'msg', text: 'گزارش فروش مهرماه تا پایان هفته آماده می‌شود. اعداد دو نماینده‌ی تبریز هنوز نیامده است.', date: '۱۴۰۵/۰۷/۱۷', time: '۱۲:۳۰', remind: null, wait: true, seen: true },
    { code: 115147, from: 'demo', to: MSG_ME, type: 'pay', text: 'گزارش واریزی --- فاکتور شماره ۹۰/۰۱/۰۲-الف مبلغ ۴۸٬۰۰۰٬۰۰۰ ریال به حساب ملت واریز شد.', date: '۱۴۰۵/۰۷/۱۵', time: '۱۵:۲۵', remind: null, wait: false, seen: false },
    { code: 115145, from: 'demo', to: MSG_ME, type: 'pay', text: 'گزارش واریزی --- فاکتور شماره ۹۰/۰۱/۰۲-ب مبلغ ۱۲٬۵۰۰٬۰۰۰ ریال به حساب ملت واریز شد.', date: '۱۴۰۵/۰۷/۱۵', time: '۱۵:۲۵', remind: null, wait: false, seen: true },
    { code: 115139, from: 'یاسمین معصومی', to: MSG_ME, type: 'msg', text: 'تیکت TK-5521 به واحد فنی ارجاع شد؛ مشتری درخواست تماس تلفنی دارد.', date: '۱۴۰۵/۰۷/۱۴', time: '۱۱:۱۲', remind: null, wait: false, seen: true },
    { code: 115131, from: MSG_ME, to: 'امیر باصری', type: 'msg', text: 'فاکتور رزروشده‌ی پارس‌نیکان را تا فردا نهایی کنید؛ موجودی HP-510 رو به اتمام است.', date: '۱۴۰۵/۰۷/۱۲', time: '۰۸:۵۵', remind: null, wait: true, seen: false },
    { code: 115124, from: 'علی سحرخیز', to: MSG_ME, type: 'cancel', text: 'کنسلی برنامه به شماره فرم ۰۵۷۳۸ — مشتری به‌دلیل تعطیلی اداره، نصب را به هفته‌ی بعد موکول کرد.', date: '۱۴۰۵/۰۷/۱۰', time: '۱۴:۰۰', remind: null, wait: false, seen: true },
    { code: 115118, from: 'مریم صفری', to: MSG_ME, type: 'msg', text: 'لیست نمایندگان استان فارس به‌روزرسانی شد؛ لطفاً بررسی و تأیید کنید.', date: '۱۴۰۵/۰۷/۰۸', time: '۰۹:۳۰', remind: null, wait: true, seen: true },
    { code: 115102, from: MSG_ME, to: 'یاسمین معصومی', type: 'remind', text: 'بازدید دوره‌ای دستگاه‌های شعبه‌ی کرج را در برنامه‌ی هفته‌ی بعد قرار دهید.', date: '۱۴۰۵/۰۷/۰۳', time: '۱۰:۴۵', remind: { date: '۱۴۰۵/۰۷/۲۲', time: '۰۸:۳۰' }, wait: false, seen: true }
  ];

  /* ==========================================================================
   * حسابداری (سند پرداخت / هزینه)
   * pay: cash نقدی | cheque چک | transfer واریز به حساب — petty: in واریز به تنخواه | out پرداخت از تنخواه
   * ========================================================================== */
  var ACC_TYPES = [
    { id: 'buy', title: 'خرید کالا', tone: 'badge-primary' },
    { id: 'expense', title: 'هزینه جاری', tone: 'badge-warning' },
    { id: 'agent', title: 'پرداخت به نماینده', tone: 'badge-violet' },
    { id: 'damage', title: 'خسارت', tone: 'badge-danger' },
    { id: 'petty', title: 'تنخواه‌گردان', tone: 'badge-success' }
  ];
  var ACC_BANKS = ['ملت', 'ملی', 'صادرات', 'تجارت', 'پاسارگاد', 'سامان', 'رفاه کارگران'];
  var ACC_DOCS = [
    { code: 2041, period: 14, type: 'buy', date: '۱۴۰۵/۰۷/۲۰', agent: false, company: '', item: 'کارت RFID (بسته ۱۰۰ عددی)', consumer: 'انبار اصلی', invoice: '', base: 1450000, qty: 20, discount: 1000000, seller: 'بازرگانی رهام', sellerPhone: '۰۲۱۶۶۷۱۲۴۵۰', sellerAddr: 'تهران، خیابان جمهوری، پاساژ امجد', pay: 'cheque', account: '', person: '', chequeDate: '۱۴۰۵/۰۸/۲۰', chequeNo: '۷۴۲۱۱۸', bank: 'ملت', petty: '', note: 'خرید ماهانه‌ی کارت' },
    { code: 2040, period: 14, type: 'expense', date: '۱۴۰۵/۰۷/۱۹', agent: false, company: '', item: 'ایاب و ذهاب نصب شهریار', consumer: 'علی سحرخیز', invoice: '۱۴۰۴-۰۵۲۱', base: 850000, qty: 1, discount: 0, seller: '', sellerPhone: '', sellerAddr: '', pay: 'cash', account: '', person: '', chequeDate: '', chequeNo: '', bank: '', petty: 'out', note: '' },
    { code: 2039, period: 14, type: 'agent', date: '۱۴۰۵/۰۷/۱۸', agent: true, company: 'شرکت الکترونیک تلفن', item: 'پورسانت فروش شهریور', consumer: '', invoice: '', base: 18600000, qty: 1, discount: 0, seller: '', sellerPhone: '', sellerAddr: '', pay: 'transfer', account: '۶۲۱۹۸۶۱۰۳۴۵۶۷۸۹۰', person: 'جاهد اورنگ', chequeDate: '', chequeNo: '', bank: 'سامان', petty: '', note: 'طبق قرارداد ۱۲٪' },
    { code: 2038, period: 14, type: 'petty', date: '۱۴۰۵/۰۷/۱۵', agent: false, company: '', item: 'شارژ تنخواه واحد پشتیبانی', consumer: 'یاسمین معصومی', invoice: '', base: 30000000, qty: 1, discount: 0, seller: '', sellerPhone: '', sellerAddr: '', pay: 'cash', account: '', person: '', chequeDate: '', chequeNo: '', bank: '', petty: 'in', note: '' },
    { code: 2037, period: 14, type: 'damage', date: '۱۴۰۵/۰۷/۱۲', agent: false, company: '', item: 'تعویض برد دستگاه HB-630 A (سریال 630-23-00412)', consumer: 'واحد فنی', invoice: '', base: 6400000, qty: 1, discount: 0, seller: 'تعمیرات الکترونیک پویا', sellerPhone: '۰۲۱۳۳۹۱۴۲۰۸', sellerAddr: 'تهران، لاله‌زار جنوبی', pay: 'cash', account: '', person: '', chequeDate: '', chequeNo: '', bank: '', petty: 'out', note: 'آسیب در حمل' },
    { code: 2036, period: 14, type: 'expense', date: '۱۴۰۵/۰۷/۱۰', agent: false, company: '', item: 'اجاره‌ی انبار فرعی', consumer: 'انبار فرعی', invoice: '', base: 42000000, qty: 1, discount: 0, seller: 'آقای محمدی (موجر)', sellerPhone: '۰۹۱۲۳۴۴۰۹۸۱', sellerAddr: '', pay: 'transfer', account: '۶۰۳۷۹۹۷۵۱۲۳۴۵۶۷۸', person: 'حسن محمدی', chequeDate: '', chequeNo: '', bank: 'ملی', petty: '', note: '' },
    { code: 2035, period: 14, type: 'buy', date: '۱۴۰۵/۰۷/۰۶', agent: false, company: '', item: 'آداپتور ۱۲ ولت', consumer: 'انبار اصلی', invoice: '', base: 380000, qty: 50, discount: 500000, seller: 'پخش قطعات نوین', sellerPhone: '۰۲۱۶۶۷۴۸۸۱۰', sellerAddr: 'تهران، خیابان جمهوری', pay: 'cheque', account: '', person: '', chequeDate: '۱۴۰۵/۰۷/۳۰', chequeNo: '۷۴۲۱۰۹', bank: 'ملت', petty: '', note: '' },
    { code: 2034, period: 14, type: 'agent', date: '۱۴۰۵/۰۷/۰۴', agent: true, company: 'شرکت حسابداران دقیق اسپادانا', item: 'پورسانت فروش مرداد و شهریور', consumer: '', invoice: '', base: 24300000, qty: 1, discount: 0, seller: '', sellerPhone: '', sellerAddr: '', pay: 'cheque', account: '', person: '', chequeDate: '۱۴۰۵/۰۸/۰۵', chequeNo: '۷۴۲۱۰۴', bank: 'ملت', petty: '', note: '' },
    { code: 2033, period: 14, type: 'damage', date: '۱۴۰۵/۰۶/۲۸', agent: false, company: '', item: 'خسارت دستگاه دموی EP-810 (شکستگی صفحه)', consumer: 'تینا لشکریان', invoice: '', base: 3900000, qty: 1, discount: 0, seller: '', sellerPhone: '', sellerAddr: '', pay: 'cash', account: '', person: '', chequeDate: '', chequeNo: '', bank: '', petty: 'out', note: 'از دمو برگشت خورد' },
    { code: 2032, period: 14, type: 'expense', date: '۱۴۰۵/۰۶/۲۵', agent: false, company: '', item: 'هزینه‌ی پیامک (بسته ۵۰ هزارتایی)', consumer: 'واحد فروش', invoice: '', base: 9500000, qty: 1, discount: 0, seller: 'سامانه پیامک آوا', sellerPhone: '۰۲۱۹۱۰۰۵۰۰۰', sellerAddr: '', pay: 'transfer', account: '۱۰۰۲۳۴۵۶۷۸۹', person: 'آوا پیام', chequeDate: '', chequeNo: '', bank: 'پاسارگاد', petty: '', note: '' },
    { code: 2031, period: 14, type: 'expense', date: '۱۴۰۵/۰۶/۲۰', agent: false, company: '', item: 'پذیرایی نمایشگاه الکامپ', consumer: 'واحد بازاریابی', invoice: '', base: 7200000, qty: 1, discount: 200000, seller: 'کترینگ پارسه', sellerPhone: '۰۲۱۸۸۰۲۳۳۴۰', sellerAddr: '', pay: 'cash', account: '', person: '', chequeDate: '', chequeNo: '', bank: '', petty: 'out', note: '' },
    { code: 2030, period: 14, type: 'petty', date: '۱۴۰۵/۰۶/۰۱', agent: false, company: '', item: 'شارژ تنخواه واحد نصب', consumer: 'علی سحرخیز', invoice: '', base: 20000000, qty: 1, discount: 0, seller: '', sellerPhone: '', sellerAddr: '', pay: 'cash', account: '', person: '', chequeDate: '', chequeNo: '', bank: '', petty: 'in', note: '' }
  ];

  /* ==========================================================================
   * داده‌های گزارش‌ها
   * ========================================================================== */
  var REP_OWNERS = ['توکلی', 'عدالت', 'اصغری', 'حقی', 'میلاد فتاحی', 'محمودی', 'کاظمی', 'لشکریان', 'باصری', 'محصصی', 'فروش ۲'];

  /* لیست نماینده‌ها (نوع: نماینده / عامل) */
  var REP_AGENTS = [
    ['نماینده', 'شرکت الکترونیک تلفن', 'آذربایجان شرقی', 'تبریز', 'جاهد اورنگ', '09144037720', '04135246410', 'تبریز، خیابان امام، مابین مسجد سالار و میدان قطب، روبه‌روی پوشاک منصور، کوچه سالار، درب اول سمت چپ، دیجیتال سانترال تلفن'],
    ['نماینده', 'آسایش بنیان (رضا موصلی)', 'آذربایجان شرقی', 'تبریز', 'موصلی', '09145052760', '-', 'تبریز، مابین چهارراه بهار و آخونی، جنب تالار آذربایجان، ساختمان پاس ۶۴، طبقه اول'],
    ['نماینده', 'جناب آقای حسین تقی‌زاده - آرین دیجیتال', 'آذربایجان شرقی', 'تبریز', 'تقی‌زاده', '09143116123', '-', 'تبریز، خیابان استاد جعفری، خیابان قطران جنوبی، پلاک ۲۲'],
    ['نماینده', 'مینا انواری - تجارت هوشمند رایبون', 'آذربایجان شرقی', 'تبریز', 'افتخار', '-', '09900246924', 'تبریز، خیابان ارتش جنوبی، نرسیده به چهارراه باغشمال، ساختمان قائم، طبقه سوم'],
    ['نماینده', 'مریم فرج‌زاده (دیجیتال سانترال)', 'آذربایجان شرقی', 'تبریز', 'اورنگ', '09146297720', '-', 'تبریز، خیابان امام، مابین مسجد سالار و میدان قطب، کوچه سالار، دیجیتال سانترال تلفن'],
    ['نماینده', 'جناب آقای عبدالرحیم فتحی آذری بابره', 'آذربایجان غربی', 'ارومیه', 'سعید عباسی', '09358146997', '04433449989', 'ارومیه، بلوار نبوت، کوی ۳۱، آپارتمان پاس، واحد یک'],
    ['عامل', 'شرکت مرکز گسترش ماشین‌های اداری', 'آذربایجان غربی', 'ارومیه', 'افشاری', '09143410334', '04432227871', 'ارومیه، خیابان امام، مجتمع اداری ماشین‌های اداری، طبقه زیرهمکف، پلاک ۳۰'],
    ['نماینده', 'شرکت تراز پردازان ایده‌آل حساب آذربایجان', 'آذربایجان غربی', 'میاندوآب', 'علی ابراهیم‌نیا', '09142237411', '04445269200', 'میاندوآب، خیابان طالقانی، کوچه بهداری، ساختمان آناهیتا ۳'],
    ['نماینده', 'سید الیاس قاسمی (آرتا شبکه یکتا)', 'اردبیل', 'اردبیل', 'الیاس آقامحمدی', '09143518129', '04533232062', 'اردبیل، ایستگاه سرعین، خیابان آب، بعد از کوچه بهار ۴۹، فروشگاه آرتا شبکه'],
    ['نماینده', 'شرکت حسابداران دقیق اسپادانا', 'اصفهان', 'اصفهان', 'وحید تنگستانی', '09132270521', '03131320654', 'اصفهان، خیابان خلیفه سلطانی، کوچه ۸، پلاک ۲۲'],
    ['نماینده', 'جناب آقای تنگستانی', 'اصفهان', 'اصفهان', 'وحید تنگستانی', '09132270521', '03131320654', 'اصفهان، خیابان هشت‌بهشت شرقی، کوچه ۲۰، بوستان ۱، پلاک ۱۱۳'],
    ['نماینده', 'الناز رجبی رستمی (فروشگاه ارگ)', 'اصفهان', 'اصفهان', 'رستمی', '09133768353', '-', 'اصفهان، بزرگراه خرازی، حدفاصل صمدیه و کهندژ، ساختمان امام رضا، واحد ۳'],
    ['عامل', 'فروشگاه درخشش', 'اصفهان', 'کاشان', 'حامد درخشش‌فر', '09133610449', '03155241050', 'کاشان، خیابان فاضل نراقی، روبه‌روی بانک صنعت و معدن'],
    ['نماینده', 'جناب آقای مهدی عرب‌نجفی (صنایع الکترونیک آریا گستر)', 'البرز', 'کرج', '-', '09123632494', '-', 'کرج، چهارراه هفت‌تیر، مجتمع تجاری کیش، طبقه اول، واحد ۲۰۵'],
    ['نماینده', 'شرکت دیده‌بان سیستم زاگرس', 'ایلام', 'ایلام', 'شهاب سهرابی‌پور', '09181413624', '08433339547', 'ایلام، خیابان خرمشهر، نبش کوچه شهید مظفری، طبقه اول'],
    ['نماینده', 'جناب آقای سجاد جمالی (ماشین‌های اداری اطلس)', 'ایلام', 'ایلام', 'جمالی', '09375838100', '08433333784', 'ایلام، میدان شهید کشوری، ابتدای خیابان آیت‌الله حیدری'],
    ['نماینده', 'فروشگاه پارسیان شبکه', 'بوشهر', 'بوشهر', 'دانش', '09177195003', '07733552220', 'بوشهر، خیابان انقلاب'],
    ['نماینده', 'جناب آقای محمدامین دهباشی (دیجیتال سنتر)', 'بوشهر', 'بوشهر', 'دهباشی', '09179291281', '07733556182', 'بوشهر، خیابان شهید مطهری، ابتدای کارگر (هلالی)، نبش کوچه تلاش'],
    ['نماینده', 'سما گستر بوشهر', 'بوشهر', 'بوشهر', 'زهرابی', '09171720488', '07733334453', 'بوشهر، خیابان مطهری، جنب بانک رفاه، ساختمان سما گستر'],
    ['نماینده', 'ساتا ایده‌پرداز ویرا', 'تهران', 'تهران', 'نوید نوبخت', '09123252163', '02141135000', 'تهران، خیابان کریمخان زند، ایرانشهر شمالی، کوچه یگانه، پلاک ۲، واحد ۱'],
    ['نماینده', 'نادین علم و صنعت مهراد', 'تهران', 'تهران', 'شعبانی', '-', '02156390703', 'تهران، میدان ولیعصر، خیابان شهید حسن عضدی، کوچه سپند، پلاک ۶۸'],
    ['نماینده', 'آوا فرهنگ آریا', 'تهران', 'تهران', 'آبدری', '09163601361', '02188316000', 'تهران، ایرانشهر شمالی، کوچه دهقانی، پلاک ۹، واحد ۵'],
    ['عامل', 'پیشگامان فناوری پارس', 'فارس', 'شیراز', 'کیانی', '09171234590', '07132345670', 'شیراز، خیابان زند، نبش کوچه ۲۲، ساختمان نگین'],
    ['نماینده', 'رایان سامانه طوس', 'خراسان رضوی', 'مشهد', 'رضوانی', '09151112233', '05138456120', 'مشهد، بلوار سجاد، سجاد ۱۴، پلاک ۸'],
    ['عامل', 'گیلان دیجیتال', 'گیلان', 'رشت', 'پورحسن', '09111345678', '01333223344', 'رشت، خیابان امام، کوچه بهار، پلاک ۱۲']
  ].map(function (r, i) { return { code: 300 + i, kind: r[0], name: r[1], province: r[2], city: r[3], buyer: r[4], mobile: r[5], phone: r[6], address: r[7] }; });

  /* گزارش پیامک (ارسالی / دریافتی) */
  var REP_SMS = [];
  (function () {
    var texts = ['یادآوری نصب دستگاه حضور و غیاب فردا ساعت ۱۰', 'فاکتور شما صادر شد؛ شماره پیگیری در پیامک بعدی ارسال می‌شود', 'به سامانه پیامک ما خوش آمدید — نسخه جدید', 'کارشناس پشتیبانی تا ساعت ۱۴ با شما تماس می‌گیرد', 'تمدید قرارداد پشتیبانی سالانه شما تا پایان ماه مهلت دارد', 'دستگاه شما از تعمیرگاه تحویل شد', 'آدرس: شیراز، سه‌راه نمازی، به سمت شاه‌چراغ، کوچه کلانتری عباسیه، بعد از بی‌بی دختران', 'تست', 'سلام', 'پیش‌فاکتور درخواستی به ایمیل شما ارسال شد', 'دعوت به نمایشگاه الکامپ — غرفه ۳۱۲ سالن ۸'];
    var inTexts = ['سلام، دستگاه بعد از قطعی برق روشن نمی‌شود', 'لطفاً پیش‌فاکتور را دوباره ارسال کنید', 'ممنون، دریافت شد', 'زمان نصب را به شنبه منتقل کنید', 'شماره حساب برای واریز را بفرستید'];
    var senders = ['demo', 'توکلی', 'باصری', 'کاظمی', 'لشکریان'];
    var receivers = ['', 'گروه صنعتی البرز', 'پارس‌نیکان', 'شهرداری خرم‌دره', 'داده‌پرداز', 'آریا جم', 'کیمیا شیمی دماوند', ''];
    var seed = 7; function r(n) { seed = (seed * 9301 + 49297) % 233280; return Math.floor(seed / 233280 * n); }
    function p(n) { return (n < 10 ? '0' : '') + n; }
    var nums = ['09123127680', '09123342979', '09357896171', '09122307295', '09369017163', '09368797747', '09124452049', '09151112233', '09171720488'];
    for (var i = 0; i < 64; i++) {
      var y = 1405 - (i > 44 ? 1 : 0), m = 7 - Math.floor(i / 7) % 7, d = 20 - (i * 3) % 19;
      if (m < 1) m += 12;
      var dir = i % 5 === 3 ? 'in' : 'out';
      REP_SMS.push({
        code: 9000 - i, dir: dir, user: senders[r(senders.length)], name: receivers[r(receivers.length)], number: nums[r(nums.length)],
        text: dir === 'in' ? inTexts[r(inTexts.length)] : texts[r(texts.length)],
        date: y + '/' + p(m) + '/' + p(Math.max(1, d)), time: p(8 + r(10)) + ':' + p(r(60)), status: dir === 'in' ? 'دریافت شد' : (r(9) === 0 ? 'ناموفق' : 'تحویل شد')
      });
    }
  })();

  /* شرکت‌ها (مشتریان حقوقی) برای «مشخصات شرکت‌ها» و «آمار شرکت‌ها» */
  var REP_COMPANIES = [];
  (function () {
    var names = ['گروه صنعتی البرز', 'پارس‌نیکان', 'داده‌پرداز', 'شهرداری خرم‌دره', 'آریا جم', 'کیمیا شیمی دماوند', 'رزستان سنگ', 'صندوق کار آفرین امید', 'ماشین‌های اداری امیتاک', 'راستین ارتباط سازان پاژ', 'فولاد سپاهان نوین', 'بیمارستان مهر', 'دانشگاه آزاد واحد کرج', 'هتل پارسیان شیراز', 'پخش البرز', 'کاشی سعدی', 'نساجی مازند', 'تعاونی مسکن فرهنگیان', 'شرکت ساختمانی آبادگران', 'پتروشیمی مارون', 'مدارس غیرانتفاعی نیکان', 'کارخانه قند نیشابور', 'سازمان آب منطقه‌ای گیلان', 'رستوران‌های زنجیره‌ای شاندیز', 'پوشاک هاکوپیان', 'لبنیات کاله', 'شیرین‌عسل', 'آسانسور آرین', 'داروسازی سبحان', 'پلیمر آریاساسول'];
    var geo = [['تهران', 'تهران'], ['تهران', 'شهریار'], ['البرز', 'کرج'], ['اصفهان', 'اصفهان'], ['اصفهان', 'کاشان'], ['فارس', 'شیراز'], ['خراسان رضوی', 'مشهد'], ['خراسان رضوی', 'نیشابور'], ['آذربایجان شرقی', 'تبریز'], ['گیلان', 'رشت']];
    var sources = ['اینترنت', 'معرفی مشتری', 'بازاریابی تلفنی', 'نمایشگاه', 'معرفی همکار', 'آشنایان', 'مناقصه', 'ایمیل مارکتینگ'];
    var coops = ['مشتری نهایی', 'مشتری نهایی', 'مشتری نهایی', 'نماینده', 'همکار فروش', 'عمده‌فروش'];
    var owners = ['باصری', 'کاظمی', 'لشکریان', 'میلاد فتاحی', 'توکلی', 'عدالت'];
    var seed = 11; function r(n) { seed = (seed * 9301 + 49297) % 233280; return Math.floor(seed / 233280 * n); }
    function p(n) { return (n < 10 ? '0' : '') + n; }
    names.forEach(function (n, i) {
      var g = geo[r(geo.length)];
      REP_COMPANIES.push({
        code: 1000 + i * 7, name: n, province: g[0], city: g[1], source: sources[r(sources.length)], coop: coops[r(coops.length)],
        owner: owners[r(owners.length)], phone: '0' + (21 + r(70)) + (30000000 + r(60000000)), contact: ['آقای ', 'خانم '][r(2)] + ['رضایی', 'محمدی', 'کریمی', 'حسینی', 'احمدی', 'جعفری', 'نوری', 'صادقی'][r(8)],
        devices: r(9), since: (1396 + r(10)) + '/' + p(1 + r(12)) + '/' + p(1 + r(28))
      });
    });
  })();

  /* فاکتور و پیش‌فاکتورها برای «گزارش مالی و آماری» و «آمار مسئول فروش»
     kind: pre (پیش‌فاکتور) | inv (فاکتور) — status: ok | cancel — مبالغ به تومان */
  var REP_INVOICES = [];
  (function () {
    var weight = { 'توکلی': 6, 'عدالت': 4, 'اصغری': 3, 'حقی': 2, 'میلاد فتاحی': 1, 'محمودی': 3, 'کاظمی': 6, 'لشکریان': 4, 'باصری': 14, 'محصصی': 2, 'فروش ۲': 1 };
    var seed = 23; function r(n) { seed = (seed * 9301 + 49297) % 233280; return Math.floor(seed / 233280 * n); }
    function p(n) { return (n < 10 ? '0' : '') + n; }
    var code = 5000;
    REP_OWNERS.forEach(function (o) {
      var cnt = weight[o] * 22;
      for (var i = 0; i < cnt; i++) {
        var y = r(19) < 12 ? 1404 : 1405, m = y === 1405 ? 1 + r(7) : 1 + r(12), d = 1 + r(m <= 6 ? 31 : 30);
        if (y === 1405 && m === 7 && d > 20) d = 1 + r(20);
        if (o === 'میلاد فتاحی' && y === 1405 && m === 7) m = 6;
        var kind = r(100) < 55 ? 'pre' : 'inv', net = (8 + r(200)) * 1000000 + r(10) * 100000;
        var vat = Math.round(net * 0.1), install = r(3) ? 0 : (5 + r(25)) * 100000, total = net + vat + install;
        var status = kind === 'inv' && r(100) < 6 ? 'cancel' : 'ok';
        var paid = kind === 'inv' && status === 'ok' ? (r(4) ? total : Math.round(total * r(9) / 10)) : 0;
        REP_INVOICES.push({
          code: code++, owner: o, date: y + '/' + p(m) + '/' + p(d), kind: kind, official: r(100) < 93, status: status,
          net: net, vat: vat, install: install, total: total, paid: paid, agent: r(100) < 14, partner: r(100) < 9
        });
      }
    });
  })();

  /* ریز وضعیت دستگاه‌ها: سابقه‌ی هر سریال (ورود → خروج) */
  var REP_DEVICES = [];
  (function () {
    var custs = ['شهرداری خرم‌دره', 'شرکت راستین ارتباط سازان پاژ', 'صندوق کار آفرین امید - ستاد مرکزی', 'رزستان سنگ', 'آریا جم', 'ماشین‌های اداری امیتاک', 'فواد بهرامی - ماشین‌های اداری ماد نوین', 'کیمیا شیمی دماوند', 'گروه صنعتی البرز', 'پارس‌نیکان', 'داده‌پرداز', 'بیمارستان مهر', 'هتل پارسیان شیراز'];
    var statuses = ['sale', 'sale', 'sale', 'sale', 'demo', 'present', 'broken', 'support'];
    var seed = 5; function r(n) { seed = (seed * 9301 + 49297) % 233280; return Math.floor(seed / 233280 * n); }
    function p(n) { return (n < 10 ? '0' : '') + n; }
    WH_PRODUCTS.filter(function (x) { return x.cat === 'main' || x.cat === 'security'; }).forEach(function (pr) {
      var n = 3 + r(6);
      for (var i = 0; i < n; i++) {
        var iy = 1386 + r(19), im = 1 + r(12), id = 1 + r(28);
        var oy = Math.min(1405, iy + r(3)), om = r(2) ? im : Math.min(12, im + 1 + r(3)), od = 1 + r(28);
        if (oy === 1405 && om > 7) om = 7;
        REP_DEVICES.push({
          product: pr.code, name: pr.name, serial: String(2560000000000 + pr.code * 1000003 + i * 7919 + r(900)),
          reader: ['ID', 'EM', 'Mifare', 'HID'][r(4)], inDate: iy + '/' + p(im) + '/' + p(id), status: statuses[r(statuses.length)],
          customer: custs[r(custs.length)], outDate: oy + '/' + p(om) + '/' + p(od)
        });
      }
    });
  })();

  /* ==========================================================================
   * پشتیبانی: برنامه کاری، برنامه‌ریزی، ثبت اطلاعات فرم، خدمات، عملکرد کاربر
   * ========================================================================== */
  function F(s) { return String(s).replace(/\d/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'[d]; }); }
  var SUP_FORM_TYPES = [
    { id: 'install', title: 'نصب', icon: 'zap', tone: 'primary' },
    { id: 'support', title: 'پشتیبانی', icon: 'headset', tone: 'warning' },
    { id: 'training', title: 'آموزش', icon: 'presentation', tone: 'violet' },
    { id: 'sale', title: 'فروش', icon: 'receipt', tone: 'success' },
    { id: 'demo', title: 'ارسال دمو', icon: 'send', tone: 'info' },
    { id: 'meeting', title: 'جلسه', icon: 'users', tone: 'gray' },
    { id: 'card', title: 'چاپ کارت', icon: 'id-card', tone: 'info' },
    { id: 'swap', title: 'تعویض و بازگشت', icon: 'rotate-ccw', tone: 'danger' }
  ];
  /* وضعیت فرم: پیش‌نویس ← ارسال (منتظر برنامه‌ریزی) ← تأیید ← چاپ ← انجام شد | کنسل | ناقص */
  var SUP_STATUSES = [
    { id: 'draft', title: 'پیش‌نویس', tone: 'gray' },
    { id: 'sent', title: 'ارسال شده', tone: 'info' },
    { id: 'confirmed', title: 'تأیید شده', tone: 'primary' },
    { id: 'printed', title: 'چاپ شده', tone: 'violet' },
    { id: 'done', title: 'انجام شد', tone: 'success' },
    { id: 'incomplete', title: 'ناقص', tone: 'warning' },
    { id: 'cancel', title: 'کنسل', tone: 'danger' }
  ];
  var SUP_COORDS = ['توکلی', 'باصری', 'کاظمی', 'لشکریان', 'میلاد فتاحی', 'عدالت'];
  var SUP_EXPERTS = ['فتحی', 'قورچیان', 'سحرخیز', 'دایجی', 'آقاجانپور', 'جانی پور', 'درگزی', 'احمدی تبار'];
  var SUP_LISTS = {
    settle: ['نقدی', 'چک', 'کارتخوان', 'واریز به حساب', 'اعتباری (قرارداد)'],
    send: ['داخل شرکت', 'پیک موتوری', 'تیپاکس', 'پست پیشتاز', 'باربری', 'تحویل حضوری'],
    settleDocs: ['مهر', 'معرفی نامه', 'کارت شناسایی'],
    cancelReasons: ['عدم حضور مشتری', 'آماده نبودن محل نصب', 'درخواست مشتری', 'عدم تسویه حساب', 'نقص تجهیزات', 'تداخل برنامه‌ی کارشناس'],
    delay: ['بدون تأخیر', 'ترافیک', 'تأخیر در برنامه‌ی قبلی', 'عدم هماهنگی مشتری', 'مشکل خودرو'],
    defects: ['بدون نقص', 'کابل‌کشی ناقص', 'نبود پریز برق', 'عدم دسترسی به شبکه', 'آماده نبودن سیستم نرم‌افزار'],
    incomplete: ['انجام کامل', 'عدم آمادگی شبکه', 'عدم حضور مسئول IT', 'نقص قطعه', 'کمبود زمان'],
    remote: ['ریموت نشده', 'درخواست مشتری', 'فاصله‌ی زیاد', 'مشکل نرم‌افزاری', 'کاهش هزینه'],
    satisfaction: ['عالی', 'خوب', 'متوسط', 'ضعیف'],
    install: ['نصب کامل', 'نصب سخت‌افزار', 'نصب نرم‌افزار', 'جابجایی دستگاه', 'بدون نصب'],
    support: ['بدون پشتیبانی', 'حضوری', 'تلفنی', 'ریموت', 'تعمیرات'],
    software: ['بدون نرم‌افزار', 'حضور و غیاب تحت وب', 'حضور و غیاب ویندوزی', 'کنترل تردد', 'سلف سرویس'],
    placeOf: ['داخل شرکت', 'تهران', 'حومه تهران', 'شهرستان'],
    serviceKinds: ['حضوری', 'تعمیرات', 'تلفنی', 'ریموت', 'گزارش تعمیرات'],
    serviceStatus: ['اتمام پیگیری', 'در حال پیگیری', 'ارجاع به تعمیرات', 'منتظر پاسخ مشتری'],
    repairs: ['تعویض برد', 'تعویض سنسور اثر انگشت', 'تعویض آداپتور', 'تعمیر صفحه‌کلید', 'به‌روزرسانی فریم‌ور'],
    deskFilters: ['همه', 'اعتبار رو به اتمام (۳۰ روز)', 'اعتبار منقضی', 'دارای پیگیری باز', 'نماینده‌ها'],
    following: ['همه', 'در حال پیگیری', 'بدون پیگیری'],
    refCompanies: ['سامانه‌های بعد پنجم', 'آریا گستر', 'پیشگامان فناوری پارس']
  };

  /* شرکت‌های پشتیبانی (با افراد، دستگاه‌ها، فاکتورها و فایل‌ها برای «پرونده مشتری») */
  var SUP_COMPANIES = [];
  (function () {
    var seed = 31; function r(n) { seed = (seed * 9301 + 49297) % 233280; return Math.floor(seed / 233280 * n); }
    function p(n) { return (n < 10 ? '0' : '') + n; }
    var prods = ['EB - 920 TC', 'HP - 200', 'EB - 102', 'HP - 510', 'EP - 810', 'HP - 310', 'EB - 720 C'];
    var readers = ['ID', 'بدون_کارتخوان', 'Mifare', 'EM'];
    var owners = ['انصاری', 'رحیمی', 'حسینی', 'میلاد فتاحی', 'باصری'];
    var units = ['مدیریت', 'اداری', 'مالی', 'IT', 'منابع انسانی', ''];
    var roles = ['مدیرعامل', 'کارشناس', 'مسئول خرید', 'مسئول IT', ''];
    var fn = ['امیری', 'احمدی', 'صباغ زاده', 'ذبیحی', 'غضنفری', 'برزگر', 'قائمی', 'زنوزی', 'قاسمی', 'حسن زاده', 'رضایی', 'کریمی', 'نوری'];
    function mk(code, name, coop, addr, phone, credit, follow, o) {
      o = o || {};
      var people = o.people || [];
      if (!o.people) for (var i = 0, n = 3 + r(5); i < n; i++) people.push({ name: (r(2) ? 'جناب آقای ' : 'سرکار خانم ') + fn[r(fn.length)], unit: units[r(units.length)], role: i === 0 ? 'مدیرعامل' : roles[r(roles.length)], tel1: r(2) ? phone : '', tel2: '', mobile: r(2) ? F('0912' + (1000000 + r(8999999))) : '', email: '' });
      var devices = [];
      for (var k = 0, m = 1 + r(4); k < m; k++) {
        var y = 1392 + r(13), mo = 1 + r(12), d = 1 + r(28);
        devices.push({ product: prods[r(prods.length)], invoice: r(3) ? F((y - 1300) + '/' + p(mo) + '/' + (100 + r(800))) : '', serial: F(String(1000000000 + r(899999) * 4099)), out: F(y + '/' + mo + '/' + d), reader: readers[r(readers.length)], type: 'فروش', owner: owners[r(owners.length)], note: '', credit: F((y + 1) + '/' + p(mo) + '/' + p(d)) });
      }
      var invoices = [];
      for (var j = 0, q = 1 + r(3); j < q; j++) { var iy = 1394 + r(11), im = 1 + r(12); invoices.push({ no: F((iy - 1300) + '/' + p(im) + '/' + (100 + r(800))), date: F(iy + '/' + p(im) + '/' + p(1 + r(28))), owner: owners[r(owners.length)] }); }
      SUP_COMPANIES.push(Object.assign({
        code: code, name: name, coop: coop, address: addr, phone: phone, email: '', ref: '', expert: SUP_EXPERTS[r(SUP_EXPERTS.length)], owner: owners[r(owners.length)],
        econ: '', postal: F(String(1000000000 + r(899999999))), reg: F(String(10000 + r(80000))), invType: ['رسمی کامل', 'غیررسمی', 'رسمی'][r(3)], note: '',
        credit: credit, follow: follow, flags: [], people: people, devices: devices, invoices: invoices,
        files: [{ name: 'فرم فروش', date: devices[0].out, by: 'اسکندری', note: '' }, { name: 'قرارداد پشتیبانی', date: F('1404/03/31'), by: 'باصری', note: 'اسکن امضاشده' }]
      }, o));
    }
    mk(26, 'جناب آقای مهدی عرب نجفی (شرکت صنایع الکترونیک آریا گستر)', 'نماینده', 'کرج، چهارراه هفت‌تیر، مجتمع تجاری کیش، طبقه اول، واحد ۲۰۵', '۰۲۶۳۲۲۸۴۱۰۲', '۱۴۰۵/۱۲/۲۶', '', {
      email: 'jafi@faratel.com', owner: 'رحیمی', postal: '۳۱۳۴۷۶۳۳۹۴', reg: '۶۱۰۴۱۲۹۶۲۲۹', invType: 'رسمی کامل', note: '۰۰۶۹۳۶۰۰۸۱', expert: 'احمدی تبار', flags: ['good'],
      people: [
        { name: 'جناب آقای -', unit: 'مدیریت', role: 'مدیرعامل', tel1: '-', tel2: '۰۲۶۳۲۲۸۴۱۰۲', mobile: '۰۹۱۲۳۶۳۲۴۹۴', email: 'aryagostar205@gmail.com' },
        { name: 'سرکار خانم امیری', unit: '', role: '', tel1: '', tel2: '', mobile: '', email: '' },
        { name: 'سرکار خانم احمدی', unit: '', role: '', tel1: '۰۲۶۳۲۲۸۴۱۰۱-۲', tel2: '', mobile: '', email: '' },
        { name: 'جناب آقای صباغ زاده', unit: '', role: '', tel1: '', tel2: '', mobile: '', email: '' },
        { name: 'سرکار خانم ذبیحی', unit: '', role: '', tel1: '', tel2: '', mobile: '', email: '' },
        { name: 'سرکار خانم غضنفری', unit: '', role: '', tel1: '', tel2: '', mobile: '', email: '' },
        { name: 'سرکار خانم برزگر', unit: '', role: '', tel1: '', tel2: '', mobile: '', email: '' },
        { name: 'سرکار خانم قائمی', unit: '', role: '', tel1: '', tel2: '', mobile: '', email: '' },
        { name: 'سرکار خانم زنوزی', unit: '', role: '', tel1: '', tel2: '', mobile: '', email: '' },
        { name: 'جناب آقای مهدی نجفی', unit: '', role: '', tel1: '۰۲۶۳۲۲۸۴۱۰۲', tel2: '۰۲۶۳۲۲۸۴۱۰۱', mobile: '۰۹۱۲۳۶۳۲۴۹۴', email: 'aryagostar205@gmail.com' },
        { name: 'سرکار خانم قاسمی', unit: '', role: '', tel1: '', tel2: '', mobile: '۰۹۲۱۲۹۴۲۳۸۳', email: '' },
        { name: 'سرکار خانم حسن زاده', unit: '', role: '', tel1: '۰۲۶۳۲۲۸۴۱۰۱', tel2: '', mobile: '۰۹۲۱۲۹۴۲۳۸۳', email: '' }
      ],
      devices: [
        { product: 'EB - 920 TC', invoice: '', serial: '۲۶۶۲۳۲۰۰۱۹', out: '۱۳۹۲/۲/۸', reader: 'ID', type: 'فروش', owner: 'انصاری', note: '', credit: '۱۳۹۳/۰۲/۰۸' },
        { product: 'HP - 200', invoice: '', serial: '۰۲۰۳۰۴۰۰۷۶', out: '۱۳۹۲/۲/۴', reader: 'ID', type: 'فروش', owner: 'انصاری', note: 'نصب در زیوار صنعت', credit: '۱۳۹۳/۰۲/۰۴' },
        { product: 'EB - 102', invoice: '', serial: '۳۱۴۲۳۴۰۰۵۱', out: '۱۳۹۲/۲/۴', reader: 'بدون_کارتخوان', type: 'فروش', owner: 'انصاری', note: '', credit: '۱۳۹۳/۰۲/۰۴' }
      ],
      invoices: [{ no: '۹۵/۰۹/۱۲۸', date: '۱۳۹۵/۰۹/۲۸', owner: 'حسینی' }, { no: '۹۶/۰۹/۱۷۶', date: '۱۳۹۶/۰۹/۲۲', owner: 'رحیمی' }, { no: '۹۷/۰۵/۵۰-۱', date: '۱۳۹۷/۰۵/۰۸', owner: 'میلاد فتاحی' }],
      files: [{ name: 'فرم فروش', date: '۱۳۹۲/۰۶/۱۸', by: 'اسکندری', note: '' }, { name: 'فرم فروش', date: '۱۳۹۲/۰۶/۱۸', by: 'اسکندری', note: '' }]
    });
    mk(6614, 'شرکت آریا گستر', 'فرصت مشتری', 'تهران، خیابان ولیعصر، بالاتر از پارک ساعی، کوچه‌ی نوبخت، پلاک ۱۲', '۰۲۱۸۸۷۷۴۵۲۱', '۱۴۰۵/۰۳/۳۱', '', { flags: [] });
    mk(20859, 'وحید قدیمی-آریا گسترش', 'مشتری غیر مستقیم', 'اصفهان، خیابان چهارباغ بالا، مجتمع پارک، واحد ۹', '۰۳۱۳۶۶۲۱۴۵۰', '۱۴۰۵/۰۳/۱۰', '', {});
    mk(21891, 'شرکت کوشا آریاگستر نت', 'فرصت مشتری', 'تهران، شهرک غرب، بلوار فرحزادی، پلاک ۴۲', '۰۲۱۲۲۰۸۴۵۶۷', '', '', {});
    mk(1000, 'شرکت سامانه‌های بعد پنجم', 'داخلی', 'تهران، بزرگراه جلال آل احمد، شرق به غرب، نرسیده به چهارراه آریافر، پلاک ۲۷۹، واحد ۱۰', '۰۲۱۸۸۲۵۶۰۰۰', '', '', { people: [{ name: 'فتحی', unit: 'فنی', role: 'کارشناس', tel1: '۰۲۱۸۸۲۵۶۰۰۰', tel2: '', mobile: '۰۹۱۲۱۰۰۲۰۳۰', email: '' }, { name: 'توکلی', unit: 'فروش', role: 'هماهنگ‌کننده', tel1: '', tel2: '', mobile: '', email: '' }] });
    mk(5748, 'شرکت پادا نقش جهان جی', 'مشتری نهایی', 'اصفهان، شهرک صنعتی جی، انتهای خیابان یکم فرعی ۱۴، پلاک ۱۸۴', '۰۳۱۳۵۷۲۲۵۴۸', '۱۴۰۶/۰۷/۱۲', '', { people: [{ name: 'مرضیه طاهری دولت آبادی', unit: 'اداری', role: 'مسئول اداری', tel1: '۰۳۱۳۵۷۲۲۵۴۸', tel2: '', mobile: '۰۹۱۳۲۲۴۵۶۱۰', email: '' }, { name: 'جناب آقای نوری', unit: 'IT', role: 'مسئول IT', tel1: '', tel2: '', mobile: '۰۹۱۳۸۸۰۴۵۲۱', email: '' }] });
    mk(1021, 'گروه صنعتی البرز', 'مشتری نهایی', 'کرج، جاده مخصوص، کیلومتر ۱۲، خیابان صنعت', '۰۲۶۳۴۴۱۲۲۰۰', '۱۴۰۵/۰۸/۰۵', '۱۴۰۵/۰۷/۲۳', {});
    mk(1028, 'پارس‌نیکان', 'مشتری نهایی', 'تهران، خیابان مطهری، خیابان سلیمان خاطر، پلاک ۸', '۰۲۱۸۸۳۴۲۹۷۹', '۱۴۰۴/۱۱/۲۰', '', { flags: ['bad'] });
    mk(1035, 'داده‌پرداز', 'همکار فروش', 'تهران، میدان ونک، خیابان ملاصدرا، پلاک ۱۲۰', '۰۲۱۸۸۶۱۷۰۲۰', '۱۴۰۵/۰۷/۲۸', '۱۴۰۵/۰۷/۲۲', {});
    mk(1042, 'شهرداری خرم‌دره', 'مشتری نهایی', 'خرم‌دره، بلوار امام، ساختمان شهرداری', '۰۲۴۳۵۵۲۲۱۰۰', '۱۴۰۶/۰۱/۱۵', '', {});
    mk(1049, 'آریا جم', 'نماینده', 'شیراز، خیابان زند، نبش کوچه ۲۲', '۰۷۱۳۲۳۴۵۶۷۰', '۱۴۰۵/۰۸/۰۱', '', {});
    mk(1056, 'کیمیا شیمی دماوند', 'مشتری نهایی', 'دماوند، شهرک صنعتی، خیابان سوم', '۰۲۱۷۶۳۲۰۴۴۰', '۱۴۰۵/۰۶/۳۰', '۱۴۰۵/۰۷/۲۵', {});
  })();

  /* فرم‌های برنامه کاری (منبع «برنامه‌ریزی»، «ثبت اطلاعات فرم» و «گردش فرم») */
  var SUP_PLANS = [
    { no: '۰۵۷۵۱', created: '۱۴۰۵/۰۷/۲۰', types: ['install'], coord: 'توکلی', docs: [], company: 1000, person: 'فتحی', mobile: '', settle: 'نقدی', send: '', freight: '', official: false,
      items: [{ product: 'HP - 510', reader: 'کارتخوان Mifare', qty: 1 }], note: '', status: 'sent', plan: null, data: null, cancel: null,
      flow: [{ st: 'sent', user: 'توکلی', at: '۱۴۰۵/۰۷/۲۰ ۱۰:۵۲:۱۱', date: '', time: '', note: '' }] },
    { no: '۰۵۷۵۰', created: '۱۴۰۵/۰۷/۲۰', types: ['support'], coord: 'کاظمی', docs: ['معرفی نامه'], company: 1021, person: '', mobile: '', settle: 'اعتباری (قرارداد)', send: 'داخل شرکت', freight: '', official: false,
      items: [], note: 'دستگاه طبقه‌ی دوم اثر انگشت نمی‌خواند', status: 'sent', plan: null, data: null, cancel: null,
      flow: [{ st: 'sent', user: 'کاظمی', at: '۱۴۰۵/۰۷/۲۰ ۰۹:۱۲:۴۰', date: '', time: '', note: '' }] },
    { no: '۰۵۷۴۹', created: '۱۴۰۵/۰۷/۱۹', types: ['install', 'training'], coord: 'باصری', docs: ['مهر'], company: 1035, person: '', mobile: '', settle: 'چک', send: 'داخل شرکت', freight: '', official: true,
      items: [{ product: 'EP - 810', reader: 'کارتخوان EM (۱۲۵ کیلوهرتز)', qty: 2 }, { product: 'نرم‌افزار حضور و غیاب', reader: 'بدون کارتخوان', qty: 1 }], note: '', status: 'confirmed',
      plan: { date: '۱۴۰۵/۰۷/۲۲', time: '۱۰:۳۰', expert: 'قورچیان', note: '' }, data: null, cancel: null,
      flow: [{ st: 'sent', user: 'باصری', at: '۱۴۰۵/۰۷/۱۹ ۱۱:۰۲:۱۸', date: '', time: '', note: '' }, { st: 'confirmed', user: 'کاظمی', at: '۱۴۰۵/۰۷/۲۰ ۰۸:۴۵:۰۹', date: '۱۴۰۵/۰۷/۲۲', time: '۱۰:۳۰', note: '' }] },
    { no: '۰۵۷۴۸', created: '۱۴۰۵/۰۷/۱۹', types: ['sale'], coord: 'باصری', docs: [], company: 5748, person: 'مرضیه طاهری دولت آبادی', mobile: '', settle: 'واریز به حساب', send: 'تیپاکس', freight: 'pre', official: false,
      items: [{ product: 'HP - 310', reader: 'کارتخوان Mifare', qty: 1 }], note: '', status: 'printed',
      plan: { date: '۱۴۰۵/۰۷/۱۹', time: '۱۴:۰۰', expert: 'سحرخیز', note: '' }, data: null, cancel: null,
      flow: [{ st: 'sent', user: 'باصری', at: '۱۴۰۵/۰۷/۱۹ ۰۹:۴۶:۴۵', date: '', time: '', note: '' }, { st: 'confirmed', user: 'کاظمی', at: '۱۴۰۵/۰۷/۱۹ ۱۰:۲۰:۱۳', date: '۱۴۰۵/۰۷/۱۹', time: '۱۴:۰۰', note: '' }, { st: 'printed', user: 'باصری', at: '۱۴۰۵/۰۷/۱۹ ۱۰:۳۱:۵۹', date: '', time: '', note: '' }] },
    { no: '۰۵۷۴۷', created: '۱۴۰۵/۰۷/۱۸', types: ['demo'], coord: 'لشکریان', docs: ['کارت شناسایی'], company: 1049, person: '', mobile: '', settle: 'نقدی', send: 'باربری', freight: 'post', official: false,
      items: [{ product: 'EP - 810', reader: 'کارتخوان HID', qty: 1 }], note: 'دمو دو هفته‌ای', status: 'done',
      plan: { date: '۱۴۰۵/۰۷/۱۸', time: '۱۶:۰۰', expert: 'دایجی', note: '' }, data: { waybill: '۴۵۸۸۲۱۰', date: '۱۴۰۵/۰۷/۱۸', send: 'باربری', minutes: 40, note: 'تحویل باربری راه‌آهن' }, cancel: null,
      flow: [{ st: 'sent', user: 'لشکریان', at: '۱۴۰۵/۰۷/۱۸ ۰۹:۰۰:۰۲', date: '', time: '', note: '' }, { st: 'confirmed', user: 'توکلی', at: '۱۴۰۵/۰۷/۱۸ ۰۹:۳۰:۴۴', date: '۱۴۰۵/۰۷/۱۸', time: '۱۶:۰۰', note: '' }, { st: 'printed', user: 'لشکریان', at: '۱۴۰۵/۰۷/۱۸ ۰۹:۴۱:۱۰', date: '', time: '', note: '' }, { st: 'done', user: 'دایجی', at: '۱۴۰۵/۰۷/۱۸ ۱۷:۱۲:۳۰', date: '', time: '', note: 'ثبت اطلاعات فرم' }] },
    { no: '۰۵۷۴۶', created: '۱۴۰۵/۰۷/۱۷', types: ['install'], coord: 'توکلی', docs: ['مهر', 'معرفی نامه'], company: 1042, person: '', mobile: '', settle: 'چک', send: 'داخل شرکت', freight: '', official: true,
      items: [{ product: 'HP - 510', reader: 'کارتخوان Mifare', qty: 3 }], note: '', status: 'cancel',
      plan: { date: '۱۴۰۵/۰۷/۲۰', time: '۰۹:۰۰', expert: 'آقاجانپور', note: '' }, data: null, cancel: { kind: 'cancel', reason: 'آماده نبودن محل نصب', note: 'کابل‌کشی شبکه انجام نشده بود' },
      flow: [{ st: 'sent', user: 'توکلی', at: '۱۴۰۵/۰۷/۱۷ ۱۲:۱۰:۳۳', date: '', time: '', note: '' }, { st: 'confirmed', user: 'کاظمی', at: '۱۴۰۵/۰۷/۱۸ ۰۸:۱۵:۲۰', date: '۱۴۰۵/۰۷/۲۰', time: '۰۹:۰۰', note: '' }, { st: 'cancel', user: 'توکلی', at: '۱۴۰۵/۰۷/۲۰ ۱۱:۰۹:۰۰', date: '', time: '', note: 'آماده نبودن محل نصب' }] },
    { no: '۰۵۷۴۵', created: '۱۴۰۵/۰۷/۱۶', types: ['support', 'card'], coord: 'عدالت', docs: [], company: 1056, person: '', mobile: '', settle: 'نقدی', send: 'پیک موتوری', freight: 'post', official: false,
      items: [{ product: 'کارت RFID (بسته ۱۰۰ عددی)', reader: 'بدون کارتخوان', qty: 2 }], note: 'چاپ ۲۰۰ کارت پرسنلی', status: 'incomplete',
      plan: { date: '۱۴۰۵/۰۷/۱۷', time: '۱۱:۰۰', expert: 'جانی پور', note: '' }, data: null, cancel: { kind: 'incomplete', reason: 'نقص تجهیزات', note: 'عکس ۴۰ نفر از پرسنل ارسال نشده' },
      flow: [{ st: 'sent', user: 'عدالت', at: '۱۴۰۵/۰۷/۱۶ ۱۰:۰۰:۰۰', date: '', time: '', note: '' }, { st: 'confirmed', user: 'توکلی', at: '۱۴۰۵/۰۷/۱۶ ۱۳:۲۲:۱۹', date: '۱۴۰۵/۰۷/۱۷', time: '۱۱:۰۰', note: '' }, { st: 'incomplete', user: 'جانی پور', at: '۱۴۰۵/۰۷/۱۷ ۱۵:۴۰:۰۸', date: '', time: '', note: 'نقص تجهیزات' }] },
    { no: '۰۵۷۴۴', created: '۱۴۰۵/۰۷/۱۵', types: ['meeting'], coord: 'میلاد فتاحی', docs: [], company: 1028, person: '', mobile: '', settle: 'نقدی', send: '', freight: '', official: false,
      items: [], note: 'جلسه‌ی ارائه‌ی سامانه‌ی کنترل تردد', status: 'done',
      plan: { date: '۱۴۰۵/۰۷/۱۶', time: '۱۰:۰۰', expert: 'درگزی', note: '' }, data: { waybill: '', date: '۱۴۰۵/۰۷/۱۶', send: 'داخل شرکت', minutes: 90, note: '' }, cancel: null,
      flow: [{ st: 'sent', user: 'میلاد فتاحی', at: '۱۴۰۵/۰۷/۱۵ ۱۴:۰۵:۳۷', date: '', time: '', note: '' }, { st: 'confirmed', user: 'توکلی', at: '۱۴۰۵/۰۷/۱۵ ۱۵:۰۰:۱۰', date: '۱۴۰۵/۰۷/۱۶', time: '۱۰:۰۰', note: '' }, { st: 'done', user: 'درگزی', at: '۱۴۰۵/۰۷/۱۶ ۱۲:۱۱:۴۲', date: '', time: '', note: 'ثبت اطلاعات فرم' }] },
    { no: '۰۵۷۴۳', created: '۱۴۰۵/۰۷/۱۴', types: ['swap'], coord: 'کاظمی', docs: [], company: 26, person: 'جناب آقای مهدی نجفی', mobile: '۰۹۱۲۳۶۳۲۴۹۴', settle: 'نقدی', send: 'تیپاکس', freight: 'post', official: false,
      items: [{ product: 'EB - 920 TC', reader: 'ID', qty: 1 }], note: 'تعویض دستگاه معیوب', status: 'printed',
      plan: { date: '۱۴۰۵/۰۷/۲۱', time: '۱۲:۰۰', expert: 'احمدی تبار', note: '' }, data: null, cancel: null,
      flow: [{ st: 'sent', user: 'کاظمی', at: '۱۴۰۵/۰۷/۱۴ ۰۹:۵۰:۲۱', date: '', time: '', note: '' }, { st: 'confirmed', user: 'توکلی', at: '۱۴۰۵/۰۷/۲۰ ۰۹:۱۰:۰۰', date: '۱۴۰۵/۰۷/۲۱', time: '۱۲:۰۰', note: '' }, { st: 'printed', user: 'کاظمی', at: '۱۴۰۵/۰۷/۲۰ ۰۹:۲۰:۴۵', date: '', time: '', note: '' }] },
    { no: '۰۵۷۴۲', created: '۱۴۰۵/۰۷/۱۲', types: ['install'], coord: 'باصری', docs: ['مهر'], company: 6614, person: '', mobile: '', settle: 'کارتخوان', send: 'داخل شرکت', freight: '', official: true,
      items: [{ product: 'HP - 310', reader: 'کارتخوان Mifare', qty: 2 }], note: '', status: 'sent', plan: null, data: null, cancel: null,
      flow: [{ st: 'sent', user: 'باصری', at: '۱۴۰۵/۰۷/۱۲ ۱۶:۰۲:۱۱', date: '', time: '', note: '' }] },
    { no: '۰۵۷۴۱', created: '۱۴۰۵/۰۷/۲۱', types: ['training'], coord: 'توکلی', docs: [], company: 20859, person: '', mobile: '', settle: 'نقدی', send: '', freight: '', official: false,
      items: [], note: 'آموزش نرم‌افزار به واحد اداری', status: 'draft', plan: null, data: null, cancel: null, flow: [] }
  ];

  /* خدمات انجام‌شده برای شرکت‌ها (پنجره‌ی «اطلاعات» و گزارش «عملکرد پشتیبانی») */
  var SUP_SERVICES = [
    [26, 'تلفنی', 'احمدی تبار', 'احمدی تبار', 'اقبال', 5, 'اتمام پیگیری', '', '۱۳۹۸/۱۱/۲۶ ۱۷:۲۳', 'قرارداد پشتیبانی تا ۱۴۰۵/۰۳/۳۱', 'مشتریشون خانه ایده‌آل نرم‌افزارشون باز نمی‌شد؛ مشکل قفل داشتن، پورت رو عوض کردن حل شد'],
    [26, 'تلفنی', 'احمدی تبار', 'احمدی تبار', 'برزگر', 10, 'اتمام پیگیری', '', '۱۳۹۸/۱۱/۲۰ ۱۶:۴۹', 'گارانتی نرم‌افزار تا ۱۴۰۶/۰۷/۱۲', 'حذف مدیر دستگاه برای مشتریشون انجام شد'],
    [26, 'تلفنی', 'احمدی تبار', 'احمدی تبار', 'اقبال', 20, 'اتمام پیگیری', '', '۱۳۹۸/۱۱/۱۴ ۰۸:۵۵', 'قرارداد پشتیبانی تا ۱۴۰۵/۰۳/۳۱', 'نحوه تنظیم کردن پیامک تو نرم‌افزار رو به طور کامل براشون توضیح دادم. همچنین مشتریشون مشکل ارتباط داشت؛ چک کردم پینگ نداشت، راهنمایی کردم آی‌پی ست کنن'],
    [26, 'تلفنی', 'احمدی تبار', 'احمدی تبار', '-', 8, 'اتمام پیگیری', '', '۱۳۹۸/۱۱/۰۷ ۱۲:۰۴', 'گارانتی نرم‌افزار تا ۱۴۰۶/۰۷/۱۲', 'می‌خواستن حکم یکی از پرسنل تو نرم‌افزار بر اساس فقط یک ایتم (اضافه کار ازاد) باشه؛ راهنمایی کردم چجوری تعریف کنن'],
    [26, 'تلفنی', 'احمدی تبار', 'احمدی تبار', 'برزگر', 8, 'اتمام پیگیری', '', '۱۳۹۸/۱۱/۰۲ ۰۹:۱۱', 'گارانتی نرم‌افزار تا ۱۴۰۶/۰۷/۱۲', 'برای مرکز بهداشت کرج تماس گرفتن؛ یک دستگاهشون ارتباط نداشت، راهنمایی شد'],
    [26, 'تلفنی', 'جانی پور', 'جانی پور', '-', 30, '', '', '۱۳۹۲/۰۴/۱۱ ۱۱:۴۸', '', 'مشکل داشتند که قفل مسدود شده؛ t5 در رابطه با نرم‌افزار بود. از شرکت کارتن ماشین تماس گرفته بودند که مشکل قفل حل شد'],
    [26, 'ریموت', 'جانی پور', 'جانی پور', '-', 20, 'اتمام پیگیری', '', '۱۳۹۲/۰۴/۱۱ ۱۶:۳۲', '', 'با خانم رحمتی از کارتون ماشین صحبت کردیم که نرم‌افزار T5 قفل شده بود که مشکل قفل برطرف شد و نرم‌افزار t5 راه‌اندازی شد'],
    [26, 'تلفنی', 'درگزی', 'درگزی', '-', 5, 'اتمام پیگیری', '', '۱۳۹۲/۰۶/۱۶ ۱۱:۲۴', '', 'usb تخلیه اطلاعات با'],
    [26, 'ریموت', 'درگزی', 'درگزی', '-', 10, 'اتمام پیگیری', '', '۱۳۹۲/۰۷/۰۳ ۱۱:۴۲', '', 'خطای برقراری ارتباط میداد؛ مشکل رو رفع کردم a5 برنامه'],
    [26, 'تلفنی', 'درگزی', 'درگزی', '-', 10, 'اتمام پیگیری', '', '۱۳۹۲/۰۷/۰۷ ۰۹:۵۰', '', 'در مورد خروجی حقوق و دستمزد سوال داشتند'],
    [26, 'ریموت', 'آقاجانپور', 'آقاجانپور', 'زنوزی', 20, 'اتمام پیگیری', '', '۱۴۰۵/۰۷/۱۹ ۱۰:۱۴', 'قرارداد پشتیبانی تا ۱۴۰۵/۱۲/۲۶', 'خطای محدودیت چارت سازمانی وجود داشت که به دلیل عدم شناسایی قفل بود که با جابه‌جایی پورت آن مشکل برطرف شد.'],
    [6614, 'حضوری', 'قورچیان', 'قورچیان', 'خانم صالحی', 90, 'اتمام پیگیری', '', '۱۴۰۵/۰۶/۲۸ ۱۱:۲۰', 'قرارداد پشتیبانی تا ۱۴۰۵/۰۳/۳۱', 'راه‌اندازی مجدد دستگاه‌ها پس از جابه‌جایی دفتر'],
    [6614, 'تلفنی', 'سحرخیز', 'سحرخیز', 'خانم صالحی', 15, 'در حال پیگیری', '۱۴۰۵/۰۷/۲۴', '۱۴۰۵/۰۷/۱۸ ۰۹:۰۵', 'قرارداد پشتیبانی تا ۱۴۰۵/۰۳/۳۱', 'گزارش ماهانه خروجی اکسل نمی‌دهد؛ نسخه‌ی جدید ارسال شد'],
    [20859, 'تعمیرات', 'دایجی', 'دایجی', 'وحید قدیمی', 45, 'ارجاع به تعمیرات', '۱۴۰۵/۰۷/۲۶', '۱۴۰۵/۰۷/۱۵ ۱۳:۴۰', 'گارانتی تا ۱۴۰۵/۰۳/۱۰', 'سنسور اثر انگشت آسیب دیده؛ دستگاه به تعمیرگاه ارسال شد'],
    [1021, 'حضوری', 'قورچیان', 'قورچیان', 'آقای کاظمی', 60, 'اتمام پیگیری', '', '۱۴۰۵/۰۷/۱۰ ۱۰:۰۰', 'قرارداد پشتیبانی تا ۱۴۰۵/۰۸/۰۵', 'سرویس دوره‌ای و تمیزکاری سنسورها'],
    [1021, 'ریموت', 'سحرخیز', 'سحرخیز', 'آقای کاظمی', 25, 'در حال پیگیری', '۱۴۰۵/۰۷/۲۳', '۱۴۰۵/۰۷/۲۰ ۱۴:۲۲', 'قرارداد پشتیبانی تا ۱۴۰۵/۰۸/۰۵', 'تنظیم شیفت‌های چرخشی؛ ادامه در جلسه‌ی بعد'],
    [1035, 'تلفنی', 'فتحی', 'فتحی', '-', 10, 'اتمام پیگیری', '', '۱۴۰۵/۰۷/۰۸ ۰۹:۳۰', 'همکار فروش', 'راهنمایی نصب درایور USB'],
    [1028, 'گزارش تعمیرات', 'دایجی', 'دایجی', '-', 30, 'اتمام پیگیری', '', '۱۴۰۵/۰۶/۱۲ ۱۶:۱۰', 'بدون قرارداد', 'تعویض آداپتور و تست ۲۴ ساعته'],
    [1042, 'حضوری', 'آقاجانپور', 'آقاجانپور', 'مهندس رسولی', 120, 'اتمام پیگیری', '', '۱۴۰۵/۰۵/۲۲ ۱۰:۴۵', 'قرارداد پشتیبانی تا ۱۴۰۶/۰۱/۱۵', 'آموزش اپراتورهای جدید و بررسی گزارش‌ها'],
    [1056, 'تلفنی', 'جانی پور', 'جانی پور', '-', 12, 'منتظر پاسخ مشتری', '۱۴۰۵/۰۷/۲۵', '۱۴۰۵/۰۷/۲۰ ۱۱:۱۰', 'قرارداد پشتیبانی تا ۱۴۰۵/۰۶/۳۰', 'تمدید قرارداد پشتیبانی پیشنهاد شد؛ منتظر تأیید مدیر مالی'],
    [1049, 'ریموت', 'احمدی تبار', 'احمدی تبار', '-', 35, 'اتمام پیگیری', '', '۱۴۰۵/۰۷/۰۲ ۱۵:۰۰', 'نماینده', 'به‌روزرسانی نرم‌افزار نماینده به نسخه‌ی ۷']
  ].map(function (r, i) {
    return { code: 7000 + i, company: r[0], kind: r[1], owner: r[2], expert: r[3], custExpert: r[4], minutes: r[5], status: r[6], follow: r[7], at: r[8], contract: r[9], note: r[10],
      operator: false, hw: r[1] === 'تعمیرات' || r[1] === 'گزارش تعمیرات', sw: r[1] !== 'تعمیرات', abbr: '', renew: false, repair: r[1] === 'تعمیرات' ? 'تعویض سنسور اثر انگشت' : '', form: '' };
  });

  /* ثبت عملکرد کاربر */
  var SUP_USERPERF = [
    { code: 1, user: 'قورچیان', form: '۰۵۷۴۹', company: 1035, date: '۱۴۰۵/۰۷/۲۲', install: 'نصب کامل', support: 'بدون پشتیبانی', software: 'حضور و غیاب تحت وب', place: ['تهران'], delay: 'بدون تأخیر', devices: 2, prevDelivered: false, contForm: '', shared: false, onTime: true, defects: 'بدون نقص', incomplete: 'انجام کامل', remote: 'ریموت نشده', minutes: 150, satisfaction: 'عالی', cost: 0, damage: 0, note: '' },
    { code: 2, user: 'دایجی', form: '۰۵۷۴۷', company: 1049, date: '۱۴۰۵/۰۷/۱۸', install: 'بدون نصب', support: 'بدون پشتیبانی', software: 'بدون نرم‌افزار', place: ['داخل شرکت'], delay: 'بدون تأخیر', devices: 1, prevDelivered: false, contForm: '', shared: false, onTime: true, defects: 'بدون نقص', incomplete: 'انجام کامل', remote: 'ریموت نشده', minutes: 40, satisfaction: 'خوب', cost: 350000, damage: 0, note: 'تحویل باربری' },
    { code: 3, user: 'جانی پور', form: '۰۵۷۴۵', company: 1056, date: '۱۴۰۵/۰۷/۱۷', install: 'بدون نصب', support: 'حضوری', software: 'بدون نرم‌افزار', place: ['حومه تهران'], delay: 'ترافیک', devices: 0, prevDelivered: true, contForm: '', shared: false, onTime: false, defects: 'بدون نقص', incomplete: 'نقص قطعه', remote: 'ریموت نشده', minutes: 95, satisfaction: 'متوسط', cost: 600000, damage: 0, note: 'عکس پرسنل ناقص بود' },
    { code: 4, user: 'درگزی', form: '۰۵۷۴۴', company: 1028, date: '۱۴۰۵/۰۷/۱۶', install: 'بدون نصب', support: 'بدون پشتیبانی', software: 'کنترل تردد', place: ['تهران'], delay: 'بدون تأخیر', devices: 0, prevDelivered: false, contForm: '', shared: false, onTime: true, defects: 'بدون نقص', incomplete: 'انجام کامل', remote: 'ریموت نشده', minutes: 90, satisfaction: 'عالی', cost: 0, damage: 0, note: 'جلسه‌ی موفق' }
  ];

  return {
    nav: NAV, modules: MODULES, kpis: KPIS, customers: CUSTOMERS, dealStages: DEAL_STAGES, deals: DEALS,
    tickets: TICKETS, invoices: INVOICES, products: PRODUCTS, threads: THREADS,
    activities: ACTIVITIES, notifications: NOTIFICATIONS, tasks: TASKS, team: TEAM,
    users: USERS, messages: MESSAGES, files: FILES, faq: FAQ,
    whCategories: WH_CATEGORIES, whCardReaders: WH_CARD_READERS, whUnits: WH_UNITS,
    whExitTypes: WH_EXIT_TYPES, whStores: WH_STORES, whProducts: WH_PRODUCTS, whIn: WH_IN, whOut: WH_OUT,
    defUserTypes: DEF_USER_TYPES, defUserKinds: DEF_USER_KINDS, defUsers: DEF_USERS, permModules: PERM_MODULES,
    permPresets: PERM_PRESETS, defPerms: DEF_PERMS, fiscalPeriods: FISCAL_PERIODS, basicTypes: BASIC_TYPES,
    basicItems: BASIC_ITEMS, settingTypes: SETTING_TYPES, settingValues: SETTING_VALUES,
    msgMe: MSG_ME, msgTypes: MSG_TYPES, msgs: MSGS, accTypes: ACC_TYPES, accBanks: ACC_BANKS, accDocs: ACC_DOCS,
    repOwners: REP_OWNERS, repAgents: REP_AGENTS, repSms: REP_SMS, repCompanies: REP_COMPANIES, repDevices: REP_DEVICES, repInvoices: REP_INVOICES,
    supFormTypes: SUP_FORM_TYPES, supStatuses: SUP_STATUSES, supCoords: SUP_COORDS, supExperts: SUP_EXPERTS, supLists: SUP_LISTS,
    supCompanies: SUP_COMPANIES, supPlans: SUP_PLANS, supServices: SUP_SERVICES, supUserPerf: SUP_USERPERF
  };
})();
