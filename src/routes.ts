import express from 'express';
import * as authController from './controllers/auth/authController';
import * as userController from './controllers/user/userController';
import { authenticateToken } from './middleware/validateTokenMiddleware';

//
const router = express.Router();

//auth
router.post('/auth/register', authController.userRegisterController);
router.post('/auth/signin', authController.userSignInController);

//user-profile - required auth
router.get('/user/:id', authenticateToken, userController.getUserController);
router.put('/user', userController.updateUserController);

export default router;
