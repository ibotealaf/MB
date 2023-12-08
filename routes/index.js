import { Router } from 'express';
import authRouter from './authRoute.js';
import taskRouter from './taskRoute.js';
import { detokenize } from '../utils/middlewares.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/tasks', detokenize, taskRouter);

export default router;
