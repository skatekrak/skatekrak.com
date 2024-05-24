import Stripe from 'stripe';
import RequestObject from '../../helpers/request-object';
import { Roles } from '../../models/user';

declare global {
    export namespace Express {
        interface Request {
            token?: string;
            object: RequestObject;
            user?: {
                _id: string;
                id: string;
                role: Roles;
            };
            rawBody: string | Buffer;
            event?: Stripe.Event;
        }

        interface User {
            _id: string;
            id: string;
            role: string;
        }
    }
}
