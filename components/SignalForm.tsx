
import React, { useState, useCallback } from 'react';
import { useCosmicStore, TradingSignal } from '../store/useCosmicStore';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import Spinner from './common/Spinner';
import { useQueryClient } from '@tanstack/react-query';

const SignalForm: React.FC = () => {
    const [symbol, setSymbol] = useState('');
    const [price, setPrice] = useState('');
    const [signalType, setSignalType] = useState<'BUY' | 'SELL'>('BUY');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    const { setTradingSignal, isNahs } = useCosmicStore();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const handleSubmit = useCallback(async () => {
        if (!symbol.trim() || !price.trim()) {
            setError('لطفاً نام ارز و قیمت ورود را مشخص کنید.');
            return;
        }
        if (!user) {
            setError('برای انتشار سیگنال باید وارد حساب کاربری خود شوید.');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        const newSignal: TradingSignal = {
            symbol: symbol.toUpperCase(),
            type: signalType,
            price: price,
        };

        try {
            // 1. Save to Supabase
            const { error: dbError } = await supabase
              .from('signals')
              .insert({
                symbol: newSignal.symbol,
                entry_price: parseFloat(newSignal.price),
                signal_type: newSignal.type,
                user_id: user.id,
                is_nahs: isNahs, // Store the astrological status at the time of signal creation
              });

            if (dbError) {
                throw new Error(`خطای پایگاه داده: ${dbError.message}`);
            }

            // Invalidate the query to trigger a refetch in SignalHistory
            await queryClient.invalidateQueries({ queryKey: ['signals'] });

            // 2. Broadcast to Telegram via store action
            setTradingSignal(newSignal);

            setSuccess(`سیگنال ${signalType === 'BUY' ? 'خرید' : 'فروش'} برای ${newSignal.symbol} با موفقیت منتشر شد.`);
            setSymbol('');
            setPrice('');
        } catch (err: any) {
            setError(err.message || 'خطا در انتشار سیگنال.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }

    }, [symbol, price, signalType, user, isNahs, setTradingSignal, queryClient]);
    
    const inputClasses = "w-full bg-slate-800/50 border border-slate-700/80 rounded-lg p-3 text-center transition-all duration-300 focus:bg-slate-900/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none";

    return (
        <div className="mt-8 pt-8 border-t border-purple-500/20">
            <h4 className="font-lalezar text-2xl text-center text-indigo-300 mb-6">{"انتشار سیگنال جدید"}</h4>
            <div className="max-w-md mx-auto space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        placeholder="نام ارز (BTC, ETH, ...)"
                        className={inputClasses}
                    />
                     <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="قیمت ورود"
                        className={inputClasses}
                    />
                </div>
                <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-700">
                    <button
                        onClick={() => setSignalType('BUY')}
                        className={`w-1/2 py-2 rounded-md font-bold transition-colors ${signalType === 'BUY' ? 'bg-green-500 text-white' : 'text-gray-400'}`}
                    >
                        خرید (BUY)
                    </button>
                    <button
                        onClick={() => setSignalType('SELL')}
                        className={`w-1/2 py-2 rounded-md font-bold transition-colors ${signalType === 'SELL' ? 'bg-red-500 text-white' : 'text-gray-400'}`}
                    >
                        فروش (SELL)
                    </button>
                </div>

                {error && <p className="text-red-400 text-center font-tanha">{error}</p>}
                {success && <p className="text-green-400 text-center font-tanha">{success}</p>}
                
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg transform hover:-translate-y-1 disabled:bg-indigo-900/50"
                >
                    {isSubmitting ? <Spinner small /> : "انتشار سیگنال هوشمند"}
                </button>
            </div>
        </div>
    );
};

export default SignalForm;
