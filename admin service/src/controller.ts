import getBuffer from "./config/dataUri.js";
import TryCatch from "./TryCatch.js";
import cloudinary from "cloudinary";
import { sql } from "./config/db.js";
import { Request, Response } from "express";
import { redisClient } from "./index.js";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
//   file?: Express.Multer.File;
}

export const addAlbum = TryCatch(async (req: AuthenticatedRequest, res) => {
      console.log("User info:", req.user);
  if (req.user?.role !== "admin") {
    res.status(401).json({
      message: "You are not admin",
    });
    return;
  }

 const { title, description } = req.body;

  const file = req.file;
  if (!file) {
    res.status(400).json({ message: "File is required" });
    return;
  }
  const fileBuffer = getBuffer(file);
  if (!fileBuffer || !fileBuffer.content) {
     res.status(400).json({
      message: "Failed to generate file buffer",
    });
    return
  }

  const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
    folder: "albums",
  });

  const result = await sql`
    INSERT INTO albums (title, description, thumbnail)
    VALUES (${title}, ${description}, ${cloud.secure_url})
    RETURNING *;
  `;

  if(redisClient.isReady) {
    await redisClient.del("albums"); // Invalidate the cache for albums
    console.log("Cache for albums invalidated");
  }   
  

  res.status(201).json({
    message: "Album added successfully",
    album: result[0],
  });
});

export const addSong = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    res.status(401).json({
      message: "You are not admin",
    });
    return;
  }

  const { title, description, album } = req.body;

  const isAlbum = await sql`SELECT * FROM albums WHERE id = ${album}`;

  if (isAlbum.length === 0) {
    res.status(404).json({
      message: "No album with this id",
    });
    return;
  }

  const file = req.file;

  if (!file) {
    res.status(400).json({
      message: "No file to upload",
    });
    return;
  }

  

  const fileBuffer = getBuffer(file);

  if (!fileBuffer || !fileBuffer.content) {
    res.status(500).json({
      message: "Failed to generate file buffer",
    });
    return;
  }

  const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
    folder: "songs",
    resource_type: "video",
  });

  const result = await sql`
    INSERT INTO songs (title, description, audio, album_id) VALUES
    (${title}, ${description}, ${cloud.secure_url}, ${album})
  `;

  if(redisClient.isReady) {
    await redisClient.del("songs"); // Invalidate the cache for songs
    console.log("Cache for songs invalidated");
  }


  res.json({
    message: "Song Added",
  });
});

export const addThumbnail = TryCatch(async (req: AuthenticatedRequest, res) => {
  try {
    if (req.user?.role !== "admin") {
      res.status(401).json({
        message: "You are not admin",
      });
      return;
    }
    const song = await sql`
      SELECT * FROM songs WHERE id = ${req.params.id};
    `;
    if (song.length === 0) {
      res.status(404).json({
        message: "No song with this id",
      });
      return;
    }
    const file = req.file;
    if (!file) {
      res.status(400).json({
        message: "No file to upload",
      });
      return;
    }
    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
      res.status(500).json({
        message: "Failed to generate file buffer",
      });
      return;
    }
    const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content);

    const result = await sql`
      UPDATE songs
      SET thumbnail = ${cloud.secure_url}
      WHERE id = ${req.params.id}
      RETURNING *;
    `;

    if(redisClient.isReady) {
      await redisClient.del("songs"); // Invalidate the cache for songs
      console.log("Cache for songs invalidated");
    }

    res.status(200).json({
      message: "Thumbnail added successfully",
      song: result[0],
    });

  } catch (error) {
    console.error("Error in addThumbnail:", error);
    res.status(500).json({
      message: "Internal server error",
    }); 

  }
});

export const deleteAlbum = TryCatch(async (req: AuthenticatedRequest, res) => {
  try {
    if (req.user?.role !== "admin") {
      res.status(401).json({
        message: "You are not admin",
      });
      return;
    }
    const albumId = req.params.id;
    const album = await sql`
      SELECT * FROM albums WHERE id = ${albumId};
    `;
    if (album.length === 0) {
      res.status(404).json({
        message: "No album with this id",
      });
      return;
    }
    // Delete the album from the database
    await sql`
      DELETE FROM albums WHERE id = ${albumId};
    `;
    // Optionally, you can also delete the associated songs if needed
    await sql`
      DELETE FROM songs WHERE album_id = ${albumId};
    `;

       if(redisClient.isReady) {
      await redisClient.del("albums"); 
      console.log("Cache for songs invalidated");
    }

    if(redisClient.isReady) {
      await redisClient.del("songs"); // Invalidate the cache for songs
      console.log("Cache for albums invalidated");
    }

    res.status(200).json({
      message: "Album deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteAlbum:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

export const deleteSong = TryCatch(async (req: AuthenticatedRequest, res) => {
  try {
    if (req.user?.role !== "admin") {
      res.status(401).json({
        message: "You are not admin",
      });
      return;
    }
    const songId = req.params.id;
    const song = await sql`
      SELECT * FROM songs WHERE id = ${songId};
    `;
    if (song.length === 0) {
      res.status(404).json({
        message: "No song with this id",
      });
      return;
    }
    // Delete the song from the database
    await sql`
      DELETE FROM songs WHERE id = ${songId};
    `;

 

    if(redisClient.isReady) {
      await redisClient.del("songs"); // Invalidate the cache for songs
      console.log("Cache for songs invalidated");
    }


    
    res.status(200).json({
      message: "Song deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteSong:", error);
  }
});