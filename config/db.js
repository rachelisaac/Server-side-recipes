import mongoose from 'mongoose';

const DB_URL = process.env.MONGODB_URI ;

async function connectToDB() {
    try {
        await mongoose.connect(DB_URL);
        console.log('mongo connected'); 
    } catch (error) { 
        console.log('mongo failed', error);
    } 
}
export { connectToDB };
