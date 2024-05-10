import express from 'express';

import config from '../server/config';

import healthCtrl from '../controllers/health';

import authRoutes from './auth';
import userRoutes from './users';
import profileRoutes from './profiles';
import feedRoutes from './feeds';
import spotRoutes from './spots';
import mediaRoutes from './medias';
import notificationRoutes from './notifications';
import sessionRoutes from './sessions';
import feedbackRoutes from './feedbacks';
import clipRoutes from './clips';
import pushRoutes from './pushes';
import trickRoutes from './tricks';
import contestRoutes from './contests';
import adminRoutes from './admin';
import trickDoneRoutes from './tricks-done';
import publicRoutes from './public';
import paymentsRoutes from './payments';

import devRoutes from './dev';

const router = express.Router();

router.get('/', healthCtrl.healthCheck);

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);
router.use('/profiles', profileRoutes);
router.use('/feeds', feedRoutes);
router.use('/spots', spotRoutes);
router.use('/medias', mediaRoutes);
router.use('/notifications', notificationRoutes);
router.use('/sessions', sessionRoutes);
router.use('/feedbacks', feedbackRoutes);
router.use('/clips', clipRoutes);
router.use('/pushes', pushRoutes);
router.use('/tricks', trickRoutes);
router.use('/contests', contestRoutes);
router.use('/tricks-done', trickDoneRoutes);
router.use('/public', publicRoutes);
router.use('/payments', paymentsRoutes);

if (config.NODE_ENV === 'development' || config.NODE_ENV === 'test') {
    router.use('/dev', devRoutes);
}

export default router;
