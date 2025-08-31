export default async function generateResume(req, res) {
  try {
    const { name, jobTitle, skills, experience, education } = req.body;

    const resumeText = `
${name.toUpperCase()}
${jobTitle}

Skills:
${skills}

Experience:
${experience}

Education:
${education}
    `;

    res.json({ resume: resumeText });
  } catch (error) {
    console.error("Error generating resume:", error);
    res.status(500).json({ error: "Failed to generate resume." });
  }
}
