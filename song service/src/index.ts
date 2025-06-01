import express from 'express';
import dotenv from 'dotenv';
import songRoutes from './route.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/v1", songRoutes);


const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Song service is running on port ${port}`);
});
