import React from 'react';
// FIX: Import 'Variants' to correctly type the animation variants.
import { motion, Variants } from 'framer-motion';
import { Hub } from '../../App';
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

// FIX: Explicitly type 'itemVariants' as 'Variants' to ensure TypeScript correctly interprets the animation properties, such as 'transition.type'.
const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

const CosmicHubs: React.FC<{ onHubSelect: (hub: Hub) => void }> = ({ onHubSelect }) => {
    return (
        <section id="hubs">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
                {hubs.map(hub => (
                    <motion.div
                        key={hub.id}
                        variants={itemVariants}
                        className="h-full"
                    >
                        <div
                            onClick={() => onHubSelect(hub.id)}
                            className={`bg-slate-900/40 backdrop-blur-xl border ${hub.borderColor} rounded-2xl p-8 flex flex-col h-full cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:border-white/50 shadow-2xl shadow-black/40 ${hub.shadowColor}`}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                {hub.icon}
                                <h3 className="font-lalezar text-3xl text-white">{hub.title}</h3>
                            </div>
                            <p className="font-tanha text-gray-300 leading-relaxed flex-grow">{hub.description}</p>
                            <div className="mt-6 font-bold text-lg text-white group-hover:text-amber-300 transition-colors">
                                {"ورود به بخش →"}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default CosmicHubs;
