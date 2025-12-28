
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ToastMessage, useToast } from '../../contexts/ToastContext';

interface ToastProps {
    toast: ToastMessage;
}

const Toast: React.FC<ToastProps> = ({ toast }) => {
    const { removeToast } = useToast();

    useEffect(() => {
        const timer = setTimeout(() => {
            removeToast(toast.id);
        }, 5000); // Auto-dismiss after 5 seconds

        return () => clearTimeout(timer);
    }, [toast.id, removeToast]);

    const typeClasses = {
        info: 'border-cyan-500/50',
        success: 'border-green-500/50',
        warning: 'border-amber-500/50',
        error: 'border-red-500/50',
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`flex items-start p-4 w-80 max-w-sm rounded-lg shadow-lg backdrop-blur-lg border ${typeClasses[toast.type]}`}
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
        >
            <div className="flex-shrink-0 text-2xl mr-3">{toast.icon}</div>
            <div className="flex-1">
                <p className="text-sm font-semibold text-gray-100">{toast.message}</p>
            </div>
            <button onClick={() => removeToast(toast.id)} className="ml-4 flex-shrink-0 text-gray-400 hover:text-white">
                &times;
            </button>
        </motion.div>
    );
};

export default Toast;
