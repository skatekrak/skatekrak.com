import { startOfMonth, subDays } from 'date-fns';

export type Stat = {
    createdAt: Date;
    className: string;
    all: number;
    monthly: number;
    weekly: number;
    daily: number;
};

/**
 * Build a Stat object from a list of items sorted by `createdAt` descending.
 *
 * Port of carrelage's `Stat.build()`.
 * The list **must** be sorted newest-first so the early-break optimisation works.
 */
export function buildStat(list: { createdAt: Date }[] = []): Stat {
    const now = new Date();
    const yesterday = subDays(now, 1);
    const sevenDaysAgo = subDays(now, 7);
    const monthStart = startOfMonth(now);

    const stat: Stat = {
        createdAt: now,
        className: 'stat',
        all: list.length,
        monthly: 0,
        weekly: 0,
        daily: 0,
    };

    for (const item of list) {
        // Items are sorted newest-first; once one falls outside a bucket,
        // all subsequent items will too, so we can break early.
        if (item.createdAt >= monthStart) {
            stat.monthly += 1;
        } else {
            break;
        }
        if (item.createdAt >= sevenDaysAgo) {
            stat.weekly += 1;
        } else {
            continue;
        }
        if (item.createdAt >= yesterday) {
            stat.daily += 1;
        }
    }

    return stat;
}
