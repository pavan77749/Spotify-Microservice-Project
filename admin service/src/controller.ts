import getBuffer from "./config/dataUri.js";
import TryCatch from "./TryCatch.js";
import cloudinary from "cloudinary";
import { sql } from "./config/db.js";
import { Request, Response } from "express";

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