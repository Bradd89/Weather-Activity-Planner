/**
 * Weather Service
 * 
 * Handles all interactions with the Open-Meteo API.
 * Separation of Concerns: All external API calls are isolated in this service.
 * This makes it easy to swap out the weather provider or mock for testing.
 * 
 * Open-Meteo API Documentation: https://open-meteo.com/en/docs
 */

const axios = require('axios');

/**
 * Open-Meteo API Base URLs
 * - Geocoding API: Converts location names to coordinates
 * - Forecast API: Provides weather forecast data
 */
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API = 'https://api.open-meteo.com/v1/forecast';

/**
 * Convert location name to geographic coordinates
 * 
 * This function uses the Open-Meteo Geocoding API to find the latitude
 * and longitude of a city or town. This is necessary because the weather
 * API requires coordinates, not place names.
 * 
 * @param {string} location - City or town name
 * @returns {Promise<Object>} Object with latitude, longitude, and display name
 * @throws {Error} If location is not found
 */
async function geocodeLocation(location) {
  try {
    // Make request to geocoding API
    // Parameters:
    // - name: The location to search for
    // - count: Maximum number of results to return
    // - language: Response language
    // - format: Response format (json)
    const response = await axios.get(GEOCODING_API, {
      params: {
        name: location,
        count: 1,
        language: 'en',
        format: 'json',
      },
    });

    // Check if any results were found
    if (!response.data.results || response.data.results.length === 0) {
      throw new Error(`Location "${location}" not found`);
    }

    // Extract first result (most relevant match)
    const result = response.data.results[0];

    return {
      latitude: result.latitude,
      longitude: result.longitude,
      displayName: `${result.name}, ${result.country}`,
    };
  } catch (error) {
    // Re-throw with more context if it's our custom error
    if (error.message.includes('not found')) {
      throw error;
    }
    // Otherwise, wrap the API error
    throw new Error(`Geocoding failed: ${error.message}`);
  }
}

/**
 * Fetch 7-day weather forecast
 * 
 * This function retrieves detailed weather data from Open-Meteo.
 * It requests specific variables needed for activity ranking.
 * 
 * Open-Meteo API Parameters Explained:
 * - latitude/longitude: Location coordinates
 * - daily: Comma-separated list of weather variables to retrieve
 * - timezone: auto (uses location's timezone for date formatting)
 * - forecast_days: Number of days to forecast (7 days)
 * 
 * @param {number} latitude - Geographic latitude
 * @param {number} longitude - Geographic longitude
 * @returns {Promise<Array>} Array of daily weather objects
 */
async function getWeatherForecast(latitude, longitude) {
  try {
    // Make request to forecast API
    // We request multiple weather variables needed for activity scoring:
    // - temperature_2m_max/min: Daily high and low temperatures (°C)
    // - precipitation_sum: Total daily precipitation (mm)
    // - windspeed_10m_max: Maximum wind speed at 10m height (km/h)
    // - snowfall_sum: Total daily snowfall (cm)
    // - cloudcover_mean: Average cloud cover percentage (0-100%)
    const response = await axios.get(FORECAST_API, {
      params: {
        latitude,
        longitude,
        daily: [
          'temperature_2m_max',
          'temperature_2m_min',
          'precipitation_sum',
          'windspeed_10m_max',
          'snowfall_sum',
          'cloudcover_mean',
        ].join(','),
        timezone: 'auto',
        forecast_days: 7,
      },
    });

    // Extract daily data from response
    const daily = response.data.daily;

    // Transform API response into structured array
    // Map over dates and create an object for each day
    return daily.time.map((date, index) => ({
      date,
      maxTemp: daily.temperature_2m_max[index],
      minTemp: daily.temperature_2m_min[index],
      precipitation: daily.precipitation_sum[index] || 0,
      windSpeed: daily.windspeed_10m_max[index],
      snowfall: daily.snowfall_sum[index] || 0,
      cloudCover: daily.cloudcover_mean[index],
    }));
  } catch (error) {
    throw new Error(`Weather forecast failed: ${error.message}`);
  }
}

// Export functions for use in GraphQL resolvers
module.exports = {
  geocodeLocation,
  getWeatherForecast,
};