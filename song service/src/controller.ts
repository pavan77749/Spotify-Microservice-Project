import TryCatch from "./TryCatch.js";
import { sql } from "./config/db.js";
import { redisClient } from "./index.js";

export const getAllAlbums = TryCatch(async (req, res) => {
    let albums;
    const CACHE_EXPIRE_TIME = 1800; 

    if(redisClient.isReady) {
        const cachedAlbums = await redisClient.get("albums");
        if (cachedAlbums) {
            return res.status(200).json({
                message: "Albums fetched from cache",
                albums: JSON.parse(cachedAlbums),
            });
        }
        else {
            console.log("Cache miss for albums");
            albums = await sql`SELECT * FROM albums`;
            
            if(redisClient.isReady) {
                await redisClient.set("albums", JSON.stringify(albums), {
                    EX: CACHE_EXPIRE_TIME,  
                });
                console.log("Albums cached successfully");
    }
        }
    }

    try {
        albums = await sql`SELECT * FROM albums`;
    } catch (error) {
        return res.status(500).json({ message: "Error fetching albums" });
    }
    if (albums.length === 0) {
        return res.status(404).json({ message: "No albums found" });
    }
    res.status(200).json({
        message: "Albums fetched successfully",
        albums,
    });
}
);

export const getAllSongs = TryCatch(async (req, res) => {
    let songs;

     const CACHE_EXPIRE_TIME = 1800; 

    if(redisClient.isReady) {
        const cachedSongs = await redisClient.get("songs");
        if (cachedSongs) {
            return res.status(200).json({
                message: "Songs fetched from cache",
                albums: JSON.parse(cachedSongs),
            });
        }
        else {
            console.log("Cache miss for songs");
            songs = await sql`SELECT * FROM songs`;
            
            if(redisClient.isReady) {
                await redisClient.set("songs", JSON.stringify(songs), {
                    EX: CACHE_EXPIRE_TIME,  
                });
                console.log("Songs cached successfully");
    }
        }
    }

    try {
        songs = await sql`SELECT * FROM songs`;
    } catch (error) {
        return res.status(500).json({ message: "Error fetching songs" });
    }
    if (songs.length === 0) {
        return res.status(404).json({ message: "No songs found" });
    }
    res.status(200).json({
        message: "Songs fetched successfully",
        songs,
    });
});

export const getAllSongsofAlbum = TryCatch(async (req, res) => {
    const { id } = req.params;
    let songs , album;
    const CACHE_EXPIRE_TIME = 1800;

    if(redisClient.isReady) {
        const cachedSongs = await redisClient.get(`album:${id}`);
        if (cachedSongs) {
            return res.status(200).json({
                message: "Songs fetched from cache",
                songs: JSON.parse(cachedSongs),
            });
        }
        else {
            console.log("Cache miss for album songs");
            try {
                album = await sql`SELECT * FROM albums WHERE id = ${id}`;
                if (album.length === 0) {
                    return res.status(404).json({ message: "No album found with this id" });
                }
                songs = await sql`SELECT * FROM songs WHERE album_id = ${id}`;
                
                if(redisClient.isReady) {
                    await redisClient.set(`album:${id}`, JSON.stringify(songs), {
                        EX: CACHE_EXPIRE_TIME,  
                    });
                    console.log("Album songs cached successfully");
                }
            } catch (error) {
                return res.status(500).json({ message: "Error fetching album or songs" });
            }
        }
    }


    try {
        album = await sql`SELECT * FROM albums WHERE id = ${id}`;
    } catch (error) {
        return res.status(500).json({ message: "Error fetching album" });
    }
    if (album.length === 0) {
        return res.status(404).json({ message: "No album found with this id" });
    }
    try {
        songs = await sql`SELECT * FROM songs WHERE album_id = ${id}`;
    } catch (error) {
        return res.status(500).json({ message: "Error fetching songs" });
    }
    if (songs.length === 0) {
        return res.status(404).json({ message: "No songs found for this album" });
    }
    res.status(200).json({
        message: "Songs fetched successfully",
        songs,
        album: album[0],
    });
});

export const getSingleSong = TryCatch(async (req, res) => {

    const id = req.params.id;
    const CACHE_EXPIRE_TIME = 1800;
    if(redisClient.isReady) {
        const cachedSong = await redisClient.get(`song:${id}`);
        if (cachedSong) {
            return res.status(200).json({
                message: "Song fetched from cache",
                song: JSON.parse(cachedSong),
            });
        }
        else {
            console.log("Cache miss for song");
        }
    }
    if(redisClient.isReady) {
        const song = await sql`SELECT * FROM songs WHERE id = ${id}`;
        if (song.length === 0) {
            return res.status(404).json({ message: "No song found with this id" });
        }
        await redisClient.set(`song:${id}`, JSON.stringify(song[0]), {
            EX: CACHE_EXPIRE_TIME,  
        });
        console.log("Song cached successfully");
    }
    
    const song = await sql`SELECT * FROM songs WHERE id = ${id}`;

    res.status(200).json(
        song[0]
    );
});