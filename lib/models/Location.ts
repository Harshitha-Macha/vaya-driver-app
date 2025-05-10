import mongoose, { Document } from 'mongoose';

export interface ILocation extends Document {
    district: string;
    town: string;
    zones: string[];
}

const LocationSchema = new mongoose.Schema({
    district: { 
        type: String, 
        required: true 
    },
    town: { 
        type: String, 
        required: true 
    },
    zones: [{ 
        type: String 
    }]
}, {
    timestamps: true
});

export const Location = (mongoose.models.Location as mongoose.Model<ILocation>) || 
    mongoose.model<ILocation>('Location', LocationSchema);
