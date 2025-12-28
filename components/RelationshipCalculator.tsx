
import React, { useState, useMemo, useCallback, useContext } from 'react';
import { Profile } from '../types';
import Card from './common/Card';
import Spinner from './common/Spinner';
import { useZodiacRulers } from '../data/rabAlTalehData';
import { useZodiacData } from '../data/zodiacData';
import { calculateAbjad } from '../utils/abjad';
import { generateRelationshipAnalysis } from '../services/geminiService';
import { useAuth } from '../contexts/AuthContext';
import BlurPreview from './common/BlurPreview';
import { CosmicLibraryContext } from '../contexts/CosmicLibraryContext';

interface RelationshipCalculatorProps {
  profiles: Profile[];
}

const reduceToSingleDigit = (num: number): number => {
    let currentNum = num;
    while (currentNum > 9) {
        currentNum = String(currentNum).split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    }
    return currentNum === 0 && num > 0 ? 9 : currentNum;
};

const getAnalysisData = (profile: Profile, zodiacRulers: ReturnType<typeof useZodiacRulers>, zodiacData: ReturnType<typeof useZodiacData>) => {
    const totalAbjad = calculateAbjad(profile.name) + calculateAbjad(profile.motherName);
    const remainder = totalAbjad % 12;
    const rabTale = remainder === 0 ? 12 : remainder;
    const signInfo = zodiacRulers.find(r => r.id === rabTale);
    const zodiacInfo = zodiacData.find(z => z.traditional === signInfo?.sign);
    
    return {
        sign: signInfo?.sign || 'نامشخص',
        ruler: signInfo?.ruler || 'نامشخص',
        element: zodiacInfo?.element || 'نامشخص',
        number: reduceToSingleDigit(totalAbjad),
    };
};

const AnalysisResultDisplay = ({ analysis }: { analysis: any }) => {
    const Section: React.FC<{ title: string, children: React.ReactNode, icon: string }> = ({ title, children, icon }) => (
        <div className="bg-slate-800/40 p-6 rounded-lg">
            <h4 className="flex items-center text-2xl font-lalezar text-indigo-300 mb-4">
                <span className="text-3xl ml-3">{icon}</span>
                {title}
            </h4>
            <div className="prose prose-lg prose-invert max-w-none font-tanha leading-loose space-y-3">{children}</div>
        </div>
    );
    
    return (
        <div className="mt-12 space-y-8">
            <Section title={"هماهنگی عنصری"} icon="🌍">
                <p>{analysis.elementalHarmony}</p>
            </Section>
            <Section title={"دینامیک سیاره‌ای"} icon="🪐">
                <p>{analysis.planetaryDynamics}</p>
            </Section>
            <Section title={"ارتباط عددی"} icon="🔢">
                <p>{analysis.numerologicalConnection}</p>
            </Section>

            <div className="grid md:grid-cols-2 gap-8">
                <Section title={"نقاط قوت"} icon="✨">
                    <ul className="list-disc list-inside">
                        {analysis.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                    </ul>
                </Section>
                <Section title={"چالش‌ها"} icon="🌪️">
                     <ul className="list-disc list-inside">
                        {analysis.challenges?.map((c: string, i: number) => <li key={i}>{c}</li>)}
                    </ul>
                </Section>
            </div>

            <Section title={"نتیجه‌گیری"} icon="📜">
                <p>{analysis.conclusion}</p>
            </Section>
        </div>
    );
};

const relationshipTypes = [
    { key: 'marriage', label: 'ازدواج' },
    { key: 'business_partnership', label: 'شراکت کاری' },
    { key: 'friendship', label: 'دوستی' },
    { key: 'family', label: 'خانوادگی' }
];

const RelationshipCalculator: React.FC<RelationshipCalculatorProps> = ({ profiles }) => {
  const zodiacRulers = useZodiacRulers();
  const zodiacData = useZodiacData();
  const [profile1Id, setProfile1Id] = useState('');
  const [profile2Id, setProfile2Id] = useState('');
  const [relationshipTypeKey, setRelationshipTypeKey] = useState(relationshipTypes[0].key);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isPremium } = useAuth();
  const libraryContext = useContext(CosmicLibraryContext);


  const availableProfilesForP2 = useMemo(() => profiles.filter(p => p.id !== profile1Id), [profiles, profile1Id]);
  const availableProfilesForP1 = useMemo(() => profiles.filter(p => p.id !== profile2Id), [profiles, profile2Id]);

  const handleAnalysis = useCallback(async () => {
    const relationshipType = relationshipTypes.find(rt => rt.key === relationshipTypeKey)?.label;
    if (!profile1Id || !profile2Id || !relationshipType) {
        setError('لطفاً هر دو پروفایل و نوع رابطه را انتخاب کنید.');
        return;
    }
    if (profile1Id === profile2Id) {
        setError('لطفاً دو پروفایل متفاوت انتخاب کنید.');
        return;
    }

    setError(null);
    setIsLoading(true);
    setAnalysis(null);

    const profile1 = profiles.find(p => p.id === profile1Id);
    const profile2 = profiles.find(p => p.id === profile2Id);

    if (!profile1 || !profile2) {
        setError("پروفایل‌های انتخاب شده یافت نشدند.");
        setIsLoading(false);
        return;
    }

    try {
        const analysis1 = getAnalysisData(profile1, zodiacRulers, zodiacData);
        const analysis2 = getAnalysisData(profile2, zodiacRulers, zodiacData);
        
        const result = await generateRelationshipAnalysis(
            profile1, analysis1,
            profile2, analysis2,
            relationshipType
        );

        if (!result) throw new Error("پاسخی از سرویس هوش مصنوعی دریافت نشد.");
        setAnalysis(result);
        libraryContext?.unlockChapter('horoscopy');


    } catch(e: any) {
        setError(e.message || "خطا در تولید تحلیل.");
    } finally {
        setIsLoading(false);
    }

  }, [profile1Id, profile2Id, relationshipTypeKey, profiles, zodiacRulers, zodiacData, libraryContext]);

  const ProfileSelector: React.FC<{ value: string; onChange: (id: string) => void; options: Profile[]; label: string; }> = ({ value, onChange, options, label }) => (
    <div>
        <label className="block text-lg font-tanha text-gray-300 mb-2">{label}</label>
        <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-slate-800/50 border-slate-600 rounded p-3 focus:ring-2 focus:ring-indigo-500 text-lg">
            <option value="">-- انتخاب پروفایل --</option>
            {options.map(p => <option key={p.id} value={p.id}>{p.name} ({"فرزند"} {p.motherName})</option>)}
        </select>
    </div>
  );

  return (
    <Card>
      <div className="text-center">
        <h4 className="text-3xl font-semibold text-white font-lalezar tracking-wide">{"تحلیل رابطه"}</h4>
        <p className="font-tanha text-gray-300 leading-relaxed max-w-3xl mx-auto mt-4">{"سازگاری بین دو فرد را بر اساس طالع ابجدی، عنصر وجودی و دینامیک سیاره‌ای حاکم بر آن‌ها تحلیل کنید."}</p>
      </div>
      
      {!analysis && !isLoading && (
        <div className="mt-8 max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
                <ProfileSelector value={profile1Id} onChange={setProfile1Id} options={availableProfilesForP1} label={"شخص اول"} />
                <ProfileSelector value={profile2Id} onChange={setProfile2Id} options={availableProfilesForP2} label={"شخص دوم"} />
            </div>
            <div>
                 <label className="block text-lg font-tanha text-gray-300 mb-2">{"نوع رابطه"}</label>
                 <select 
                    value={relationshipTypeKey} 
                    onChange={e => setRelationshipTypeKey(e.target.value)} 
                    className="w-full bg-slate-800/50 border-slate-600 rounded p-3 focus:ring-2 focus:ring-indigo-500 text-lg"
                 >
                    {relationshipTypes.map(type => (
                        <option key={type.key} value={type.key}>
                            {type.label}
                        </option>
                    ))}
                </select>
            </div>
            {error && <p className="text-red-400 text-center font-tanha">{error}</p>}
            <button onClick={handleAnalysis} disabled={isLoading || !profile1Id || !profile2Id || !relationshipTypeKey} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg transform hover:-translate-y-1">
                {isLoading ? <Spinner small /> : "دریافت تحلیل رابطه"}
            </button>
            {profiles.length < 2 && <p className="text-center text-amber-400 font-tanha mt-4">{"برای تحلیل رابطه، حداقل به دو پروفایل ذخیره شده نیاز دارید."}</p>}
        </div>
      )}

      {isLoading && (
         <div className="flex flex-col items-center justify-center h-full mt-12">
            <Spinner />
            <p className="mt-4 text-gray-300 font-tanha">{"در حال تحلیل هماهنگی کیهانی..."}</p>
        </div>
      )}

      {analysis && (
        <div className="animate-fade-in">
          <BlurPreview isLocked={!isPremium}>
            <AnalysisResultDisplay analysis={analysis} />
          </BlurPreview>
          <div className="text-center mt-12">
            <button onClick={() => setAnalysis(null)} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300">{"تحلیل جدید"}</button>
          </div>
        </div>
      )}

    </Card>
  );
};

export default RelationshipCalculator;
