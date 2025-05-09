import mongoose, { Document } from 'mongoose';

export interface IRide extends Document {
    userId: string;
    driverId?: string;
    status: 'REQUESTED' | 'ACCEPTED' | 'STARTED' | 'COMPLETED' | 'CANCELLED';
    pickupLocation: {
        type: 'Point';
        coordinates: [number, number];
    };
    dropLocation?: {
        type: 'Point';
        coordinates: [number, number];
    };
    fare?: number;
    requestTime: Date;
    acceptTime?: Date;
    startTime?: Date;
    endTime?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const RideSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'User'
    },
    driverId: {
        type: String,
        ref: 'User'
    },
    status: {
        type: String,
        required: true,
        enum: ['REQUESTED', 'ACCEPTED', 'STARTED', 'COMPLETED', 'CANCELLED'],
        default: 'REQUESTED'
    },
    pickupLocation: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    dropLocation: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: [Number]
    },
    fare: Number,
    requestTime: { type: Date, default: Date.now },
    acceptTime: Date,
    startTime: Date,
    endTime: Date
}, {
    timestamps: true
});

RideSchema.index({ pickupLocation: '2dsphere' });

export const Ride = mongoose.models.Ride || mongoose.model<IRide>('Ride', RideSchema);
