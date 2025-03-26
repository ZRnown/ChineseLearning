import React, { useEffect, useRef, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface InfiniteScrollProps<T> {
    items: T[];
    hasMore: boolean;
    isLoading: boolean;
    onLoadMore: () => void;
    renderItem: (item: T) => React.ReactNode;
    className?: string;
}

export default function InfiniteScroll<T>({
    items,
    hasMore,
    isLoading,
    onLoadMore,
    renderItem,
    className = '',
}: InfiniteScrollProps<T>) {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsIntersecting(entry.isIntersecting);
                    if (entry.isIntersecting && hasMore && !isLoading) {
                        onLoadMore();
                    }
                });
            },
            {
                rootMargin: '100px',
                threshold: 0.1,
            }
        );

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [hasMore, isLoading, onLoadMore]);

    return (
        <div className={className}>
            {items.map((item, index) => (
                <div key={index}>{renderItem(item)}</div>
            ))}
            <div ref={loadMoreRef} className="py-4">
                {isLoading && <LoadingSpinner />}
                {!hasMore && items.length > 0 && (
                    <p className="text-center text-gray-500">没有更多内容了</p>
                )}
            </div>
        </div>
    );
} 