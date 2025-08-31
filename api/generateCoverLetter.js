export default async function generateCoverLetter(req, res) {
  try {
    const { name, jobTitle, company, skills, experience } = req.body;

    // Add a page break before cover letter (\f)
    const coverLetterText = `
\f
Dear Hiring Manager,

My name is ${name}, and I am excited to apply for the ${jobTitle} position at ${company}.
With my experience in ${experience} and strong skills in ${skills},
I am confident that I can contribute effectively to your team and help achieve company goals.

I would welcome the opportunity to further discuss how my background can add value to ${company}.

Sincerely,
${name}
    `;

    res.json({ coverLetter: coverLetterText });
  } catch (error) {
    console.error("Error generating cover letter:", error);
    res.status(500).json({ error: "Failed to generate cover letter." });
  }
}
