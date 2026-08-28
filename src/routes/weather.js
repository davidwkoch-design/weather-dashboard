const express = require('express');
const router = express.Router();
const weatherService = require('../services/weatherService');

// Get current weather for a city
router.get('/current', async (req, res, next) => {
  try {
    const { city } = req.query;
    
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    const weatherData = await weatherService.getCurrentWeather(city);
    res.json(weatherData);
  } catch (error) {
    next(error);
  }
});

// Get weather forecast for a city
router.get('/forecast', async (req, res, next) => {
  try {
    const { city, days = 5 } = req.query;
    
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    const forecastData = await weatherService.getForecast(city, days);
    res.json(forecastData);
  } catch (error) {
    next(error);
  }
});

// Search for cities
router.get('/search', async (req, res, next) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters' });
    }

    const results = await weatherService.searchCities(query);
    res.json(results);
  } catch (error) {
    next(error);
  }
});

// Get weather for multiple cities
router.post('/multiple', async (req, res, next) => {
  try {
    const { cities } = req.body;
    
    if (!Array.isArray(cities) || cities.length === 0) {
      return res.status(400).json({ error: 'Cities array is required' });
    }

    const weatherData = await weatherService.getMultipleCitiesWeather(cities);
    res.json(weatherData);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
