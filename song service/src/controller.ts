import TryCatch from "./TryCatch.js";
import { sql } from "./config/db.js";

export const getAllAlbums = TryCatch(async (req, res) => {
    let albums;

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
    
    const song = await sql`SELECT * FROM songs WHERE id = ${req.params.id}`;

    res.status(200).json(
        song[0]
    );
});