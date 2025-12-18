import { createContext, useContext, useState, ReactNode } from 'react';
import Toast from '../components/Toast';

interface ToastContextType {
    showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (message: string) => {
        setToastMessage(message);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toastMessage && (
                <Toast
                    message={toastMessage}
                    onClose={() => setToastMessage(null)}
                />
            )}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
