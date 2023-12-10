import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const authRouter = Router();

/**
 * @description register a new user
 * @method POST
 * @route {host-url}/api/auth/register
 * @api public
 */
authRouter.post('/register', registerUser);

/**
 * @description user login for the session
 * @method POST
 * @route {host-url}/login
 * @api public
 */
authRouter.post('/login', loginUser);

export default authRouter;
