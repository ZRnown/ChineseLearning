import React, { useState, useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface FavoriteButtonProps {
    isFavorite: boolean;
    onToggle: () => Promise<void>;
    className?: string;
}

export default function FavoriteButton({
    isFavorite,
    onToggle,
    className = '',
}: FavoriteButtonProps) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [localIsFavorite, setLocalIsFavorite] = useState(isFavorite);

    useEffect(() => {
        setLocalIsFavorite(isFavorite);
    }, [isFavorite]);

    const handleClick = async () => {
        setIsAnimating(true);
        try {
            await onToggle();
            setLocalIsFavorite(!localIsFavorite);
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        } finally {
            setTimeout(() => setIsAnimating(false), 300);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`
                relative p-2 rounded-full transition-all duration-300
                ${localIsFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}
                ${isAnimating ? 'scale-125' : 'scale-100'}
                ${className}
            `}
        >
            {localIsFavorite ? (
                <HeartSolidIcon className="h-6 w-6" />
            ) : (
                <HeartIcon className="h-6 w-6" />
            )}
            {isAnimating && (
                <div className="absolute inset-0 rounded-full bg-red-100 animate-ping opacity-75" />
            )}
        </button>
    );
} 