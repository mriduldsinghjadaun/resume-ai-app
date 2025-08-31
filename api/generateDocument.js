import PDFDocument from "pdfkit";

export default async function generateDocument(req, res) {
  try {
    const { name, jobTitle, company, skills, experience, education } = req.body;

    const doc = new PDFDocument();

    // Stream PDF to response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=application.pdf");
    doc.pipe(res);

    // Resume (Page 1)
    doc.fontSize(20).text(name.toUpperCase(), { align: "center" });
    doc.fontSize(16).text(jobTitle, { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text("Skills:");
    doc.fontSize(12).text(skills);
    doc.moveDown();

    doc.fontSize(14).text("Experience:");
    doc.fontSize(12).text(experience);
    doc.moveDown();

    doc.fontSize(14).text("Education:");
    doc.fontSize(12).text(education);

    // Cover Letter (Page 2)
    doc.addPage();
    doc.fontSize(14).text("Dear Hiring Manager,");
    doc.moveDown();

    doc.fontSize(12).text(
      `My name is ${name}, and I am excited to apply for the ${jobTitle} position at ${company}.
With my experience in ${experience} and strong skills in ${skills}, I am confident that I can contribute effectively to your team.

I would welcome the opportunity to further discuss how my background can add value to ${company}.

Sincerely,
${name}`
    );

    doc.end();
  } catch (error) {
    console.error("Error generating PDF document:", error);
    res.status(500).json({ error: "Failed to generate document." });
  }
}
