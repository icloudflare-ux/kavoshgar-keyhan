
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import Spinner from './common/Spinner';
import { motion } from 'framer-motion';

interface Signal {
    id: number;
    created_at: string;
    symbol: string;
    entry_price: number;
    signal_type: 'BUY' | 'SELL';
    is_nahs: boolean;
}

const SignalHistoryCard: React.FC<{ signal: Signal }> = ({ signal }) => {
    const isBuy = signal.signal_type === 'BUY';
    const isNahs = signal.is_nahs;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-slate-900/60 rounded-xl p-4 border-l-4 ${isBuy ? 'border-green-500' : 'border-red-500'}`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3">
                        <span className="font-lalezar text-2xl text-white">{signal.symbol}</span>
                        <span className={`px-3 py-1 text-sm font-bold rounded-full ${isBuy ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {isBuy ? 'خرید' : 'فروش'}
                        </span>
                    </div>
                    <p className="font-roboto-mono text-lg text-gray-300 mt-1">{signal.entry_price}</p>
                </div>
                <div className="text-left">
                    <p className={`font-semibold ${isNahs ? 'text-red-400' : 'text-green-400'}`}>
                        {isNahs ? 'نحس ⚠️' : 'سعد ✅'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {new Date(signal.created_at).toLocaleDateString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

const SignalHistory: React.FC = () => {
    const { data: signals, isLoading, error } = useQuery<Signal[]>({
        queryKey: ['signals'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('signals')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20); // Limit to last 20 signals for performance

            if (error) {
                throw new Error(error.message);
            }
            return data;
        },
    });

    return (
        <div className="mt-12 pt-8 border-t border-rose-500/20">
            <h4 className="font-lalezar text-2xl text-center text-rose-300 mb-6">{"تاریخچه سیگنال‌ها"}</h4>
            
            {isLoading && (
                <div className="flex justify-center items-center py-8">
                    <Spinner />
                </div>
            )}

            {error instanceof Error && (
                <p className="text-red-400 text-center font-tanha">خطا در بارگذاری تاریخچه: {error.message}</p>
            )}

            {signals && signals.length === 0 && (
                <p className="text-gray-500 text-center font-tanha">{"هیچ سیگنالی تاکنون ثبت نشده است."}</p>
            )}

            {signals && signals.length > 0 && (
                <div className="space-y-4 max-w-2xl mx-auto">
                    {signals.map(signal => (
                        <SignalHistoryCard key={signal.id} signal={signal} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SignalHistory;
