# Weather Dashboard

A modern, responsive weather dashboard that fetches real-time weather data from OpenWeatherMap API. Get current weather conditions, forecasts, and search for multiple cities.

## Features

✨ **Real-time Weather Data**
- Current temperature, humidity, wind speed, and more
- 5-day forecast with hourly details
- Weather condition descriptions with emojis
- Sunrise/sunset times

🔍 **City Search**
- Search for cities with autocomplete suggestions
- Support for cities worldwide
- Coordinates display

📱 **Responsive Design**
- Works on desktop, tablet, and mobile devices
- Modern UI with smooth animations
- Intuitive user interface

⚡ **Fast & Reliable**
- Client-side caching
- Error handling
- Real-time updates

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenWeatherMap API key (free tier available)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/davidwkoch-design/weather-dashboard.git
cd weather-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Get a free API key:
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Generate an API key

4. Create a `.env` file:
```bash
cp .env.example .env
```

5. Add your API key to `.env`:
```
OPENWEATHER_API_KEY=your_api_key_here
PORT=3000
NODE_ENV=development
```

## Running the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Get Current Weather
```
GET /api/weather/current?city=London
```

### Get Weather Forecast
```
GET /api/weather/forecast?city=London&days=5
```

### Search Cities
```
GET /api/weather/search?query=Lon
```

### Get Weather for Multiple Cities
```
POST /api/weather/multiple
Body: { "cities": ["London", "Paris", "Tokyo"] }
```

## Project Structure

```
weather-dashboard/
├── public/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # Styling
│   └── script.js           # Frontend JavaScript
├── src/
│   ├── index.js            # Express app setup
│   ├── routes/
│   │   └── weather.js      # Weather API routes
│   └── services/
│       └── weatherService.js # OpenWeatherMap integration
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── package.json            # Project dependencies
└── README.md               # This file
```

## Technologies Used

- **Backend:** Node.js, Express.js
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **API:** OpenWeatherMap REST API
- **HTTP Client:** Axios
- **Environment:** dotenv
- **CORS:** Express CORS middleware

## Features Documentation

### Current Weather Display
Shows comprehensive weather information for the selected city:
- Temperature (current, feels like, min/max)
- Weather conditions with emoji indicators
- Humidity, pressure, wind speed
- Visibility, sunrise/sunset times

### Forecast
Displays 5-day weather forecast with:
- Average daily temperature
- Weather conditions
- Humidity percentage
- Wind speed
- Precipitation probability

### Search Functionality
- Real-time autocomplete suggestions
- Global city database
- Quick city selection

## Error Handling

The application handles various error scenarios:
- Invalid city names (404)
- API rate limits (429)
- Invalid API key (401)
- Network errors
- Validation errors

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Lightweight frontend (no heavy frameworks)
- Fast API responses
- Efficient data formatting
- Debounced search input
- Lazy loading of forecast data

## Future Enhancements

- [ ] Favorites/bookmarks for frequently searched cities
- [ ] Weather alerts and notifications
- [ ] Multiple unit systems (Celsius/Fahrenheit)
- [ ] Historical weather data
- [ ] Weather maps visualization
- [ ] PWA support for offline access
- [ ] Multi-language support
- [ ] Dark/light theme toggle

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues or questions, please open an issue on GitHub.

## Credits

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons and emojis for visual enhancement

---

**Made with ❤️ by davidwkoch-design**
