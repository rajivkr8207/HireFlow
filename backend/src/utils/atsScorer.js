import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParseModule = require("pdf-parse");

/**
 * Extract text content from a file buffer (PDF or plain text).
 * @param {Buffer} buffer
 * @param {string} mimetype
 * @returns {Promise<string>}
 */
export const extractResumeText = async (buffer, mimetype) => {
    if (!buffer) return "";
    try {
        if (mimetype === "application/pdf") {
            if (typeof pdfParseModule === "function") {
                const data = await pdfParseModule(buffer);
                return data.text || "";
            } else if (pdfParseModule && pdfParseModule.PDFParse) {
                const parser = new pdfParseModule.PDFParse({ data: buffer });
                await parser.load();
                const textResult = await parser.getText();
                return typeof textResult === "string" ? textResult : (textResult?.text || "");
            } else if (pdfParseModule && typeof pdfParseModule.default === "function") {
                const data = await pdfParseModule.default(buffer);
                return data.text || "";
            }
        }
        // Fallback for plain text or string buffers
        return buffer.toString("utf-8");
    } catch (error) {
        console.error("PDF Parsing Error:", error.message);
        return buffer.toString("utf-8");
    }
};

/**
 * Calculate ATS Score (0 - 100) and feedback by comparing resume content with Job Posting specs.
 * @param {Object} params
 * @param {string} params.resumeText - Extracted text from candidate's resume
 * @param {string[]} params.candidateSkills - Array of skills from candidate profile
 * @param {string} params.coverLetter - Candidate cover letter text
 * @param {Object} params.job - JobPosting Mongoose document
 * @returns {{ score: number, matchedSkills: string[], missingSkills: string[], summary: string }}
 */
export const calculateATSScore = ({ resumeText = "", candidateSkills = [], coverLetter = "", job = {} }) => {
    const combinedContent = `${resumeText} ${candidateSkills.join(" ")} ${coverLetter}`.toLowerCase();

    const requiredSkills = Array.isArray(job.skillsRequired) ? job.skillsRequired : [];
    const jobTitle = (job.title || "").toLowerCase();
    const jobDescription = (job.description || "").toLowerCase();
    const jobQualifications = Array.isArray(job.qualifications) ? job.qualifications.join(" ").toLowerCase() : "";

    let matchedSkills = [];
    let missingSkills = [];

    // 1. Skill Matching (50% weight)
    if (requiredSkills.length > 0) {
        requiredSkills.forEach((skill) => {
            const cleanSkill = skill.trim().toLowerCase();
            if (cleanSkill && combinedContent.includes(cleanSkill)) {
                matchedSkills.push(skill);
            } else {
                missingSkills.push(skill);
            }
        });
    }

    const skillScore = requiredSkills.length > 0
        ? (matchedSkills.length / requiredSkills.length) * 50
        : 35; // Default baseline if no explicit skills required

    // 2. Job Title Keyword Match (20% weight)
    const titleWords = jobTitle.split(/\s+/).filter((w) => w.length > 2);
    let titleMatchCount = 0;
    titleWords.forEach((word) => {
        if (combinedContent.includes(word)) titleMatchCount++;
    });

    const titleScore = titleWords.length > 0
        ? (titleMatchCount / titleWords.length) * 20
        : 15;

    // 3. Description & Qualifications Keyword Match (20% weight)
    const descWords = `${jobDescription} ${jobQualifications}`
        .replace(/[^\w\s]/gi, "")
        .split(/\s+/)
        .filter((w) => w.length > 4);

    const uniqueDescWords = [...new Set(descWords)];
    let descMatchCount = 0;
    uniqueDescWords.slice(0, 30).forEach((word) => {
        if (combinedContent.includes(word)) descMatchCount++;
    });

    const descScore = uniqueDescWords.length > 0
        ? Math.min((descMatchCount / Math.min(uniqueDescWords.length, 30)) * 20, 20)
        : 15;

    // 4. Baseline & Content Completeness (10% weight)
    let completenessScore = 5;
    if (resumeText.length > 100) completenessScore += 3;
    if (coverLetter.length > 20) completenessScore += 2;

    const totalScore = Math.min(Math.round(skillScore + titleScore + descScore + completenessScore), 100);

    let summary = `Matched ${matchedSkills.length} of ${requiredSkills.length} required skills.`;
    if (totalScore >= 80) summary += " Excellent candidate match for this role!";
    else if (totalScore >= 60) summary += " Good match with core competencies.";
    else summary += " Consider tailoring your resume with key required skills.";

    return {
        score: totalScore,
        matchedSkills,
        missingSkills,
        summary,
    };
};
