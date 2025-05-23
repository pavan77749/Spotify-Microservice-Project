import mongoose , {Document,Schema} from "mongoose";

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: string;
    playlist: string[];
}

const schema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    playlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Playlist',
    }],
}, { timestamps: true }); 

export const User = mongoose.model<IUser>('User', schema);