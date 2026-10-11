# مدرن‌CRM — قالب رابط کاربری سامانه مدیریت ارتباط با مشتری

قالب کامل و آماده‌ی فرانت‌اند (فقط UI) برای سامانه CRM فارسی و راست‌چین،
ساخته‌شده با **HTML + CSS + JavaScript خالص** و بدون هیچ کتابخانه یا CDN خارجی.

- زبان برنامه: فارسی — چینش: RTL کامل
- فونت: **وزیرمتن (Vazirmatn)** — به‌صورت متغیر و همراه قالب (بدون نیاز به اینترنت)
- تم: **روشن و تیره** با ذخیره‌سازی انتخاب کاربر
- پنجره‌های شناور: هر کارت را می‌توان مثل پنجره‌های ویندوز جابه‌جا، تغییر اندازه، مینیمایز، ماکسیمایز و به لبه‌ها «اسنپ» کرد
- نمودارها: موتور سبک SVG داخلی (خطی، ستونی، حلقه‌ای، شعاعی، Sparkline)
- تقویم شمسی (جلالی) و اعداد فارسی در تمام صفحات

---

## شروع سریع

کافی است پوشه را با هر وب‌سروری سرو کنید (باز کردن مستقیم فایل‌ها نیز کار می‌کند):

```bash
# پایتون
python3 -m http.server 8000

# یا با Node
npx serve .
```

سپس در مرورگر به آدرس زیر بروید:

```
http://localhost:8000/index.html
```

> صفحه‌ی `index.html` نقش «نقشه‌ی قالب» را دارد و فهرست تمام صفحه‌ها را نمایش می‌دهد.
> برای دیدن برنامه، از `login.html` (صفحه ورود) یا `dashboard.html` (داشبورد) شروع کنید.

---

## ساختار پوشه‌ها

```
ModernCRM-template/
├── index.html                صفحه معرفی و فهرست صفحات قالب
├── README.md                 همین فایل
│
├── assets/
│   ├── css/
│   │   ├── tokens.css        ★ همه رنگ‌ها، شعاع‌ها، سایه‌ها و متغیرها (تم روشن/تیره)
│   │   ├── base.css          ریست، تایپوگرافی، فونت وزیرمتن، ابزارهای عمومی
│   │   ├── components.css    کتابخانه اجزا (دکمه، فرم، جدول، مودال، نمودار، …)
│   │   └── layout.css        پوسته برنامه، سایدبار، تاپ‌بار، نوار وظیفه، پنجره‌ها
│   ├── js/
│   │   ├── icons.js          ۱۶۹ آیکون SVG (بر پایه Lucide — مجوز ISC)
│   │   ├── data.js           ★ داده‌های نمایشی و مدل منوی سایدبار
│   │   ├── app.js            هسته: تم، توست، مودال، دراور، نمودار، جدول، پالت فرمان
│   │   └── windows.js        مدیر پنجره‌ها (درگ، تغییر اندازه، ماکسیمایز، اسنپ)
│   ├── fonts/                وزیرمتن (Variable + وزن‌های اصلی) + مجوز OFL
│   └── img/                  لوگو و فاوآیکون SVG
│
└── صفحه‌ها (۳۶ فایل HTML در ریشه پروژه)
```

---

## فهرست صفحه‌ها

| گروه | صفحه‌ها |
| --- | --- |
| ورود به قالب | `index.html` (فهرست کامل صفحه‌ها و پیش‌نمایش زنده) |
| عمومی | `dashboard.html` `desktop.html` `activity.html` `calendar.html` `notifications.html` `search.html` |
| مشتریان و فروش | `customers.html` `customer-new.html` `customer-profile.html` `pipeline.html` `deals.html` `products.html` |
| مالی و گزارش | `invoices.html` `print-invoice.html` `reports.html` |
| پشتیبانی | `tickets.html` `ticket-new.html` `messages.html` `kb.html` `help.html` |
| احراز هویت | `login.html` `register.html` `forgot-password.html` `reset-password.html` `otp.html` `change-password.html` `lock.html` |
| مدیریت | `users.html` `settings.html` `profile.html` `design-system.html` |
| خطاها | `403.html` `404.html` `500.html` `maintenance.html` |

---

## چگونه کار می‌کند؟

### ۱) پوسته‌ی مشترک (سایدبار، تاپ‌بار، نوار وظیفه)

هر صفحه فقط این ساختار را دارد و بقیه با JavaScript ساخته می‌شود:

```html
<body class="app" data-page="customers">
  <div class="app-shell" id="appShell">
    <aside class="sidebar" id="sidebar"></aside>
    <div class="main">
      <header class="topbar" id="topbar"></header>
      <main class="content"><div class="page-wrap"> … محتوای صفحه … </div></main>
    </div>
  </div>

  <div class="win-layer" id="winLayer"></div>
  <div class="start-menu" id="startMenu"></div>
  <footer class="taskbar" id="taskbar"></footer>
  <div class="toast-wrap" id="toastWrap"></div>

  <script src="assets/js/icons.js"></script>
  <script src="assets/js/data.js"></script>
  <script src="assets/js/app.js"></script>
  <script src="assets/js/windows.js"></script>
</body>
```

- `data-page` مشخص می‌کند کدام آیتم سایدبار فعال باشد.
- منوی سایدبار از آرایه‌ی `CRM_DATA.nav` در `assets/js/data.js` ساخته می‌شود؛ برای افزودن صفحه فقط یک آیتم به همین آرایه اضافه کنید.
- برای صفحه‌های بدون پوسته (ورود، خطاها، چاپ) مقدار `data-shell="none"` روی `body` بگذارید.
- برای اینکه نوار وظیفه همیشه نمایش داده شود، `data-taskbar` را روی `body` قرار دهید (مثل `desktop.html`).

### ۲) پنجره‌های شبیه ویندوز

هر عنصری که ویژگی `data-win` داشته باشد می‌تواند به پنجره شناور تبدیل شود.
قالب به‌صورت خودکار یک دکمه ⛶ در گوشه‌ی کارت‌های دارای `data-win` تزریق می‌کند:

```html
<div class="card" data-win="kpi-revenue"
     data-win-title="درآمد این ماه"
     data-win-sub="شاخص کلیدی عملکرد"
     data-win-icon="wallet"
     data-win-size="820x520">
  … محتوای کارت (به‌صورت خودکار داخل پنجره کلون می‌شود) …
</div>
```

| ویژگی | کاربرد |
| --- | --- |
| `data-win-open="id"` | بازکردن پنجره از هر جای دیگر (مثلاً یک دکمه) |
| `data-win-close / -min / -max="id"` | کنترل پنجره از بیرون |
| `data-win-size="WxH"` | اندازه پیش‌فرض پنجره |
| `data-win-icon` | آیکون نوار عنوان |
| `data-win-content="#selector"` | استفاده از محتوای عنصر دیگری به‌جای خودِ عنصر |
| `data-win-detach` | پنهان‌کردن کارت اصلی وقتی پنجره باز است (مناسب صفحه میزکار) |
| `data-win-autoopen="800"` | بازکردن خودکار پنجره پس از ۸۰۰ میلی‌ثانیه |
| `data-win-nobtn` | این کارت دکمه ⛶ نگیرد |
| `data-win-min-all / -max-all / -tile / -close-all` | فرمان‌های گروهی روی همه پنجره‌ها (به‌صورت آماده در منوی نوار وظیفه) |

هر کارتی که «سربرگ» (`card-head`) داشته باشد **به‌صورت خودکار** پنجره‌شدنی است و دکمه ⛶ می‌گیرد؛
کارت‌های خلاصه (KPI) که سربرگ ندارند، در حالت هاور یک دکمه ⛶ گوشه‌ی کارت می‌گیرند.
برای خاموش‌کردن این رفتار در یک صفحه، `data-win-auto="off"` را روی `<body>` بگذارید
(صفحه‌های ورود و خطا و چاپ همین کار را می‌کنند).

با کلیک روی دکمه‌ی «پنجره» در نوار وظیفه، منوی پنجره‌های شناور باز می‌شود: فهرست پنجره‌های باز،
انتقال بین آن‌ها و فرمان‌های گروهی (مینیمایز همه، بیشینه همه، چیدمان کاشی، بستن همه).

امکانات: کشیدن با نوار عنوان، تغییر اندازه از ۸ جهت، مینیمایز/ماکسیمایز با دوبار کلیک،
اسنپ به لبه‌ها با کشیدن به کناره‌ها، منوی چیدمان با نگه‌داشتن نشانگر روی دکمه ماکسیمایز،
چیدمان کاشی‌ای، نوار وظیفه با دکمه‌های پنجره‌ها و منوی شروع.

### ۳) اجزای تعاملی (فقط با ویژگی داده)

```html
<!-- مودال -->
<button data-modal-open="#myModal">بازکردن</button>
<div class="overlay" id="myModal" style="display:none"> … </div>
<button data-modal-close="#myModal">بستن</button>

<!-- دراور کناری -->
<button data-drawer-open="#myDrawer">فیلترها</button>

<!-- تب‌ها -->
<div data-tabs-root>
  <div class="tabs" data-tabs>
    <button class="tab is-active" data-tab="a">تب ۱</button>
    <button class="tab" data-tab="b">تب ۲</button>
  </div>
  <div data-tab-panel="a">…</div>
  <div class="d-none" data-tab-panel="b">…</div>
</div>

<!-- نمودار -->
<div class="chart h-240" data-chart="line"
     data-values="310,342,298,415"
     data-values2="300,320,330,360"
     data-labels="فروردین,اردیبهشت,خرداد,تیر"></div>

<div data-chart="donut" data-values="42,26,18,14"
     data-center="۱۲۴" data-center-sub="مشتری"
     data-labels="معرفی,تبلیغات,نمایشگاه,تماس سرد"></div>

<div data-chart="bar"  data-values="48,36,27,19"></div>
<div data-chart="radial" data-values="78" data-label="تحقق هدف"></div>
<div data-chart="spark"  data-values="4,9,7,12,10,16"></div>

<!-- فرم نمایشی (از ارسال واقعی جلوگیری می‌کند و توست موفقیت نشان می‌دهد) -->
<form data-demo-form="پیام موفقیت" data-close-modal="#myModal" data-reset-on-submit> … </form>

<!-- تایید حذف -->
<button data-confirm="این آیتم حذف شود؟">حذف</button>
```

سایر ویژگی‌ها: `data-table-search="#tableId"`، `data-select-all`، `data-row-check`،
`data-sort` روی سرستون‌ها، `data-chip-group`، `data-segmented`، `data-otp`،
`data-password-toggle`، `data-strength-for="#input"`، `data-counter="1248"`،
`data-icon="users"`، `data-kbd`… و پالت فرمان با <kbd>Ctrl</kbd> + <kbd>K</kbd>.

### ۴) تغییر هویت بصری (رنگ، فونت، اندازه)

همه‌ی متغیرها در `assets/css/tokens.css` تعریف شده‌اند:

```css
:root {
  --brand-600: #059669;   /* رنگ اصلی برند */
  --brand-500: #10b981;
  --radius: 13px;         /* گردی گوشه‌ها */
  --sidebar-w: 264px;     /* عرض سایدبار */
  --font: "Vazirmatn", …;
}
html[data-theme="dark"] { --brand: var(--brand-400); … }
```

برای تغییر رنگ برند کافی است مقادیر `--brand-*` را عوض کنید؛ دکمه‌ها، نمودارها،
سایدبار و حالت تیره همه به‌صورت خودکار هماهنگ می‌شوند.

### ۵) اتصال به بک‌اند

داده‌های نمایشی در `assets/js/data.js` هستند (`CRM_DATA.customers`, `CRM_DATA.deals`, …).
برای اتصال واقعی فقط همان‌جا را با فراخوانی API خود جایگزین کنید:

```js
// نمونه: جایگزینی داده نمایشی با داده سرور
fetch('/api/customers').then(r => r.json()).then(rows => {
  CRM_DATA.customers = rows;
  // سپس رندر جدول/کارت‌ها را دوباره اجرا کنید
});
```

ساختار HTML و کلاس‌ها ثابت است؛ نیازی به تغییر مارک‌آپ صفحات نیست.

---

## نکات فنی

- **بدون وابستگی:** هیچ CDN، jQuery، Bootstrap، Chart.js یا آیکون‌فونت خارجی استفاده نشده است.
- **آیکون‌ها:** `Icons.svg('users', { size: 20, cls: '...' })` یا در HTML با `data-icon="users"`.
- **اعداد و تاریخ:** `CRM.num(1248000)`، `CRM.money(486500000)`، `CRM.jDate(new Date())`، `CRM.jLong(...)`.
- **پیام شناور:** `CRM.toast({ type: 'success', title: '…', msg: '…' })`.
- **مودال از JS:** `CRM.modal.confirm({ title: '…', msg: '…' }).then(ok => …)`.
- **دسترس‌پذیری:** ویژگی‌های `aria-*`، فوکوس قابل مشاهده با کیبورد و احترام به `prefers-reduced-motion`.
- **چاپ:** صفحات فاکتور، فهرست‌ها و کارت‌ها با `@media print` بهینه شده‌اند.

## مجوزها

- فونت وزیرمتن: مجوز **OFL** — فایل `assets/fonts/Vazirmatn-OFL.txt`
- آیکون‌ها بر پایه **Lucide** با مجوز **ISC** — فایل `assets/icons-LICENSE.txt`
- کد قالب: آزاد برای استفاده در پروژه‌های شخصی و تجاری.
