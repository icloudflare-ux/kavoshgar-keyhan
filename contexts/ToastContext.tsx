
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

export interface ToastMessage {
    id: number;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    icon: string;
}

interface ToastContextType {
    toasts: ToastMessage[];
    addToast: (message: string, type: ToastMessage['type'], icon: string) => void;
    removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const addToast = useCallback((message: string, type: ToastMessage['type'], icon: string) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, icon }]);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
