import React, { useEffect, useRef, useCallback } from 'react';

type InfiniteScrollProps = {
    loadMore: () => void;
    hasMore: boolean;
    isLoading?: boolean;
    threshold?: number;
    getScrollParent?: () => HTMLElement | null;
    children: React.ReactNode;
};

/**
 * Find the closest scrollable ancestor of an element by walking up the DOM
 * and checking for overflow styles that enable scrolling.
 */
const findScrollableAncestor = (element: HTMLElement): HTMLElement | null => {
    let current = element.parentElement;
    while (current) {
        const style = getComputedStyle(current);
        const overflowY = style.overflowY;
        if (overflowY === 'auto' || overflowY === 'scroll') {
            return current;
        }
        current = current.parentElement;
    }
    return null;
};

/**
 * Lightweight InfiniteScroll component using Intersection Observer.
 * Replaces react-infinite-scroller (unmaintained, class-based, incompatible with React 19).
 */
const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
    loadMore,
    hasMore,
    isLoading = false,
    threshold = 250,
    getScrollParent,
    children,
}) => {
    const sentinelRef = useRef<HTMLDivElement>(null);
    const loadMoreRef = useRef(loadMore);
    const isLoadingRef = useRef(isLoading);

    // Keep the callback ref up to date without re-creating the observer
    useEffect(() => {
        loadMoreRef.current = loadMore;
    }, [loadMore]);

    useEffect(() => {
        isLoadingRef.current = isLoading;
    }, [isLoading]);

    const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
        if (entries[0]?.isIntersecting && !isLoadingRef.current) {
            loadMoreRef.current();
        }
    }, []);

    useEffect(() => {
        if (!hasMore) return;

        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const root = getScrollParent?.() ?? findScrollableAncestor(sentinel);

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
