import {
  GenerateContentResult,
  GoogleGenerativeAI,
} from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
export const getCleanedGeminiResponse = (result: GenerateContentResult) => {
  const response = result.response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, '').trim();
  return JSON.parse(cleanedText);
};
export default geminiModel;
