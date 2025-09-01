import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import generateResume from './api/generate.js';
import generateCoverLetter from './api/generateCoverLetter.js';
import generateCoverLetterNew from './api/generateCoverLetter.js';
import generateResumeFunc from './api/generateResume.js';
import generateDocument from './api/generateDocument.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// API routes
app.post('/api/generate', generateResume);
app.post('/api/generate-cover-letter', generateCoverLetter);
app.post('/api/generate-resume', generateResumeFunc);
app.post('/api/generate-cover-letter-new', generateCoverLetterNew);
app.post('/api/generate-resume-new', generateResumeFunc);
app.post('/api/generate-document', generateDocument);

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// Serve resume.html at /resume
app.get('/resume', (req, res) => {
  res.sendFile(join(__dirname, 'resume.html'));
});

// Serve cover-letter.html at /cover-letter
app.get('/cover-letter', (req, res) => {
  res.sendFile(join(__dirname, 'cover-letter.html'));
});

// Fallback route for React router
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    console.log(`404 - Not Found: ${req.method} ${req.path}`);
    return res.status(404).send('Not Found');
  }
  res.sendFile(join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);

  if (!process.env.GROQ_API_KEY) {
    console.error("❌ GROQ_API_KEY is missing in .env file");
  } else {
    console.log("✅ GROQ_API_KEY loaded successfully");
  }
});
