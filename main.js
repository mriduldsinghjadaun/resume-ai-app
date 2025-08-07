document.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    title: document.getElementById("title").value,
    location: document.getElementById("location").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    skills: document.getElementById("skills").value,
    experience: document.getElementById("experience").value,
    education: document.getElementById("education").value,
    job_description: document.getElementById("job_description").value,
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

    const json = JSON.parse(text); // ✅ Now will only try parsing if response is OK

    document.getElementById("resume-output").textContent = json.resume_raw;
    document.getElementById("cover-output").textContent = json.cover_raw;
  } catch (err) {
    console.error("Error generating resume:", err);
    alert("Error generating resume. Check console.");
  }
});
