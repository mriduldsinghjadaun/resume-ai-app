// XYZ Resume Generator - Main Application Logic
class XYZResumeApp {
  constructor() {
    this.engine = new XYZResumeEngine();
    this.currentTab = 0;
    this.tabs = ['personal', 'candidate', 'experience', 'projects', 'education', 'skills', 'job'];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupTabNavigation();
    this.setupXYZPreview();
    this.setupDynamicForms();
    this.setupKeywordExtraction();
  }

  setupEventListeners() {
    const form = document.getElementById("resumeForm");
    const loading = document.getElementById("loading");
    const resumeOutput = document.getElementById("resume-output");
    const coverOutput = document.getElementById("cover-output");

    form.addEventListener("submit", (e) => this.handleFormSubmit(e));
    
    // Tab navigation
    document.querySelectorAll('.tab-button').forEach(button => {
      button.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
    });

    // Navigation buttons
    document.getElementById('prev-tab').addEventListener('click', () => this.previousTab());
    document.getElementById('next-tab').addEventListener('click', () => this.nextTab());

    // Dynamic form additions
    document.getElementById('add-experience').addEventListener('click', () => this.addExperienceBlock());
    document.getElementById('add-project').addEventListener('click', () => this.addProjectBlock());
    document.getElementById('add-education').addEventListener('click', () => this.addEducationBlock());
    document.getElementById('add-certification').addEventListener('click', () => this.addCertificationBlock());

    // Output actions
    document.getElementById('download-pdf').addEventListener('click', () => this.downloadPDF());
    document.getElementById('download-markdown').addEventListener('click', () => this.downloadMarkdown());
    document.getElementById('copy-resume').addEventListener('click', () => this.copyToClipboard());
  }

  setupTabNavigation() {
    this.updateTabButtons();
  }

  switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });

    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
      button.classList.remove('active');
    });

    // Show selected tab content
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Add active class to selected tab button
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update current tab index
    this.currentTab = this.tabs.indexOf(tabName);
    this.updateTabButtons();
  }

  previousTab() {
    if (this.currentTab > 0) {
      this.switchTab(this.tabs[this.currentTab - 1]);
    }
  }

  nextTab() {
    if (this.currentTab < this.tabs.length - 1) {
      this.switchTab(this.tabs[this.currentTab + 1]);
    }
  }

  updateTabButtons() {
    const prevButton = document.getElementById('prev-tab');
    const nextButton = document.getElementById('next-tab');
    
    prevButton.style.display = this.currentTab === 0 ? 'none' : 'flex';
    nextButton.style.display = this.currentTab === this.tabs.length - 1 ? 'none' : 'flex';
  }

  setupXYZPreview() {
    // Add event listeners to all XYZ input fields for real-time preview
    document.addEventListener('input', (e) => {
      if (e.target.classList.contains('xyz-situation') || 
          e.target.classList.contains('xyz-action') || 
          e.target.classList.contains('xyz-result')) {
        this.updateXYZPreview(e.target);
      }
    });
  }

  updateXYZPreview(inputElement) {
    const achievementBlock = inputElement.closest('.achievement-block');
    const previewElement = achievementBlock.querySelector('.preview-text');
    
    const situation = achievementBlock.querySelector('.xyz-situation').value;
    const action = achievementBlock.querySelector('.xyz-action').value;
    const result = achievementBlock.querySelector('.xyz-result').value;

    if (situation && action && result) {
      const xyzBullet = this.engine.generateXYZBullet(situation, action, result);
      previewElement.textContent = xyzBullet.formatted;
      previewElement.style.color = '#333';
      previewElement.style.fontStyle = 'normal';
    } else {
      previewElement.textContent = 'Fill in all three fields to see preview...';
      previewElement.style.color = '#666';
      previewElement.style.fontStyle = 'italic';
    }
  }

  setupDynamicForms() {
    // This will be implemented to handle dynamic form additions
  }

  setupKeywordExtraction() {
    const jobDescriptionTextarea = document.getElementById('job_description');
    if (jobDescriptionTextarea) {
      jobDescriptionTextarea.addEventListener('input', () => {
        this.extractKeywords();
      });
    }
  }

  extractKeywords() {
    const jobDescription = document.getElementById('job_description').value;
    const keywordsContainer = document.getElementById('extracted-keywords');
    
    if (!jobDescription.trim()) {
      keywordsContainer.innerHTML = '';
      return;
    }

    const keywords = this.engine.extractKeywords(jobDescription);
    
    keywordsContainer.innerHTML = keywords.map(keyword => 
      `<span class="keyword-tag">${keyword}</span>`
    ).join('');
  }

  addExperienceBlock() {
    const container = document.getElementById('experience-container');
    const blockCount = container.children.length + 1;
    
    const newBlock = document.createElement('div');
    newBlock.className = 'experience-block';
    newBlock.innerHTML = `
      <h4>Experience ${blockCount}</h4>
      <div class="form-row">
        <div class="form-group">
          <label>Organization</label>
          <input type="text" class="exp-organization" placeholder="Company name" />
        </div>
        <div class="form-group">
          <label>Position</label>
          <input type="text" class="exp-position" placeholder="Job title" />
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Location</label>
          <input type="text" class="exp-location" placeholder="City, State" />
        </div>
        <div class="form-group">
          <label>Start Date</label>
          <input type="text" class="exp-start-date" placeholder="Month Year" />
        </div>
        <div class="form-group">
          <label>End Date</label>
          <input type="text" class="exp-end-date" placeholder="Month Year or Present" />
        </div>
      </div>

      <div class="achievements-section">
        <h5>Key Achievements (XYZ Format)</h5>
        <div class="achievement-block">
          <div class="xyz-inputs">
            <div class="xyz-input">
              <label>X - Situation/Task</label>
              <textarea class="xyz-situation" placeholder="Describe the situation or challenge you faced"></textarea>
            </div>
            <div class="xyz-input">
              <label>Y - Action/Contribution</label>
              <textarea class="xyz-action" placeholder="Describe the specific actions you took"></textarea>
            </div>
            <div class="xyz-input">
              <label>Z - Results (quantified)</label>
              <textarea class="xyz-result" placeholder="Describe the measurable results achieved"></textarea>
            </div>
          </div>
          <div class="xyz-preview">
            <strong>Preview:</strong>
            <div class="preview-text"></div>
          </div>
        </div>
      </div>
    `;
    
    container.appendChild(newBlock);
  }

  addProjectBlock() {
    const container = document.getElementById('projects-container');
    const blockCount = container.children.length + 1;
    
    const newBlock = document.createElement('div');
    newBlock.className = 'project-block';
    newBlock.innerHTML = `
      <h4>Project ${blockCount}</h4>
      <div class="form-row">
        <div class="form-group">
          <label>Project Name</label>
          <input type="text" class="project-name" placeholder="Project title" />
        </div>
        <div class="form-group">
          <label>Technologies Used</label>
          <input type="text" class="project-technologies" placeholder="React, Node.js, MongoDB" />
        </div>
      </div>
      
      <div class="form-group">
        <label>Project Description</label>
        <textarea class="project-description" placeholder="Brief description of the project"></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Duration</label>
          <input type="text" class="project-duration" placeholder="e.g. 3 months" />
        </div>
        <div class="form-group">
          <label>Team Size</label>
          <input type="number" class="project-team-size" placeholder="1" min="1" />
        </div>
      </div>

      <div class="achievements-section">
        <h5>Project Achievements (XYZ Format)</h5>
        <div class="achievement-block">
          <div class="xyz-inputs">
            <div class="xyz-input">
              <label>X - Project Scope/Challenge</label>
              <textarea class="xyz-situation" placeholder="Describe the project scope or problem solved"></textarea>
            </div>
            <div class="xyz-input">
              <label>Y - Implementation Approach</label>
              <textarea class="xyz-action" placeholder="Describe technologies and approach used"></textarea>
            </div>
            <div class="xyz-input">
              <label>Z - Measurable Impact</label>
              <textarea class="xyz-result" placeholder="Describe the measurable results or impact"></textarea>
            </div>
          </div>
          <div class="xyz-preview">
            <strong>Preview:</strong>
            <div class="preview-text"></div>
          </div>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>GitHub Link</label>
          <input type="text" class="project-github" placeholder="https://github.com/..." />
        </div>
        <div class="form-group">
          <label>Live Demo</label>
          <input type="text" class="project-demo" placeholder="https://..." />
        </div>
      </div>
    `;
    
    container.appendChild(newBlock);
  }

  addEducationBlock() {
    const container = document.getElementById('education-container');
    const blockCount = container.children.length + 1;
    
    const newBlock = document.createElement('div');
    newBlock.className = 'education-block';
    newBlock.innerHTML = `
      <h4>Education ${blockCount}</h4>
      <div class="form-row">
        <div class="form-group">
          <label>Degree</label>
          <input type="text" class="edu-degree" placeholder="e.g. Bachelor of Technology" />
        </div>
        <div class="form-group">
          <label>Major/Field</label>
          <input type="text" class="edu-major" placeholder="e.g. Computer Science" />
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Institution</label>
          <input type="text" class="edu-institution" placeholder="University name" />
        </div>
        <div class="form-group">
          <label>Location</label>
          <input type="text" class="edu-location" placeholder="City, State" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Graduation Date</label>
          <input type="text" class="edu-graduation-date" placeholder="Month Year" />
        </div>
        <div class="form-group">
          <label>GPA (optional)</label>
          <input type="number" class="edu-gpa" step="0.01" min="0" max="4" placeholder="3.5" />
        </div>
      </div>

      <div class="form-group">
        <label>Honors/Achievements</label>
        <textarea class="edu-honors" placeholder="Dean's List, Magna Cum Laude, etc."></textarea>
      </div>

      <div class="form-group">
        <label>Relevant Coursework (for freshers)</label>
        <textarea class="edu-coursework" placeholder="Data Structures, Algorithms, Database Systems, etc."></textarea>
      </div>
    `;
    
    container.appendChild(newBlock);
  }

  addCertificationBlock() {
    const container = document.getElementById('certifications-container');
    const blockCount = container.children.length + 1;
    
    const newBlock = document.createElement('div');
    newBlock.className = 'certification-block';
    newBlock.innerHTML = `
      <div class="form-row">
        <div class="form-group">
          <label>Certification Name</label>
          <input type="text" class="cert-name" placeholder="AWS Certified Solutions Architect" />
        </div>
        <div class="form-group">
          <label>Issuing Organization</label>
          <input type="text" class="cert-organization" placeholder="Amazon Web Services" />
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Date Obtained</label>
          <input type="text" class="cert-date" placeholder="Month Year" />
        </div>
        <div class="form-group">
          <label>Expiration Date (optional)</label>
          <input type="text" class="cert-expiration" placeholder="Month Year" />
        </div>
      </div>

      <div class="form-group">
        <label>Credential ID (optional)</label>
        <input type="text" class="cert-credential-id" placeholder="Credential ID" />
      </div>
    `;
    
    container.appendChild(newBlock);
  }

  collectFormData() {
    const data = {
      personal_info: {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        location: document.getElementById('location').value.trim(),
        linkedin: document.getElementById('linkedin').value.trim(),
        github: document.getElementById('github').value.trim(),
        portfolio: document.getElementById('portfolio').value.trim()
      },
      candidate_type: document.getElementById('candidate_type').value,
      target_role: {
        position: document.getElementById('target_position').value.trim(),
        industry: document.getElementById('target_industry').value.trim(),
        key_skills: document.getElementById('core_competencies').value.split(',').map(s => s.trim()).filter(Boolean)
      },
      professional_summary: {
        years_experience: parseInt(document.getElementById('years_experience').value) || 0,
        core_competencies: document.getElementById('core_competencies').value.split(',').map(s => s.trim()).filter(Boolean)
      },
      experience: this.collectExperienceData(),
      projects: this.collectProjectsData(),
      education: this.collectEducationData(),
      certifications: this.collectCertificationsData(),
      additional_sections: {
        technical_skills: {
          programming_languages: document.getElementById('programming-languages').value.split(',').map(s => s.trim()).filter(Boolean),
          frameworks: document.getElementById('frameworks').value.split(',').map(s => s.trim()).filter(Boolean),
          databases: document.getElementById('databases').value.split(',').map(s => s.trim()).filter(Boolean),
          tools: document.getElementById('tools').value.split(',').map(s => s.trim()).filter(Boolean),
          cloud_platforms: document.getElementById('cloud-platforms').value.split(',').map(s => s.trim()).filter(Boolean)
        }
      },
      applied_job_title: document.getElementById('applied_job_title').value.trim(),
      applied_company: document.getElementById('applied_company').value.trim(),
      job_description: document.getElementById('job_description').value.trim()
    };

    return data;
  }

  collectExperienceData() {
    const experiences = [];
    const blocks = document.querySelectorAll('.experience-block');
    
    blocks.forEach(block => {
      const organization = block.querySelector('.exp-organization').value.trim();
      if (!organization) return;
      
      const achievementBlock = block.querySelector('.achievement-block');
      const situation = achievementBlock.querySelector('.xyz-situation').value.trim();
      const action = achievementBlock.querySelector('.xyz-action').value.trim();
      const result = achievementBlock.querySelector('.xyz-result').value.trim();
      
      const experience = {
        organization,
        position: block.querySelector('.exp-position').value.trim(),
        location: block.querySelector('.exp-location').value.trim(),
        start_date: block.querySelector('.exp-start-date').value.trim(),
        end_date: block.querySelector('.exp-end-date').value.trim(),
        achievements: []
      };
      
      if (situation && action && result) {
        experience.achievements.push({
          X: situation,
          Y: action,
          Z: result
        });
      }
      
      experiences.push(experience);
    });
    
    return experiences;
  }

  collectProjectsData() {
    const projects = [];
    const blocks = document.querySelectorAll('.project-block');
    
    blocks.forEach(block => {
      const name = block.querySelector('.project-name').value.trim();
      if (!name) return;
      
      const achievementBlock = block.querySelector('.achievement-block');
      const situation = achievementBlock.querySelector('.xyz-situation').value.trim();
      const action = achievementBlock.querySelector('.xyz-action').value.trim();
      const result = achievementBlock.querySelector('.xyz-result').value.trim();
      
      const project = {
        name,
        description: block.querySelector('.project-description').value.trim(),
        technologies: block.querySelector('.project-technologies').value.split(',').map(s => s.trim()).filter(Boolean),
        duration: block.querySelector('.project-duration').value.trim(),
        team_size: parseInt(block.querySelector('.project-team-size').value) || 1,
        github_link: block.querySelector('.project-github').value.trim(),
        live_demo: block.querySelector('.project-demo').value.trim(),
        achievements: []
      };
      
      if (situation && action && result) {
        project.achievements.push({
          X: situation,
          Y: action,
          Z: result
        });
      }
      
      projects.push(project);
    });
    
    return projects;
  }

  collectEducationData() {
    const education = [];
    const blocks = document.querySelectorAll('.education-block');
    
    blocks.forEach(block => {
      const degree = block.querySelector('.edu-degree').value.trim();
      if (!degree) return;
      
      education.push({
        degree,
        major: block.querySelector('.edu-major').value.trim(),
        institution: block.querySelector('.edu-institution').value.trim(),
        location: block.querySelector('.edu-location').value.trim(),
        graduation_date: block.querySelector('.edu-graduation-date').value.trim(),
        gpa: parseFloat(block.querySelector('.edu-gpa').value) || null,
        honors: block.querySelector('.edu-honors').value.split(',').map(s => s.trim()).filter(Boolean),
        relevant_coursework: block.querySelector('.edu-coursework').value.split(',').map(s => s.trim()).filter(Boolean)
      });
    });
    
    return education;
  }

  collectCertificationsData() {
    const certifications = [];
    const blocks = document.querySelectorAll('.certification-block');
    
    blocks.forEach(block => {
      const name = block.querySelector('.cert-name').value.trim();
      if (!name) return;
      
      certifications.push({
        name,
        issuing_organization: block.querySelector('.cert-organization').value.trim(),
        date_obtained: block.querySelector('.cert-date').value.trim(),
        expiration_date: block.querySelector('.cert-expiration').value.trim() || null,
        credential_id: block.querySelector('.cert-credential-id').value.trim() || null
      });
    });
    
    return certifications;
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    
    const loading = document.getElementById("loading");
    const resumeOutput = document.getElementById("resume-output");
    const coverOutput = document.getElementById("cover-output");
    const outputContainer = document.getElementById("output");
    const validationContainer = document.getElementById("validation-errors");

    // Hide previous outputs
    outputContainer.style.display = 'none';
    validationContainer.style.display = 'none';
    
    // Show loading
    loading.style.display = "block";
    resumeOutput.innerHTML = "";
    coverOutput.innerHTML = "";

    try {
      // Collect and validate form data
      const formData = this.collectFormData();
      const validation = this.engine.validateInputData(formData);
      
      if (validation.errors.length > 0) {
        this.showValidationErrors(validation.errors);
        return;
      }

      // Generate resume using XYZ engine
      const resume = this.engine.generateResume(formData);
      
      // Optimize for ATS if job description provided
      if (formData.job_description) {
        this.engine.optimizeForATS(resume, formData.job_description);
      }

      // Display the generated resume
      this.displayResume(resume);
      
      // Show ATS score
      document.getElementById('ats-score-value').textContent = `${resume.ats_score}%`;
      
      // Show output container
      outputContainer.style.display = 'block';
      
      // Generate cover letter via API
      await this.generateCoverLetter(formData);

    } catch (err) {
      console.error("Error generating resume:", err);
      this.showError("Failed to generate resume. Please check your input and try again.");
    } finally {
      loading.style.display = "none";
    }
  }

  showValidationErrors(errors) {
    const validationContainer = document.getElementById("validation-errors");
    const errorList = document.getElementById("error-list");
    
    errorList.innerHTML = errors.map(error => `<li>${error}</li>`).join('');
    validationContainer.style.display = 'block';
  }

  showError(message) {
    const resumeOutput = document.getElementById("resume-output");
    resumeOutput.innerHTML = `<div class="error-message">❌ ${message}</div>`;
    document.getElementById("output").style.display = 'block';
  }

  displayResume(resume) {
    const resumeOutput = document.getElementById("resume-output");
    let html = '';

    // Header
    html += `<div class="resume-header">`;
    html += `<h1>${this.escapeHtml(resume.personal_info.name)}</h1>`;
    html += `<div class="contact-info">`;
    
    const contactParts = [];
    if (resume.personal_info.location) contactParts.push(resume.personal_info.location);
    if (resume.personal_info.email) contactParts.push(`<a href="mailto:${resume.personal_info.email}">${resume.personal_info.email}</a>`);
    if (resume.personal_info.phone) contactParts.push(resume.personal_info.phone);
    if (resume.personal_info.linkedin) contactParts.push(`<a href="${resume.personal_info.linkedin}" target="_blank">LinkedIn</a>`);
    if (resume.personal_info.github) contactParts.push(`<a href="${resume.personal_info.github}" target="_blank">GitHub</a>`);
    if (resume.personal_info.portfolio) contactParts.push(`<a href="${resume.personal_info.portfolio}" target="_blank">Portfolio</a>`);
    
    html += contactParts.join(' • ');
    html += `</div></div>`;

    // Professional Summary
    if (resume.professional_summary) {
      html += `<div class="resume-section">`;
      html += `<h2>Professional Summary</h2>`;
      html += `<p>${this.escapeHtml(resume.professional_summary)}</p>`;
      html += `</div>`;
    }

    // Sections
    resume.sections.forEach(section => {
      html += `<div class="resume-section">`;
      html += `<h2>${section.title}</h2>`;
      
      if (section.title === 'Technical Skills') {
        html += this.renderTechnicalSkills(section.content);
      } else if (section.title === 'Professional Experience') {
        html += this.renderExperience(section.content);
      } else if (section.title === 'Projects') {
        html += this.renderProjects(section.content);
      } else if (section.title === 'Education') {
        html += this.renderEducation(section.content);
      } else if (section.title === 'Certifications') {
        html += this.renderCertifications(section.content);
      }
      
      html += `</div>`;
    });

    resumeOutput.innerHTML = html;
  }

  renderTechnicalSkills(skills) {
    let html = '';
    
    if (skills.programming_languages.length > 0) {
      html += `<div class="skill-category">`;
      html += `<strong>Programming Languages:</strong> ${skills.programming_languages.join(', ')}`;
      html += `</div>`;
    }
    
    if (skills.frameworks.length > 0) {
      html += `<div class="skill-category">`;
      html += `<strong>Frameworks & Libraries:</strong> ${skills.frameworks.join(', ')}`;
      html += `</div>`;
    }
    
    if (skills.databases.length > 0) {
      html += `<div class="skill-category">`;
      html += `<strong>Databases:</strong> ${skills.databases.join(', ')}`;
      html += `</div>`;
    }
    
    if (skills.tools.length > 0) {
      html += `<div class="skill-category">`;
      html += `<strong>Tools & Technologies:</strong> ${skills.tools.join(', ')}`;
      html += `</div>`;
    }
    
    if (skills.cloud_platforms.length > 0) {
      html += `<div class="skill-category">`;
      html += `<strong>Cloud Platforms:</strong> ${skills.cloud_platforms.join(', ')}`;
      html += `</div>`;
    }
    
    return html;
  }

  renderExperience(experiences) {
    let html = '';
    
    experiences.forEach(exp => {
      html += `<div class="experience-item">`;
      html += `<div class="experience-header">`;
      html += `<h3>${this.escapeHtml(exp.position)}</h3>`;
      html += `<div class="company-info">`;
      html += `<strong>${this.escapeHtml(exp.organization)}</strong>`;
      if (exp.location) html += ` • ${this.escapeHtml(exp.location)}`;
      html += `</div>`;
      html += `<div class="experience-dates">${this.escapeHtml(exp.start_date)} - ${this.escapeHtml(exp.end_date)}</div>`;
      html += `</div>`;
      
      if (exp.achievements && exp.achievements.length > 0) {
        html += `<ul class="achievements-list">`;
        exp.achievements.forEach(achievement => {
          html += `<li>${this.escapeHtml(achievement.formatted)}</li>`;
        });
        html += `</ul>`;
      }
      
      html += `</div>`;
    });
    
    return html;
  }

  renderProjects(projects) {
    let html = '';
    
    projects.forEach(project => {
      html += `<div class="project-item">`;
      html += `<div class="project-header">`;
      html += `<h3>${this.escapeHtml(project.name)}</h3>`;
      if (project.technologies.length > 0) {
        html += `<div class="project-tech">${project.technologies.join(', ')}</div>`;
      }
      html += `</div>`;
      
      if (project.description) {
        html += `<p class="project-description">${this.escapeHtml(project.description)}</p>`;
      }
      
      if (project.achievements && project.achievements.length > 0) {
        html += `<ul class="achievements-list">`;
        project.achievements.forEach(achievement => {
          html += `<li>${this.escapeHtml(achievement.formatted)}</li>`;
        });
        html += `</ul>`;
      }
      
      html += `</div>`;
    });
    
    return html;
  }

  renderEducation(education) {
    let html = '';
    
    education.forEach(edu => {
      html += `<div class="education-item">`;
      html += `<h3>${this.escapeHtml(edu.degree)}`;
      if (edu.major) html += ` in ${this.escapeHtml(edu.major)}`;
      html += `</h3>`;
      html += `<div class="education-details">`;
      html += `<strong>${this.escapeHtml(edu.institution)}</strong>`;
      if (edu.location) html += ` • ${this.escapeHtml(edu.location)}`;
      html += `</div>`;
      html += `<div class="education-date">${this.escapeHtml(edu.graduation_date)}</div>`;
      html += `</div>`;
    });
    
    return html;
  }

  renderCertifications(certifications) {
    let html = '';
    
    certifications.forEach(cert => {
      html += `<div class="certification-item">`;
      html += `<h3>${this.escapeHtml(cert.name)}</h3>`;
      html += `<div class="certification-details">`;
      html += `<strong>${this.escapeHtml(cert.issuing_organization)}</strong>`;
      html += ` • ${this.escapeHtml(cert.date_obtained)}`;
      html += `</div>`;
      html += `</div>`;
    });
    
    return html;
  }

  async generateCoverLetter(formData) {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${text}`);
      }

      const json = JSON.parse(text);
      const coverOutput = document.getElementById("cover-output");
      
      try {
        const coverParsed = JSON.parse(json.cover_raw);
        coverOutput.innerHTML = `<div class="cover-letter">${this.escapeHtml(coverParsed.cover_letter || JSON.stringify(coverParsed))}</div>`;
      } catch (e) {
        coverOutput.innerHTML = `<div class="cover-letter">${this.escapeHtml(json.cover_raw || "")}</div>`;
      }

    } catch (err) {
      console.error("Error generating cover letter:", err);
      document.getElementById("cover-output").innerHTML = "❌ Failed to generate cover letter.";
    }
  }

  downloadPDF() {
    // Implementation for PDF download
    const resumeContent = document.getElementById('resume-output');
    const coverContent = document.getElementById('cover-output');
    
    if (!resumeContent.innerHTML.trim()) {
      alert('Please generate a resume first before downloading PDF.');
      return;
    }

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
    
    // Get the name for the header
    const name = document.getElementById('name').value.trim() || 'Resume';
    
    // Add header with name
    addTextWithWrap(name.toUpperCase(), 18, true, [44, 62, 80]);
    yPosition += 5;
    
    // Process resume content
    const resumeElements = resumeContent.querySelectorAll('h1, h2, h3, p, div, ul, li');
    
    for (let element of resumeElements) {
      const tagName = element.tagName.toLowerCase();
      const text = element.textContent.trim();
      
      if (!text) continue;
      
      switch (tagName) {
        case 'h1':
          addTextWithWrap(text, 16, true, [44, 62, 80]);
          yPosition += 3;
          break;
        case 'h2':
          addTextWithWrap(text, 14, true, [52, 73, 94]);
          yPosition += 2;
          break;
        case 'h3':
          addTextWithWrap(text, 12, true, [52, 73, 94]);
          yPosition += 2;
          break;
        case 'p':
        case 'div':
          addTextWithWrap(text, 12, false);
          break;
        case 'ul':
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
    const filename = `${name.replace(/\s+/g, '_')}_XYZ_Resume.pdf`;
    
    // Save the PDF
    doc.save(filename);
  }

  downloadMarkdown() {
    const resumeContent = document.getElementById('resume-output');
    const coverContent = document.getElementById('cover-output');
    
    if (!resumeContent.innerHTML.trim()) {
      alert('Please generate a resume first before downloading Markdown.');
      return;
    }

    // Convert HTML to Markdown (simplified)
    let markdown = this.htmlToMarkdown(resumeContent.innerHTML);
    
    if (coverContent.innerHTML.trim()) {
      markdown += '\n\n# Cover Letter\n\n';
      markdown += this.htmlToMarkdown(coverContent.innerHTML);
    }
    
    // Create and download file
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${document.getElementById('name').value.replace(/\s+/g, '_')}_XYZ_Resume.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  copyToClipboard() {
    const resumeContent = document.getElementById('resume-output');
    const coverContent = document.getElementById('cover-output');
    
    if (!resumeContent.innerHTML.trim()) {
      alert('Please generate a resume first before copying.');
      return;
    }

    let text = resumeContent.textContent;
    if (coverContent.innerHTML.trim()) {
      text += '\n\nCOVER LETTER\n\n' + coverContent.textContent;
    }
    
    navigator.clipboard.writeText(text).then(() => {
      alert('Resume copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
      alert('Failed to copy to clipboard. Please try again.');
    });
  }

  htmlToMarkdown(html) {
    // Simplified HTML to Markdown conversion
    return html
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<ul[^>]*>(.*?)<\/ul>/gi, '$1\n')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<div[^>]*>(.*?)<\/div>/gi, '$1\n')
      .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
      .replace(/<[^>]*>/g, '')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();
  }

  escapeHtml(text) {
    if (!text) return "";
    return text
      .toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new XYZResumeApp();
});