import express from 'express';
import { validate } from 'express-validation';
import Joi from 'joi';

import publicCtrl from '../controllers/public';

const router = express.Router();

const validation = {
    overview: {
        query: Joi.object({
            limit: Joi.number().positive().default(6),
        }),
    },
};

router.get('/overview', validate(validation.overview), publicCtrl.overview);

export default router;
