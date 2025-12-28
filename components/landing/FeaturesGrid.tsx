
import React from 'react';
import { motion } from 'framer-motion';

const features = [
    { icon: '🕰️', title: 'ساعت کوانتومی کیهان', description: 'زمان‌بندی دقیق با ساعات سیارات برای ورود و خروج از معاملات.' },
    { icon: '💹', title: 'سیگنال‌های VIP ترید', description: 'دریافت سیگنال‌های SURE، CAUTION و AVOID بر اساس انرژی کیهانی لحظه‌ای.' },
    { icon: '🎧', title: 'پادکست‌های آموزشی', description: 'به مفاهیم پیچیده نجوم مالی در حین رانندگی یا استراحت گوش دهید.' },
    { icon: '🤖', title: 'تحلیل‌گر هوشمند Gemini', description: 'تحلیل‌های عمیق چارت تولد، روابط و تعبیر خواب با قدرت هوش مصنوعی.' },
];

const FeatureCard: React.FC<{ feature: typeof features[0]; index: number }> = ({ feature, index }) => {
    return (
        <motion.div
            className="bg-slate-800/40 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-8 text-center"
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)' }}
            transition={{ type: 'spring', stiffness: 300 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={{
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.1, duration: 0.5, ease: 'easeOut' },
                },
                hidden: { opacity: 0, y: 50 },
            }}
        >
            <motion.div 
                className="text-6xl mb-4 inline-block"
                whileHover={{ textShadow: '0 0 15px rgba(255, 255, 255, 0.8)' }}
            >
                {feature.icon}
            </motion.div>
            <h3 className="font-lalezar text-2xl text-white mb-3">{feature.title}</h3>
            <p className="font-tanha text-gray-400 leading-relaxed">{feature.description}</p>
        </motion.div>
    );
};

const FeaturesGrid: React.FC = () => {
    return (
        <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <FeatureCard key={feature.title} feature={feature} index={index} />
                ))}
            </div>
        </section>
    );
};

export default FeaturesGrid;
