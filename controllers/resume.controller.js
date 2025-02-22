import axios from "axios";
import { PDFExtract } from "pdf.js-extract";
import Applicant from "../models/applicants.model.js";
import { askGemini } from "../lib/gemini.utils.js";
import { encryptData, decryptData } from "../lib/encryption.js";
export const enrichResume = async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ message: "URL is missing" });
    }

    try {
        const response = await axios.get(url, {
            responseType: "arraybuffer",
            timeout: 10000,
        });

        if (!response) {
            return res
                .status(500)
                .json({ message: "Error: No response from URL" });
        }

        const contentType = response.headers["content-type"];

        if (!contentType || !contentType.startsWith("application/pdf")) {
            return res
                .status(500)
                .json({ message: "Invalid URL: Not a PDF file" });
        }

        // console.log("Type of response.data:", typeof response.data); // Log the type
        // console.log(
        //     "Is response.data a Buffer?",
        //     Buffer.isBuffer(response.data)
        // ); 
  

        const pdfExtract = new PDFExtract();
        const options = {};
        const pdfDataUint8Array = new Uint8Array(response.data); // **Convert to Uint8Array**

        pdfExtract.extractBuffer(
            pdfDataUint8Array,
            options,
            async (err, pdfText) => {
                if (err) {
                    console.error("PDF Extraction Error:", err);
                    return res.status(500).json({
                        message: "Error extracting text from PDF",
                        error: err.message,
                    });
                }

                let extractedText = "";

                if (pdfText && pdfText.pages) {
                    extractedText = pdfText.pages
                        .map((page) => {
                            return page.content
                                .map((item) => item.str)
                                .join(" ");
                        })
                        .join("\n\n");
                }

                if (!extractedText || extractedText.trim() === "") {
                    return res.status(500).json({
                        message: "ERROR :: No Text Extracted",
                        text: "",
                    });
                }

                const geminiResponseText = await askGemini(extractedText);
                // console.log("Raw Gemini Response Text:", geminiResponseText);
                if (!geminiResponseText) {
                    return res.status(400).json({
                        message: "Failed during Gemini call in controller",
                    });
                }

                // <TODO> add a validation check to see if all fields are there

                const clearJson = geminiResponseText
                    .replace(/^```json\s*/, "")
                    .replace(/\s*```$/, "")
                    .trim();

                const geminiData = JSON.parse(clearJson)

                if (!Array.isArray(geminiData.education)) {
                    geminiData.education = [geminiData.education];
                }
                if (!Array.isArray(geminiData.experience)) {
                    geminiData.experience = [geminiData.experience];
                }
                if (!Array.isArray(geminiData.skills)) {
                    geminiData.skills = geminiData.skills
                        ? [geminiData.skills]
                        : [];
                }

                // encrypting before saving in DB
                geminiData.email = encryptData(geminiData.email)

                //Storing response from gemini Model in DB

                try {
                    const newApplicant = new Applicant(geminiData);
                    await newApplicant.save();
                } catch (dbError) {
                    console.error(
                        "Error saving applicant data to database:",
                        dbError
                    );
                    return res.status(500).json({
                        message: "Error saving enriched resume data",
                        error: dbError.message,
                    });
                }

                return res.status(200).json({
                    message:
                        "Resume text Extraction | Enrichment | Record creation successfull",
                });
            }
        );
    } catch (error) {
        console.error("Error processing PDF from URL:", error);
        if (axios.isAxiosError(error)) {
            return res.status(502).json({
                message: "Error fetching PDF from URL",
                error: error.message,
            });
        }
    }
};

export const searchApplicant = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "Name is required to search Applicants",
        });
    }
    try {
        const searchTerm = name;

        const query = { name: { $regex: searchTerm, $options: "i" } };
        const matchedApplicants = await Applicant.find(query);

        if (matchedApplicants.length === 0) {
            return res.status(404).json({
                message: "Invalid name, No documents found!! ",
            });
        }
        const decryptedApplicants = matchedApplicants.map(applicant => {
            return{
                ...applicant,
                email: decryptData(applicant.email)
            }
        })

        return res.status(200).json(decryptedApplicants);
    } catch (searchErr) {
        console.error("Error Finding applicant data to database:", searchErr);
        return res.status(500).json({
            message: "Error :: Finding Records ",
            error: searchErr.message,
        });
    }
};
