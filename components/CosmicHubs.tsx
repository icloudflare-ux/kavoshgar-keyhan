import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Hub } from '../App';
import { BarChart3, FlaskConical, Library } from 'lucide-react';

interface HubInfo {
    id: Hub;
    title: string;
    description: string;
    icon: React.ReactNode;
    borderColor: string;
    shadowColor: string;
}

const hubs: HubInfo[] = [
    {
        id: 'control_room',
        title: 'اتاق فرمان کیهانی',
        description: 'رصد زنده بازار و دریافت سیگنال‌های معاملاتی بر اساس انرژی لحظه‌ای سیارات و فاز ماه.',
        icon: <BarChart3 size={40} className="text-cyan-300" />,
        borderColor: 'border-cyan-400/50',
        shadowColor: 'hover:shadow-cyan-500/20',
    },
    {
        id: 'laboratory',
        title: 'آزمایشگاه اسرار',
        description: 'کاوش در دنیای درون با ابزارهای محاسباتی شخصی. از تحلیل چارت تولد تا کشف نام قرین.',
        icon: <FlaskConical size={40} className="text-purple-300" />,
        borderColor: 'border-purple-400/50',
        shadowColor: 'hover:shadow-purple-500/20',
    },
    {
        id: 'wisdom_treasury',
        title: 'گنجینه حکمت',
        description: 'سفر در تاریخ، یادگیری مفاهیم عمیق نجومی و دسترسی به کتابخانه جامع مقالات و پادکست‌ها.',
        icon: <Library size={40} className="text-amber-300" />,
        borderColor: 'border-amber-400/50',
        shadowColor: 'hover:shadow-amber-500/20',
    }
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2, delayChildren: 0.2 }
    }
};

const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

const CosmicHubs: React.FC<{ onHubSelect: (hub: Hub) => void }> = ({ onHubSelect }) => {
    return (
        <section id="hubs" className="py-20 px-4 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="font-lalezar text-4xl text-white mb-4">مرکز هدایت کیهانی</h2>
                <p className="font-tanha text-gray-400">مسیر خود را انتخاب کنید</p>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-8 rtl"
            >
                {hubs.map(hub => (
                    <motion.div
                        key={hub.id}
                        variants={itemVariants}
                        className="h-full group"
                    >
                        <div
                            onClick={() => onHubSelect(hub.id)}
                            className={`bg-slate-900/60 backdrop-blur-2xl border-2 ${hub.borderColor} rounded-3xl p-8 flex flex-col h-full cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:border-white/40 shadow-2xl ${hub.shadowColor}`}
                        >
                            <div className="flex flex-col items-start gap-6 mb-6">
                                <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/10">
                                    {hub.icon}
                                </div>
                                <h3 className="font-lalezar text-3xl text-white group-hover:text-amber-300 transition-colors">
                                    {hub.title}
                                </h3>
                            </div>

                            <p className="font-tanha text-gray-300 text-lg leading-loose mb-8">
                                {hub.description}
                            </p>

                            <div className="mt-auto flex items-center gap-2 font-bold text-xl text-indigo-300 group-hover:text-amber-400 transition-all">
                                <span>ورود به بخش</span>
                                <span>←</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default CosmicHubs;