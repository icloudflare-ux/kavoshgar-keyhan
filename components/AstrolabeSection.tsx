import React, { useRef } from 'react';
import Card from './common/Card';
import useUnlockOnScroll from '../hooks/useUnlockOnScroll';

const AstrolabeSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useUnlockOnScroll(sectionRef, 'agricultural_astrology');

  return (
    <section id="astrolabe" ref={sectionRef} role="region" aria-labelledby="astrolabe-title">
      <h3 id="astrolabe-title" className="text-4xl md:text-5xl font-bold text-center mb-12 font-lalezar tracking-wider bg-gradient-to-r from-amber-400 to-yellow-600 text-transparent bg-clip-text">
        {"اسطرلاب: کامپیوتر باستانی آسمان"}
      </h3>
      <Card>
        <div className="prose prose-lg prose-invert max-w-none text-gray-300 prose-p:my-4 prose-headings:text-amber-300 leading-relaxed font-tanha prose-headings:font-lalezar prose-headings:tracking-wider prose-headings:text-2xl">
          <p>{"اسطرلاب یکی از پیچیده‌ترین و زیباترین ابزارهای علمی تاریخ است که توسط منجمان یونانی اختراع و در تمدن اسلامی به اوج کمال خود رسید. این ابزار، یک مدل دو بعدی از آسمان است که به کاربر اجازه می‌دهد تا موقعیت اجرام آسمانی را محاسبه کرده و مسائل مختلفی را حل کند."}</p>

          <h4 className="!text-amber-200 mt-8">{"کاربردهای اسطرلاب"}</h4>
          <p>{"یک منجم ماهر با استفاده از اسطرلاب می‌توانست ده‌ها محاسبه مختلف را انجام دهد. برخی از مهم‌ترین کاربردهای آن عبارتند از:"}</p>

          <h5>{"محاسبات نجومی"}</h5>
          <p>{"اسطرلاب برای پیدا کردن موقعیت خورشید، ماه و ستارگان در هر زمان از شبانه‌روز استفاده می‌شد. اجزای اصلی آن برای این کار عبارتند از:"}</p>
          <ul className="list-disc list-inside space-y-3">
            <li><strong>{"صفیحه (Plate):"}:</strong> {"یک صفحه فلزی که خطوط افق، ارتفاع و سمت برای یک عرض جغرافیایی خاص روی آن حک شده است."}</li>
            <li><strong>{"عنکبوت (Rete):"}:</strong> {"یک شبکه متحرک که موقعیت ستارگان درخشان را نشان می‌دهد و روی صفیحه می‌چرخد."}</li>
            <li><strong>{"عضاده (Alidade):"}:</strong> {"یک خط‌کش متحرک در پشت اسطرلاب برای اندازه‌گیری ارتفاع اجرام آسمانی."}</li>
          </ul>

          <h5>{"محاسبات زمانی و دینی"}</h5>
          <p>{"با اندازه‌گیری ارتفاع خورشید، می‌توانستند زمان دقیق روز را مشخص کنند. همچنین برای تعیین اوقات شرعی (مانند زمان نماز) و جهت قبله نیز کاربرد داشت."}</p>

          <h5>{"طالع‌بینی (Astrology)"}</h5>
          <p>{"یکی از کاربردهای اصلی اسطرلاب در گذشته، استخراج نمودار تولد یا «زایچه» بود. منجمان با تنظیم اسطرلاب برای تاریخ و زمان تولد یک فرد، می‌توانستند وضعیت آسمان و موقعیت سیارات را در آن لحظه مشخص کرده و طالع فرد را تحلیل کنند."}</p>
          
          <h4 className="!text-amber-200 mt-8">{"اهمیت تاریخی و فرهنگی"}</h4>
          <ul className="list-disc list-inside space-y-3">
            <li><strong>{"نماد علم:"}:</strong> {"اسطرلاب در جهان اسلام به نمادی از حکمت و دانش پیشرفته تبدیل شد و داشتن آن نشانه فضل و مهارت بود."}</li>
            <li><strong>{"انتقال دانش:"}:</strong> {"این ابزار، دانش نجومی را از یونان به تمدن اسلامی و سپس به اروپای قرون وسطی منتقل کرد و نقش مهمی در رنسانس علمی اروپا داشت."}</li>
            <li><strong>{"هنر و صنعت:"}:</strong> {"اسطرلاب‌ها اغلب با دقت و ظرافت بسیار بالایی ساخته می‌شدند و نمونه‌های باقی‌مانده از آن‌ها شاهکارهای هنری و صنعتی به شمار می‌روند."}</li>
          </ul>

          <p className="font-semibold text-center mt-8 !text-indigo-300">
            {"اسطرلاب نه تنها یک ابزار علمی، بلکه پلی بین آسمان و زمین، و پیوندی میان علم، هنر و معنویت بود."}
          </p>
        </div>
      </Card>
    </section>
  );
};

export default AstrolabeSection;
