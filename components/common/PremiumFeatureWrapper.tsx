import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface PremiumFeatureWrapperProps {
  children: React.ReactNode;
  title: string;
  icon: string;
}

const PremiumFeatureWrapper: React.FC<PremiumFeatureWrapperProps> = ({ children, title, icon }) => {
  const { isPremium, openSubscriptionModal } = useAuth();

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div 
      className="relative p-8 border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-500 hover:bg-slate-900/40 transition-all duration-300 min-h-[300px]"
      onClick={openSubscriptionModal}
    >
      <div className="absolute top-4 right-4 bg-amber-500 text-black px-3 py-1 text-sm font-bold rounded-full flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
        {"ویژه"}
      </div>
      <div className="text-6xl mb-4">{icon}</div>
      <h4 className="text-3xl font-lalezar text-slate-400 mb-2">{title}</h4>
      <p className="text-slate-500 font-tanha max-w-sm">
        {`برای استفاده از ابزار «${title}» نیاز به اشتراک پرمیوم دارید.`}
      </p>
      <button className="mt-6 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold py-2 px-6 rounded-lg shadow-lg shadow-amber-500/20">
        {"باز کردن قفل"}
      </button>
    </div>
  );
};

export default PremiumFeatureWrapper;
