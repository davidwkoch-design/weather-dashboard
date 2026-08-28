const axios = require('axios');

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org';

if (!API_KEY) {
  console.warn('⚠️  Warning: OPENWEATHER_API_KEY is not set in environment variables');
}

class WeatherService {
  /**
   * Get current weather for a city
   */
  async getCurrentWeather(city) {
    try {
      const response = await axios.get(`${BASE_URL}/data/2.5/weather`, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric'
        }
      });

      return this.formatWeatherData(response.data);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get weather forecast for a city
   */
  async getForecast(city, days = 5) {
    try {
      const response = await axios.get(`${BASE_URL}/data/2.5/forecast`, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric',
          cnt: days * 8 // 8 forecasts per day (3-hour intervals)
        }
      });

      return this.formatForecastData(response.data);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Search for cities
   */
  async searchCities(query) {
    try {
      const response = await axios.get(`${BASE_URL}/geo/1.0/direct`, {
        params: {
          q: query,
          limit: 10,
          appid: API_KEY
        }
      });

      return response.data.map(city => ({
        name: city.name,
        country: city.country,
        state: city.state || '',
        lat: city.lat,
        lon: city.lon
      }));
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get weather for multiple cities
   */
  async getMultipleCitiesWeather(cities) {
    try {
      const promises = cities.map(city => this.getCurrentWeather(city));
      const results = await Promise.allSettled(promises);

      return results.map((result, index) => ({
        city: cities[index],
        status: result.status,
        data: result.status === 'fulfilled' ? result.value : { error: result.reason.message }
      }));
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Format weather data for response
   */
  formatWeatherData(data) {
    return {
      city: data.name,
      country: data.sys.country,
      coordinates: {
        latitude: data.coord.lat,
        longitude: data.coord.lon
      },
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      tempMin: Math.round(data.main.temp_min),
      tempMax: Math.round(data.main.temp_max),
      pressure: data.main.pressure,
      humidity: data.main.humidity,
      weather: {
        main: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon
      },
      wind: {
        speed: data.wind.speed,
        degree: data.wind.deg,
        gust: data.wind.gust || null
      },
      visibility: data.visibility,
      cloudiness: data.clouds.all,
      sunrise: new Date(data.sys.sunrise * 1000),
      sunset: new Date(data.sys.sunset * 1000),
      timezone: data.timezone,
      timestamp: new Date(data.dt * 1000)
    };
  }

  /**
   * Format forecast data for response
   */
  formatForecastData(data) {
    const groupedByDay = {};

    data.list.forEach(forecast => {
      const date = new Date(forecast.dt * 1000).toISOString().split('T')[0];
      
      if (!groupedByDay[date]) {
        groupedByDay[date] = [];
      }

      groupedByDay[date].push({
        time: new Date(forecast.dt * 1000),
        temperature: Math.round(forecast.main.temp),
        feelsLike: Math.round(forecast.main.feels_like),
        weather: forecast.weather[0].main,
        description: forecast.weather[0].description,
        humidity: forecast.main.humidity,
        windSpeed: forecast.wind.speed,
        cloudiness: forecast.clouds.all,
        rainProbability: (forecast.pop * 100).toFixed(0)
      });
    });

    return {
      city: data.city.name,
      country: data.city.country,
      forecast: groupedByDay
    };
  }

  /**
   * Handle API errors
   */
  handleError(error) {
    if (error.response) {
      const status = error.response.status;
      let message = 'An error occurred';

      if (status === 404) {
        message = 'City not found';
      } else if (status === 401) {
        message = 'Invalid API key';
      } else if (status === 429) {
        message = 'Too many requests. Please try again later.';
      }

      const err = new Error(message);
      err.status = status;
      throw err;
    }

    throw error;
  }
}

module.exports = new WeatherService();
