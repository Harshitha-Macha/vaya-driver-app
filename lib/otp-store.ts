const otpStore = new Map<string, { otp: string, expiresAt: number }>();

export function saveOtp(phone: string, otp: string) {
  otpStore.set(phone, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // 5 min expiry
}

export function verifyOtp(phone: string, code: string) {
  const record = otpStore.get(phone);
  if (!record || Date.now() > record.expiresAt) return false;
  return record.otp === code;
}

export function deleteOtp(phone: string) {
  otpStore.delete(phone);
}
