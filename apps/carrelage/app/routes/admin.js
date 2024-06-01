import express from 'express';
import { validate } from 'express-validation';
import Joi from 'joi';

import auth from '../server/auth';
import adminCtrl from '../controllers/admin';
import defaultValidations from '../helpers/default-validations';
import { SubscriptionStatus } from '../models/user';

const router = express.Router();

const validations = {
    apply_db_script: {
        query: Joi.object({
            script: Joi.string().required(),
            safe: Joi.boolean().default(true),
        }),
    },
    added_by_null: {
        query: Joi.object({
            object: Joi.string().allow('media', 'spot', 'session', 'clip').required(),
        }),
    },
    updateSubscription: {
        body: Joi.object().keys({
            userId: Joi.string().required(),
            status: Joi.string()
                .valid(...Object.values(SubscriptionStatus))
                .required(),
            subscriptionEndAt: Joi.date(),
            stripeCustomerId: Joi.string(),
        }),
    },
    getStats: {
        query: Joi.object({
            from: Joi.date().required(),
            to: Joi.date().required(),
        }),
    },
};

router.param('userId', validate(defaultValidations.userId));

router.get('/check', auth.logged(), auth.admin(), adminCtrl.check);

router.post('/import-tricks', auth.logged(), auth.admin(), adminCtrl.importTricksFromAirtable);

router.route('/tokens/:userId').get(auth.logged(), auth.admin(), adminCtrl.listUsernameTokens);
router.route('/revoke-all/:userId').delete(auth.logged(), auth.admin(), adminCtrl.revokeAllTokens);

router.post(
    '/apply-db-script',
    validate(validations.apply_db_script),
    auth.logged(),
    auth.admin(),
    adminCtrl.applyDBScript,
);

router.get('/added-by-null', auth.logged(), auth.admin(), validate(validations.added_by_null), adminCtrl.addedByNull);

router.post('/generate-algolia-index', auth.logged(), auth.admin(), adminCtrl.createAlgoliaSpotIndex);
router.post('/recompute-stats', auth.logged(), auth.admin(), adminCtrl.recomputeStats);
router.post(
    '/update-subscription',
    validate(validations.updateSubscription),
    auth.logged(),
    auth.admin(),
    adminCtrl.updateSubscriptionOfUser,
);

router.get('/stats', auth.logged(), auth.admin(), validate(validations.getStats), adminCtrl.getStats);

export default router;
