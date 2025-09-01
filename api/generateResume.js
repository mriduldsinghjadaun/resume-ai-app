export default async function generateResume(req, res) {
  try {
    const { name, jobTitle, skills, experience, education } = req.body || {};

    if (!name || !jobTitle || !skills || !experience || !education) {
      return res.status(400).json({ error: "Missing required fields in request body." });
    }

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
