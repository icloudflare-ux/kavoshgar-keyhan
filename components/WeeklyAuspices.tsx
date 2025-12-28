
import React, { useRef } from 'react';
import Card from './common/Card';
import { useWeeklyAuspicesData } from '../data/weeklyAuspicesData';
import useUnlockOnScroll from '../hooks/useUnlockOnScroll';

const DayCard: React.FC<ReturnType<typeof useWeeklyAuspicesData>[0]> = ({ day, type, description, icon, color, planet }) => {
  const typeColor = color === 'green' ? 'text-green-400' : 'text-red-400';
  const borderColor = color === 'green' ? 'border-green-500/50' : 'border-red-500/50';

  return (
    <div className={`bg-slate-800/50 p-6 rounded-lg border-t-4 ${borderColor} flex flex-col h-full transition-transform duration-300 hover:-translate-y-1`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-3xl font-lalezar text-white">{day}</h4>
        <span className={`text-2xl ${typeColor}`}>{icon}</span>
      </div>
      <p className={`text-lg font-bold mb-3 ${typeColor}`}>{type}</p>
      
      <div className="border-t border-b border-slate-700/50 my-3 py-2 text-center">
        <span className="text-gray-400 text-sm">{"کوکب حاکم"}: </span>
        <strong className="text-indigo-300 font-semibold tracking-wide">{planet}</strong>
      </div>
      
      <p className="text-gray-300 font-tanha leading-relaxed flex-grow">{description}</p>
    </div>
  );
};

const WeeklyAuspices: React.FC = () => {
  const weeklyData = useWeeklyAuspicesData();
  const sectionRef = useRef<HTMLElement>(null);
  useUnlockOnScroll(sectionRef, 'mundane_astrology');

  return (
    <section id="weekly-auspices" ref={sectionRef} role="region" aria-labelledby="weekly-auspices-title">
      <h3 id="weekly-auspices-title" className="text-4xl md:text-5xl font-bold text-center mb-12 font-lalezar tracking-wider bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
        {"سعد و نحس ایام هفته"}
      </h3>
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {weeklyData.map(day => <DayCard key={day.day} {...day} />)}
        </div>

        <div className="mt-12 border-t border-slate-700/50 pt-8 text-gray-300 font-tanha prose prose-lg prose-invert max-w-none">
            <h4 className="text-2xl font-lalezar text-indigo-300">{"نتیجه‌گیری و کاربرد"}</h4>
            <p>
                {"این تقسیم‌بندی به شما کمک می‌کند تا انرژی کلی هر روز را درک کنید. روزهای سعد برای شروع کارها، قرارهای مهم و امور مثبت مناسب‌ترند، در حالی که در روزهای نحس بهتر است بیشتر به امور جاری پرداخته و از شروع کارهای اساسی پرهیز کرد."}
            </p>
            <p className="font-semibold text-cyan-400 text-lg">
                {"البته به یاد داشته باشید که این یک راهنمای کلی است و عوامل دیگری مانند ساعات سیارات و وضعیت ماه نیز در تعیین بهترین زمان برای یک کار مؤثر هستند."}
            </p>
        </div>
      </Card>
    </section>
  );
};

export default WeeklyAuspices;
