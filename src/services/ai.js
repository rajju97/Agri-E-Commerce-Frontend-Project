import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI;
if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
} else {
  console.warn("Gemini API Key is missing. AI features will be disabled.");
}

export const generateProductDescription = async (prompt) => {
  if (!genAI) {
    console.warn("Gemini API Key is missing.");
    return "This is a placeholder description. Add your Gemini API key to enable AI-powered descriptions.";
  }
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating description:", error);
    throw error;
  }
};

export const generateProductImage = async (prompt) => {
  if (!genAI) {
    console.warn("Gemini API Key is missing.");
    return `https://placehold.co/500x500?text=${encodeURIComponent('No API Key')}`;
  }
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent([prompt, { "inline_data": { "mime_type": "image/png", "data": "" } }]);
    const parts = result.response.candidates[0].content.parts;
    for (const part of parts) {
      if (part.inlineData) {
        const { data, mimeType } = part.inlineData;
        return `data:${mimeType};base64,${data}`;
      }
    }
    throw new Error('No image returned by the model');
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};
