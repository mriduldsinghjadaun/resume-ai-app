// main.js

document.getElementById("resumeForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const payload = {
    name: document.getElementById("name").value,
    title: document.getElementById("title").value,
    location: document.getElementById("location").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    skills: document.getElementById("skills").value,
    experience: document.getElementById("experience").value,
    education: document.getElementById("education").value,
    job_description: document.getElementById("jobdesc").value,
  };

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    const resumeData = JSON.parse(data.resume_raw);
    const coverData = JSON.parse(data.cover_raw);

    document.getElementById("resumeOutput").textContent = JSON.stringify(resumeData, null, 2);
    document.getElementById("coverOutput").textContent = coverData.cover_letter;

  } catch (err) {
    alert("Error generating resume. Please try again.");
    console.error(err);
  }
});

function downloadPDF() {
  const element = document.getElementById("output");
  html2pdf().from(element).save("resume_and_cover_letter.pdf");
}
