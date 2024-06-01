import express from 'express';
import { validate } from 'express-validation';
import Joi from 'joi';
import payments from '../controllers/payments';
import auth from '../server/auth';

const router = express.Router();

const validation = {
    createCheckoutSession: {
        query: Joi.object().keys({
            currency: Joi.string().valid('eur', 'usd'),
        }),
    },
};

router.post(
    '/createCheckoutSession',
    validate(validation.createCheckoutSession),
    auth.logged(),
    auth.isNotSubscribed(),
    payments.generateCheckoutSessionURL,
);
router.post('/invoice', auth.isStripe(), payments.handleInvoice);
router.post('/customer.subscription.updated', auth.isStripe(), payments.handleCustomerUpdate);
router.get('/portal', auth.logged(), auth.isSubscribed(), payments.getCustomerPortalSession);

export default router;
