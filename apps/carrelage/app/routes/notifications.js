import express from 'express';
import validate from 'express-validation';
import Joi from 'joi';
import notificationCtrl from '../controllers/notifications';
import auth from '../server/auth';

const router = express.Router();

const validations = {
    list: {
        query: Joi.object({
            limit: Joi.number().positive(),
            skip: Joi.number(),
        }),
    },
};

router
    .route('/')
    /** GET /notifications - Get list of notifications */
    .get(auth.logged(), validate(validations.list), notificationCtrl.list);

export default router;
