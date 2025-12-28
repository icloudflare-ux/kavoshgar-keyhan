
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface BlurPreviewProps {
  isLocked: boolean;
  children: React.ReactNode;
}

const BlurPreview: React.FC<BlurPreviewProps> = ({ isLocked, children }) => {
  const { openSubscriptionModal } = useAuth();

  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="blur-md select-none pointer-events-none">{children}</div>
      <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-center p-4 rounded-lg">
        <span className="text-5xl mb-4" role="img" aria-label="Sparkles">✨</span>
        <h4 className="font-lalezar text-2xl text-amber-300">{"تحلیل کامل ویژه اعضای پرمیوم"}</h4>
        <p className="font-tanha text-gray-300 my-2 max-w-sm">{"برای مشاهده تحلیل کامل و دسترسی به امکانات ویژه، اشتراک خود را ارتقا دهید."}</p>
        <button
          onClick={openSubscriptionModal}
          className="mt-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold py-2 px-6 rounded-lg shadow-lg shadow-amber-500/20"
        >
          {"باز کردن قفل"}
        </button>
      </div>
    </div>
  );
};

export default BlurPreview;
