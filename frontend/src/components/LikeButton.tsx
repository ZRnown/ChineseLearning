import React from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface LikeButtonProps {
    isLiked: boolean;
    onToggle: () => void;
    count: number;
}

export default function LikeButton({
    isLiked,
    onToggle,
    count,
}: LikeButtonProps) {
    return (
        <button
            onClick={onToggle}
            className="inline-flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
        >
            {isLiked ? (
                <HeartIconSolid className="h-5 w-5 text-red-600" />
            ) : (
                <HeartIcon className="h-5 w-5" />
            )}
            <span className="text-sm">{count}</span>
        </button>
    );
} 