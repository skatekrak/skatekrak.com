import express from 'express';
import validate from 'express-validation';
import Joi from 'joi';
import spotEditCtrl from '../controllers/spot-edits';
import auth from '../server/auth';
import defaultValidations from '../helpers/default-validations';

const router = express.Router();

const validation = {
    create: {
        body: Joi.object()
            .keys({
                name: Joi.string(),
                longitude: Joi.number(),
                latitude: Joi.number(),
                type: Joi.string().regex(/\b(private|diy|shop|street|park)\b/),
                status: Joi.string().regex(/\b(active|wip|rip)\b/),
                description: Joi.string(),
                indoor: Joi.bool(),
                phone: Joi.string(),
                website: Joi.string().uri(),
                instagram: Joi.string(),
                snapchat: Joi.string(),
                facebook: Joi.string(),
                mergeInto: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            })
            .min(1)
            .and('latitude', 'longitude')
            .without('mergeInto', [
                'name',
                'longitude',
                'latitude',
                'type',
                'status',
                'description',
                'indoor',
                'phone',
                'website',
                'instagram',
                'snapchat',
                'facebook',
            ]),
    },
};

router.param('objectId', validate(defaultValidations.objectId));

router
    .route('/')
    .get(auth.addedBy(), spotEditCtrl.all)
    .post(validate(validation.create), spotEditCtrl.create);

router
    .route('/:objectId')
    .get(spotEditCtrl.load, spotEditCtrl.get)
    .delete(spotEditCtrl.load, auth.addedBy(), spotEditCtrl.remove);

export default router;
