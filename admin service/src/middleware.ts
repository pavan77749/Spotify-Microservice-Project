import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface IUser  {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    playlist: string[];
}

interface AuthenticatedRequest extends Request {
    user?: IUser | null;
}

export const isAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
   

    try {
       const token = req.headers.token as string;
    if (!token) {
         res.status(401).json({ message: 'Please login' });
         return;
    }

    const {data} = await axios.get( `${process.env.User_URL}/api/v1/user/me`, {
        headers: {
            token,
        },
    });
   
    req.user = data.user as IUser;
    next();

    } catch (error) {
         res.status(401).json({ message: 'Please Login' });
    }
}


// multer middleware for file uploads
import multer from 'multer';
const storage = multer.memoryStorage();
const uploadFile = multer({ storage }).single('file');

export default uploadFile;
