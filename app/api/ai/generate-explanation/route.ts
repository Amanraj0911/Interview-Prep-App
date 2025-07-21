import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const conceptExplainPrompt = (question: string) => {
  return `
    You are an AI trained to generate explanations for a given interview question.
    Task:
    - Explain the following interview question and its concept in depth as if you're teaching a beginner developer.
    - Question: "${question}"
    - After the explanation, provide a short and clear title that summarizes the concept for the article or page header.
    - If the explanation includes a code example, provide a small code block.
    - Keep the formatting very clean and clear.
    - Return the result as a valid JSON object in the following format:
    {
        "title": "Short title here?",
        "explanation": "Explanation here."
    }
    Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.
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
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    jwt.verify(token, process.env.JWT_SECRET!)

    const { question } = await request.json()

    if (!question) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    console.log("Generating explanation with Gemini API...")

    // Use the correct model name that works in your test
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    const prompt = conceptExplainPrompt(question)

    const result = await model.generateContent(prompt)
    const response = await result.response
    const rawText = response.text()

    console.log("Raw AI explanation response received:", rawText.substring(0, 100) + "...")

    const cleanedText = cleanAIResponse(rawText)

    try {
      const jsonData = JSON.parse(cleanedText)

      // Validate the response structure
      if (!jsonData.title || !jsonData.explanation) {
        throw new Error("AI response missing required fields: title or explanation")
      }

      return NextResponse.json(jsonData)
    } catch (parseError) {
      console.error("Failed to parse AI explanation response:", parseError)
      console.error("Raw AI response:", rawText)
      console.error("Cleaned text:", cleanedText)

      return NextResponse.json(
        {
          message: "AI generated an invalid explanation format. Please try again.",
          error: "INVALID_AI_RESPONSE",
          details: parseError instanceof Error ? parseError.message : "Unknown parsing error",
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("AI explanation generation error:", error)

    // Handle specific errors similar to the questions route
    if (error.message?.includes("API_KEY_INVALID") || error.message?.includes("API Key not found")) {
      return NextResponse.json(
        {
          message: "Invalid Gemini API key. Please check your configuration.",
          error: "API_KEY_INVALID",
        },
        { status: 400 },
      )
    }

    if (error.message?.includes("quota") || error.message?.includes("QUOTA_EXCEEDED")) {
      return NextResponse.json(
        {
          message: "API quota exceeded. Please try again later.",
          error: "QUOTA_EXCEEDED",
        },
        { status: 429 },
      )
    }

    return NextResponse.json(
      {
        message: "Failed to generate explanation using AI. Please try again later.",
        error: "AI_EXPLANATION_FAILED",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
