# کاوشگر کیهان (Celestial Explorer)

وب‌اپلیکیشن React، TypeScript و Vite برای ابزارهای نجومی و محتوای آموزشی فارسی.

## اجرای محلی

پیش‌نیاز: Node.js 22 یا جدیدتر.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

مقادیر `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY` را در `.env.local` تنظیم کنید. بدون آن‌ها رابط استاتیک نمایش داده می‌شود، ولی ورود فعال نیست. فقط کلید publishable/anon را در متغیرهای `VITE_*` بگذارید؛ این متغیرها عمومی و داخل فایل مرورگر هستند. کلید service-role هرگز نباید وارد مرورگر شود.

```sh
npm run typecheck   # بررسی TypeScript برنامه، API و تنظیمات Vite
npx vitest run     # اجرای یک‌باره تست‌ها
npm run build     # بررسی نوع‌ها و ساخت خروجی dist
```

`npm run dev` فقط Vite را اجرا می‌کند؛ برای اجرای `/api/*` از محیط توسعه Vercel (`vercel dev`) استفاده کنید. Vite به‌تنهایی API را اجرا نمی‌کند.

## استقرار کامل روی Vercel

پوشهٔ ریشه پروژه را deploy کنید و دستور build را `npm run build` و خروجی را `dist` بگذارید. متغیرهای محیطی:

- عمومی: `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY`
- فقط سرور: `GEMINI_API_KEY`، `TELEGRAM_BOT_TOKEN` و `TELEGRAM_CHAT_ID`
- اختیاری سرور: `GEMINI_MODEL` (پیش‌فرض: `gemini-3-flash-preview`؛ دسترسی مدل را در پروژه خود بررسی کنید)

Gemini از `/api/gemini` فراخوانی می‌شود و SDK و کلید آن در خروجی مرورگر نیستند. هر دو API توکن Supabase را با `auth.getUser` روی سرور اعتبارسنجی می‌کنند:

- Gemini نیاز به `app_metadata.subscription = "premium"` یا `app_metadata.role = "admin"` دارد.
- ارسال تلگرام فقط برای `app_metadata.role = "admin"` مجاز است.

این ویژگی‌ها را فقط از یک محیط مدیریتی امن Supabase تعیین کنید، نه `user_metadata` یا مرورگر. بعد از تغییر نقش، نشست کاربر را تازه کنید. دکمه‌های پرداخت فعلاً اطلاعاتی هستند و دسترسی پولی را فعال نمی‌کنند؛ فعال‌سازی خودکار به درگاه پرداخت و webhook معتبر سرور نیاز دارد.

**پیش از انتشار عمومی:** کلید Gemini و توکن تلگرام قبلاً در سورس بوده‌اند؛ آن‌ها را در سرویس مربوطه باطل و جایگزین کنید. حذف از سورس، تاریخچه Git یا کلید فعال را پاک نمی‌کند. تنظیم RLS روی همهٔ جدول‌های Supabase، محدودیت هزینه و نرخ درخواست API (با ذخیره‌سازی اشتراکی یا WAF) نیز ضروری است. این مخزن درگاه پرداخت، quota توزیع‌شده یا migrationهای RLS ارائه نمی‌کند.

## GitHub Pages: فقط رابط استاتیک

Pages توابع سرور را اجرا نمی‌کند؛ Gemini و ارسال تلگرام در آن فعال نیستند. برای اجرای کامل از Vercel استفاده کنید.

```sh
VITE_BASE=/kavoshgar-keyhan/ npm run build
```

workflow موجود تست‌ها و build را اجرا می‌کند و در push به `main` رابط استاتیک را روی Pages منتشر می‌کند. در Settings → Pages، منبع را GitHub Actions انتخاب کنید. متغیرهای عمومی Supabase را در secrets مخزن با نام‌های `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY` قرار دهید؛ کلید Gemini یا تلگرام برای build استاتیک لازم نیست.

## ساختار و محدودیت‌ها

- ورودی فعال `index.tsx` و `App.tsx` در ریشه است؛ درخت تکراری `src/` حذف شده است.
- ترجمهٔ موجود فارسی در `public/locales/fa/common.json` است. زبان‌های بدون ترجمه به‌عنوان زبان پشتیبانی‌شده اعلام نمی‌شوند.
- پخش متن کتابخانه از Speech Synthesis مرورگر استفاده می‌کند؛ فایل صوتی ضبط‌شده همراه پروژه نیست و صدای فارسی به مرورگر/سیستم‌عامل بستگی دارد.
- بعضی محاسبات نجومی هنوز تخمینی یا دادهٔ نمایشی هستند (`services/astrologyEngine.ts`، `hooks/useAstrologyData.ts`). اصلاح build و تست‌ها به‌معنای اعتبارسنجی علمی یا مناسب‌بودن سیگنال‌ها برای تصمیم مالی نیست.
