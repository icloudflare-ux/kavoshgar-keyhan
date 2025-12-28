
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Spinner from '../common/Spinner';

type AuthView = 'signIn' | 'forgotPassword' | 'recoverySent';

const AuthModal: React.FC = () => {
    const { closeAuthModal, signInWithPassword, signUp, resetPassword } = useAuth();
    const [view, setView] = useState<AuthView>('signIn');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loadingAction, setLoadingAction] = useState<'signIn' | 'signUp' | 'reset' | null>(null);
    const [error, setError] = useState('');

    const handleAuth = async (action: 'signIn' | 'signUp') => {
        if (!email || !password) {
            setError('لطفاً ایمیل و رمز عبور را وارد کنید.');
            return;
        }
        setLoadingAction(action);
        setError('');
        try {
            if (action === 'signIn') {
                await signInWithPassword(email, password);
            } else {
                await signUp(email, password);
            }
            closeAuthModal();
        } catch (err: any) {
            if (err.message.includes('Invalid login credentials')) {
                setError('ایمیل یا رمز عبور اشتباه است.');
            } else if (err.message.includes('User already registered')) {
                setError('این ایمیل قبلاً ثبت‌نام کرده است. لطفاً وارد شوید.');
            } else if (err.message.includes('Password should be at least 6 characters')) {
                setError('رمز عبور باید حداقل ۶ کاراکتر باشد.');
            } else {
                setError('خطایی رخ داد. لطفاً دوباره تلاش کنید.');
            }
            console.error(err.message);
        } finally {
            setLoadingAction(null);
        }
    };

    const handlePasswordReset = async () => {
        if (!email) {
            setError('لطفاً ایمیل خود را وارد کنید.');
            return;
        }
        setLoadingAction('reset');
        setError('');
        try {
            await resetPassword(email);
            setView('recoverySent');
        } catch (err: any) {
            setError('خطا در ارسال لینک بازیابی. لطفاً ایمیل را بررسی کرده و دوباره تلاش کنید.');
            console.error(err.message);
        } finally {
            setLoadingAction(null);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeAuthModal();
        }
    };

    const renderSignInView = () => (
        <>
            <div className="text-center mb-6">
                <h3 className="font-lalezar text-3xl text-indigo-300">{"ورود یا ثبت‌نام"}</h3>
                <p className="font-tanha text-gray-400 mt-2">{"ایمیل و رمز عبور خود را وارد کنید."}</p>
            </div>
            <div className="space-y-4">
                <input name="email" type="email" placeholder={"ایمیل"} value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-800/50 border border-slate-600 rounded p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-lg text-center" required />
                <input name="password" type="password" placeholder={"رمز عبور"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-800/50 border border-slate-600 rounded p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-lg text-center" required />
                {error && <p className="text-red-400 text-center text-sm font-tanha">{error}</p>}
                <div className="text-center">
                    <button type="button" onClick={() => { setView('forgotPassword'); setError(''); }} className="text-sm text-indigo-400 hover:text-indigo-300 font-tanha">
                        رمز عبور خود را فراموش کرده‌اید؟
                    </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <button type="button" onClick={() => handleAuth('signIn')} disabled={!!loadingAction} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-600/50 flex items-center justify-center">
                        {loadingAction === 'signIn' ? <Spinner small /> : "ورود"}
                    </button>
                    <button type="button" onClick={() => handleAuth('signUp')} disabled={!!loadingAction} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-600/50 flex items-center justify-center">
                        {loadingAction === 'signUp' ? <Spinner small /> : "ثبت‌نام"}
                    </button>
                </div>
            </div>
        </>
    );

    const renderForgotPasswordView = () => (
        <>
            <div className="text-center mb-6">
                <h3 className="font-lalezar text-3xl text-indigo-300">{"بازیابی رمز عبور"}</h3>
                <p className="font-tanha text-gray-400 mt-2">{"ایمیل خود را وارد کنید تا لینک بازیابی برایتان ارسال شود."}</p>
            </div>
            <div className="space-y-4">
                <input name="email" type="email" placeholder="ایمیل" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-800/50 border border-slate-600 rounded p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-lg text-center" required />
                {error && <p className="text-red-400 text-center text-sm font-tanha">{error}</p>}
                <button onClick={handlePasswordReset} disabled={!!loadingAction} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-600/50 flex items-center justify-center">
                    {loadingAction === 'reset' ? <Spinner small /> : "ارسال لینک بازیابی"}
                </button>
                <div className="text-center">
                    <button type="button" onClick={() => { setView('signIn'); setError(''); }} className="text-sm text-indigo-400 hover:text-indigo-300 font-tanha">
                        بازگشت به صفحه ورود
                    </button>
                </div>
            </div>
        </>
    );

    const renderRecoverySentView = () => (
        <div className="text-center">
            <span className="text-5xl" role="img" aria-label="email envelope">📧</span>
            <h3 className="font-lalezar text-3xl text-green-400 mt-4">{"لینک ارسال شد"}</h3>
            <p className="font-tanha text-gray-300 mt-2">
                {"یک ایمیل حاوی لینک بازیابی رمز عبور به "}<strong>{email}</strong>{" ارسال شد. لطفاً صندوق ورودی و پوشه اسپم خود را بررسی کنید."}
            </p>
            <button onClick={closeAuthModal} className="mt-6 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg">
                {"متوجه شدم"}
            </button>
        </div>
    );

    let content;
    switch (view) {
        case 'forgotPassword': content = renderForgotPasswordView(); break;
        case 'recoverySent': content = renderRecoverySentView(); break;
        default: content = renderSignInView(); break;
    }

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={handleBackdropClick}
        >
            <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-fade-in-down">
                <button onClick={closeAuthModal} className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                {content}
            </div>
        </div>
    );
};

export default AuthModal;
