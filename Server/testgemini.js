require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function test() {
  const response = await ai.models.generateContent({
   model: "models/gemini-flash-latest",
    contents: "Hello",
  });

  console.log(response.text);
}

test().catch(console.error);