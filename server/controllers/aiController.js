import OpenAI from "openai";

export async function askAI(req, res) {
  const message = req.body?.message?.trim();
  if (!message) return res.status(400).json({ message: "Message is required" });
  if (!process.env.OPENAI_API_KEY) {
    return res.json({ reply: "I’m in demo mode right now. Try browsing Products, or ask about footwear, accessories, or home items. Add OPENAI_API_KEY to enable full conversational recommendations." });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions: "You are Shopwise+, a concise and friendly e-commerce shopping assistant. Help users discover products, compare options, and understand shopping features. Never invent stock, prices, or order details.",
      input: message
    });
    res.json({ reply: response.output_text });
  } catch (error) {
    console.error("AI request failed:", error.message);
    res.status(502).json({ message: "The AI assistant is temporarily unavailable" });
  }
}
