import { NextFunction, Request, Response } from 'express';
import moment from 'moment';
import Stripe from 'stripe';
import httpStatus from 'http-status';
import geoip from 'geoip-lite';

import APIError from '../helpers/api-error';
import { fetchUserFromCustomer, handleInvoicePaymentFailed, handleInvoicePaymentSucceeded } from '../helpers/payments';
import stripe from '../helpers/stripe';
import User, { SubscriptionStatus } from '../models/user';
import config from '../server/config';
import logger from '../server/logger';

async function generateCheckoutSessionURL(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.id;
    let currency = (req.query?.currency as 'eur' | 'usd' | null) ?? null;

    if (req.query.currency == null) {
        const ip = (req.headers['x-forwarded-for'] as string).split(',')[0];
        console.log('ip', ip);
        if (ip) {
            const ipData = geoip.lookup(ip);
            console.log('ipdata', ipData);
            currency = 'usd';
            if (ipData != null) {
                currency = ipData.timezone.startsWith('Europe') ? 'eur' : 'usd';
            }
        }
    }

    const user = await User.get(userId);
    logger.debug('user', user);

    let customerId = user.stripeCustomerId;
    // If the current user doesn't have a stripe cus id, we double check with the email
    if (customerId == null) {
        const customers = await stripe.customers.list({ email: user.email, limit: 1 });
        logger.debug('customer', customers);

        if (customers.data.length <= 0) {
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: {
                    krak_user_id: userId,
                },
            });
            customerId = customer.id;
        } else {
            customerId = customers.data[0].id;
        }

        user.stripeCustomerId = customerId;
        await user.save();
    }

    let priceId = config.STRIPE_USD_PLAN;
    let paymentMethodTypes = ['card'];
    if (currency === 'eur') {
        priceId = config.STRIPE_EUR_PLAN;
        paymentMethodTypes = ['card', 'sepa_debit', 'bancontact'];
    }

    try {
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: paymentMethodTypes as any,
            mode: 'subscription',
            customer: customerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            cancel_url: 'https://skatekrak.com',
            success_url: 'https://skatekrak.com/success',
        });

        res.json({ url: checkoutSession.url, currency });
    } catch (err) {
        const error = err as Stripe.StripeInvalidRequestError;
        next(new APIError(error.message, error.statusCode ?? 500));
    }
}

async function handleInvoice(req: Request, res: Response) {
    switch (req.event.type) {
        case 'invoice.payment_succeeded':
            await handleInvoicePaymentSucceeded(req.event.data.object as Stripe.Invoice);
            break;
        case 'invoice.payment_failed':
            await handleInvoicePaymentFailed(req.event.data.object as Stripe.Invoice);
            break;
        default:
            res.status(httpStatus.BAD_GATEWAY).json({ message: 'event not supported here' });
            return;
    }

    res.json({ received: true });
}

async function handleCustomerUpdate(req: Request, res: Response) {
    const subscription = req.event.data as Stripe.Subscription;

    const user = await fetchUserFromCustomer(subscription.customer);

    if (subscription.cancel_at_period_end) {
        // User will end it's subscription
        logger.debug(`${user.id} has cancelled`, { customer: subscription.customer });
        user.subscriptionStatus = SubscriptionStatus.Cancelled;
        user.subscriptionEndAt = moment.unix(subscription.current_period_end).toDate();
        await user.save();
    }

    return res.json({ received: true });
}

async function getCustomerPortalSession(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.id;
    const user = await User.get(userId);

    if (user.stripeCustomerId == null) {
        return next(new APIError(['User has not payed once'], httpStatus.FORBIDDEN));
    }

    const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: 'https://skatekrak.com',
    });

    return res.json({ url: session.url });
}

export default {
    generateCheckoutSessionURL,
    handleInvoice,
    handleCustomerUpdate,
    getCustomerPortalSession,
};
