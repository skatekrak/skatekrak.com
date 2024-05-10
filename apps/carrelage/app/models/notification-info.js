import mongoose from '../server/mongo';

export const NotificationInfoSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
        },
        className: {
            type: String,
            enum: ['media', 'session', 'clip', 'comment', 'like', 'spot', 'trick-done'],
            required: true,
        },
        url: {
            type: String,
            match: [
                /(https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&amp;:/~+#]*[\w\-@?^=%&amp;/~+#])?/,
                'The value of path {PATH} ({VALUE}) is not a valid URL.',
            ],
        },
        content: String,
    },
    { _id: false },
);

/**
 * @typedef NotificationInfo
 */
export default mongoose.model('NotificationInfo', NotificationInfoSchema);
