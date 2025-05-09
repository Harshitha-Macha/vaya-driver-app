// lib/otp.ts (temporary in-memory store, replace with DB or Redis in prod)
const store = new Map<string, string>()

export function generateOtp(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

export async function saveOtp(phone: string, otp: string) {
  store.set(phone, otp)
  setTimeout(() => store.delete(phone), 300000) // Auto-expire in 5 minutes
}

export async function verifyOtpAndDelete(phone: string, otp: string): Promise<boolean> {
  const validOtp = store.get(phone)
  if (validOtp === otp) {
    store.delete(phone)
    return true
  }
  return false
}
