/// Extract hashtags from a string
export function extractHashtags(str: string): string[] {
    if (str == null || str === '') return [];
    const regex = /#[\w\d]+/g;
    const result = str.match(regex);
    return result ? result : [];
}
