import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// ✅ fallback (ALWAYS RETURNS)
const fallbackReply = (msg = "") => {
  const text = msg.toLowerCase();

  if (text.includes("hello")) return "Hi 👋 How can I help you?";
  if (text.includes("task")) return "You can manage tasks from your dashboard.";
  if (text.includes("help")) return "Try asking about tasks, notes, or features.";

  return "⚠️ Server is busy right now. Please try again.";
};

export const chatWithGemini = async (req, res) => {
  try {
    let { messages } = req.body;

    // ✅ keep only last message
    const lastMsg = messages[messages.length - 1];

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: lastMsg,   // 🔥 ONLY LAST MESSAGE
    });

    const reply =
      result?.candidates?.[0]?.content?.parts?.[0]?.text;

    // ✅ if Gemini gives response
    if (reply) {
      return res.json({ reply });
    }

    // ❌ if empty → fallback
    return res.json({ reply: fallbackReply(lastMsg) });

  } catch (error) {
    console.log("Gemini Failed:", error.status);

    // 🔥 ALWAYS RETURN SOMETHING
    return res.json({
      reply: fallbackReply(req.body.messages?.slice(-1)[0])
    });
  }
};