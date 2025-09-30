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
    console.error("AI health check failed:", error);
    return res.status(500).json({
      success: false,
      message: "AI service health check failed",
      error: error.message || "Service unavailable",
      model: MODEL_NAME,
      timestamp: new Date().toISOString(),
    });
  }
};

// Skills
const softSkills = async (req, res) => {
  try {
    const {
      jobTitle,
      currentSkills = [],
      experienceLevel = "mid-level",
      count = 8,
    } = req.body;

    // Validate required fields
    if (!jobTitle || jobTitle.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Job title is required to suggest relevant skills",
      });
    }

    // Build the prompt
    const prompt = `You are a career advisor helping to build a resume skills section. This section should showcase key soft skills and abilities that give employers a quick overview of your strengths and how they fit with the job. Note: Technical skills like programming languages, frameworks, and tools are covered in a separate section.

**Role Details:**
- Job Title: ${jobTitle}
- Experience Level: ${experienceLevel}

**Current Skills to Avoid:**
${currentSkills.length > 0 ? currentSkills.join(", ") : "None listed"}

**Requirements:**
- Suggest ${count} relevant soft skills for this role
- Focus on interpersonal abilities, leadership qualities, and professional competencies
- Include skills like: communication, problem-solving, leadership, teamwork, adaptability, time management, critical thinking, collaboration, conflict resolution, project management
- Focus on skills commonly required in job postings for this position
- Consider current trends and in-demand soft skills for this role
- Make skills specific and actionable (avoid vague terms like "hardworking" or "team player")
- Prioritize skills that demonstrate clear value to employers

**Output Format:**
Return exactly ${count} skills as a comma-separated list with no additional text, explanations, or numbering.
Example format: Leadership, Cross-functional Collaboration, Problem Solving, Strategic Planning, Communication, Team Management, Adaptability, Stakeholder Management`;

    console.log(`Suggesting ${count} skills for ${jobTitle}`);

    // Make API call to Gemini
    const response = await geminiClient.models.generateContent({
      model: MODEL_NAME,
      contents: [{ parts: [{ text: prompt }] }],
    });

    const text = (response.text || "").trim();

    // Parse the response to extract skills
    const suggestedSkills = text
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 2)
      .filter(
        (skill) =>
          !currentSkills.some(
            (existing) =>
              existing.toLowerCase().includes(skill.toLowerCase()) ||
              skill.toLowerCase().includes(existing.toLowerCase())
          )
      )
      .slice(0, count);

    if (suggestedSkills.length === 0) {
      throw new Error(
        "No new skills could be suggested. You may already have comprehensive skills listed."
      );
    }

    console.log(`Successfully suggested ${suggestedSkills.length} skills`);

    return res.json({
      success: true,
      data: {
        suggestedSkills,
        metadata: {
          model: MODEL_NAME,
          jobTitle,
          experienceLevel,
          requestedCount: count,
          returnedCount: suggestedSkills.length,
        },
      },
    });
  } catch (error) {
    console.error("Skills suggestion error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to suggest skills",
    });
  }
};

module.exports = { 
  healthCheck,
  softSkills,
 };
