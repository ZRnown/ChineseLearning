import React, { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircleIcon className="h-5 w-5 text-green-400" />,
        error: <XCircleIcon className="h-5 w-5 text-red-400" />,
        info: <InformationCircleIcon className="h-5 w-5 text-blue-400" />,
    };

    const colors = {
        success: 'bg-green-50 text-green-800 border-green-200',
        error: 'bg-red-50 text-red-800 border-red-200',
        info: 'bg-blue-50 text-blue-800 border-blue-200',
    };

    return (
        <div
            className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg border ${colors[type]} shadow-lg flex items-center space-x-3 animate-slide-up`}
        >
            {icons[type]}
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
} 