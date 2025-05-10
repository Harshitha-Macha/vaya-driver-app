import mongoose from 'mongoose';

let isConnected = false;

const connectMongo = async (): Promise<typeof mongoose> => {
    if (isConnected) {
        return mongoose;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/vaya', {
            bufferCommands: false,
        });
        isConnected = true;
        return conn;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

export default connectMongo;