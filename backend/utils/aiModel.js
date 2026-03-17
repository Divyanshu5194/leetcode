import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function getGeminiResponse(contents,statement,description) {
  console.log({SYS_INTR:`the problem statement is ${statement} description is ${description} You are a ai to assist code problem  if anyone asks you irrelevant questions say sorry cant help if you have any douobts related to coding then ask when the question is about coding, assist them in a good manner`})
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents:contents,
    config: {
      systemInstruction: `the problem statement is ${statement} description is ${description} You are a ai to assist code problem  if anyone asks you irrelevant questions say sorry cant help if you have any douobts related to coding then ask when the question is about coding, assist them in a good manner`,
      temperature: 0.1,
    }
  });
  return response.text
}

export {getGeminiResponse}