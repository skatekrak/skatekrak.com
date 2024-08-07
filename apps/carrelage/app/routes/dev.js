import express from 'express';
import { validate } from 'express-validation';
import Joi from 'joi';

import auth from '../server/auth';
import devCtrl from '../controllers/dev';

const router = express.Router();

const validBadRequest = {
    body: Joi.object({
        arg1: Joi.string().required(),
        arg2: Joi.string().required(),
    }),
};

router.get('/need-admin', auth.logged(), auth.admin(), devCtrl.trueBullshit);

router.get('/create-error-msg', devCtrl.createErrorMsg);

router.get('/test-error', devCtrl.testError);

router.post('/badrequest', validate(validBadRequest), devCtrl.trueBullshit);

export default router;
