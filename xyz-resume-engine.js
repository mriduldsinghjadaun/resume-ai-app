/**
 * XYZ Resume Generation Engine
 * Implements the XYZ methodology for ATS-friendly resume generation
 */

class XYZResumeEngine {
  constructor() {
    this.actionVerbs = {
      leadership: ["Led", "Directed", "Managed", "Supervised", "Coordinated", "Mentored", "Guided"],
      analysis: ["Analyzed", "Evaluated", "Assessed", "Investigated", "Researched", "Examined"],
      creation: ["Developed", "Designed", "Built", "Created", "Implemented", "Established", "Launched"],
      improvement: ["Optimized", "Enhanced", "Improved", "Streamlined", "Increased", "Reduced", "Accelerated"],
      collaboration: ["Collaborated", "Partnered", "Facilitated", "Coordinated", "Contributed", "Supported"]
    };

    this.quantificationExamples = {
      percentages: "Increased efficiency by 25%",
      dollar_amounts: "Generated $500K in revenue",
      time_savings: "Reduced processing time by 3 hours daily",
      scale: "Managed team of 15 developers",
      frequency: "Delivered 20+ projects quarterly",
      user_impact: "Improved user experience for 10K+ users"
    };
  }

  /**
   * Validates input data structure according to XYZ methodology requirements
   */
  validateInputData(data) {
    const errors = [];
    const warnings = [];

    // Required fields validation
    if (!data.personal_info?.name) errors.push("Name is required");
    if (!data.personal_info?.email) errors.push("Email is required");
    if (!data.candidate_type) errors.push("Candidate type (experienced/fresher) is required");
    if (!data.target_role?.position) errors.push("Target position is required");

    // Candidate type validation
    if (data.candidate_type && !['experienced', 'fresher'].includes(data.candidate_type)) {
      errors.push("Candidate type must be 'experienced' or 'fresher'");
    }

    // Experience validation for experienced candidates
    if (data.candidate_type === 'experienced' && (!data.experience || data.experience.length === 0)) {
      warnings.push("No professional experience provided for experienced candidate");
    }

    // Education validation
    if (!data.education || data.education.length === 0) {
      warnings.push("No education information provided");
    }

    // XYZ achievement validation
    if (data.professional_summary?.key_achievements) {
      data.professional_summary.key_achievements.forEach((achievement, index) => {
        if (!achievement.X || !achievement.Y || !achievement.Z) {
          warnings.push(`Achievement ${index + 1} missing XYZ components`);
        }
      });
    }

    return { errors, warnings };
  }

  /**
   * Generates XYZ-formatted bullet points
   */
  generateXYZBullet(situation, action, result, options = {}) {
    const {
      removePronouns = true,
      suggestQuantification = true,
      actionVerbCategory = 'creation'
    } = options;

    let formattedAction = action;
    let formattedResult = result;

    // Remove personal pronouns
    if (removePronouns) {
      formattedAction = this.removePersonalPronouns(formattedAction);
      formattedResult = this.removePersonalPronouns(formattedResult);
    }

    // Convert to phrase format (remove full sentences)
    formattedAction = this.convertToPhrase(formattedAction);
    formattedResult = this.convertToPhrase(formattedResult);

    // Suggest quantification if result lacks numbers
    if (suggestQuantification && !this.hasQuantification(formattedResult)) {
      formattedResult = this.suggestQuantification(formattedResult);
    }

    // Ensure action starts with strong verb
    formattedAction = this.ensureStrongActionVerb(formattedAction, actionVerbCategory);

    return {
      X: this.convertToPhrase(situation),
      Y: formattedAction,
      Z: formattedResult,
      formatted: `${formattedAction} ${formattedResult}`
    };
  }

  /**
   * Removes personal pronouns from text
   */
  removePersonalPronouns(text) {
    if (!text) return text;
    
    const pronouns = /\b(I|me|my|we|our|us)\b/gi;
    return text.replace(pronouns, '').replace(/\s+/g, ' ').trim();
  }

  /**
   * Converts full sentences to professional phrases
   */
  convertToPhrase(text) {
    if (!text) return text;
    
    // Remove sentence endings
    text = text.replace(/[.!?]+$/, '');
    
    // Convert to lowercase and capitalize first letter
    text = text.toLowerCase().trim();
    if (text.length > 0) {
      text = text.charAt(0).toUpperCase() + text.slice(1);
    }
    
    return text;
  }

  /**
   * Checks if text contains quantification
   */
  hasQuantification(text) {
    if (!text) return false;
    
    const quantificationPatterns = [
      /\d+%/,           // percentages
      /\$\d+/,          // dollar amounts
      /\d+\+/,          // numbers with plus
      /\d+[KMB]/,       // K, M, B suffixes
      /\d+\s*(hours?|days?|weeks?|months?|years?)/i, // time periods
      /\d+\s*(users?|customers?|clients?|projects?|teams?)/i // scale indicators
    ];
    
    return quantificationPatterns.some(pattern => pattern.test(text));
  }

  /**
   * Suggests quantification for results
   */
  suggestQuantification(result) {
    const suggestions = [
      "resulting in measurable improvement",
      "achieving significant impact",
      "delivering positive outcomes",
      "exceeding expectations",
      "driving successful results"
    ];
    
    return `${result}, ${suggestions[Math.floor(Math.random() * suggestions.length)]}`;
  }

  /**
   * Ensures action starts with a strong verb
   */
  ensureStrongActionVerb(action, category = 'creation') {
    if (!action) return action;
    
    const verbs = this.actionVerbs[category] || this.actionVerbs.creation;
    const firstWord = action.split(' ')[0].toLowerCase();
    
    // Check if already starts with a strong verb
    const hasStrongVerb = Object.values(this.actionVerbs).flat()
      .some(verb => verb.toLowerCase() === firstWord);
    
    if (!hasStrongVerb) {
      const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
      return `${randomVerb} ${action}`;
    }
    
    return action;
  }

  /**
   * Generates professional summary based on candidate type
   */
  generateProfessionalSummary(data) {
    const { candidate_type, professional_summary, target_role } = data;
    
    if (candidate_type === 'fresher') {
      return this.generateFresherSummary(professional_summary, target_role);
    } else {
      return this.generateExperiencedSummary(professional_summary, target_role);
    }
  }

  generateFresherSummary(summary, targetRole) {
    const years = summary?.years_experience || 0;
    const competencies = summary?.core_competencies || [];
    const achievements = summary?.key_achievements || [];
    
    let summaryText = `Recent graduate with ${years} years of experience seeking ${targetRole.position} position. `;
    
    if (competencies.length > 0) {
      summaryText += `Proficient in ${competencies.slice(0, 3).join(', ')}. `;
    }
    
    if (achievements.length > 0) {
      const topAchievement = achievements[0];
      summaryText += `Demonstrated ability to ${topAchievement.Y.toLowerCase()} ${topAchievement.Z.toLowerCase()}.`;
    }
    
    return summaryText;
  }

  generateExperiencedSummary(summary, targetRole) {
    const years = summary?.years_experience || 0;
    const competencies = summary?.core_competencies || [];
    const achievements = summary?.key_achievements || [];
    
    let summaryText = `Experienced ${targetRole.position} with ${years} years of expertise in ${targetRole.industry}. `;
    
    if (competencies.length > 0) {
      summaryText += `Core competencies include ${competencies.slice(0, 4).join(', ')}. `;
    }
    
    if (achievements.length > 0) {
      const topAchievement = achievements[0];
      summaryText += `Proven track record of ${topAchievement.Y.toLowerCase()} ${topAchievement.Z.toLowerCase()}.`;
    }
    
    return summaryText;
  }

  /**
   * Optimizes content for ATS systems
   */
  optimizeForATS(content, jobDescription = '') {
    if (!jobDescription) return content;
    
    // Extract keywords from job description
    const jobKeywords = this.extractKeywords(jobDescription);
    
    // Add missing keywords to skills section
    if (content.skills) {
      const missingKeywords = jobKeywords.filter(keyword => 
        !content.skills.some(skill => 
          skill.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      
      if (missingKeywords.length > 0) {
        content.skills = [...content.skills, ...missingKeywords.slice(0, 3)];
      }
    }
    
    return content;
  }

  /**
   * Extracts keywords from job description
   */
  extractKeywords(jobDescription) {
    if (!jobDescription) return [];
    
    const commonTechKeywords = [
      'javascript', 'python', 'java', 'react', 'angular', 'vue', 'node.js',
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'agile',
      'scrum', 'ci/cd', 'api', 'rest', 'graphql', 'sql', 'nosql',
      'machine learning', 'ai', 'data analysis', 'project management'
    ];
    
    const text = jobDescription.toLowerCase();
    return commonTechKeywords.filter(keyword => text.includes(keyword));
  }

  /**
   * Generates complete resume structure
   */
  generateResume(data) {
    const validation = this.validateInputData(data);
    if (validation.errors.length > 0) {
      throw new Error(`Validation errors: ${validation.errors.join(', ')}`);
    }

    const resume = {
      personal_info: data.personal_info,
      professional_summary: this.generateProfessionalSummary(data),
      sections: this.generateSections(data),
      ats_score: this.calculateATSScore(data),
      warnings: validation.warnings
    };

    return resume;
  }

  /**
   * Generates resume sections based on candidate type
   */
  generateSections(data) {
    const sections = [];
    
    if (data.candidate_type === 'fresher') {
      sections.push(
        this.generateTechnicalSkillsSection(data),
        this.generateProjectsSection(data),
        this.generateEducationSection(data),
        this.generateCertificationsSection(data)
      );
    } else {
      sections.push(
        this.generateTechnicalSkillsSection(data),
        this.generateExperienceSection(data),
        this.generateProjectsSection(data),
        this.generateEducationSection(data),
        this.generateCertificationsSection(data)
      );
    }
    
    return sections.filter(section => section !== null);
  }

  generateTechnicalSkillsSection(data) {
    const skills = data.additional_sections?.technical_skills;
    if (!skills) return null;
    
    return {
      title: "Technical Skills",
      content: {
        programming_languages: skills.programming_languages || [],
        frameworks: skills.frameworks || [],
        databases: skills.databases || [],
        tools: skills.tools || [],
        cloud_platforms: skills.cloud_platforms || []
      }
    };
  }

  generateExperienceSection(data) {
    if (!data.experience || data.experience.length === 0) return null;
    
    const formattedExperience = data.experience.map(exp => ({
      ...exp,
      achievements: exp.achievements?.map(achievement => 
        this.generateXYZBullet(achievement.X, achievement.Y, achievement.Z)
      ) || []
    }));
    
    return {
      title: "Professional Experience",
      content: formattedExperience
    };
  }

  generateProjectsSection(data) {
    if (!data.projects || data.projects.length === 0) return null;
    
    const formattedProjects = data.projects.map(project => ({
      ...project,
      achievements: project.achievements?.map(achievement => 
        this.generateXYZBullet(achievement.X, achievement.Y, achievement.Z)
      ) || []
    }));
    
    return {
      title: "Projects",
      content: formattedProjects
    };
  }

  generateEducationSection(data) {
    if (!data.education || data.education.length === 0) return null;
    
    return {
      title: "Education",
      content: data.education
    };
  }

  generateCertificationsSection(data) {
    if (!data.certifications || data.certifications.length === 0) return null;
    
    return {
      title: "Certifications",
      content: data.certifications
    };
  }

  /**
   * Calculates ATS compatibility score
   */
  calculateATSScore(data) {
    let score = 0;
    let maxScore = 0;
    
    // Personal info (20 points)
    maxScore += 20;
    if (data.personal_info?.name) score += 5;
    if (data.personal_info?.email) score += 5;
    if (data.personal_info?.phone) score += 5;
    if (data.personal_info?.location) score += 5;
    
    // Professional summary (15 points)
    maxScore += 15;
    if (data.professional_summary) score += 15;
    
    // Experience/Projects (25 points)
    maxScore += 25;
    if (data.candidate_type === 'experienced' && data.experience?.length > 0) {
      score += 25;
    } else if (data.candidate_type === 'fresher' && data.projects?.length > 0) {
      score += 25;
    }
    
    // Education (15 points)
    maxScore += 15;
    if (data.education?.length > 0) score += 15;
    
    // Skills (15 points)
    maxScore += 15;
    if (data.additional_sections?.technical_skills) score += 15;
    
    // Certifications (10 points)
    maxScore += 10;
    if (data.certifications?.length > 0) score += 10;
    
    return Math.round((score / maxScore) * 100);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = XYZResumeEngine;
} else if (typeof window !== 'undefined') {
  window.XYZResumeEngine = XYZResumeEngine;
}
