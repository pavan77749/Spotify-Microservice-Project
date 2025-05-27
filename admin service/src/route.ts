import express from 'express';
import uploadFile, { isAuth } from './middleware.js';
import { addAlbum } from './controller.js';

const router = express.Router();

router.post("/album/new",isAuth,uploadFile,addAlbum)

export default router;