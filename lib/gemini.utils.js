import { GoogleGenerativeAI } from "@google/generative-ai";
import { resumeJsonFormat } from "../prompt-format/resume-json-format.js";


export const askGemini = async (
    extractedText,
    modelId = process.env.modelId || "gemini-2.0-flash"
) => {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: modelId });

    const prompt = `${extractedText} 
        This is text from a resume. I need you to extract the information from it and structure it as a JSON object according to the following format:

        \`\`\`json
        ${JSON.stringify(resumeJsonFormat, null, 2)}
        \`\`\`

        Please extract the relevant information from the resume text and fill in the corresponding fields in the JSON structure above. If a field is not present in the resume, leave it blank or empty. For the 'skills' field, please list each skill as a separate string within the array.  Return ONLY the JSON object in your response.`;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Error in generateContentFromGemini:", error);
        // Handle errors gracefully here, e.g., throw a custom error or return null/undefined with an error message
        throw new Error(`Gemini API call failed: ${error.message}`); // Re-throwing error for controller to handle
    }
};
