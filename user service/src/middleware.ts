import { Request,Response,NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser, User } from "./model.js";

export interface AuthRequest extends Request {
    user?:IUser | null;
}

export const isAuth = async (req: AuthRequest, res: Response, next: NextFunction) :
Promise<void> => {
    const token = req.headers.token as string;
    if (!token) {
         res.status(401).json({
            message: "Unauthorized",
        });
    }
    try {
        const decodedValue = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        if (!decodedValue || !decodedValue.id) {
                res.status(401).json({
                    message: "Invalid token",
                });
                return;
            }

        const userId = decodedValue.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            res.status(401).json({
                message: "User not found",
            });
            return;
        }
        req.user = user;
        next();
    } catch (error) {
         res.status(401).json({
            message: "Unauthorized",
        });
    }
}


