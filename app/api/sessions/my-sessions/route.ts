import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/db"
import Session from "@/lib/models/Session"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }

    const sessions = await Session.find({ user: decoded.id }).sort({ createdAt: -1 })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error("Sessions fetch error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
