import fetch from "node-fetch";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const payload = req.body || {};

  // Extract data from the new XYZ structure
  const {
    personal_info,
    candidate_type,
    target_role,
    professional_summary,
    experience,
    projects,
    education,
    certifications,
    additional_sections,
    applied_job_title,
    applied_company,
    job_description,
  } = payload;

  // Build a comprehensive prompt for XYZ methodology resume
  const resumePrompt = `
You are an expert resume writer specializing in the XYZ methodology for ATS-optimized resumes. 

XYZ Methodology Rules:
- X = Situation/Task (context or challenge)
- Y = Action/Contribution (specific actions taken)
- Z = Results (quantified outcomes)
- No personal pronouns (I, me, my, we, our)
- Use strong action verbs
- Quantify results wherever possible
- Phrase format, not full sentences

Given the user's inputs below, produce a JSON object (ONLY JSON, no commentary) with the structure:

{
  "headline": "...",
  "summary": "...",
  "contact": { "location": "...", "email": "...", "phone": "...", "linkedin": "...", "github": "...", "portfolio": "..." },
  "technical_skills": {
    "programming_languages": ["..."],
    "frameworks": ["..."],
    "databases": ["..."],
    "tools": ["..."],
    "cloud_platforms": ["..."]
  },
  "experience": [
    { 
      "company": "", 
      "role": "", 
      "location": "",
      "start_date": "",
      "end_date": "",
      "achievements": [
        {
          "X": "situation/challenge",
          "Y": "action taken", 
          "Z": "quantified result"
        }
      ]
    }
  ],
  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": ["..."],
      "duration": "",
      "team_size": 1,
      "achievements": [
        {
          "X": "project scope/challenge",
          "Y": "implementation approach",
          "Z": "measurable impact"
        }
      ],
      "github_link": "",
      "live_demo": ""
    }
  ],
  "education": [
    {
      "degree": "",
      "major": "",
      "institution": "",
      "location": "",
      "graduation_date": "",
      "gpa": null,
      "honors": ["..."],
      "relevant_coursework": ["..."]
    }
  ],
  "certifications": [
    {
      "name": "",
      "issuing_organization": "",
      "date_obtained": "",
      "expiration_date": null,
      "credential_id": null
    }
  ],
  "keywords": ["..."],
  "parsed_job_title": "",
  "parsed_company": ""
}

Use the XYZ methodology for all achievements. Convert any existing bullet points to XYZ format. If job_description is provided, extract keywords and optimize content accordingly.

User inputs:
Personal Info: ${JSON.stringify(personal_info || {})}
Candidate Type: ${candidate_type || ""}
Target Role: ${JSON.stringify(target_role || {})}
Professional Summary: ${JSON.stringify(professional_summary || {})}
Experience: ${JSON.stringify(experience || [])}
Projects: ${JSON.stringify(projects || [])}
Education: ${JSON.stringify(education || [])}
Certifications: ${JSON.stringify(certifications || [])}
Technical Skills: ${JSON.stringify(additional_sections?.technical_skills || {})}
Applied Job Title: ${applied_job_title || ""}
Applied Company: ${applied_company || ""}
Job Description: ${job_description || ""}

Return ONLY the JSON object described above (no markdown, no backticks).
`;

  const coverPrompt = `
You are an expert cover letter writer specializing in creating compelling cover letters that complement XYZ methodology resumes. Based on the resume information below, produce a tailored cover letter and return a JSON object only:

{
  "cover_letter": "..."
}

Cover Letter Requirements:
- 180-230 words
- Address the hiring manager (use company name if available)
- Mention 2-3 key strengths using XYZ methodology principles
- Reference specific achievements with quantified results
- Include a strong closing call to action
- Use the target role and company information
- Professional, confident tone
- ATS-friendly language

Resume Information:
Personal Info: ${JSON.stringify(personal_info || {})}
Candidate Type: ${candidate_type || ""}
Target Role: ${JSON.stringify(target_role || {})}
Professional Summary: ${JSON.stringify(professional_summary || {})}
Experience: ${JSON.stringify(experience || [])}
Projects: ${JSON.stringify(projects || [])}
Applied Job Title: ${applied_job_title || ""}
Applied Company: ${applied_company || ""}
Job Description: ${job_description || ""}

Return ONLY the JSON object with the cover_letter field (no markdown, no backticks).
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
        messages: [{ role: "user", content: coverPrompt }],
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
