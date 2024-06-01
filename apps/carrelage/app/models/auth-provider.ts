import { Document, Model } from 'mongoose';

import mongoose from '../server/mongo';

interface IFacebookProvider {
    user_id: string;
    access_token: string;
    expires_at: Date;
}

interface IAppleProvider {
    apple_id: string;
}

export interface IAuthProvider extends Document {
    facebook: IFacebookProvider;
    apple: IAppleProvider;
}

type IAuthProviderModel = Model<IAuthProvider>;

export const AuthProviderSchema = new mongoose.Schema(
    {
        facebook: {
            user_id: String,
            access_token: String,
            expires_at: Date,
        },
        apple: {
            apple_id: String,
        },
    },
    { _id: false },
);

export const AuthProvider = mongoose.model<IAuthProvider, IAuthProviderModel>('AuthProvider', AuthProviderSchema);

export default AuthProvider;
