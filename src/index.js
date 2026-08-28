const express = require('express');
const cors = require('cors');
require('dotenv').config();
const weatherRoutes = require('./routes/weather');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/weather', weatherRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Weather Dashboard API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🌤️  Weather Dashboard running on http://localhost:${PORT}`);
  console.log('API endpoints:');
  console.log(`  GET /api/weather/current?city=London`);
  console.log(`  GET /api/weather/forecast?city=London`);
  console.log(`  GET /api/weather/search?query=London`);
});
