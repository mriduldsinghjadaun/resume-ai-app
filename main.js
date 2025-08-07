const form = document.querySelector("form");
const loading = document.getElementById("loading");
const resumeOutput = document.getElementById("resume-output");
const coverOutput = document.getElementById("cover-output");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  loading.style.display = "block"; // Show loading
  resumeOutput.textContent = "";
  coverOutput.textContent = "";

  const data = {
    name: document.getElementById("name").value,
    title: document.getElementById("title").value,
    location: document.getElementById("location").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    skills: document.getElementById("skills").value,
    experience: document.getElementById("experience").value,
    education: document.getElementById("education").value,
    job_description: document.getElementById("jobdesc").value, // ✅ Corrected ID here
  };

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const text = await res.text();

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}: ${text}`);
    }

    const json = JSON.parse(text);

    resumeOutput.textContent = json.resume_raw || "No resume generated.";
    coverOutput.textContent = json.cover_raw || "No cover letter generated.";
  } catch (err) {
    console.error("Error generating resume:", err);
    alert("❌ Error generating resume. Check console.");
    resumeOutput.textContent = "❌ Failed to generate resume.";
    coverOutput.textContent = "❌ Failed to generate cover letter.";
  } finally {
    loading.style.display = "none"; // Hide loading
  }
});
