
import React, { useState, useEffect } from 'react';
import { useProfiles } from './common/ProfileManager';
import Card from './common/Card';

const DashboardSection: React.FC = () => {
  const { profiles } = useProfiles();
  const [savedAnalyses, setSavedAnalyses] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const checkSavedAnalyses = () => {
      const analyses: Record<string, boolean> = {};
      profiles.forEach(profile => {
        try {
            const saved = localStorage.getItem(`horoscope_analysis_${profile.id}`);
            if (saved && saved.length > 50) { // Basic check for non-empty string
                analyses[profile.id] = true;
            }
        } catch (e) {
            console.error(`Could not check storage for profile ${profile.id}`, e);
        }
      });
      setSavedAnalyses(analyses);
    };
    
    if (profiles.length > 0) {
        checkSavedAnalyses();
    }
  }, [profiles]);

  if (profiles.length === 0) {
    return null; // Don't show the dashboard if there are no profiles
  }
  
  return (
    <div className="mb-10">
        <Card className="!bg-slate-900/40 !border-slate-700/60">
            <h3 className="font-lalezar text-2xl text-center mb-3 text-indigo-300">{"داشبورد گزارش‌ها"}</h3>
            <p className="font-tanha text-center text-gray-400 mb-6">{"برای مشاهده تحلیل ذخیره شده، پروفایل مربوطه را از بخش «مدیریت پروفایل» در بالا انتخاب کنید."}</p>
            <div className="space-y-3">
                {profiles.map(p => (
                    <div key={p.id} className="bg-slate-800/60 p-3 rounded-lg flex justify-between items-center">
                        <span className="font-tanha text-lg text-white">{p.name}</span>
                        <div className="flex items-center gap-2">
                           {savedAnalyses[p.id] ? (
                                <>
                                    <span className="text-sm text-green-400">{"تحلیل زایچه ذخیره شده"}</span>
                                    <span className="text-green-400">✅</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-sm text-gray-500">{"تحلیلی ذخیره نشده"}</span>
                                    <span className="text-gray-500">❌</span>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    </div>
  )
};

export default DashboardSection;
