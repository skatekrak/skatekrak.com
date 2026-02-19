export type TruncateTextProps = {
    truncateLines?: number;
};

/**
 * Returns Tailwind class names for text truncation.
 * - 1 line: `truncate` (white-space: nowrap; overflow: hidden; text-overflow: ellipsis)
 * - N lines: `line-clamp-N` (display: -webkit-box; -webkit-line-clamp: N; -webkit-box-orient: vertical; overflow: hidden)
 * - undefined: empty string (no truncation)
 */
export const getTruncateClasses = (lines?: number): string => {
    if (lines == null) return '';
    if (lines === 1) return 'truncate';
    return `line-clamp-[${lines}]`;
};
