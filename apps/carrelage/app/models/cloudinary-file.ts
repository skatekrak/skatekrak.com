import { Document, Model } from 'mongoose';

import mongoose from '../server/mongo';

export interface ICloudinaryFile extends Document {
    publicId: string;
    version: string;
    url: string;
    format: string;
    width: string;
    height: string;
    jpg: string;
}

type ICloudinaryFileModel = Model<ICloudinaryFile>;

export const CloudinaryFileSchema = new mongoose.Schema(
    {
        publicId: {
            type: String,
            required: true,
            sparse: true,
        },
        version: {
            type: String,
        },
        url: {
            type: String,
            required: true,
            match: [
                /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&amp;:/~+#]*[\w\-@?^=%&amp;/~+#])?/,
                'The value of path {PATH} ({VALUE}) is not a valid URL.',
            ],
        },
        format: {
            type: String,
        },
        width: {
            type: Number,
        },
        height: {
            type: Number,
        },
    },
    {
        _id: false,
        id: false,
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    },
);

CloudinaryFileSchema.virtual('jpg').get(function(this: ICloudinaryFile) {
    return this.url.replace(/\.webp$/, '.jpg');
});

export const CloudinaryFile = mongoose.model<ICloudinaryFile, ICloudinaryFileModel>(
    'CloudinaryFile',
    CloudinaryFileSchema,
);

export default CloudinaryFile;
