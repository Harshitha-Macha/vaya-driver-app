import { Schema, model, models } from 'mongoose';

const otpSchema = new Schema({
  phone: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const OTP = models.OTP || model('OTP', otpSchema);
export default OTP;
