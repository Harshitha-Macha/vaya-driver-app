// import mongoose from 'mongoose';

// let isConnected = false;

// const connectMongo = async (): Promise<typeof mongoose> => {
//     if (isConnected) {
//         return mongoose;
//     }

//     try {
//         const conn = await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/vaya', {
//             bufferCommands: false,
//         });
//         isConnected = true;
//         return conn;
//     } catch (error) {
//         console.error('MongoDB connection error:', error);
//         throw error;
//     }
// };

// export default connectMongo;


import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

const connectMongo = async (): Promise<typeof mongoose> => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'VAYA1',
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectMongo;
