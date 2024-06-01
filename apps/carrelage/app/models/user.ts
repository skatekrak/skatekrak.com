import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import httpStatus from 'http-status';
import moment from 'moment';
import { Document, Model, Types } from 'mongoose';

import APIError from '../helpers/api-error';
import * as mails from '../helpers/mails';
import config from '../server/config';
import logger from '../server/logger';
import mongoose from '../server/mongo';
import { AuthProviderSchema, IAuthProvider } from './auth-provider';
import { DeviceType, IInstallation, InstallationSchema } from './installation';
import Profile from './profile';
import utils from './utils';

export enum Roles {
    User = 'user',
    Moderator = 'moderator',
    Admin = 'admin',
}

export enum SubscriptionStatus {
    Active = 'active',
    Expired = 'expired',
    Cancelled = 'cancelled',
    None = 'none',
}

export interface IUser extends Document {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    className: string;
    username: string;
    usernameValid: boolean;
    role: Roles;
    password: string;
    email: string;
    emailVerified: boolean;
    emailConfirmationToken: string;
    welcomeMailSent: boolean;
    installations: Types.DocumentArray<IInstallation>;
    auth: IAuthProvider;
    resetPasswordToken: string;
    resetPasswordExpires: Date;
    receiveNewsletter: boolean;
    subscriptionStatus: SubscriptionStatus;
    stripeCustomerId?: string;
    subscriptionEndAt?: Date;

    /**
     * Get list of installations of the platform
     */
    getInstallations(this: IUser, platform: DeviceType): IInstallation[];
    /**
     * Generate a new confirmation token for the user
     */
    generateEmailConfirmationToken(): void;
    /**
     * Send the confirmation email
     */
    sendConfirmationEmail(): Promise<any>;
}

export interface IUserModel extends Model<IUser> {
    /**
     * Check if user exist
     */
    exist(this: IUserModel, id: string): Promise<boolean>;
    /**
     * Check if user email already exist
     */
    existEmail(this: IUserModel, email: string): Promise<boolean>;
    /**
     * Get user
     */
    get(this: IUserModel, id: string): Promise<IUser>;
    /**
     * Find User by Email address
     */
    byEmail(this: IUserModel, email: string): Promise<IUser>;
    /**
     * Find User by reset password token
     */
    byResetToken(this: IUserModel, token: string): Promise<IUser>;
    /**
     * Find user by Stripe customer id
     */
    byStripeCustomerID(this: IUserModel, customerId: string): Promise<IUser>;
    /**
     * List users in descending order of creation
     */
    list(this: IUserModel, { skip, limit, email }: { skip?: number; limit?: number; email?: string }): Promise<IUser[]>;
    /**
     * Create a new user w/ empty profile
     */
    creator(this: IUserModel, username: string, password: string, email: string, role?: Roles): Promise<IUser>;
    /**
     * Ensure root user is created
     */
    ensureRootCreation(this: IUserModel, email: string, password: string): Promise<IUser>;
}

export const UserSchema = new mongoose.Schema<IUser>(
    {
        _id: {
            type: String,
            // match: [/^[a-z0-9_]{1,15}$/, "The value of path {PATH} ({VALUE}) is not a valid username."],
            required: true,
        },
        createdAt: {
            type: Date,
            index: true,
        },
        updatedAt: {
            type: Date,
            index: true,
        },
        className: {
            type: String,
            default: 'user',
        },
        role: {
            type: String,
            required: true,
            enum: Object.values(Roles),
            default: Roles.User,
        },
        password: {
            type: String,
            set: (password: string) => {
                const salt = bcrypt.genSaltSync(10);
                return bcrypt.hashSync(password, salt);
            },
        },
        email: {
            type: String,
            unique: true,
            sparse: true,
            // match: [/([\w\.]+)@([\w\.]+)\.(\w+)/, "The value of path {PATH} ({VALUE}) is not a valid email address."],
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        emailConfirmationToken: String,
        welcomeMailSent: {
            type: Boolean,
            default: false,
        },
        installations: [InstallationSchema],
        auth: AuthProviderSchema,
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        receiveNewsletter: {
            type: Boolean,
            default: false,
        },
        subscriptionStatus: {
            type: String,
            required: true,
            enum: Object.values(SubscriptionStatus),
            default: SubscriptionStatus.None,
        },
        stripeCustomerId: String,
        subscriptionEndAt: Date,
    },
    utils.genSchemaConf((_, ret) => {
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpires;
        delete ret.emailConfirmationToken;
        delete ret.__parse_id;
        return ret;
    }),
);

UserSchema.index({ _id: 'text', email: 'text' });

/**
 * Virtuals fields
 */
UserSchema.virtual('username').get(function(this: IUser) {
    return this._id ? this._id : null;
});

UserSchema.virtual('usernameValid').get(function(this: IUser) {
    return /^[a-z0-9_]{1,15}$/.test(this._id);
});

/**
 * Pre-save hooks
 */
UserSchema.pre('save', function(this: IUser, next: () => void) {
    if (this.isNew && this.email && config.NODE_ENV !== 'test' && this.id !== 'root') {
        this.sendConfirmationEmail();
        this.welcomeMailSent = true;
    }
    next();
});

/**
 * Methods
 */
UserSchema.methods = {
    getInstallations(this: IUser, platform: DeviceType): IInstallation[] {
        return this.installations
            .filter((install) => {
                if (install.deviceType === platform) {
                    return install;
                }
                return null;
            })
            .map((filteredInstall) => filteredInstall);
    },
    generateEmailConfirmationToken(this: IUser): void {
        this.emailConfirmationToken = crypto.randomBytes(20).toString('hex');
    },
    sendConfirmationEmail(this: IUser): Promise<any> {
        if (!this.email) {
            throw new Error("User doesn't have any email");
        }

        if (this.emailVerified) {
            throw new Error("User's email is already verified");
        }

        if (!this.emailConfirmationToken) {
            this.generateEmailConfirmationToken();
        }

        logger.debug('Sending welcome email to', this.id);

        const link = `${config.FRONT_URL}/confirm-email?token=${this.emailConfirmationToken}`;

        const mailOptions = {
            from: '"Krak" <hey@skatekrak.com>',
            to: this.email,
            subject: 'Confirm your email',
            html:
                'Hey there,<br/><br/>' +
                'Welcome on the Krak world!<br/>' +
                'Please click on the following link, or paste this into your browser to confirm your email (no spam, promise):<br/><br/>' +
                `<a href="${link}">${link}</a><br/><br/>` +
                'The Krak Team',
        };

        return mails.send(mailOptions);
    },
    isSubscribed(this: IUser): boolean {
        if (this.subscriptionEndAt != null && moment(this.subscriptionEndAt).isAfter(moment.now())) {
            return true;
        }

        return (
            this.subscriptionStatus !== SubscriptionStatus.Expired &&
            this.subscriptionStatus !== SubscriptionStatus.None
        );
    },
};

/**
 * Statics
 */
UserSchema.statics = {
    exist(this, id: string): Promise<boolean> {
        return this.findById(id)
            .exec()
            .then((user: IUser) => user !== null);
    },
    existEmail(this, email: string): Promise<boolean> {
        return this.findOne({ email })
            .exec()
            .then((user: IUser) => user !== null);
    },
    get(this, id: string): Promise<IUser> {
        return this.findById(id)
            .exec()
            .then((user: IUser) => {
                if (user) {
                    return user;
                }
                throw new APIError(['No such user exists'], httpStatus.NOT_FOUND);
            });
    },
    byEmail(this, email: string): Promise<IUser> {
        return this.findOne({ email })
            .exec()
            .then((user: IUser) => {
                if (user) {
                    return user;
                }
                throw new APIError(['No such email exists'], httpStatus.NOT_FOUND);
            });
    },
    byResetToken(this, token: string): Promise<IUser> {
        return this.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: {
                $gt: new Date(),
            },
        }).then((user: IUser) => {
            if (user) {
                return user;
            }
            throw new APIError(['No such user exists'], httpStatus.NOT_FOUND);
        });
    },
    byStripeCustomerID(this: IUserModel, customerId: string): Promise<IUser> {
        return this.findOne({
            stripeCustomerId: customerId,
        }).then((user) => {
            if (user) {
                return user;
            }
            throw new APIError(['No such user exists'], httpStatus.NOT_FOUND);
        });
    },
    list(
        this: IUserModel,
        { skip = 0, limit = 20, email }: { skip?: number; limit?: number; email?: string },
    ): Promise<IUser[]> {
        const query: { email?: string } = {};
        if (email) {
            query.email = email;
        }
        return this.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
    },
    creator(this: IUserModel, username: string, password: string, email: string, role?: Roles): Promise<IUser> {
        const user = new this();
        user._id = username;
        user.password = password;
        user.email = email;
        if (role) {
            user.role = role;
        }
        return Profile.build(username).then(() => user.save());
    },
    ensureRootCreation(this: IUserModel, email: string, password: string): Promise<IUser> {
        return Profile.build('root')
            .then(() => this.findById('root').exec())
            .then((exist) => {
                let user;
                if (exist) {
                    user = exist;
                } else {
                    user = new this();
                    user._id = 'root';
                }
                user.role = Roles.Admin;
                user.email = email;
                user.password = password;
                return user.save();
            });
    },
};

export const User = mongoose.model<IUser, IUserModel>('User', UserSchema);

export default User;
