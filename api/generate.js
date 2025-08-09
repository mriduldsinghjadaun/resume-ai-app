import fetch from "node-fetch";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const payload = req.body || {};

  // deconstruct fields
  const {
    name,
    headline,
    summary,
    location,
    email,
    phone,
    linkedin,
    portfolio,
    skills,
    certifications,
    achievements,
    experience,
    education,
    projects,
    applied_job_title,
    applied_company,
    job_description,
  } = payload;

  // Build a comprehensive prompt for resume JSON + cover letter
  const resumePrompt = `
You are an expert resume writer and ATS optimizer. Given the user's inputs below, produce a JSON object (ONLY JSON, no commentary) with the structure:

{
  "headline": "...",
  "summary": "...",
  "contact": { "location": "...", "email": "...", "phone": "...", "linkedin": "...", "portfolio": "..." },
  "skills": ["..."],
  "certifications": ["..."],
  "achievements": ["..."],
  "experience": [
    { "company":"", "role":"", "period":"", "bullets":["",""] },
    ...
  ],
  "education": [
    { "degree":"", "institution":"", "year":"" }
  ],
  "projects": [
    { "title":"", "description":"" }
  ],
  "keywords": ["..."],
  "parsed_job_title": "",   // If job_description contains a job title, extract it, else use applied_job_title
  "parsed_company": ""      // Extract company from job_description or use applied_company
}

Use the inputs below to fill fields. If a field is empty, leave it blank or an empty array. Tailor the summary and keywords to match the job_description if provided. If job_description is provided, extract the most probable job title and company name and put them into parsed_job_title and parsed_company. Make bullet points result-oriented and where possible include metrics or impact (if achievements or bullets provided). Keep language concise, ATS-friendly, and professional.

User inputs:
Name: ${name || ""}
Headline: ${headline || ""}
Summary: ${summary || ""}
Location: ${location || ""}
Email: ${email || ""}
Phone: ${phone || ""}
LinkedIn: ${linkedin || ""}
Portfolio: ${portfolio || ""}
Skills: ${(skills && skills.join ? skills.join(", ") : (skills || ""))}
Certifications: ${(certifications && certifications.join ? certifications.join(", ") : (certifications || ""))}
Achievements: ${(achievements && achievements.join ? achievements.join("; ") : (achievements || ""))}
Experience: ${JSON.stringify(experience || [])}
Education: ${JSON.stringify(education || [])}
Projects: ${JSON.stringify(projects || [])}
Applied Job Title (from user): ${applied_job_title || ""}
Applied Company (from user): ${applied_company || ""}
Job Description: ${job_description || ""}

Return ONLY the JSON object described above (no markdown, no backticks).
`;

  const coverPrompt = `
You are an expert cover letter writer. Based on the resume information (the same user inputs) produce a tailored cover letter and return a JSON object only:

{
  "cover_letter": "..."
}

Make the cover letter about 180-230 words, address the hiring manager (use the company name if parsed_company is available), mention 2-3 key strengths from the user's skills/experience, and include a closing call to action. Use parsed_job_title (extracted) to mention the target role. Return ONLY this JSON.
`;

  try {
    // Resume request
    const resumeRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: resumePrompt }],
        max_tokens: 1500,
        temperature: 0.2,
      }),
    });

    const resumeData = await resumeRes.json();
    console.log("Resume Raw Groq Response:", resumeData);
    const resume_raw = resumeData?.choices?.[0]?.message?.content || "❌ Resume generation failed.";

    // Cover letter request
    const coverRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: coverPrompt + "\n\nUser inputs:\n" + JSON.stringify(payload) }],
        max_tokens: 800,
        temperature: 0.25,
      }),
    });

    const coverData = await coverRes.json();
    console.log("Cover Letter Raw Groq Response:", coverData);
    const cover_raw = coverData?.choices?.[0]?.message?.content || "❌ Cover letter generation failed.";

    // Return both pieces of text; front-end will parse resume_raw (JSON text) and cover_raw
    res.status(200).json({ resume_raw, cover_raw });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Groq API call failed", details: err.message });
  }
};
