import httpStatus from 'http-status';

/**
 * Class representing an API error
 */
class APIError extends Error {
    public readonly status: number;

    public readonly type: string;

    /**
     * Creates an API error
     */
    constructor(msg: string | string[], status = httpStatus.INTERNAL_SERVER_ERROR, err?: Error) {
        if (Array.isArray(msg)) {
            super(msg[0]);
        } else {
            super(msg);
        }
        Error.captureStackTrace(this, this.constructor);
        this.message = msg as any;
        this.type = this.constructor.name;
        this.status = status;
        if (err) {
            this.stack += ` \n\n Override: ${err.stack}`;
        }
    }
}

export default APIError;
