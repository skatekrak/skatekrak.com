/** Extract hashtags from a caption string (matches #word patterns, deduplicates) */
export function extractHashtags(str: string | null | undefined): string[] {
    if (!str) return [];
    const result = str.match(/#[\w\d]+/g);
    return result ? [...new Set(result)] : [];
}

/** Ensure a hashtag string starts with '#' (stored hashtags include the prefix) */
export function addHashtagIfNeeded(tag: string): string {
    return tag[0] !== '#' ? `#${tag}` : tag;
}
