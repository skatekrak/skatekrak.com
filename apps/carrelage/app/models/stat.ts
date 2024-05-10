import { isWithinRange, startOfMonth, subDays } from 'date-fns';

import { Document, Schema, HydratedDocument, Model, Query, model } from 'mongoose';
import utils from './utils';

export enum Timeframes {
    Daily = 'daily',
    Weekly = 'weekly',
    Monthly = 'monthly',
    All = 'all',
}

export interface IStat {
    createdAt: Date;
    className: string;
    all: number;
    monthly: number;
    weekly: number;
    daily: number;
}

export interface IStatModel extends Model<IStat> {
    /**
     * Create stat from a list of content
     */
    build(this: IStatModel, list?: { createdAt: Date }[], allOnly?: boolean): IStat;
    /**
     * Create query
     */
    createQuery(query: Query<any, any>, path: string, timeframe?: Timeframes): void;
}

export const StatSchema = new Schema<IStat, IStatModel>(
    {
        createdAt: {
            type: Date,
            index: true,
            default: new Date().getTime(),
        },
        className: {
            type: String,
            default: 'stat',
        },
        all: {
            type: Number,
            required: true,
            index: true,
            default: 0,
        },
        monthly: {
            type: Number,
            index: true,
        },
        weekly: {
            type: Number,
            index: true,
        },
        daily: {
            type: Number,
            index: true,
        },
    },
    utils.genSchemaConf((doc, retJson) => {
        const ret = retJson;
        delete ret._id;
        delete ret.__v;
        // Remove old non updated results
        const now = new Date().getTime();
        const yesterday = subDays(now, 1);
        const sevenDaysAgo = subDays(now, 7);
        const monthStart = startOfMonth(now);
        if (!isWithinRange(doc.createdAt, monthStart, now)) {
            delete ret.monthly;
            delete ret.weekly;
            delete ret.daily;
        } else if (!isWithinRange(doc.createdAt, sevenDaysAgo, now)) {
            delete ret.weekly;
            delete ret.daily;
        } else if (!isWithinRange(doc.createdAt, yesterday, now)) {
            delete ret.daily;
        }
        return ret;
    }, false),
);

/**
 * Statics
 */
StatSchema.statics = {
    build(this, list: { createdAt: Date }[] = [], allOnly = false): IStat {
        const now = new Date().getTime();
        const yesterday = subDays(now, 1);
        const sevenDaysAgo = subDays(now, 7);
        const monthStart = startOfMonth(now);
        const stat = new this({ all: list.length });
        if (!allOnly) {
            stat.monthly = 0;
            stat.weekly = 0;
            stat.daily = 0;
            for (const item of list) {
                if (isWithinRange(item.createdAt, monthStart, now)) {
                    stat.monthly += 1;
                } else {
                    break;
                }
                if (isWithinRange(item.createdAt, sevenDaysAgo, now)) {
                    stat.weekly += 1;
                } else {
                    break;
                }
                if (isWithinRange(item.createdAt, yesterday, now)) {
                    stat.daily += 1;
                }
            }
        }
        return stat;
    },
    createQuery(query: Query<IStatModel, IStatModel>, path: string, timeframe: Timeframes = Timeframes.All): void {
        const now = new Date().getTime();
        const yesterday = subDays(now, 1);
        const sevenDaysAgo = subDays(now, 7);
        const monthStart = startOfMonth(now);
        switch (timeframe) {
            case Timeframes.Daily:
                query.where(`${path}.createdAt`).gte(yesterday.getTime());
                break;
            case Timeframes.Weekly:
                query.where(`${path}.createdAt`).gte(sevenDaysAgo.getTime());
                break;
            case Timeframes.Monthly:
                query.where(`${path}.createdAt`).gte(monthStart.getTime());
                break;
            default:
                break;
        }
        query.sort(`-${path}.${timeframe}`);
    },
};

export const Stat = model<IStat, IStatModel>('Stat', StatSchema);
export type StatDocument = HydratedDocument<IStat, IStatModel, Document<IStat, IStatModel>>;

export default Stat;
