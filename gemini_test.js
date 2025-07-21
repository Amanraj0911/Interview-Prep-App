import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your actual Gemini API key from https://aistudio.google.com/app/apikey
// It's important to keep your API key secure and not expose it directly in the code.
const API_KEY = "AIzaSyDgrGj90oLezJ9a-U5kbZpoMyadnyJu9oU";

// The error was due to an incorrect model name.
// "gemini-1.5-flash" is a current and widely available model.
const MODEL_NAME = "gemini-2.5-flash";


const genAI = new GoogleGenerativeAI(API_KEY);

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const result = await model.generateContent("who won the 2024 euro");
    const response = await result.response;
    const text = response.text();

    console.log("✅ Gemini Response:\n", text);
  } catch (err) {
    console.error("❌ Gemini API test failed:", err);
  }
}

run();
