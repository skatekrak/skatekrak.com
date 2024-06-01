import express from 'express';
import { validate } from 'express-validation';
import Joi from 'joi';

import rewardCtrl from '../controllers/rewards';
import { REWARD_TYPE } from '../models/reward';
import auth from '../server/auth';
import defaultValidations from '../helpers/default-validations';

const router = express.Router();

const validation = {
    create: {
        body: Joi.object({
            type: Joi.string()
                .valid(...REWARD_TYPE)
                .required(),
            subtype: Joi.string().required(),
        }),
    },
};

router.param('objectId', validate(defaultValidations.objectId));

router.route('/').post(auth.admin(), validate(validation.create), rewardCtrl.create);

router.route('/:objectId').get(rewardCtrl.load, rewardCtrl.get).delete(rewardCtrl.load, rewardCtrl.remove);

export default router;
