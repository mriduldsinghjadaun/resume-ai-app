import fetch from "node-fetch";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const {
    name,
    title,
    location,
    email,
    phone,
    skills,
    experience,
    education,
    job_description,
  } = req.body;

  const resumePrompt = `
You are a resume expert. Based on this info:
Name: ${name}
Title: ${title}
Location: ${location}
Email: ${email}, Phone: ${phone}
Skills: ${skills}
Experience: ${experience}
Education: ${education}
Job Description: ${job_description}

Write a JSON with:
- summary: short professional summary
- sections: Experience, Skills, Education (each with entries)
- keywords: list of ATS keywords
Return only the JSON.
`;

  const coverPrompt = `
You are a professional cover letter writer. Based on this info:
Name: ${name}
Title: ${title}
Job Description: ${job_description}
Experience: ${experience}
Skills: ${skills}

Write a polite, confident 200-word cover letter tailored to the job. Return a JSON like:
{ "cover_letter": "..." }
Return only the JSON.
`;

  try {
    const resumeRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [{ role: "user", content: resumePrompt }],
        max_tokens: 1000,
        temperature: 0.5,
      }),
    });

    const resumeData = await resumeRes.json();
    const resume_raw = resumeData?.choices?.[0]?.message?.content || "❌ Resume generation failed.";

    const coverRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [{ role: "user", content: coverPrompt }],
        max_tokens: 700,
        temperature: 0.5,
      }),
    });

    const coverData = await coverRes.json();
    const cover_raw = coverData?.choices?.[0]?.message?.content || "❌ Cover letter generation failed.";

    res.status(200).json({ resume_raw, cover_raw });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Groq API call failed", details: err.message });
  }
};
