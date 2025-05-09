// import OTP from "@/lib/models/otp"
// import { NextResponse } from "next/server"
// import twilio from "twilio"
// import connectMongo from "@/lib/connectMongo"; // 👈 import it

// // In your function:
// await connectMongo(); 

// const accountSid = process.env.TWILIO_ACCOUNT_SID!
// const authToken = process.env.TWILIO_AUTH_TOKEN!
// const twilioPhone = process.env.TWILIO_PHONE_NUMBER!

// const client = twilio(accountSid, authToken)

// export async function POST(req: Request) {
//   const { phone } = await req.json()
//   console.log("[SEND OTP] Raw phone input:", phone)

//   const normalizePhone = (phone: string) => phone.replace(/\s+/g, '').replace(/^\+/, '')
//   const normalizedPhone = normalizePhone(phone)
//   console.log("[SEND OTP] Normalized phone:", normalizedPhone)

//   if (!phone) {
//     console.warn("[SEND OTP] Phone number missing in request.")
//     return NextResponse.json({ error: "Phone is required" }, { status: 400 })
//   }

//   const otp = Math.floor(1000 + Math.random() * 9000).toString()
//   const expiresAt = Date.now() + 5 * 60 * 1000  // OTP expires in 5 minutes
//   console.log("[SEND OTP] Generated OTP:", otp, "Expires at:", new Date(expiresAt))

//   // Store OTP in MongoDB
//   try {
//     await OTP.findOneAndUpdate(
//       { phone: normalizedPhone },
//       { otp, expiresAt: new Date(expiresAt) },
//       { upsert: true } // This will create a new entry if it doesn't exist
//     )
//     console.log("[SEND OTP] OTP stored in MongoDB")
//   } catch (error) {
//     console.error("[SEND OTP] Error saving OTP to MongoDB:", error)
//     return NextResponse.json({ error: "Failed to store OTP" }, { status: 500 })
//   }

//   // Send OTP via Twilio
//   try {
//     const message = await client.messages.create({
//       body: `Your OTP code is ${otp}`,
//       from: twilioPhone,
//       to: phone,
//     })
//     console.log("[SEND OTP] Twilio message sent:", message.sid)
//   } catch (error) {
//     console.error("[SEND OTP] Twilio error:", error)
//     return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 })
//   }

//   return NextResponse.json({ success: true })
// }


import { NextResponse } from "next/server";
import twilio from "twilio";
import OTP from "@/lib/models/otp";
import connectMongo from "@/lib/connectMongo";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER!;

const client = twilio(accountSid, authToken);

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    console.log("[SEND OTP] Raw phone input:", phone);

    if (!phone || typeof phone !== "string") {
      console.warn("[SEND OTP] Invalid phone input.");
      return NextResponse.json({ error: "Phone is required" }, { status: 400 });
    }

    const normalizePhone = (phone: string) =>
      phone.replace(/\s+/g, "").replace(/^\+/, "");
    const normalizedPhone = normalizePhone(phone);
    console.log("[SEND OTP] Normalized phone:", normalizedPhone);

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    console.log("[SEND OTP] Generated OTP:", otp, "Expires at:", expiresAt);

    // ✅ Connect to MongoDB
    await connectMongo();

    // ✅ Save OTP to MongoDB
    await OTP.findOneAndUpdate(
      { phone: normalizedPhone },
      { otp, expiresAt },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log("[SEND OTP] OTP stored in MongoDB");

    // ✅ Send OTP via Twilio
    const message = await client.messages.create({
      body: `Your OTP code is ${otp}`,
      from: twilioPhone,
      to: phone,
    });

    console.log("[SEND OTP] Twilio message sent:", message.sid);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[SEND OTP] Error:", error);
    return NextResponse.json({ error: "Server error, please try again." }, { status: 500 });
  }
}
