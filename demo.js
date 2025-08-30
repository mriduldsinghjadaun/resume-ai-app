/**
 * Demo script for XYZ Resume Generator
 * This script demonstrates how to use the XYZResumeEngine programmatically
 */

// Import the XYZ Resume Engine (if running in Node.js environment)
// const XYZResumeEngine = require('./xyz-resume-engine.js');

// Sample data for demonstration
const sampleFresherData = {
  personal_info: {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "https://www.linkedin.com/in/sarah-johnson-dev",
    github: "https://github.com/sarahjohnson",
    portfolio: "https://sarahjohnson.dev"
  },
  candidate_type: "fresher",
  target_role: {
    position: "Frontend Developer",
    industry: "Technology",
    key_skills: ["JavaScript", "React", "CSS", "HTML", "Node.js"]
  },
  professional_summary: {
    years_experience: 0,
    key_achievements: [
      {
        X: "University capstone project requiring full-stack web application development",
        Y: "Developed e-commerce platform using React, Node.js, and MongoDB with responsive design",
        Z: "Achieved 95% test coverage, 2-second page load time, and won Best Project Award"
      }
    ],
    core_competencies: ["JavaScript", "React", "Node.js", "MongoDB", "Responsive Design"]
  },
  education: [
    {
      degree: "Bachelor of Science",
      major: "Computer Science",
      institution: "University of California, Berkeley",
      location: "Berkeley, CA",
      graduation_date: "May 2024",
      gpa: 3.8,
      honors: ["Dean's List", "Magna Cum Laude"],
      relevant_coursework: ["Data Structures", "Algorithms", "Database Systems", "Software Engineering", "Web Development"]
    }
  ],
  projects: [
    {
      name: "Task Management App",
      description: "A collaborative task management application with real-time updates",
      technologies: ["React", "Node.js", "Socket.io", "MongoDB"],
      duration: "3 months",
      team_size: 3,
      achievements: [
        {
          X: "Team project requiring real-time collaboration features",
          Y: "Implemented WebSocket connections and responsive UI with React",
          Z: "Achieved 100+ concurrent users and 99.9% uptime"
        }
      ],
      github_link: "https://github.com/sarahjohnson/task-manager",
      live_demo: "https://taskmanager-demo.herokuapp.com"
    }
  ],
  certifications: [
    {
      name: "AWS Certified Cloud Practitioner",
      issuing_organization: "Amazon Web Services",
      date_obtained: "March 2024",
      expiration_date: "March 2027",
      credential_id: "AWS-CCP-123456"
    }
  ],
  additional_sections: {
    technical_skills: {
      programming_languages: ["JavaScript", "Python", "Java", "HTML5", "CSS3"],
      frameworks: ["React", "Node.js", "Express", "Bootstrap", "Tailwind CSS"],
      databases: ["MongoDB", "MySQL", "PostgreSQL"],
      tools: ["Git", "Docker", "VS Code", "Postman", "Figma"],
      cloud_platforms: ["AWS", "Heroku", "Netlify", "Vercel"]
    }
  }
};

// Demo function to test XYZ Resume Engine
function runDemo() {
  console.log("🚀 XYZ Resume Generator Demo");
  console.log("============================\n");

  // Initialize the engine
  const engine = new XYZResumeEngine();

  // Test XYZ bullet point generation
  console.log("📝 Testing XYZ Bullet Point Generation:");
  console.log("----------------------------------------");
  
  const xyzBullet = engine.generateXYZBullet(
    "Legacy system causing performance issues",
    "Redesigned the architecture using microservices",
    "Improved performance by 60% and reduced costs by 30%"
  );
  
  console.log("Input:");
  console.log("  X: Legacy system causing performance issues");
  console.log("  Y: Redesigned the architecture using microservices");
  console.log("  Z: Improved performance by 60% and reduced costs by 30%");
  console.log("\nOutput:");
  console.log(`  ${xyzBullet.formatted}\n`);

  // Test input validation
  console.log("✅ Testing Input Validation:");
  console.log("----------------------------");
  
  const validation = engine.validateInputData(sampleFresherData);
  console.log(`Validation Errors: ${validation.errors.length}`);
  console.log(`Validation Warnings: ${validation.warnings.length}`);
  
  if (validation.errors.length > 0) {
    console.log("Errors:", validation.errors);
  }
  if (validation.warnings.length > 0) {
    console.log("Warnings:", validation.warnings);
  }
  console.log("");

  // Test professional summary generation
  console.log("📋 Testing Professional Summary Generation:");
  console.log("--------------------------------------------");
  
  const summary = engine.generateProfessionalSummary(sampleFresherData);
  console.log(summary);
  console.log("");

  // Test ATS score calculation
  console.log("📊 Testing ATS Score Calculation:");
  console.log("----------------------------------");
  
  const atsScore = engine.calculateATSScore(sampleFresherData);
  console.log(`ATS Compatibility Score: ${atsScore}%`);
  console.log("");

  // Test keyword extraction
  console.log("🔍 Testing Keyword Extraction:");
  console.log("-------------------------------");
  
  const jobDescription = "We are looking for a Frontend Developer with experience in React, JavaScript, and modern web development practices. The ideal candidate will have knowledge of HTML, CSS, and responsive design principles.";
  const keywords = engine.extractKeywords(jobDescription);
  console.log("Job Description:", jobDescription);
  console.log("Extracted Keywords:", keywords);
  console.log("");

  // Test complete resume generation
  console.log("📄 Testing Complete Resume Generation:");
  console.log("--------------------------------------");
  
  try {
    const resume = engine.generateResume(sampleFresherData);
    console.log("✅ Resume generated successfully!");
    console.log(`ATS Score: ${resume.ats_score}%`);
    console.log(`Sections: ${resume.sections.length}`);
    console.log("Section titles:", resume.sections.map(s => s.title));
  } catch (error) {
    console.log("❌ Error generating resume:", error.message);
  }

  console.log("\n🎉 Demo completed successfully!");
  console.log("\nTo use this system:");
  console.log("1. Open index.html in your browser");
  console.log("2. Fill in the form with your information");
  console.log("3. Use the XYZ methodology for achievements");
  console.log("4. Generate and download your resume");
}

// Run the demo if this script is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  console.log("This demo is designed to run in a browser environment.");
  console.log("Please open index.html in your browser to use the XYZ Resume Generator.");
} else {
  // Browser environment
  console.log("XYZ Resume Generator Demo loaded. Run runDemo() to start the demonstration.");
}
