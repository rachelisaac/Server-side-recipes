import mongoose from 'mongoose';

const DB_URL = process.env.MONGODB_URI ||"mongodb+srv://r0556722102:qCU4XmG5Qr0OJw5R@projectracheli.ti885.mongodb.net/";

async function connectToDB() {
    try {
        await mongoose.connect(DB_URL);
        console.log('mongo connected'); 
    } catch (error) { 
        console.log('mongo failed', error);
    } 
}
export { connectToDB };
