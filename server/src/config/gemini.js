const { GoogleGenAI, Type } = require("@google/genai");
require("dotenv").config();
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

async function main(joblink) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: joblink,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "object",
                properties: {
                    companyName: { type: "string" },
                    description: { type: "string" },
                    salary: {
                        type: "object",
                        properties: {
                            amount: { type: "number" },
                            unit: { type: "string", enum: ["LPA", "perMonth", "stipend"] }
                        },
                        required: ["amount", "unit"]
                    },
                    jobType: { type: "string", enum: ["internship", "placement"] },
                    companyType: { type: "string", enum: ["pbc"] },
                    location: { type: "string" },
                    eligibility: {
                        type: "array",
                        items: { type: "string" }
                    },
                    deadline: { type: "string", format: "date-time" },
                    applicationLink: { type: "string" },
                    rounds: {
                        type: "array",
                        items: { type: "string" }
                    },
                },
                required: [
                    "companyName",
                    "description",
                    "salary",
                    "jobType",
                    "companyType",
                    "location",
                    "eligibility",
                    "deadline",
                    "applicationLink",
                    "rounds"
                ],
                additionalProperties: false
            }

        },
    });

    return JSON.parse(response.text);
}

module.exports = { main };