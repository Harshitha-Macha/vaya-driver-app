import mongoose, { Document } from 'mongoose';

export interface IRide extends Document {
    userId: string;
    driverId?: string;
    district: string;
    town: string;
    zone: string;
    pickupAddress: string;
    status: 'REQUESTED' | 'ACCEPTED' | 'PICKED_UP' | 'COMPLETED' | 'CANCELLED';
    acceptTime?: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const RideSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    driverId: { type: String },
    district: { type: String, required: true },
    town: { type: String, required: true },
    zone: { type: String, required: true },
    pickupAddress: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ['REQUESTED', 'ACCEPTED', 'PICKED_UP', 'COMPLETED', 'CANCELLED'],
        default: 'REQUESTED'
    },
    acceptTime: { type: Date },
    completedAt: { type: Date }
}, {
    timestamps: true
});

export const Ride = (mongoose.models.Ride as mongoose.Model<IRide>) ||
    mongoose.model<IRide>('Ride', RideSchema);
