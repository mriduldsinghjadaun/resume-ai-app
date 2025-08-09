// main.js - updated to collect structured fields and render nicely
const form = document.getElementById("resumeForm");
const loading = document.getElementById("loading");
const resumeOutput = document.getElementById("resume-output");
const coverOutput = document.getElementById("cover-output");

function collectExperience(i) {
  const company = document.getElementById(`company${i}`).value.trim();
  if (!company) return null;
  return {
    company,
    role: document.getElementById(`role${i}`).value.trim(),
    period: document.getElementById(`period${i}`).value.trim(),
    bullets: document.getElementById(`bullets${i}`).value
      .split("\n")
      .map(s => s.trim())
      .filter(Boolean),
  };
}

function renderResume(resumeJson) {
  // resumeJson expected to be an object (parsed JSON)
  let html = "";

  if (resumeJson.headline) {
    html += `<h3>${escapeHtml(resumeJson.headline)}</h3>`;
  }
  if (resumeJson.summary) {
    html += `<p>${escapeHtml(resumeJson.summary)}</p>`;
  }

  // Contact
  if (resumeJson.contact) {
    html += "<p><strong>Contact:</strong> ";
    const c = resumeJson.contact;
    const parts = [];
    if (c.location) parts.push(escapeHtml(c.location));
    if (c.email) parts.push(`<a href="mailto:${escapeHtml(c.email)}">${escapeHtml(c.email)}</a>`);
    if (c.phone) parts.push(escapeHtml(c.phone));
    if (c.linkedin) parts.push(`<a href="${escapeHtml(c.linkedin)}" target="_blank">LinkedIn</a>`);
    if (c.portfolio) parts.push(`<a href="${escapeHtml(c.portfolio)}" target="_blank">Portfolio</a>`);
    html += parts.join(" · ");
    html += "</p>";
  }

  // Skills
  if (resumeJson.skills && resumeJson.skills.length) {
    html += "<p><strong>Skills:</strong> " + resumeJson.skills.map(s => `<span class=\"tag\">${escapeHtml(s)}</span>`).join(" ") + "</p>";
  }

  // Experience
  if (resumeJson.experience && resumeJson.experience.length) {
    html += "<h4>Experience</h4>";
    resumeJson.experience.forEach(exp => {
      html += `<div class="exp"><strong>${escapeHtml(exp.role || "")} — ${escapeHtml(exp.company || "")}</strong> <em>${escapeHtml(exp.period || "")}</em>`;
      if (exp.bullets && exp.bullets.length) {
        html += "<ul>";
        exp.bullets.forEach(b => html += `<li>${escapeHtml(b)}</li>`);
        html += "</ul>";
      }
      html += "</div>";
    });
  }

  // Education
  if (resumeJson.education && resumeJson.education.length) {
    html += "<h4>Education</h4>";
    resumeJson.education.forEach(ed => {
      html += `<div><strong>${escapeHtml(ed.degree || "")}</strong>, ${escapeHtml(ed.institution || "")} <em>${escapeHtml(ed.year || "")}</em></div>`;
    });
  }

  // Projects
  if (resumeJson.projects && resumeJson.projects.length) {
    html += "<h4>Projects</h4>";
    resumeJson.projects.forEach(p => {
      html += `<div><strong>${escapeHtml(p.title)}</strong><div>${escapeHtml(p.description)}</div></div>`;
    });
  }

  // Certifications & Achievements
  if (resumeJson.certifications && resumeJson.certifications.length) {
    html += "<p><strong>Certifications:</strong> " + resumeJson.certifications.map(x => escapeHtml(x)).join(", ") + "</p>";
  }
  if (resumeJson.achievements && resumeJson.achievements.length) {
    html += "<h4>Achievements</h4><ul>";
    resumeJson.achievements.forEach(a => html += `<li>${escapeHtml(a)}</li>`);
    html += "</ul>";
  }

  // Keywords
  if (resumeJson.keywords && resumeJson.keywords.length) {
    html += "<p><strong>Keywords:</strong> " + resumeJson.keywords.map(k => `<span class=\"tag\">${escapeHtml(k)}</span>`).join(" ") + "</p>";
  }

  resumeOutput.innerHTML = html || "<p>No resume content generated.</p>";
}

function escapeHtml(text) {
  if (!text) return "";
  return text
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  loading.style.display = "block";
  resumeOutput.innerHTML = "";
  coverOutput.innerHTML = "";

  // Collect experiences (up to 3)
  const experiences = [];
  for (let i = 1; i <= 3; i++) {
    const ex = collectExperience(i);
    if (ex) experiences.push(ex);
  }

  // Education
  const education = [];
  const edDegree = document.getElementById("education_degree").value.trim();
  if (edDegree) {
    education.push({
      degree: edDegree,
      institution: document.getElementById("education_institution").value.trim(),
      year: document.getElementById("education_year").value.trim(),
    });
  }

  // Projects
  const projects = [];
  const ptitle = document.getElementById("project_title").value.trim();
  if (ptitle) {
    projects.push({
      title: ptitle,
      description: document.getElementById("project_desc").value.trim(),
    });
  }

  const payload = {
    name: document.getElementById("name").value.trim(),
    headline: document.getElementById("headline").value.trim(),
    summary: document.getElementById("summary").value.trim(),
    location: document.getElementById("location").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    linkedin: document.getElementById("linkedin").value.trim(),
    portfolio: document.getElementById("portfolio").value.trim(),
    skills: document.getElementById("skills").value.split(",").map(s => s.trim()).filter(Boolean),
    certifications: document.getElementById("certifications").value.split(",").map(s => s.trim()).filter(Boolean),
    achievements: document.getElementById("achievements").value.split("\n").map(s => s.trim()).filter(Boolean),
    experience: experiences,
    education,
    projects,
    applied_job_title: document.getElementById("applied_job_title").value.trim(),
    applied_company: document.getElementById("applied_company").value.trim(),
    job_description: document.getElementById("jobdesc").value.trim(),
  };

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}: ${text}`);
    }

    // Expecting resume_raw (JSON string) and cover_raw (string or JSON)
    const json = JSON.parse(text);
    // parse resume_raw which should be JSON string
    let resumeObj;
    try {
      resumeObj = JSON.parse(json.resume_raw);
    } catch (e) {
      // If resume_raw is already object-like or unparsable, fallback:
      resumeOutput.textContent = json.resume_raw || "No resume JSON produced.";
    }

    if (resumeObj) {
      renderResume(resumeObj);
    }

    // cover letter: try parse if JSON, else treat as plain text
    try {
      const coverParsed = JSON.parse(json.cover_raw);
      coverOutput.textContent = coverParsed.cover_letter || JSON.stringify(coverParsed);
    } catch (e) {
      coverOutput.textContent = json.cover_raw || "";
    }

  } catch (err) {
    console.error("Error generating resume:", err);
    alert("Error generating resume. Check console.");
    resumeOutput.textContent = "❌ Failed to generate resume.";
    coverOutput.textContent = "❌ Failed to generate cover letter.";
  } finally {
    loading.style.display = "none";
  }
});
