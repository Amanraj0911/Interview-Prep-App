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

    const { role, experience, topicsToFocus, description, questions } = await request.json()

    // Create the session
    const newSession = await Session.create({
      user: decoded.id,
      role,
      experience,
      topicsToFocus,
      description,
    })

    // Create questions and link them to the session
    const questionDocs = await Promise.all(
      questions.map((q: any) =>
        Question.create({
          session: newSession._id,
          question: q.question,
          answer: q.answer,
        }),
      ),
    )

    // Update session with question IDs
    newSession.questions = questionDocs.map((doc) => doc._id)
    await newSession.save()

    return NextResponse.json({ success: true, session: newSession })
  } catch (error) {
    console.error("Session creation error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
