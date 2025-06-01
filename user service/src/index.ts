import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './route.js'
import cors from 'cors';

dotenv.config();

const connectDB = async () => {
    try {
         mongoose.connect(process.env.MONGO_URI as string, {
            dbName: 'spotify',
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*', // Allow all origins or specify your frontend URL
}));

app.use("/api/v1", userRoutes);



const PORT = process.env.PORT || 5000;

app.listen(5000, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
    });