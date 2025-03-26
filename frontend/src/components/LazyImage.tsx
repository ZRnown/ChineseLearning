import React, { useState, useEffect, useRef } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
}

export default function LazyImage({ src, alt, className = '' }: LazyImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (imgRef.current) {
                            imgRef.current.src = src;
                        }
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: '50px',
                threshold: 0.1,
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, [src]);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setIsError(true);
    };

    return (
        <div className={`relative ${className}`}>
            {!isLoaded && !isError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <LoadingSpinner size="small" />
                </div>
            )}
            {isError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400">加载失败</span>
                </div>
            )}
            <img
                ref={imgRef}
                alt={alt}
                className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                onLoad={handleLoad}
                onError={handleError}
            />
        </div>
    );
} 