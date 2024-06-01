import httpStatus from 'http-status';

/**
 * Class representing an unhandled API error
 */
export class UnhandledAPIError extends Error {
    public readonly status: number;

    public readonly type: string;

    /**
     * Creates an Unhandled API error
     */
    constructor(err: Error) {
        super();
        this.status = httpStatus.INTERNAL_SERVER_ERROR;
        this.message = ['Unhandled server error'] as any;
        this.type = this.constructor.name;
        this.stack = err.stack;
    }
}

export default UnhandledAPIError;
