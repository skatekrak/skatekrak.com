import express from 'express';
import { validate } from 'express-validation';
import likeCtrl from '../controllers/like';
import auth from '../server/auth';
import defaultValidations from '../helpers/default-validations';

const router = express.Router();

router.param('objectId', validate(defaultValidations.objectId));

router
    .route('/')
    /** POST /likes - Create new like */
    .post(likeCtrl.create);

router
    .route('/:objectId')
    /** GET /likes/:likeId - Get like */
    .get(likeCtrl.load, likeCtrl.get)

    /** DELETE /likes/:likeId - Delete existings like */
    .delete(likeCtrl.load, auth.addedBy(), likeCtrl.remove);

export default router;
