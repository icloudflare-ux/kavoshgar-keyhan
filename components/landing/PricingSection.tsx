
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const PricingCard: React.FC<{ plan: any; isFeatured: boolean }> = ({ plan, isFeatured }) => {
    const { openSubscriptionModal, openAuthModal, isAuthenticated } = useAuth();
    
    const handleCTAClick = () => {
        if(isFeatured) {
            if (isAuthenticated) {
                openSubscriptionModal();
            } else {
                openAuthModal();
            }
        } else {
            openAuthModal();
        }
    };

    return (
        <motion.div
            className={`p-8 rounded-3xl border h-full flex flex-col relative overflow-hidden ${isFeatured ? 'bg-amber-950/30 border-amber-400' : 'bg-slate-800/40 border-purple-500/20'}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: isFeatured ? 0.2 : 0 }}
        >
            {isFeatured && (
                <>
                    <motion.div 
                        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0_340deg,gold_360deg)]"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    />
                    <div className="absolute top-6 right-6 font-bold text-amber-300 bg-amber-500/20 py-1 px-4 rounded-full">{"پیشنهاد ویژه"}</div>
                </>
            )}
            <div className="relative z-10 flex flex-col h-full">
                <h3 className="font-lalezar text-4xl text-center mb-2">{plan.name}</h3>
                <p className={`font-tanha text-lg text-center ${isFeatured ? 'text-amber-200' : 'text-gray-400'}`}>{plan.subtitle}</p>
                <div className="my-8 text-center">
                    <span className="font-lalezar text-7xl">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                </div>
                <ul className="space-y-4 font-tanha text-lg flex-grow">
                    {plan.features.map((f: any, i: number) => (
                        <li key={i} className={`flex items-start ${f.included ? 'text-gray-200' : 'text-gray-500 line-through'}`}>
                            <span className={`ml-3 mt-1 flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full ${f.included ? 'bg-green-500/30 text-green-400' : 'bg-gray-700/50 text-gray-500'}`}>✓</span>
                            {f.text}
                        </li>
                    ))}
                </ul>
                <button 
                    onClick={handleCTAClick}
                    className={`w-full mt-10 font-bold py-4 px-10 rounded-xl transition-transform duration-300 text-xl font-lalezar tracking-wider ${isFeatured ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:scale-105 shadow-lg shadow-amber-500/30' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
                >
                    {plan.cta}
                </button>
            </div>
        </motion.div>
    );
};

const PricingSection: React.FC = () => {
    const plans = {
        free: {
            name: "رهرو ستاره",
            subtitle: "شروع سفر کیهانی",
            price: "رایگان",
            period: "",
            cta: "ثبت‌نام کنید",
            features: [
                { text: 'محاسبه رب‌الطالع و قرین', included: true },
                { text: 'دسترسی به کتابخانه کیهانی', included: true },
                { text: 'تقویم ماهانه و ساعات سیارات', included: true },
                { text: 'تحلیل کامل زایچه (هوروسکوپ)', included: false },
                { text: 'سیگنال‌های لحظه‌ای VIP', included: false },
                { text: 'تعبیر خواب با هوش مصنوعی', included: false },
            ]
        },
        vip: {
            name: "امپراتور کیهان",
            subtitle: "تسلط کامل بر آسمان‌ها",
            price: "ویژه",
            period: "",
            cta: "ارتقا به VIP",
            features: [
                { text: 'تمام امکانات پلن رایگان', included: true },
                { text: 'تحلیل کامل زایچه (هوروسکوپ)', included: true },
                { text: 'سیگنال‌های لحظه‌ای VIP', included: true },
                { text: 'تعبیر خواب با هوش مصنوعی', included: true },
                { text: 'تحلیل پیشرفته روابط', included: true },
                { text: 'پشتیبانی ویژه', included: true },
            ]
        }
    };

    return (
        <section id="pricing">
            <h2 className="text-5xl md:text-6xl font-lalezar text-center mb-4 text-white">{"پلن اشتراک خود را انتخاب کنید"}</h2>
            <p className="text-xl text-center text-gray-400 font-tanha mb-12">{"با انتخاب پلن مناسب، به ابزارهای مورد نیاز خود دسترسی پیدا کنید."}</p>
            <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
                <PricingCard plan={plans.free} isFeatured={false} />
                <PricingCard plan={plans.vip} isFeatured={true} />
            </div>
        </section>
    );
};

export default PricingSection;
