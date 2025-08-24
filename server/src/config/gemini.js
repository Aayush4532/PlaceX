const { GoogleGenAI, Type } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const generateJobData = async (jobLink) => {
    if (!jobLink) throw new Error("Job link is required");

    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: `
        Analyze this job posting link: ${jobLink} and return JSON with company, role, description, required_skills, tags
        If the link is not any career job openings Just return json with name "not_career" : "true", else false. 
        `,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    company: { type: Type.STRING },
                    role: { type: Type.STRING },
                    description: { type: Type.STRING },
                    required_skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                    tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                    not_career: { type: Type.BOOLEAN }
                },
                propertyOrdering: ["company", "role", "description", "required_skills", "tags"]
            }
        }
    });

    console.log(JSON.parse(response.text));
    return JSON.parse(response.text);
};

module.exports = { generateJobData };