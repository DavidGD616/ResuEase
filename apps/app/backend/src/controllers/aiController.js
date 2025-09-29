const { GoogleGenAI } = require('@google/genai');

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
if (!apiKey) throw new Error('Missing Gemini API key');

const geminiClient = new GoogleGenAI({ apiKey });

const explainAI = async (req, res) => {
  try {
    const response = await geminiClient.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: [{ role: 'user', parts: [{ text: 'Explain how AI works.' }] }]
    });

    return res.json({
      success: true,
      response: response.text || ''
    });
  } catch (error) {
    console.error('Gemini error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch response from Gemini'
    });
  }
};

module.exports = { explainAI };
