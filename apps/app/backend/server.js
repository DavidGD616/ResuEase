const express = require('express');
const cors = require('cors');
const path = require('path');
const { generateTestPDF, generateResumePDF } = require('./src/controllers/pdfController');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for form data
app.use(express.urlencoded({ extended: true }));

// Basic health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'ResuEase Backend API is running!', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Test route to make sure everything works
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is working correctly!',
    data: {
      server: 'Express',
      node_version: process.version,
      uptime: process.uptime()
    }
  });
});

// PDF generation test endpoint
app.get('/api/generate-test-pdf', generateTestPDF);

// Real resume PDF generation endpoint
app.post('/api/generate-resume-pdf', generateResumePDF);

// Basic error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.originalUrl} not found` 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 API endpoints:`);
  console.log(`   - Health check: http://localhost:${PORT}/`);
  console.log(`   - Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`   - Test PDF: http://localhost:${PORT}/api/generate-test-pdf`);
  console.log(`   - Resume PDF: POST http://localhost:3001/api/generate-resume-pdf`)
});

module.exports = app;