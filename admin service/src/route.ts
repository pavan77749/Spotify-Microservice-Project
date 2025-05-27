import express from 'express';
import uploadFile, { isAuth } from './middleware.js';
import { addAlbum, addSong } from './controller.js';

const router = express.Router();

router.post("/album/new",isAuth,uploadFile,addAlbum)
router.post("/song/new",isAuth,uploadFile,addSong); 

export default router;