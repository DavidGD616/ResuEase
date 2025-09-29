const { GoogleGenAI } = require('@google/genai');

const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
  throw new Error('Missing Gemini API key. Set GOOGLE_GEMINI_API_KEY (or GOOGLE_API_KEY) in your environment.');
}

const geminiClient = new GoogleGenAI({ apiKey });
const defaultModel = process.env.GOOGLE_GEMINI_MODEL || 'gemini-2.5-flash-lite';
const defaultPrompt = 'Explain how AI works.';

const explainAI = async (req, res) => {
  const userPrompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
  const prompt = userPrompt || defaultPrompt;
  const model = typeof req.body?.model === 'string' && req.body.model.trim()
    ? req.body.model.trim()
    : defaultModel;

  try {
    const response = await geminiClient.models.generateContent({
      model,
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ]
    });

    const text = typeof response.text === 'string' ? response.text.trim() : '';

    return res.status(200).json({
      success: true,
      model,
      prompt,
      response: text
    });
  } catch (error) {
    const status = error?.status || error?.response?.status || 500;
    const message = error?.message || 'Failed to fetch a response from Gemini.';

    console.error('Gemini integration error:', error);

    return res.status(status >= 400 && status < 600 ? status : 500).json({
      success: false,
      message,
      ...(process.env.NODE_ENV === 'development' ? { details: error?.response?.data || error?.stack } : {})
    });
  }
};

module.exports = {
  explainAI
};
