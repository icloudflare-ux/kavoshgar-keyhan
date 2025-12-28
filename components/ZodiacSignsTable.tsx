
import React, { useState, useContext, useRef } from 'react';
import Card from './common/Card';
import ZodiacDetailModal from './ZodiacDetailModal';
import { CosmicLibraryContext } from '../contexts/CosmicLibraryContext';
import { useZodiacData } from '../data/zodiacData';
import useUnlockOnScroll from '../hooks/useUnlockOnScroll';
import { ZodiacSignName } from '../types';

type ZodiacSign = ReturnType<typeof useZodiacData>[0];

interface ZodiacSignsTableProps {
  calculatedSign: ZodiacSignName | null;
}

const ZodiacSignsTable: React.FC<ZodiacSignsTableProps> = ({ calculatedSign }) => {
  const zodiacData = useZodiacData();
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const libraryContext = useContext(CosmicLibraryContext);
  const sectionRef = useRef<HTMLElement>(null);

  useUnlockOnScroll(sectionRef, 'greeks');

  const handleSignClick = (sign: ZodiacSign) => {
    setSelectedSign(sign);
    libraryContext?.unlockChapter('greeks');
  };

  return (
    <section id="zodiac" ref={sectionRef} role="region" aria-labelledby="zodiac-title">
      <h3 id="zodiac-title" className="text-4xl md:text-5xl font-bold text-center mb-12 font-lalezar tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 text-transparent bg-clip-text">
        {"برج‌های فلکی دوازده‌گانه"}
      </h3>
      <Card>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {zodiacData.map((sign) => {
            const isCalculated = sign.modern === calculatedSign;
            const highlightClass = isCalculated
              ? 'ring-4 ring-amber-400 ring-offset-slate-900 ring-offset-2 scale-105 shadow-2xl shadow-amber-500/40 z-10'
              : 'hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-500/20';

            return (
              <div 
                key={sign.traditional} 
                onClick={() => handleSignClick(sign)}
                className={`p-6 rounded-lg text-center flex flex-col items-center justify-start border-b-4 ${sign.color} transform transition-all duration-300 cursor-pointer ${sign.elementBg} ${highlightClass}`}
              >
                <svg 
                  className={`w-16 h-16 mb-4 ${sign.iconColor}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 12 12" 
                  strokeWidth="1.2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d={sign.svgPath} />
                </svg>
                <h4 className="text-4xl font-lalezar text-white">{sign.traditional}</h4>
                <p className="text-gray-400 font-tanha text-lg mb-4">({sign.modern})</p>
                <div className="text-sm space-y-2 mt-auto border-t border-slate-700/50 w-full pt-3">
                  <p className="text-gray-300 flex justify-between w-full"><span>{"کوکب حاکم"}:</span> <strong>{sign.planet}</strong></p>
                  <p className="text-gray-300 flex justify-between w-full"><span>{"نوع کوکب"}:</span> <strong>{sign.planetType}</strong></p>
                  <p className="text-gray-300 flex justify-between w-full"><span>{"عنصر"}:</span> <strong>{sign.element}</strong></p>
                  <p className="text-gray-300 flex justify-between w-full"><span>{"طبع"}:</span> <strong>{sign.nature}</strong></p>
                  <p className="text-gray-300 flex justify-between w-full"><span>{"کیفیت"}:</span> <strong className={`font-bold ${sign.auspiciousnessColor}`}>{sign.auspiciousness}</strong></p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      {selectedSign && <ZodiacDetailModal sign={selectedSign} onClose={() => setSelectedSign(null)} />}
    </section>
  );
};

export default ZodiacSignsTable;
