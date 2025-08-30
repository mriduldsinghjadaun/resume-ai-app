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

// PDF Download functionality
document.getElementById('download-pdf').addEventListener('click', function() {
  const resumeContent = document.getElementById('resume-output');
  const coverContent = document.getElementById('cover-output');
  
  if (!resumeContent.innerHTML.trim()) {
    alert('Please generate a resume first before downloading PDF.');
    return;
  }

  // Create a new jsPDF instance
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Set up fonts and styling
  doc.setFont('helvetica');
  doc.setFontSize(12);
  
  let yPosition = 20;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const maxWidth = doc.internal.pageSize.width - (margin * 2);
  
  // Helper function to add text with word wrapping
  function addTextWithWrap(text, fontSize = 12, isBold = false, color = [0, 0, 0]) {
    doc.setFontSize(fontSize);
    if (isBold) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    doc.setTextColor(color[0], color[1], color[2]);
    
    const lines = doc.splitTextToSize(text, maxWidth);
    
    for (let i = 0; i < lines.length; i++) {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(lines[i], margin, yPosition);
      yPosition += fontSize * 0.4;
    }
    yPosition += 5;
  }
  
  // Helper function to add a line separator
  function addLineSeparator() {
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, doc.internal.pageSize.width - margin, yPosition);
    yPosition += 10;
  }
  
  // Get the name for the header
  const name = document.getElementById('name').value.trim() || 'Resume';
  
  // Add header with name
  addTextWithWrap(name.toUpperCase(), 18, true, [44, 62, 80]);
  yPosition += 5;
  
  // Add headline if available
  const headline = document.getElementById('headline').value.trim();
  if (headline) {
    addTextWithWrap(headline, 14, true, [52, 73, 94]);
    yPosition += 5;
  }
  
  addLineSeparator();
  
  // Process resume content with better structure
  const resumeElements = resumeContent.querySelectorAll('h3, h4, p, div, ul, li');
  
  for (let element of resumeElements) {
    const tagName = element.tagName.toLowerCase();
    const text = element.textContent.trim();
    
    if (!text) continue;
    
    switch (tagName) {
      case 'h3':
        addTextWithWrap(text, 16, true, [44, 62, 80]);
        yPosition += 3;
        break;
      case 'h4':
        addTextWithWrap(text, 14, true, [52, 73, 94]);
        yPosition += 2;
        break;
      case 'p':
        // Check if it's a contact or skills line
        if (text.includes('Contact:') || text.includes('Skills:') || text.includes('Certifications:')) {
          addTextWithWrap(text, 12, true);
        } else {
          addTextWithWrap(text, 12, false);
        }
        break;
      case 'div':
        if (element.classList.contains('exp')) {
          addTextWithWrap(text, 12, false);
        } else {
          addTextWithWrap(text, 12, false);
        }
        break;
      case 'ul':
        // Handle bullet points
        const listItems = element.querySelectorAll('li');
        for (let li of listItems) {
          addTextWithWrap('• ' + li.textContent.trim(), 12, false);
        }
        break;
      case 'li':
        addTextWithWrap('• ' + text, 12, false);
        break;
      default:
        addTextWithWrap(text, 12, false);
    }
  }
  
  // Add cover letter if exists
  const coverText = coverContent.textContent.trim();
  if (coverText) {
    addLineSeparator();
    addTextWithWrap('COVER LETTER', 16, true, [44, 62, 80]);
    yPosition += 10;
    
    const coverLines = coverText.split('\n');
    for (let line of coverLines) {
      if (line.trim()) {
        addTextWithWrap(line.trim(), 12, false);
      }
    }
  }
  
  // Generate filename
  const filename = `${name.replace(/\s+/g, '_')}_Resume.pdf`;
  
  // Save the PDF
  doc.save(filename);
});

// Helper function to extract text from HTML
function extractTextFromHTML(html) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Remove script and style elements
  const scripts = tempDiv.querySelectorAll('script, style');
  scripts.forEach(script => script.remove());
  
  // Get text content and clean it up
  let text = tempDiv.textContent || tempDiv.innerText || '';
  
  // Clean up extra whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  // Convert HTML entities back to text
  text = text.replace(/&amp;/g, '&')
             .replace(/&lt;/g, '<')
             .replace(/&gt;/g, '>')
             .replace(/&quot;/g, '"')
             .replace(/&#39;/g, "'");
  
  return text;
}