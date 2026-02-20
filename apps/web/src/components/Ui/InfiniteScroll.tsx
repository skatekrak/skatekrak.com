import React, { useEffect, useRef, useCallback } from 'react';

type InfiniteScrollProps = {
    loadMore: () => void;
    hasMore: boolean;
    threshold?: number;
    getScrollParent?: () => HTMLElement | null;
    children: React.ReactNode;
};

/**
 * Lightweight InfiniteScroll component using Intersection Observer.
 * Replaces react-infinite-scroller (unmaintained, class-based, incompatible with React 19).
 */
const InfiniteScroll: React.FC<InfiniteScrollProps> = ({ loadMore, hasMore, threshold = 250, getScrollParent, children }) => {
    const sentinelRef = useRef<HTMLDivElement>(null);
    const loadMoreRef = useRef(loadMore);

    // Keep the callback ref up to date without re-creating the observer
    useEffect(() => {
        loadMoreRef.current = loadMore;
    }, [loadMore]);

    const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
        if (entries[0]?.isIntersecting) {
            loadMoreRef.current();
        }
    }, []);

    useEffect(() => {
        if (!hasMore) return;

        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const root = getScrollParent?.() ?? null;

        const observer = new IntersectionObserver(handleIntersect, {
            root,
            rootMargin: `0px 0px ${threshold}px 0px`,
        });

        observer.observe(sentinel);

        return () => {
            observer.disconnect();
        };
    }, [hasMore, threshold, getScrollParent, handleIntersect]);

    return (
        <div>
            {children}
            {hasMore && <div ref={sentinelRef} style={{ height: 1 }} />}
        </div>
    );
};

export default InfiniteScroll;
