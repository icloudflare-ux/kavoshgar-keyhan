import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const SubscriptionModal: React.FC = () => {
    const { closeSubscriptionModal, upgradeToPremium } = useAuth();

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeSubscriptionModal();
        }
    };

    const premiumFeatures = [
        "تحلیل کامل زایچه (هوروسکوپ)",
        "تعبیرگر رؤیا با هوش مصنوعی",
        "تحلیل پیشرفته روابط",
        "پاسخ به سؤالات ساعتی (Horary)",
        "محاسبات علم جفر",
        "ذخیره پروفایل‌های نامحدود",
    ];

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={handleBackdropClick}
        >
            <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl shadow-2xl p-8 max-w-lg w-full relative animate-fade-in-down">
                <button onClick={closeSubscriptionModal} className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                
                <div className="text-center">
                    <span className="text-5xl">✨</span>
                    <h3 className="text-3xl font-lalezar text-amber-300 mt-4 mb-2">{"ارتقا به نسخه پرمیوم"}</h3>
                    <p className="text-lg text-gray-300 font-tanha mb-6">{"قفل تمام امکانات پیشرفته را باز کنید"}</p>
                </div>
                
                <ul className="space-y-3 mb-8 font-tanha">
                    {premiumFeatures.map((feature, index) => (
                        <li key={index} className="flex items-center text-lg">
                            <svg className="w-6 h-6 text-green-400 ltr:mr-3 rtl:ml-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            {feature}
                        </li>
                    ))}
                </ul>

                <div className="space-y-4">
                    <button 
                        onClick={upgradeToPremium}
                        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg"
                    >
                        💳 {"پرداخت ریالی (به‌زودی)"}
                    </button>
                    <button 
                        onClick={upgradeToPremium}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg"
                    >
                        💎 {"پرداخت با ارز دیجیتال (به‌زودی)"}
                    </button>
                     <p className="text-center text-sm text-gray-400">{"(تتر، ترون و ...)"}</p>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionModal;
