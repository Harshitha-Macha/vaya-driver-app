import OTP from "@/lib/models/otp" // Adjusted path based on your file structure
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret"

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json()
    const normalizePhone = (phone: string) => phone.replace(/\s+/g, '').replace(/^\+/, '')
    const normalizedPhone = normalizePhone(phone)
    console.log("[VERIFY OTP] Request received", { phone, otp })

    if (!phone || !otp) {
      console.warn("[VERIFY OTP] Missing phone or OTP")
      return new Response("Missing phone or OTP", { status: 400 })
    }

    // Check OTP in MongoDB
    const entry = await OTP.findOne({ phone: normalizedPhone })
    console.log("[VERIFY OTP] OTP store entry:", entry)

    const now = Date.now()
    if (!entry) {
      console.warn("[VERIFY OTP] No OTP entry found for phone:", phone)
      return new Response(JSON.stringify({ error: "Invalid or expired OTP" }), { status: 401 })
    }

    if (entry.otp !== otp) {
      console.warn("[VERIFY OTP] OTP mismatch. Expected:", entry.otp, "Got:", otp)
      return new Response(JSON.stringify({ error: "Invalid or expired OTP" }), { status: 401 })
    }

    if (now > entry.expiresAt.getTime()) {
      console.warn("[VERIFY OTP] OTP expired at", entry.expiresAt, "Current time:", new Date(now))
      return new Response(JSON.stringify({ error: "Invalid or expired OTP" }), { status: 401 })
    }

    // Delete OTP after verification
    await OTP.deleteOne({ phone: normalizedPhone })
    console.log("[VERIFY OTP] OTP verified. Generating token...")

    const token = jwt.sign({ phone }, JWT_SECRET, { expiresIn: "1h" })
    console.log("[VERIFY OTP] Token generated:", token)

    return new Response(JSON.stringify({ success: true, token }), { status: 200 })
  } catch (err) {
    console.error("[VERIFY OTP] Internal server error:", err)
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 })
  }
}
