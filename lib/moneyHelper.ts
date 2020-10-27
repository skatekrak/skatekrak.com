/**
 * Get proper pricing text
 *
 * @param price: Price you want to show
 * @param currency: Currency ISO format (eur, usd...)
 *
 * @returns: Formatted pricing (i.e: $99 or like 99€)
 */
export function getPricingText(price: string, currency: string): string {
    let res = '';

    if (currency === 'usd') {
        res += '$';
    }
    if (currency === 'gbp') {
        res += '£';
    }
    res += price;
    if (currency === 'eur') {
        res += '€';
    }

    return res;
}
