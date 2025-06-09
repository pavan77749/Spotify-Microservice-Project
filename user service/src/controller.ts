import TryCatch from "./TryCatch.js";
import { AuthRequest } from "./middleware.js";
import { User } from "./model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = TryCatch(async (req, res) => {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email});
    if (user) {
         res.status(400).json({
            message: "User already exists",
        });
       
    }

    const hashPassword = await bcrypt.hash(password, 10);
    user = await User.create({
        name,
        email,
        password: hashPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
        expiresIn: "7d",
    });

    res.status(201).json({
        message: "User registered successfully",
        user,
        token,
    });
});

export const loginUser = TryCatch(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
         res.status(400).json({
            message: "User not found",
        });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
         res.status(400).json({
            message: "Invalid credentials",
        });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
        expiresIn: "7d",
    });

    res.status(200).json({
        message: "User logged in successfully",
        user,
        token,
    });
}
);

export const myProfile = TryCatch(async (req:AuthRequest, res) => {
    const user = req.user;
    if (!user) {
         res.status(400).json({
            message: "Please login",
        });
    }
    res.status(200).json({
        message: "User profile",
        user,
    });
}
);

export const addPlaylist = TryCatch(async (req:AuthRequest, res) => {
  const userId = req.user?._id;

  const user = await User.findById(userId);
  if(!user){
    res.status(404).json({
      message: "User not found",
    });
    return
  }

  if (user?.playlist.includes(req.params.id)) {
      const index = user.playlist.indexOf(req.params.id);

      user.playlist.splice(index, 1);

      await user.save();

      res.json({
        message: " Removed from playlist",
      });
      return;
    }

    user.playlist.push(req.params.id);

    await user.save();

    res.json({
      message: "Added to PlayList",
    });
  }
);
