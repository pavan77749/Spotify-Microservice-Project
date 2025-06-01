import express from 'express';
import { getAllAlbums,getAllSongs, getAllSongsofAlbum, getSingleSong } from './controller.js';

const router = express.Router();

router.get("/album/all", getAllAlbums);
router.get("/song/all", getAllSongs);
router.get("/album/:id", getAllSongsofAlbum); 
router.get("/song/:id",getSingleSong);



export default router;