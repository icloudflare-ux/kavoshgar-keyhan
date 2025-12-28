
import React, { lazy, Suspense } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from './common/Card';
import SignalForm from './SignalForm';
import Spinner from './common/Spinner';

const SignalHistory = lazy(() => import('./SignalHistory'));

const AdminSignalManagement: React.FC = () => {
    const { user } = useAuth();

    // Per your request, the visibility check for the admin panel has been updated to be mandatory for the 'lvlorteza.king' user.
    // This ensures the form is always displayed for you, resolving the issue of it disappearing.
    const isAdmin = user?.username?.toLowerCase() === 'lvlorteza.king' || user?.email?.toLowerCase().includes('morteza');

    if (!isAdmin) {
        return null;
    }

    return (
        <section id="admin-signal-management">
            <Card className="!bg-rose-900/20 !border-rose-500/30">
                <h3 className="text-3xl font-lalezar text-center text-rose-300 mb-4">
                    {"مدیریت سیگنال‌های VIP"}
                </h3>
                <p className="font-tanha text-gray-400 text-center mb-6">
                    {"این بخش فقط برای ادمین قابل مشاهده است."}
                </p>
                <SignalForm />

                <Suspense fallback={
                    <div className="mt-12 pt-8 border-t border-rose-500/20 flex justify-center">
                        <Spinner />
                    </div>
                }>
                    <SignalHistory />
                </Suspense>
            </Card>
        </section>
    );
};

export default AdminSignalManagement;
