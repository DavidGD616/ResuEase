const { GoogleGenAI } = require("@google/genai");

// Initialize Google Gemini AI client
const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
if (!apiKey) throw new Error("Missing Gemini API key");

const geminiClient = new GoogleGenAI({ apiKey });

// Model name
const MODEL_NAME = "gemini-2.5-flash-lite";

// HEALTH CHECK
const healthCheck = async (req, res) => {
  try {
    console.log(`Testing AI service health with ${MODEL_NAME}`);

    const response = await geminiClient.models.generateContent({
      model: MODEL_NAME,
      contents: [
        { parts: [{ text: "Responds with exactly: AI service operational" }] },
      ],
    });

    const text = (response.text || "").trim();

    console.log("AI service health check passed");

    return res.json({
      success: true,
      message: "AI service is healthy and operational",
      data: {
        status: "operational",
        model: MODEL_NAME,
        modelFamily: "Gemini 2.5",
        testResponse: text,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('AI health check failed:', error);
    return res.status(500).json({
      success: false,
      message: 'AI service health check failed',
      error: error.message || 'Service unavailable',
      model: MODEL_NAME,
      timestamp: new Date().toISOString()
    })
  }
};

module.exports = { healthCheck };
