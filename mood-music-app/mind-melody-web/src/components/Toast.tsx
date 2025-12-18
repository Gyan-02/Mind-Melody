import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
    message: string;
    onClose: () => void;
    duration?: number;
}

const Toast = ({ message, onClose, duration = 3000 }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className="fixed bottom-24 right-6 z-50 animate-slide-in-right">
            <div className="bg-surface border border-white/10 rounded-lg shadow-xl px-4 py-3 flex items-center gap-3 min-w-[250px]">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p className="text-white text-sm font-medium flex-1">{message}</p>
                <button
                    onClick={onClose}
                    className="text-text-muted hover:text-white transition-colors"
                    aria-label="Close notification"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Toast;
