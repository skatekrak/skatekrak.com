import express from 'express';
import validate from 'express-validation';
import Joi from 'joi';
import pushCtrl from '../controllers/pushes';
import auth from '../server/auth';

const router = express.Router();

const validations = {
    list: {
        query: {
            limit: Joi.number().positive(),
            skip: Joi.number(),
        },
    },
};

router.param('objectId', pushCtrl.load);

router
    .route('/')
    /** GET /pushes - Get list of pushes */
    .get(validate(validations.list), auth.logged(), auth.admin(), pushCtrl.list);

router
    .route('/:objectId')
    /** GET /pushes/:objectId -  Get push */
    .get(auth.logged(), auth.admin(), pushCtrl.get);

export default router;
