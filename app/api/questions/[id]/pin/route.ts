import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/db"
import Question from "@/lib/models/Question"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }

    const question = await Question.findById(params.id).populate("session")

    if (!question) {
      return NextResponse.json({ message: "Question not found" }, { status: 404 })
    }

    if (question.session.user.toString() !== decoded.id) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 })
    }

    question.isPinned = !question.isPinned
    await question.save()

    return NextResponse.json({ success: true, question })
  } catch (error) {
    console.error("Pin toggle error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
