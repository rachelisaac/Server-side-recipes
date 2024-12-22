import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables here

const DB_URL = process.env.MONGODB_URI;

async function connectToDB() {
    try {
        if (!DB_URL) {
            throw new Error('MongoDB URI is undefined. Check your .env file.');
        }
        await mongoose.connect(DB_URL);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed', error);
    }
}

export { connectToDB };


