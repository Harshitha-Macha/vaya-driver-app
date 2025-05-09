import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
    telegramId: string;
    preferredLanguage: string;
    role: 'USER' | 'DRIVER' | 'ADMIN';
    district?: string;
    town?: string;
    currentZone?: string;
    isOnline?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new mongoose.Schema({
    telegramId: { 
        type: String, 
        required: true, 
        unique: true,
        index: true 
    },
    preferredLanguage: { 
        type: String, 
        required: true,
        enum: ['en', 'hi', 'te']
    },
    role: { 
        type: String, 
        required: true, 
        default: 'USER',
        enum: ['USER', 'DRIVER', 'ADMIN']
    },
    district: { type: String },
    town: { type: String },
    currentZone: { type: String },
    isOnline: { type: Boolean, default: true }
}, { 
    timestamps: true,
    versionKey: false
});

export const User = (mongoose.models.User as mongoose.Model<IUser>) || 
    mongoose.model<IUser>('User', UserSchema);
