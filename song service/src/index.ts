import express from 'express';
import dotenv from 'dotenv';
import songRoutes from './route.js';
import redis from 'redis';


dotenv.config();

export const redisClient = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    }
});

redisClient.connect().then(() => {
    console.log('Connected to Redis');
}).catch((err) => {
    console.error('Error connecting to Redis:', err);
});


const app = express();
app.use(express.json());

app.use("/api/v1", songRoutes);


const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Song service is running on port ${port}`);
});
