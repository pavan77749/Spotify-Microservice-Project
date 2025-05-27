import express from 'express';
import uploadFile, { isAuth } from './middleware.js';
import { addAlbum, addSong, addThumbnail, deleteAlbum, deleteSong } from './controller.js';

const router = express.Router();

router.post("/album/new",isAuth,uploadFile,addAlbum)
router.post("/song/new",isAuth,uploadFile,addSong); 
router.post("/song/:id",isAuth,uploadFile,addThumbnail)
router.delete("/album/:id", isAuth, uploadFile,deleteAlbum);
router.delete("/song/:id", isAuth, uploadFile, deleteSong);

export default router;