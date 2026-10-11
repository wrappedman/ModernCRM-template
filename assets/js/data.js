/*!
 * ============================================================================
 *  ModernCRM · data.js — مدل منو و داده‌های نمونه (فقط برای نمایش UI)
 *  نکته: در پروژه واقعی این داده‌ها از API بک‌اند تامین می‌شوند.
 * ============================================================================
 */
window.CRM_DATA = (function () {
  'use strict';

  /* ------------------------------------------------------------ منوی اصلی */
  var NAV = [
    {
      group: 'عمومی',
      items: [
        { id: 'dashboard', label: 'داشبورد', icon: 'dashboard', href: 'dashboard.html' },
        { id: 'desktop', label: 'میزکار پنجره‌ها', icon: 'window', href: 'desktop.html', badge: 'پنجره‌ای', badgeStyle: 'solid' },
        { id: 'activity', label: 'فعالیت‌ها', icon: 'activity', href: 'activity.html' },
        { id: 'calendar', label: 'تقویم', icon: 'calendar', href: 'calendar.html' },
        { id: 'journey', label: 'سفر مشتری', icon: 'pipeline', href: 'journey.html', badge: 'جدید', badgeStyle: 'soft' }
      ]
    },
    {
      group: 'مدیریت مشتریان',
      key: 'customers',
      items: [
        {
          id: 'customers', label: 'مشتریان', icon: 'customers', href: 'customers.html', badge: '۱۲۴', open: true,
          children: [
            { id: 'customers', label: 'فهرست مشتریان', href: 'customers.html' },
            { id: 'customer-new', label: 'افزودن مشتری', href: 'customer-new.html' },
            { id: 'customer-profile', label: 'پروفایل مشتری', href: 'customer-profile.html' }
          ]
        },
        { id: 'companies', label: 'شرکت‌ها و سازمان‌ها', icon: 'building', href: 'customers.html', badge: '۴۸' }
      ]
    },
    {
      group: 'فروش و بازاریابی',
      items: [
        { id: 'pipeline', label: 'قیف فروش', icon: 'pipeline', href: 'pipeline.html' },
        { id: 'deals', label: 'معاملات', icon: 'deals', href: 'deals.html' },
        { id: 'products', label: 'کالا و خدمات', icon: 'products', href: 'products.html' },
        { id: 'invoices', label: 'فاکتورها', icon: 'invoice', href: 'invoices.html' },
        { id: 'reports', label: 'گزارش‌ها', icon: 'reports', href: 'reports.html' }
      ]
    },
    {
      group: 'پشتیبانی',
      items: [
        { id: 'tickets', label: 'تیکت‌ها', icon: 'tickets', href: 'tickets.html', badge: '۵' },
        { id: 'ticket-new', label: 'ثبت تیکت جدید', icon: 'plus', href: 'ticket-new.html' },
        { id: 'messages', label: 'گفتگو با مشتریان', icon: 'message', href: 'messages.html', badge: '۳' },
        { id: 'kb', label: 'پایگاه دانش', icon: 'book', href: 'kb.html' }
      ]
    },
    {
      group: 'مدیریت سیستم',
      items: [
        { id: 'users', label: 'کاربران و نقش‌ها', icon: 'user-cog', href: 'users.html' },
        { id: 'settings', label: 'تنظیمات', icon: 'settings', href: 'settings.html' }
      ]
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

  return {
    nav: NAV, kpis: KPIS, customers: CUSTOMERS, dealStages: DEAL_STAGES, deals: DEALS,
    tickets: TICKETS, invoices: INVOICES, products: PRODUCTS, threads: THREADS,
    activities: ACTIVITIES, notifications: NOTIFICATIONS, tasks: TASKS, team: TEAM,
    users: USERS, messages: MESSAGES, files: FILES, faq: FAQ
  };
})();
