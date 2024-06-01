import express from 'express';
import { validate } from 'express-validation';
// import Joi from "joi";

import defaultValidations from '../helpers/default-validations';
import feedCtrl from '../controllers/feeds';
import auth from '../server/auth';

const router = express.Router();

router
    .route('/direct')
    /** GET /feeds/direct */
    .get(auth.logged(), feedCtrl.direct);

router
    .route('/personal')
    /** GET /feeds/personal */
    .get(validate(defaultValidations.feed), auth.logged(), feedCtrl.loadProfile, feedCtrl.personal);

router
    .route('/explore')
    /** GET /feeds/explore */
    .get(validate(defaultValidations.feed), auth.logged(), feedCtrl.loadProfile, feedCtrl.explore);

export default router;
