const API_BASE_URL = '/api/weather';
const API_KEY = 'https://api.openweathermap.org';

const DOM = {
  cityInput: document.getElementById('cityInput'),
  searchBtn: document.getElementById('searchBtn'),
  suggestions: document.getElementById('suggestions'),
  currentWeatherSection: document.getElementById('currentWeatherSection'),
  forecastSection: document.getElementById('forecastSection'),
  errorMessage: document.getElementById('errorMessage'),
  loadingSpinner: document.getElementById('loadingSpinner'),
  cityName: document.getElementById('cityName'),
  weatherDescription: document.getElementById('weatherDescription'),
  weatherEmoji: document.getElementById('weatherEmoji'),
  tempLarge: document.getElementById('tempLarge'),
  feelsLike: document.getElementById('feelsLike'),
  tempRange: document.getElementById('tempRange'),
  humidity: document.getElementById('humidity'),
  pressure: document.getElementById('pressure'),
  windSpeed: document.getElementById('windSpeed'),
  visibility: document.getElementById('visibility'),
  sunrise: document.getElementById('sunrise'),
  sunset: document.getElementById('sunset'),
  forecastContainer: document.getElementById('forecastContainer')
};

// Weather emoji mapping
const weatherEmojis = {
  'Clear': '☀️',
  'Clouds': '☁️',
  'Rain': '🌧️',
  'Thunderstorm': '⛈️',
  'Drizzle': '🌦️',
  'Snow': '❄️',
  'Mist': '🌫️',
  'Smoke': '💨',
  'Haze': '🌫️',
  'Dust': '🌪️',
  'Fog': '🌫️',
  'Sand': '🌪️',
  'Ash': '🌋',
  'Squall': '💨',
  'Tornado': '🌪️'
};

// Event Listeners
DOM.searchBtn.addEventListener('click', searchWeather);
DOM.cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchWeather();
});
DOM.cityInput.addEventListener('input', debounce(handleCityInputChange, 300));

// Search weather
async function searchWeather() {
  const city = DOM.cityInput.value.trim();
  if (!city) return;

  showLoading(true);
  hideError();
  hideSuggestions();

  try {
    await fetchCurrentWeather(city);
    await fetchForecast(city);
  } catch (error) {
    showError(error.message);
  } finally {
    showLoading(false);
  }
}

// Handle city input change
async function handleCityInputChange(e) {
  const query = e.target.value.trim();

  if (query.length < 2) {
    hideSuggestions();
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to fetch suggestions');

    const cities = await response.json();
    displaySuggestions(cities);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
  }
}

// Fetch current weather
async function fetchCurrentWeather(city) {
  const response = await fetch(`${API_BASE_URL}/current?city=${encodeURIComponent(city)}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch weather data');
  }

  const data = await response.json();
  displayCurrentWeather(data);
}

// Fetch forecast
async function fetchForecast(city) {
  const response = await fetch(`${API_BASE_URL}/forecast?city=${encodeURIComponent(city)}&days=5`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch forecast data');
  }

  const data = await response.json();
  displayForecast(data);
}

// Display current weather
function displayCurrentWeather(data) {
  DOM.cityName.textContent = `${data.city}, ${data.country}`;
  DOM.weatherDescription.textContent = data.weather.description;
  DOM.tempLarge.textContent = data.temperature;
  DOM.feelsLike.textContent = `${data.feelsLike}°C`;
  DOM.tempRange.textContent = `${data.tempMin}°C / ${data.tempMax}°C`;
  DOM.humidity.textContent = `${data.humidity}%`;
  DOM.pressure.textContent = `${data.pressure} hPa`;
  DOM.windSpeed.textContent = `${data.wind.speed} m/s`;
  DOM.visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
  DOM.sunrise.textContent = formatTime(new Date(data.sunrise));
  DOM.sunset.textContent = formatTime(new Date(data.sunset));

  // Set weather emoji
  const emoji = weatherEmojis[data.weather.main] || '🌤️';
  DOM.weatherEmoji.textContent = emoji;

  DOM.currentWeatherSection.classList.remove('hidden');
}

// Display forecast
function displayForecast(data) {
  DOM.forecastContainer.innerHTML = '';

  Object.entries(data.forecast).forEach(([date, forecasts]) => {
    // Get first forecast of the day (usually morning)
    const firstForecast = forecasts[0];
    
    // Calculate average temperature
    const avgTemp = Math.round(
      forecasts.reduce((sum, f) => sum + parseFloat(f.temperature), 0) / forecasts.length
    );

    const card = document.createElement('div');
    card.className = 'forecast-card';

    const emoji = weatherEmojis[firstForecast.weather] || '🌤️';
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    card.innerHTML = `
      <div class="forecast-date">${formattedDate}</div>
      <div style="font-size: 2em; margin-bottom: 10px;">${emoji}</div>
      <div class="forecast-temp">${avgTemp}°C</div>
      <div class="forecast-weather">${firstForecast.weather}</div>
      <div class="forecast-details">
        <div class="forecast-detail">
          <span class="forecast-detail-label">💧</span>
          <span class="forecast-detail-value">${firstForecast.humidity}%</span>
        </div>
        <div class="forecast-detail">
          <span class="forecast-detail-label">💨</span>
          <span class="forecast-detail-value">${firstForecast.windSpeed}m/s</span>
        </div>
        <div class="forecast-detail">
          <span class="forecast-detail-label">🌧️</span>
          <span class="forecast-detail-value">${firstForecast.rainProbability}%</span>
        </div>
      </div>
    `;

    DOM.forecastContainer.appendChild(card);
  });

  DOM.forecastSection.classList.remove('hidden');
}

// Display suggestions
function displaySuggestions(cities) {
  if (cities.length === 0) {
    hideSuggestions();
    return;
  }

  DOM.suggestions.innerHTML = '';
  cities.forEach(city => {
    const item = document.createElement('div');
    item.className = 'suggestion-item';
    item.textContent = `${city.name}, ${city.country} ${city.state ? `(${city.state})` : ''}`;
    item.addEventListener('click', () => {
      DOM.cityInput.value = city.name;
      searchWeather();
    });
    DOM.suggestions.appendChild(item);
  });

  DOM.suggestions.classList.add('active');
}

// Show/hide suggestions
function hideSuggestions() {
  DOM.suggestions.classList.remove('active');
}

// Show/hide error
function showError(message) {
  DOM.errorMessage.textContent = message;
  DOM.errorMessage.classList.remove('hidden');
}

function hideError() {
  DOM.errorMessage.classList.add('hidden');
}

// Show/hide loading
function showLoading(show) {
  DOM.loadingSpinner.classList.toggle('hidden', !show);
}

// Format time
function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// Debounce function
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  console.log('Weather Dashboard loaded');
  // Load default city
  DOM.cityInput.value = 'London';
  searchWeather();
});

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
  if (e.target !== DOM.cityInput && e.target !== DOM.suggestions) {
    hideSuggestions();
  }
});
