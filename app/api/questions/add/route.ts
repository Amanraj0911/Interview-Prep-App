import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/db"
import Session from "@/lib/models/Session"
import Question from "@/lib/models/Question"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }

    const { sessionId, questions } = await request.json()

    if (!sessionId || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ message: "Invalid input data" }, { status: 400 })
    }

    const session = await Session.findById(sessionId)
    if (!session || session.user.toString() !== decoded.id) {
      return NextResponse.json({ message: "Session not found or not authorized" }, { status: 404 })
    }

    // Create new questions
    const createdQuestions = await Question.insertMany(
      questions.map((q: any) => ({
        session: sessionId,
        question: q.question,
        answer: q.answer,
      })),
    )

    // Update session to include new question IDs
    session.questions.push(...createdQuestions.map((q) => q._id))
    await session.save()

    return NextResponse.json({ success: true, createdQuestions })
  } catch (error) {
    console.error("Add questions error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
