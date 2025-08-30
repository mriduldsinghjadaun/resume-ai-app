# XYZ Resume Generator

A comprehensive AI-powered resume generation system that implements the proven XYZ methodology for creating ATS-friendly, professional resumes.

## 🎯 XYZ Methodology

The XYZ methodology is a structured approach to writing impactful resume bullet points:

- **X** = Situation/Task (context or challenge faced)
- **Y** = Action/Contribution (specific actions taken)
- **Z** = Results (quantified outcomes achieved)

### Key Principles:
- No personal pronouns (I, me, my, we, our)
- Use strong action verbs
- Quantify results wherever possible
- Phrase format, not full sentences
- Focus on impact and achievements

## ✨ Features

### 🎨 Modern User Interface
- **Tabbed Interface**: Organized into logical sections (Personal Info, Experience, Projects, etc.)
- **Real-time XYZ Preview**: See your bullet points formatted as you type
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Professional Styling**: Clean, modern design with intuitive navigation

### 🧠 Smart Resume Generation
- **XYZ Methodology Engine**: Automatically formats achievements using XYZ structure
- **ATS Optimization**: Ensures compatibility with Applicant Tracking Systems
- **Keyword Extraction**: Automatically extracts and suggests relevant keywords from job descriptions
- **Candidate Type Logic**: Different approaches for freshers vs. experienced professionals

### 📊 Comprehensive Input System
- **Personal Information**: Contact details, social profiles, portfolio links
- **Professional Experience**: Detailed work history with XYZ achievement formatting
- **Projects**: Technical projects with measurable impact
- **Education**: Academic background with relevant coursework and honors
- **Skills & Certifications**: Technical skills organized by category
- **Job Targeting**: Optimize for specific roles and companies

### 📄 Multiple Output Formats
- **HTML Preview**: Beautiful, formatted resume preview
- **PDF Download**: Professional PDF with proper formatting
- **Markdown Export**: Easy-to-edit markdown format
- **Copy to Clipboard**: Quick text copy for other applications

### 🔧 Advanced Features
- **Dynamic Form Addition**: Add multiple experiences, projects, education entries
- **Real-time Validation**: Input validation with helpful error messages
- **ATS Score Calculation**: Get a compatibility score for your resume
- **Cover Letter Generation**: AI-generated cover letters tailored to your application

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- A Groq API key for AI generation

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-resume-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` to access the application.

## 📖 Usage Guide

### Step 1: Personal Information
Fill in your basic contact information, including:
- Full name and contact details
- LinkedIn, GitHub, and portfolio URLs
- Location information

### Step 2: Candidate Type & Target Role
- Select your experience level (Fresher/Experienced)
- Specify your target position and industry
- Add core competencies

### Step 3: Experience (for Experienced Professionals)
For each work experience:
- Company name, position, and dates
- Use the XYZ format for achievements:
  - **X**: Describe the situation or challenge
  - **Y**: Explain the specific actions you took
  - **Z**: Quantify the results achieved

### Step 4: Projects
Highlight your most impactful projects:
- Project name and description
- Technologies used
- Duration and team size
- XYZ-formatted achievements
- GitHub and demo links

### Step 5: Education
- Degree and institution information
- Graduation date and GPA (optional)
- Honors and relevant coursework
- Academic projects (for freshers)

### Step 6: Skills & Certifications
- Technical skills organized by category
- Professional certifications with dates
- Credential IDs and expiration dates

### Step 7: Job Targeting
- Target job title and company
- Paste the full job description
- View extracted keywords for optimization

### Step 8: Generate & Download
- Click "Generate XYZ Resume"
- Review your ATS score
- Download in PDF, Markdown, or copy to clipboard

## 🎯 XYZ Examples

### For Freshers:
```
X: University capstone project requiring full-stack web application development
Y: Developed e-commerce platform using React, Node.js, and MongoDB with responsive design
Z: Achieved 95% test coverage, 2-second page load time, and won Best Project Award
```

### For Experienced Professionals:
```
X: Legacy system causing 40% performance bottlenecks affecting customer satisfaction
Y: Led cross-functional team to redesign architecture using microservices and containerization
Z: Improved system performance by 60% and reduced customer complaints by 80%
```

## 🏗️ Architecture

### Frontend Components
- **XYZResumeApp**: Main application class managing the entire UI
- **XYZResumeEngine**: Core engine implementing XYZ methodology
- **Tabbed Interface**: Organized form sections with navigation
- **Real-time Preview**: Live XYZ bullet point formatting

### Backend API
- **Node.js/Express**: RESTful API for resume generation
- **Groq Integration**: AI-powered content generation
- **XYZ Methodology**: Structured prompts for consistent output

### Key Files
- `index.html`: Main application interface
- `main.js`: Frontend application logic
- `xyz-resume-engine.js`: XYZ methodology implementation
- `styles.css`: Modern, responsive styling
- `api/generate.js`: Backend API for AI generation

## 🔧 Customization

### Adding New Sections
1. Add new tab to the `tabs` array in `XYZResumeApp`
2. Create corresponding HTML tab content
3. Add data collection method
4. Update the resume generation logic

### Modifying XYZ Rules
Edit the `XYZResumeEngine` class to:
- Add new action verb categories
- Modify quantification patterns
- Update pronoun removal rules
- Customize formatting logic

### Styling Changes
The CSS is organized into logical sections:
- Header and navigation styles
- Form and input styling
- Resume output formatting
- Responsive design rules

## 📊 ATS Optimization

The system automatically optimizes resumes for ATS compatibility:

- **Standard Section Headings**: Uses conventional resume section names
- **Keyword Integration**: Extracts and includes relevant keywords
- **Clean Formatting**: Avoids graphics, tables, and complex layouts
- **Consistent Structure**: Maintains uniform formatting throughout
- **Quantified Results**: Emphasizes measurable achievements

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Guidelines
- Follow the existing code style
- Add comments for complex logic
- Test on multiple browsers
- Ensure mobile responsiveness

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- XYZ methodology based on proven resume writing techniques
- Groq API for AI-powered content generation
- jsPDF for PDF generation capabilities
- Font Awesome for icons

## 📞 Support

For questions, issues, or feature requests:
- Create an issue on GitHub
- Check the documentation
- Review the sample data for examples

---

**Built with ❤️ for job seekers who want to create impactful, ATS-friendly resumes using the proven XYZ methodology.**
