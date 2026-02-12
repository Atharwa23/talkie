import mongoose from 'mongoose';

async function dbConnect() {
    if(mongoose.connection.readyState) {
        console.log('Already connected to the database');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '')
        console.log('Connected to the database', db);
    } catch (error) {
        console.error('Error connecting to the database', error);
        process.exit(1);
    }
}

export default dbConnect;