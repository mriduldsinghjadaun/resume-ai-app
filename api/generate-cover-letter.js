import fetch from "node-fetch";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { name, jobTitle, company, skills, experience } = req.body;

  if (!name || !jobTitle || !company || !skills || !experience) {
    return res.status(400).json({ error: "Name, jobTitle, company, skills, and experience are required" });
  }

  const coverPrompt = `
You are an expert cover letter writer. Based on the provided information, generate a professional cover letter.

Name: ${name}
Job Title: ${jobTitle}
Company: ${company}
Skills: ${skills}
Experience: ${experience}

Cover Letter Requirements:
- 180-230 words
- Professional tone
- Highlight key strengths and experience
- Include a strong closing

Return ONLY the cover letter text (no JSON, no markdown).
`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: coverPrompt }],
        max_tokens: 800,
        temperature: 0.25,
      }),
    });

    const data = await response.json();
    const coverLetterText = data?.choices?.[0]?.message?.content || "❌ Cover letter generation failed.";

    res.status(200).json({ cover_letter: coverLetterText });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Groq API call failed", details: err.message });
  }
};
