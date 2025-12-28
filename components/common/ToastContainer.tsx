
import React from 'react';
import { useToast } from '../../contexts/ToastContext';
import { AnimatePresence } from 'framer-motion';
import Toast from './Toast';

const ToastContainer: React.FC = () => {
    const { toasts } = useToast();

    return (
        <div className="fixed top-24 right-4 z-[9999] space-y-3" aria-live="assertive">
            <AnimatePresence>
                {toasts.map(toast => (
                    <Toast key={toast.id} toast={toast} />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ToastContainer;
