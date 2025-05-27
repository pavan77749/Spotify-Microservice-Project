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
