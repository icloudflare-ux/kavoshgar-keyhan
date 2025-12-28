
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Card from './common/Card';
import { qamarDarAghrabData } from '../data/qamarDarAghrabData';
import { useTimeZone } from '../contexts/TimeZoneContext';
import useUnlockOnScroll from '../hooks/useUnlockOnScroll';

type CalculationMethod = 'constellation' | 'sign';

const QamarDarAghrabSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    useUnlockOnScroll(sectionRef, 'animal_instincts');

    const { formattedTimeZone } = useTimeZone();
    const [now, setNow] = useState(new Date());
    const [method, setMethod] = useState<CalculationMethod>('constellation');

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    const events = useMemo(() => {
        return qamarDarAghrabData[method];
    }, [method]);

    const currentEvent = useMemo(() => {
        const nowTime = now.getTime();
        return events.find(event => {
            const startTime = new Date(event.start).getTime();
            const endTime = new Date(event.end).getTime();
            return nowTime >= startTime && nowTime <= endTime;
        });
    }, [now, events]);

    const upcomingEvents = useMemo(() => {
        const nowTime = now.getTime();
        return events
            .filter(event => new Date(event.end).getTime() > nowTime)
            .slice(0, 5); // Show next 5 events
    }, [now, events]);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('fa-IR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: formattedTimeZone,
        });
    };

     const formatTime = (date: Date) => {
        return date.toLocaleTimeString('fa-IR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: formattedTimeZone,
        });
    };
    
    const MethodButton: React.FC<{ value: CalculationMethod; label: string }> = ({ value, label }) => (
        <button
            onClick={() => setMethod(value)}
            className={`w-full py-3 px-4 rounded-lg text-lg font-semibold transition-all duration-300 border-2 ${method === value ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-800/60 border-slate-700 hover:bg-slate-700/80'}`}
        >
            {label}
        </button>
    );

    return (
        <section id="qamar-dar-aghrab" ref={sectionRef} role="region" aria-labelledby="qamar-title">
            <h3 id="qamar-title" className="text-4xl md:text-5xl font-bold text-center mb-6 font-lalezar tracking-wider bg-gradient-to-r from-purple-400 to-red-500 text-transparent bg-clip-text">
                {"قمر در عقرب"}
            </h3>
            <p className="text-center text-gray-400 mb-12 max-w-4xl mx-auto font-tanha text-lg leading-relaxed">
                {"در نجوم سنتی، زمانی که ماه در برج یا صورت فلکی عقرب قرار می‌گیرد، به دلیل نحس بودن این برج، از انجام کارهای مهم مانند ازدواج، شروع کسب و کار و سفر پرهیز می‌شود. در این بخش می‌توانید وضعیت فعلی و زمان‌های آینده را بررسی کنید."}
            </p>

            <Card>
                <div className="max-w-3xl mx-auto mb-12">
                    <h4 className="text-xl font-lalezar text-center text-gray-200 mb-4">{"روش محاسبه"}</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <MethodButton value="constellation" label={"بر اساس صورت فلکی (رصدی)"} />
                        <MethodButton value="sign" label={"بر اساس برج فلکی ( tropical )"} />
                    </div>
                    <div className="text-center mt-4">
                        <span className="text-sm text-indigo-300 font-tanha border border-indigo-500/30 px-3 py-1 rounded-full bg-indigo-900/20">
                            {"منطقه زمانی"}: {formattedTimeZone}
                        </span>
                    </div>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Current Status */}
                    <div>
                        <h4 className="text-2xl font-lalezar text-center text-indigo-300 mb-6">{"وضعیت فعلی"}</h4>
                        {currentEvent ? (
                            <div className="bg-red-900/30 border-2 border-red-500/50 rounded-2xl p-8 text-center animate-fade-in shadow-2xl shadow-red-500/20">
                                <div className="text-7xl mb-4 animate-pulse">🦂</div>
                                <h5 className="text-3xl font-bold text-red-400 font-lalezar">{"قمر در عقرب است"}</h5>
                                <p className="text-gray-300 mt-4 font-tanha text-lg">
                                    {"این وضعیت تا زمان زیر ادامه دارد:"}
                                    <br/>
                                    <span className="font-bold text-white font-roboto-mono block mt-2 text-xl">
                                       {formatDate(new Date(currentEvent.end))} - {"ساعت"} {formatTime(new Date(currentEvent.end))}
                                    </span>
                                </p>
                            </div>
                        ) : (
                            <div className="bg-green-900/20 border-2 border-green-500/30 rounded-2xl p-8 text-center animate-fade-in shadow-2xl shadow-green-500/10">
                                <div className="text-7xl mb-4">✅</div>
                                <h5 className="text-3xl font-bold text-green-400 font-lalezar">{"قمر در عقرب نیست"}</h5>
                                <p className="text-gray-300 mt-2 font-tanha text-lg">{"انجام امور بلامانع است."}</p>
                            </div>
                        )}
                    </div>

                    {/* Upcoming Events */}
                    <div>
                        <h4 className="text-2xl font-lalezar text-center text-indigo-300 mb-6">{"زمان‌های آینده"}</h4>
                        <div className="space-y-4">
                            {upcomingEvents.length > 0 ? (
                                upcomingEvents.map((event, index) => (
                                    <div key={index} className="bg-slate-800/60 p-4 rounded-lg border-l-4 border-purple-500">
                                        <div className="font-tanha">
                                            <p className="font-bold text-lg text-purple-300">
                                               {"از"} {formatDate(new Date(event.start))} ({"ساعت"} {formatTime(new Date(event.start))})
                                            </p>
                                            <p className="text-gray-300">
                                               {"تا"} {formatDate(new Date(event.end))} ({"ساعت"} {formatTime(new Date(event.end))})
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-400 font-tanha">{"هیچ رویداد قمر در عقربی برای آینده نزدیک ثبت نشده است."}</p>
                            )}
                        </div>
                    </div>
                </div>

                 {/* Additional Info Section */}
                <div className="mt-16 pt-10 border-t border-slate-700/50 space-y-12">
                    <div className="bg-slate-800/40 p-6 rounded-lg">
                        <h4 className="text-2xl font-lalezar text-amber-400 mb-3">{"تفاوت دو روش محاسبه"}</h4>
                        <p className="font-tanha text-gray-300 leading-relaxed">
                            روش <strong>«بر اساس صورت فلکی»</strong> به موقعیت واقعی ماه در آسمان و در میان ستارگان صورت فلکی عقرب اشاره دارد که یک محدوده نامنظم است. این روش به نجوم رصدی نزدیک‌تر است. روش <strong>«بر اساس برج فلکی»</strong> به تقسیم‌بندی دوازده‌گانه و مساوی منطقةالبروج (دایره البروج) مربوط است که در طالع‌بینی غربی (Tropical) استفاده می‌شود. هر دو روش در سنت نجومی معتبر بوده و استفاده می‌شوند.
                        </p>
                    </div>
                    <div className="bg-slate-800/40 p-6 rounded-lg">
                        <h4 className="text-2xl font-lalezar text-red-400 mb-3">{"اعمال مکروه در قمر در عقرب"}</h4>
                         <ul className="list-disc list-inside space-y-2 text-gray-300 font-tanha">
                            <li>{"عقد و ازدواج"}</li>
                            <li>{"شروع کسب و کار و تجارت مهم"}</li>
                            <li>{"آغاز سفر (به خصوص سفرهای طولانی و مهم)"}</li>
                            <li>{"شروع ساختمان‌سازی"}</li>
                            <li>{"انعقاد قراردادهای اساسی"}</li>
                        </ul>
                    </div>
                    <div className="bg-slate-800/40 p-6 rounded-lg">
                        <h4 className="text-2xl font-lalezar text-green-400 mb-3">{"رفع نحوست"}</h4>
                        <p className="font-tanha text-gray-300 leading-relaxed">{"اگر مجبور به انجام کاری در این ایام هستید، دادن <strong>صدقه</strong> و خواندن <strong>آیةالکرسی</strong> برای رفع نحوست آن بسیار توصیه شده است."}</p>
                    </div>
                </div>
            </Card>
        </section>
    );
};

export default QamarDarAghrabSection;