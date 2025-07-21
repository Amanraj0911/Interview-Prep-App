import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/db"
import Session from "@/lib/models/Session"
import Question from "@/lib/models/Question"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }

    const session = await Session.findById(params.id).populate({
      path: "questions",
      options: { sort: { isPinned: -1, createdAt: 1 } },
    })

    if (!session) {
      return NextResponse.json({ message: "Session not found" }, { status: 404 })
    }

    if (session.user.toString() !== decoded.id) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 })
    }

    return NextResponse.json({ success: true, session })
  } catch (error) {
    console.error("Session fetch error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }

    const session = await Session.findById(params.id)

    if (!session) {
      return NextResponse.json({ message: "Session not found" }, { status: 404 })
    }

    if (session.user.toString() !== decoded.id) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 })
    }

    // Delete all questions associated with this session
    await Question.deleteMany({ session: session._id })

    // Delete the session
    await Session.deleteOne({ _id: session._id })

    return NextResponse.json({ success: true, message: "Session deleted successfully" })
  } catch (error) {
    console.error("Session deletion error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
