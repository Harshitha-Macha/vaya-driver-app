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
        type: String,
        required: true 
    }]
}, {
    timestamps: true
});

LocationSchema.index({ district: 1, town: 1 }, { unique: true });

export const Location = mongoose.models.Location || 
    mongoose.model<ILocation>('Location', LocationSchema);
