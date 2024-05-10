import { Document, Model } from 'mongoose';

import mongoose from '../server/mongo';

export interface IGear extends Document {
    trucks: string;
    hardware: string;
    wheels: string;
    grip: string;
    bearings: string;
    deck: string;
}

export type IGearModel = Model<IGear>;

export const GearSchema = new mongoose.Schema(
    {
        trucks: String,
        hardware: String,
        wheels: String,
        grip: String,
        bearings: String,
        deck: String,
    },
    {
        _id: false,
        id: false,
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    },
);

export const Gear = mongoose.model<IGear, IGearModel>('Gear', GearSchema);

export default Gear;
