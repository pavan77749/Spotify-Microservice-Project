import express from 'express';
import { loginUser, myProfile, registerUser } from './controller.js';
import { isAuth } from './middleware.js';

const router = express.Router();

router.post('/user/register', registerUser);
router.post('/user/login', loginUser);
router.get('/user/me',isAuth, myProfile);

export default router;