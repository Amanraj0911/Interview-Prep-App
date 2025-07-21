import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Validate API key exists
if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not defined in environment variables")
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const questionAnswerPrompt = ({ role, experience, topicsToFocus, numberOfQuestions }: any) => {
  return `
    You are an AI trained to generate technical interview questions and answers.
    Task:
    - Role: ${role}
    - Candidate Experience: ${experience}
    - Focus Topics: ${topicsToFocus}
    - Write ${numberOfQuestions} interview questions.
    - For each question, generate a detailed but beginner-friendly answer.
    - If the answer needs a code example, add a small code block inside.
    - Keep formatting very clean.
    - Return a pure JSON array like:
    [
        {
            "question": "Question here?",
            "answer": "Answer here."
        }
    ]
    Important: Do NOT add any extra text. Only return valid JSON.
  `
}

const cleanAIResponse = (rawText: string) => {
  return rawText
    .replace(/^```json\s*/, "")
    .replace(/```$/, "")
    .trim()
}

export async function POST(request: NextRequest) {
  try {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { message: "Gemini API key is not configured. Please add GEMINI_API_KEY to your environment variables." },
        { status: 500 },
      )
    }

    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    jwt.verify(token, process.env.JWT_SECRET!)

    const { role, experience, topicsToFocus, numberOfQuestions } = await request.json()

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    console.log("Generating questions with Gemini API...")

    // Use the correct model name that works in your test
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    const prompt = questionAnswerPrompt({ role, experience, topicsToFocus, numberOfQuestions })

    const result = await model.generateContent(prompt)
    const response = await result.response
    const rawText = response.text()

    console.log("Raw AI response received:", rawText.substring(0, 200) + "...")

    const cleanedText = cleanAIResponse(rawText)

    try {
      const jsonData = JSON.parse(cleanedText)

      // Validate the response structure
      if (!Array.isArray(jsonData)) {
        throw new Error("AI response is not a valid JSON array")
      }

      // Ensure each item has question and answer
      const validatedData = jsonData.map((item, index) => {
        if (!item.question || !item.answer) {
          throw new Error(`Invalid question format at index ${index}: missing question or answer`)
        }
        return {
          question: item.question,
          answer: item.answer,
        }
      })

      console.log(`Successfully generated ${validatedData.length} questions`)
      return NextResponse.json(validatedData)
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError)
      console.error("Raw AI response:", rawText)
      console.error("Cleaned text:", cleanedText)

      // Return specific parsing error instead of fallback questions
      return NextResponse.json(
        {
          message: "AI generated an invalid response format. Please try again.",
          error: "INVALID_AI_RESPONSE",
          details: parseError instanceof Error ? parseError.message : "Unknown parsing error",
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("AI generation error:", error)

    // Handle specific API key errors
    if (error.message?.includes("API_KEY_INVALID") || error.message?.includes("API Key not found")) {
      return NextResponse.json(
        {
          message: "Invalid Gemini API key. Please check your GEMINI_API_KEY in the environment variables.",
          error: "API_KEY_INVALID",
        },
        { status: 400 },
      )
    }

    // Handle quota exceeded
    if (error.message?.includes("quota") || error.message?.includes("QUOTA_EXCEEDED")) {
      return NextResponse.json(
        {
          message: "API quota exceeded. Please try again later or check your Gemini API usage.",
          error: "QUOTA_EXCEEDED",
        },
        { status: 429 },
      )
    }

    // Handle model not found errors
    if (error.message?.includes("model") && error.message?.includes("not found")) {
      return NextResponse.json(
        {
          message: "The AI model is not available. Please try again later.",
          error: "MODEL_NOT_FOUND",
        },
        { status: 503 },
      )
    }

    // Handle network/timeout errors
    if (error.message?.includes("timeout") || error.message?.includes("network")) {
      return NextResponse.json(
        {
          message: "Network timeout while connecting to AI service. Please try again.",
          error: "NETWORK_TIMEOUT",
        },
        { status: 503 },
      )
    }

    // Generic error for any other AI failures
    return NextResponse.json(
      {
        message: "Failed to generate questions using AI. Please try again later.",
        error: "AI_GENERATION_FAILED",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
