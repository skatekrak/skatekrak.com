import { Document, Model, Types } from 'mongoose';
import twitterText from 'twitter-text';

import '../helpers/replace-all';
import mongoose from '../server/mongo';
import utils from './utils';

import { ILike, LikeSchema } from './like';
import { IProfile } from './profile';

export interface IComment extends Document {
    createdAt: Date;
    updatedAt: Date;
    className: string;
    _content: string;
    content?: string;
    addedBy: string | IProfile;
    hashtags: string[];
    usertags: string[];
    likes: ILike[];

    /**
     * Extract hashtags and usertages from content
     */
    extractTags(this: IComment): void;
}

export interface ICommentModel extends Model<IComment> {
    /**
     * Get comment
     */
    get(parent: { comments: Types.DocumentArray<IComment> }, id: Types.ObjectId): IComment;
}

export const CommentSchema = new mongoose.Schema(
    {
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
            default: 'comment',
        },
        _content: {
            type: String,
            required: true,
        },
        addedBy: {
            type: String,
            ref: 'Profile',
            required: true,
            index: true,
        },
        hashtags: {
            type: [String],
            index: true,
        },
        usertags: {
            type: [String],
            index: true,
        },
        likes: [LikeSchema],
    },
    utils.genSchemaConf((_, ret) => {
        delete ret._id;
        delete ret.__v;
        delete ret._content;
        return ret;
    }),
);

CommentSchema.virtual('content').get(function(this: IComment) {
    let content = this._content.repeat(1);
    for (let i = 0; i < this.usertags.length; i += 1) {
        const handle = this.usertags[i];
        content = content.replaceAll(`{{${i}}}`, `@${handle}`);
    }
    return content;
});

CommentSchema.methods = {
    extractTags(this: IComment): void {
        this.usertags = twitterText.extractMentions(this.content);
        this.hashtags = twitterText.extractHashtags(this.content).map((hashtag) => `#${hashtag.toLowerCase()}`);
        for (let i = 0; i < this.usertags.length; i += 1) {
            const handle = this.usertags[i];
            this._content = this._content.replaceAll(`@${handle}`, `{{${i}}}`);
        }
    },
};

CommentSchema.statics = {
    get(parent: { comments: Types.DocumentArray<IComment> }, id: Types.ObjectId): IComment {
        return parent.comments.id(id);
    },
};

export const Comment = mongoose.model<IComment, ICommentModel>('Comment', CommentSchema);

export default Comment;
