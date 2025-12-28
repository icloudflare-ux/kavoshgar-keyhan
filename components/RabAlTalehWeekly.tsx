
import React, { useState, useMemo, useEffect } from 'react';
import Card from './common/Card';
import { useZodiacRulers, useWeeklyRulers } from '../data/rabAlTalehData';
import { ZodiacSignName } from '../types';
import { useZodiacData } from '../data/zodiacData';

interface RabAlTalehWeeklyProps {
  calculatedSign: ZodiacSignName | null;
}

const RabAlTalehWeekly: React.FC<RabAlTalehWeeklyProps> = ({ calculatedSign }) => {
  const [selectedSign, setSelectedSign] = useState<ZodiacSignName | ''>('');
  const zodiacRulers = useZodiacRulers();
  const weeklyRulers = useWeeklyRulers();
  const zodiacData = useZodiacData();

  useEffect(() => {
    if (calculatedSign) {
      setSelectedSign(calculatedSign);
    }
  }, [calculatedSign]);

  const personalWeeklyData = useMemo(() => {
    if (!selectedSign) return null;

    const signData = zodiacData.find(z => z.modern === selectedSign);
    if (!signData) return null;

    const rulerInfo = zodiacRulers.find(z => z.sign === signData.traditional);
    if (!rulerInfo) return null;

    const personalRuler = rulerInfo.ruler;

    return weeklyRulers.map(dayInfo => ({
      ...dayInfo,
      significance: dayInfo.ruler === personalRuler ? "روز حاکم طالع شما" : "روز عادی",
      isSpecial: dayInfo.ruler === personalRuler,
    }));
  }, [selectedSign, zodiacRulers, weeklyRulers, zodiacData]);

  return (
    <section id="rab-al-taleh" role="region" aria-labelledby="rab-al-taleh-title">
      <h3 id="rab-al-taleh-title" className="text-4xl md:text-5xl font-bold text-center mb-6 font-lalezar tracking-wider bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-transparent bg-clip-text">
        {"طالع هفتگی شخصی"}
      </h3>
      <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto font-tanha text-lg leading-relaxed">
        {"هر روز هفته تحت حاکمیت یکی از کواکب سبعه است. روزی که حاکم آن با کوکب حاکم طالع شما یکی باشد، «روز خاص» شما محسوب شده و انرژی کیهانی برای پیشبرد اهدافتان با شما هماهنگ‌تر است."}
      </p>
      <Card>
        <div className="text-center mb-8">
          <label htmlFor="zodiac-select" className="block text-lg font-tanha text-gray-300 mb-3">
            {"برج طالع خود را انتخاب کنید:"}
          </label>
          <select
            id="zodiac-select"
            value={selectedSign}
            onChange={(e) => setSelectedSign(e.target.value as ZodiacSignName | '')}
            className="bg-slate-800/60 border border-slate-600 text-white text-lg rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-sm mx-auto p-3 transition duration-300"
          >
            <option value="">{"-- انتخاب کنید --"}</option>
            {zodiacData.map(z => (
              <option key={z.modern} value={z.modern}>{z.traditional}</option>
            ))}
          </select>
        </div>

        {selectedSign && personalWeeklyData ? (
          <div className="overflow-x-auto w-full animate-fade-in">
            <table className="min-w-full bg-slate-900/40 rounded-lg">
              <thead className="bg-slate-800/70">
                <tr>
                  <th className="p-4 text-sm font-semibold tracking-wider text-right whitespace-nowrap">{"روز هفته"}</th>
                  <th className="p-4 text-sm font-semibold tracking-wider text-right whitespace-nowrap">{"کوکب حاکم روز"}</th>
                  <th className="p-4 text-sm font-semibold tracking-wider text-right whitespace-nowrap">{"اهمیت برای شما"}</th>
                  <th className="p-4 text-sm font-semibold tracking-wider text-right whitespace-nowrap">{"کیفیت روز"}</th>
                </tr>
              </thead>
              <tbody>
                {personalWeeklyData.map(day => (
                  <tr 
                    key={day.day} 
                    className={`border-b border-slate-700/50 transition-colors duration-300 ${day.isSpecial ? 'bg-indigo-900/40 ring-2 ring-indigo-500/50' : 'hover:bg-slate-800/40'}`}
                  >
                    <td className="p-4 font-bold text-white text-base md:text-lg whitespace-nowrap">{day.day}</td>
                    <td className="p-4 text-gray-300 whitespace-nowrap">{day.ruler}</td>
                    <td className="p-4 whitespace-nowrap">
                      {day.isSpecial ? (
                        <span className="px-3 py-1 text-sm font-bold bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white rounded-full shadow-lg shadow-indigo-500/20">
                          ✨ {day.significance}
                        </span>
                      ) : (
                        <span className="text-gray-400">{day.significance}</span>
                      )}
                    </td>
                    <td className={`p-4 font-bold whitespace-nowrap ${day.color}`}>{day.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-8 bg-slate-800/30 rounded-lg">
            <p className="text-gray-400 font-tanha text-xl">{"برای مشاهده طالع هفتگی شخصی، ابتدا برج طالع خود را از لیست بالا انتخاب کنید."}</p>
          </div>
        )}
      </Card>
    </section>
  );
};

export default RabAlTalehWeekly;
