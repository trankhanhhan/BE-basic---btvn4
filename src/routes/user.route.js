import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/refresh', userController.refresh);
router.post('/logout', authMiddleware, userController.logout);
router.get('/users', authMiddleware, userController.getUsers);

export default router;