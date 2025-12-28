
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Shuffle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface TradingStrategyProps {
    score: number;
}

const TradingStrategy: React.FC<TradingStrategyProps> = ({ score }) => {
    const strategy = useMemo(() => {
        if (score > 70) {
            return {
                text: '🌅 طلوع خورشید: زمان طلایی برای ورود به پوزیشن‌های سنگین',
                icon: <ShieldCheck className="text-green-400" size={24} />,
                color: 'border-green-500/50 bg-green-900/20 text-green-300',
            };
        }
        if (score > 30) {
            return {
                text: 'مناسب برای نوسان‌گیری و سودهای کوتاه مدت',
                icon: <ArrowUpRight className="text-cyan-400" size={24} />,
                color: 'border-cyan-500/50 bg-cyan-900/20 text-cyan-300',
            };
        }
        if (score > -30) {
            return {
                text: 'بازار در نوسان است، با احتیاط معامله کنید',
                icon: <Shuffle className="text-yellow-400" size={24} />,
                color: 'border-yellow-500/50 bg-yellow-900/20 text-yellow-300',
            };
        }
        if (score > -70) {
            return {
                text: 'زمان خروج پله‌ای یا کاهش حجم معاملات',
                icon: <ArrowDownRight className="text-orange-400" size={24} />,
                color: 'border-orange-500/50 bg-orange-900/20 text-orange-300',
            };
        }
        return {
            text: '🌙 غروب ماه: ریسک بالا، از معاملات جدید خودداری کنید',
            icon: <AlertTriangle className="text-red-400" size={24} />,
            color: 'border-red-500/50 bg-red-900/20 text-red-300',
        };
    }, [score]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }} // Delay after chart's needle animation
            className="mt-8"
        >
            <div className={`p-4 rounded-xl border ${strategy.color}`}>
                <div className="flex justify-between items-center">
                    <h4 className="font-lalezar text-xl">{'استراتژی امروز'}</h4>
                    <div className="text-right">
                        <p className="font-roboto-mono text-lg font-bold">{score > 0 ? '+' : ''}{score}</p>
                        <p className="text-xs text-gray-400">{"امتیاز احساسات بازار"}</p>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-white/10">
                    {strategy.icon}
                    <p className="font-tanha text-lg text-center">{strategy.text}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default TradingStrategy;
