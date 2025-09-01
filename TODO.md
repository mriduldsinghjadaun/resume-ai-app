# TODO: Fix 404 Errors in Node.js + Express App

- [x] Update express.static() to serve from 'dist' folder
- [x] Add POST /api/generate-resume route calling generateResume from api/generateResume.js
- [x] Adjust import for generateCoverLetter to use api/generateCoverLetter.js
- [x] Add app.get('*') to serve index.html from 'dist' for React router
- [x] Add middleware to log 404 errors with request method and path
- [x] Test the server after changes
