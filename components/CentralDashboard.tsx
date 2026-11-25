
import React, { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import useStore from '../hooks/useStore';
import { useCosmicStore, type CosmicState } from '../store/useCosmicStore';
import { useCurrentPlanetaryHour } from '../hooks/useCurrentPlanetaryHour';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import { Zap, Moon, CandlestickChart, Star } from 'lucide-react';
import Spinner from './common/Spinner';
import { calculateAbjad } from '../utils/abjad';
import { useZodiacRulers } from '../data/rabAlTalehData';

// Extends Signal to include creation time and astrological state at creation
interface Signal {
    id: number;
    symbol: string;
    signal_type: 'BUY' | 'SELL';
    created_at: string;
    is_nahs: boolean;
}

const DashboardWidget: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; className?: string }> = ({ icon, title, children, className }) => (
    <motion.div
        className={`bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 flex flex-col ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <div className="flex items-center mb-3 text-indigo-300">
            {icon}
            <h4 className="font-lalezar text-lg mr-2">{title}</h4>
        </div>
        <div className="flex-grow flex items-center justify-center text-center">
            {children}
        </div>
    </motion.div>
);

// --- Time & Moon Logic ---
const LUNAR_CYCLE_DAYS = 29.53;
const NEW_MOON_REFERENCE_UTC = new Date('2024-01-11T11:57:00Z').getTime();

const getMoonPhase = (date: Date) => {
    const msSinceNewMoon = date.getTime() - NEW_MOON_REFERENCE_UTC;
    const daysSinceNewMoon = msSinceNewMoon / (1000 * 60 * 60 * 24);
    const phaseValue = (daysSinceNewMoon % LUNAR_CYCLE_DAYS) / LUNAR_CYCLE_DAYS;
    
    let name: string, icon: string, tradingInsight: string;

    if (phaseValue > 0.97 || phaseValue <= 0.03) { name = 'ماه نو'; icon = '🌑'; tradingInsight = 'زمان برنامه‌ریزی، نه معامله'; }
    else if (phaseValue <= 0.22) { name = 'هلال فزاینده'; icon = '🌒'; tradingInsight = 'روند صعودی محتمل است'; }
    else if (phaseValue <= 0.28) { name = 'تربیع اول'; icon = '🌓'; tradingInsight = 'زمان اقدام قاطع'; }
    else if (phaseValue <= 0.47) { name = 'کوژ ماه فزاینده'; icon = '🌔'; tradingInsight = 'زمان اصلاح و بهینه‌سازی'; }
    else if (phaseValue <= 0.53) { name = 'ماه کامل'; icon = '🌕'; tradingInsight = 'ریسک هیجانات بالا، احتمال بازگشت روند'; }
    else if (phaseValue <= 0.72) { name = 'کوژ ماه کاهنده'; icon = '🌖'; tradingInsight = 'زمان شکرگزاری و خروج تدریجی'; }
    else if (phaseValue <= 0.78) { name = 'تربیع آخر'; icon = '🌗'; tradingInsight = 'زمان پاکسازی پورتفولیو'; }
    else { name = 'هلال کاهنده'; icon = '🌘'; tradingInsight = 'زمان استراحت و تجدید قوا'; }

    return { name, icon, tradingInsight };
};

const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)} سال پیش`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} ماه پیش`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} روز پیش`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)} ساعت پیش`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} دقیقه پیش`;
    return `${Math.floor(seconds)} ثانیه پیش`;
};


const CentralDashboard: React.FC = () => {
    const { user } = useAuth();
    const activeProfile = useStore(useCosmicStore, (state: CosmicState) => state.activeProfile);
    const zodiacRulers = useZodiacRulers();
    const currentHour = useCurrentPlanetaryHour();
    const isNahs = useStore(useCosmicStore, (state: CosmicState) => state.isNahs);
    
    const rulingPlanet = useMemo(() => {
        if (!activeProfile) return null;
        const totalAbjad = calculateAbjad(activeProfile.name) + calculateAbjad(activeProfile.motherName);
        const remainder = totalAbjad % 12;
        const rabTale = remainder === 0 ? 12 : remainder;
        return zodiacRulers.find(z => z.id === rabTale)?.ruler || null;
    }, [activeProfile, zodiacRulers]);
    
    const isPersonalAuspiciousHour = currentHour && rulingPlanet && currentHour.planet?.persian === rulingPlanet;

    const moonPhase = useMemo(() => getMoonPhase(new Date()), []);

    const { data: latestSignal, isLoading: isSignalLoading } = useQuery<Signal | null>({
        queryKey: ['latestSignal'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('signals')
                .select('id, symbol, signal_type, created_at, is_nahs')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();
            if (error && error.code !== 'PGRST116') throw error;
            return data;
        },
        refetchInterval: 60000,
    });

    if (!user) return null;

    return (
        <section id="central-dashboard" className="mb-24">
             <div className="text-center mb-12">
                 <h2 className="text-4xl md:text-5xl font-lalezar tracking-wider bg-gradient-to-r from-purple-400 to-fuchsia-500 text-transparent bg-clip-text">
                     {`رادار کواکب: ${user.username}`}
                </h2>
                <p className="font-tanha text-lg text-gray-400 mt-2">به مرکز فرماندهی کیهانی خود خوش آمدید</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DashboardWidget icon={<Zap size={20} />} title="وضعیت لحظه‌ای">
                    {currentHour ? (
                        <div className="font-tanha text-xl">
                            {isPersonalAuspiciousHour && (
                                <p className="flex items-center justify-center gap-2 font-bold text-amber-300 mb-2">
                                    <Star size={20} className="fill-current"/>
                                    ساعت سعد شخصی شما
                                </p>
                            )}
                            <p>ساعت <strong className="font-lalezar text-2xl text-white">{currentHour.planet?.persian}</strong></p>
                            <p className={`font-bold ${isNahs ? 'text-red-400' : 'text-green-400'}`}>
                                ({isNahs ? 'نحس' : 'سعد'})
                            </p>
                            {isPersonalAuspiciousHour && <p className="text-sm text-gray-300 mt-2">زمان مناسب برای تصمیمات شهودی</p>}
                        </div>
                    ) : <Spinner small />}
                </DashboardWidget>
                <DashboardWidget icon={<Moon size={20} />} title="فاز ماه و ترید">
                    <div className="font-tanha text-xl">
                        <p className="text-3xl">{moonPhase.icon} <span className="text-white align-middle">{moonPhase.name}</span></p>
                        <p className="text-cyan-300 mt-2 text-base">{moonPhase.tradingInsight}</p>
                    </div>
                </DashboardWidget>
                 <DashboardWidget icon={<CandlestickChart size={20} />} title="آخرین سیگنال VIP">
                    {isSignalLoading ? <Spinner small /> : latestSignal ? (
                        <div>
                           <p className="font-lalezar text-3xl text-white">{latestSignal.symbol}</p>
                           <p className={`font-bold text-xl ${latestSignal.signal_type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                                ({latestSignal.signal_type === 'BUY' ? 'خرید' : 'فروش'})
                           </p>
                           <div className="mt-3 text-xs text-gray-400 flex items-center justify-center gap-4">
                               <span>{timeAgo(latestSignal.created_at)}</span>
                               <span className={`px-2 py-0.5 rounded-full text-white text-xs ${latestSignal.is_nahs ? 'bg-red-500/50' : 'bg-green-500/50'}`}>
                                   {latestSignal.is_nahs ? 'در ساعت نحس' : 'در ساعت سعد'}
                               </span>
                           </div>
                        </div>
                    ) : <p className="text-gray-400 font-tanha">سیگنالی یافت نشد</p>}
                </DashboardWidget>
            </div>
        </section>
    );
};

export default CentralDashboard;
