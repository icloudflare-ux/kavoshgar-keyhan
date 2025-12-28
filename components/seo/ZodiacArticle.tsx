
import React from 'react';
import Card from '../common/Card';

const ZodiacArticle: React.FC = () => {
    const handleCTAClick = () => {
        const calculatorSection = document.getElementById('calculator');
        if (calculatorSection) {
            calculatorSection.scrollIntoView({ behavior: 'smooth' });
            // A slight delay to allow for scrolling before highlighting
            setTimeout(() => {
                const horoscopeButton = document.querySelector('button[aria-label="زایچه (هوروسکوپ)"]');
                if (horoscopeButton) {
                    (horoscopeButton as HTMLElement).click();
                }
            }, 800);
        }
    };
    
    return (
        <article id="zodiac-leo-article" aria-labelledby="leo-main-title">
            <Card className="!p-0 overflow-hidden">
                <div className="p-8 md:p-12 prose prose-lg prose-invert max-w-none font-tanha leading-loose space-y-6 prose-headings:font-lalezar prose-headings:tracking-wider prose-headings:text-amber-300 prose-h2:text-4xl prose-h3:text-3xl prose-strong:text-amber-200">
                    <h1 id="leo-main-title" className="!text-5xl md:!text-6xl font-lalezar text-center !text-amber-400">
                        {"طالع‌بینی برج اسد (Leo): کاوش در قلمرو پادشاهی خورشید"}
                    </h1>
                    
                    <section aria-labelledby="leo-intro-title">
                        <h2 id="leo-intro-title">{"مقدمه: درخشش پادشاه آسمان"}</h2>
                        <p>{"در قلب تابستان، زمانی که خورشید با تمام قدرت می‌تابد، قلمرو برج اسد آغاز می‌شود. پنجمین برج از دایره زودیاک، تحت حاکمیت قدرتمندترین جرم آسمانی یعنی خورشید قرار دارد. اسد، که با نماد شیر شناخته می‌شود، تجسمی از شکوه، قدرت، اعتماد به نفس و خلاقیت است. اسطوره‌های باستانی، این برج را با قهرمانانی چون هرکول و ایزدان خورشیدی پیوند می‌دهند. درک ویژگی‌های برج اسد، به معنای کاوش در انرژی حیاتی، اراده و نیازی است که برای درخشش و دیده شدن در هر انسانی وجود دارد."}</p>
                    </section>
                    
                    <section aria-labelledby="leo-specs-title">
                        <h2 id="leo-specs-title">{"شناسنامه نجومی برج اسد"}</h2>
                        <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-4 text-center my-8">
                            {[{icon: '🔥', title: 'عنصر', value: 'آتش'}, {icon: '☀️', title: 'سیاره حاکم', value: 'خورشید'}, {icon: '🪙', title: 'فلز خوش‌شانسی', value: 'طلا'}, {icon: '💎', title: 'سنگ خوش‌شانسی', value: 'یاقوت سرخ'}].map(item => (
                                <div key={item.title} className="bg-slate-800/50 p-4 rounded-lg">
                                    <p className="text-4xl">{item.icon}</p>
                                    <p className="font-bold text-gray-400 mt-2">{item.title}</p>
                                    <p className="text-lg text-white">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section aria-labelledby="leo-personality-title">
                        <h2 id="leo-personality-title">{"تحلیل شخصیت: ویژگی‌های متولدین اسد"}</h2>
                        <p>{"شخصیت متولدین اسد، بازتابی از خورشید است: درخشان، گرم، بخشنده و مرکز توجه. آن‌ها رهبرانی ذاتی هستند که با اعتماد به نفس و اراده قوی خود، دیگران را جذب می‌کنند. درک چارت تولد برج اسد به ما نشان می‌دهد که چگونه این انرژی خورشیدی در جنبه‌های مختلف زندگی فرد تجلی می‌یابد."}</p>
                        
                        <h3 id="leo-men-title">{"مرد متولد اسد: پادشاهی با قلبی بزرگ"}</h3>
                        <ul>
                            <li><strong>{"نقاط قوت:"}</strong> {"بسیار دست و دلباز، وفادار، دارای اعتماد به نفس بالا و حامی قدرتمند عزیزانش است. او یک رهبر طبیعی است که دوست دارد در مرکز توجه باشد و از تحسین دیگران انرژی می‌گیرد."}</li>
                            <li><strong>{"نقاط ضعف:"}</strong> {"غرور و خودمحوری او گاهی به استبداد رأی تبدیل می‌شود. نیاز شدید به تأیید شدن ممکن است او را آسیب‌پذیر کند و تحمل انتقاد برایش دشوار است."}</li>
                        </ul>
                        
                        <h3 id="leo-women-title">{"زن متولد اسد: ملکه‌ای باوقار و خلاق"}</h3>
                        <ul>
                            <li><strong>{"نقاط قوت:"}</strong> {"بسیار باوقار، خلاق، اجتماعی و خونگرم است. او به ظاهر خود اهمیت زیادی می‌دهد و دوست دارد بدرخشد. در عشق، بسیار وفادار و پرشور است و از شریک عاطفی خود حمایت کامل می‌کند."}</li>
                            <li><strong>{"نقاط ضعف:"}</strong> {"ممکن است کمی سلطه‌جو و پرتوقع باشد. اگر به او بی‌توجهی شود، به شدت آزرده خاطر می‌شود. گاهی اوقات دراماتیک عمل می‌کند تا توجهات را به خود جلب کند."}</li>
                        </ul>
                    </section>

                    <section aria-labelledby="leo-love-title">
                        <h2 id="leo-love-title">{"روابط و عشق: چه کسانی قلب شیر را تسخیر می‌کنند؟"}</h2>
                        <p>{"برای یک اسد، عشق یک نمایش پرشور و باشکوه است. آن‌ها به دنبال شریکی هستند که نه تنها آن‌ها را تحسین کند، بلکه بتواند پا به پای انرژی و اشتیاقشان حرکت کند."}</p>
                        <ul>
                            <li><strong>{"بهترین سازگاری:"}</strong> {"برج‌های آتشین دیگر مانند <strong>حمل (Aries)</strong> و <strong>قوس (Sagittarius)</strong> هیجان و شور زندگی را با او به اشتراک می‌گذارند. برج‌های هوایی مانند <strong>جوزا (Gemini)</strong> و <strong>میزان (Libra)</strong> نیز با هوش و جذابیت اجتماعی خود، اسد را مجذوب می‌کنند."}</li>
                            <li><strong>{"سازگاری چالش‌برانگیز:"}</strong> {"برج‌های ثابت دیگر مانند <strong>ثور (Taurus)</strong> و <strong>عقرب (Scorpio)</strong> به دلیل لجاجت و اراده قوی، ممکن است وارد جنگ قدرت با اسد شوند. همچنین برج <strong>دلو (Aquarius)</strong>، نقطه مقابل اسد، می‌تواند هم یک جاذبه قدرتمند و هم یک تضاد بزرگ را تجربه کند."}</li>
                        </ul>
                    </section>
                    
                    <section aria-labelledby="leo-career-title">
                        <h2 id="leo-career-title">{"شغل و ثروت: صحنه نمایش استعدادها"}</h2>
                        <p>{"متولدین اسد در مشاغلی می‌درخشند که به آن‌ها اجازه رهبری، خلاقیت و دیده شدن بدهد. آن‌ها از پذیرش مسئولیت نمی‌ترسند و دوست دارند در کانون توجه باشند. بررسی دقیق چارت تولد برج اسد می‌تواند مسیرهای شغلی دقیق‌تری را آشکار سازد."}</p>
                        <p><strong>{"مشاغل مناسب:"}</strong> {"مدیریت، بازیگری، کارگردانی، طراحی مد، کارآفرینی، سیاست، وکالت و هر شغلی که به سخنرانی در جمع و رهبری نیاز دارد."}</p>
                    </section>

                    <section aria-labelledby="leo-cta-title" className="!mt-16">
                        <div className="not-prose bg-gradient-to-tr from-indigo-900 via-slate-900 to-purple-900 p-8 rounded-2xl text-center border-2 border-amber-400/50 shadow-2xl shadow-purple-900/50">
                             <h2 id="leo-cta-title" className="!text-3xl md:!text-4xl !text-amber-300">{"از کلیات فراتر بروید!"}</h2>
                             <p className="text-xl text-gray-300 mt-4 mb-6">{"این تحلیل‌ها کلی هستند. آیا می‌خواهید بدانید خورشید دقیقاً در کدام درجه از طالع شما می‌درخشیده و چه زوایای پنهانی با ماه و سیارات دیگر ساخته است؟ جایگاه دقیق سیارات در چارت تولد شما، داستان منحصربه‌فردتان را آشکار می‌کند."}</p>
                             <button onClick={handleCTAClick} className="btn-animated-gradient text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 font-tanha shadow-lg shadow-indigo-500/40 hover:shadow-indigo-400/60 text-xl tracking-wider">
                                {"محاسبه چارت تولد اختصاصی"}
                             </button>
                        </div>
                    </section>

                </div>
            </Card>
        </article>
    );
};

export default ZodiacArticle;
