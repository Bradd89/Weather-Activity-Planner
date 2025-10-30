/**
 * Weather Summary Component
 * 
 * Displays a high-level overview of weather conditions.
 * Separation of Concerns: Pure presentation component that formats
 * and displays weather data in a user-friendly way.
 */

import React from 'react';
import './WeatherSummary.css';

/**
 * Calculate average value from array
 * Helper function for statistical summary
 * 
 * @param {Array<number>} values - Array of numbers
 * @returns {number} Average value rounded to 1 decimal
 */
function calculateAverage(values) {
  const sum = values.reduce((acc, val) => acc + val, 0);
  return (sum / values.length).toFixed(1);
}

/**
 * Format date range
 * Creates a human-readable date range string
 * 
 * @param {string} startDate - ISO date string
 * @param {string} endDate - ISO date string
 * @returns {string} Formatted date range
 */
function formatDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const options = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
}

/**
 * @param {Object} props
 * @param {Array<Object>} props.weatherData - Array of daily weather objects
 */
function WeatherSummary({ weatherData }) {
  // Guard clause: Ensure we have data
  if (!weatherData || weatherData.length === 0) {
    return null;
  }

  /**
   * Calculate Summary Statistics
   * Extract key weather metrics across all 7 days
   */
  
  // Temperature statistics
  const avgMaxTemp = calculateAverage(weatherData.map(d => d.maxTemp));
  const avgMinTemp = calculateAverage(weatherData.map(d => d.minTemp));
  const highestTemp = Math.max(...weatherData.map(d => d.maxTemp));
  const lowestTemp = Math.min(...weatherData.map(d => d.minTemp));

  // Precipitation statistics
  const totalPrecipitation = weatherData
    .reduce((sum, d) => sum + d.precipitation, 0)
    .toFixed(1);
  const rainyDays = weatherData.filter(d => d.precipitation > 1).length;

  // Wind statistics
  const avgWindSpeed = calculateAverage(weatherData.map(d => d.windSpeed));

  // Snow statistics (important for skiing)
  const totalSnowfall = weatherData
    .reduce((sum, d) => sum + d.snowfall, 0)
    .toFixed(1);
  const snowDays = weatherData.filter(d => d.snowfall > 0).length;

  // Cloud cover
  const avgCloudCover = calculateAverage(weatherData.map(d => d.cloudCover));

  // Date range
  const dateRange = formatDateRange(
    weatherData[0].date, 
    weatherData[weatherData.length - 1].date
  );

  return (
    <div className="weather-summary">
      <h3>7-Day Weather Overview</h3>
      <p className="date-range">{dateRange}</p>

      {/* Weather Statistics Grid */}
      <div className="summary-grid">
        
        {/* Temperature Card */}
        <div className="summary-card">
          <div className="card-icon">🌡️</div>
          <div className="card-content">
            <h4>Temperature</h4>
            <p className="primary-stat">{avgMaxTemp}°C avg high</p>
            <p className="secondary-stat">{avgMinTemp}°C avg low</p>
            <p className="tertiary-stat">
              Range: {lowestTemp}°C to {highestTemp}°C
            </p>
          </div>
        </div>

        {/* Precipitation Card */}
        <div className="summary-card">
          <div className="card-icon">💧</div>
          <div className="card-content">
            <h4>Precipitation</h4>
            <p className="primary-stat">{totalPrecipitation} mm total</p>
            <p className="secondary-stat">
              {rainyDays} {rainyDays === 1 ? 'day' : 'days'} with rain
            </p>
            <p className="tertiary-stat">
              {rainyDays === 0 ? 'Dry week!' : rainyDays > 4 ? 'Very wet' : 'Some rain expected'}
            </p>
          </div>
        </div>

        {/* Wind Card */}
        <div className="summary-card">
          <div className="card-icon">💨</div>
          <div className="card-content">
            <h4>Wind</h4>
            <p className="primary-stat">{avgWindSpeed} km/h avg</p>
            <p className="secondary-stat">
              {avgWindSpeed < 15 ? 'Calm' : avgWindSpeed < 30 ? 'Moderate' : 'Strong'} winds
            </p>
            <p className="tertiary-stat">
              {avgWindSpeed < 20 ? 'Great for outdoor activities' : 'May affect some activities'}
            </p>
          </div>
        </div>

        {/* Snow Card (conditional - only show if there's snow) */}
        {totalSnowfall > 0 && (
          <div className="summary-card">
            <div className="card-icon">❄️</div>
            <div className="card-content">
              <h4>Snow</h4>
              <p className="primary-stat">{totalSnowfall} cm total</p>
              <p className="secondary-stat">
                {snowDays} {snowDays === 1 ? 'day' : 'days'} with snow
              </p>
              <p className="tertiary-stat">Perfect for skiing!</p>
            </div>
          </div>
        )}

        {/* Cloud Cover Card */}
        <div className="summary-card">
          <div className="card-icon">☁️</div>
          <div className="card-content">
            <h4>Cloud Cover</h4>
            <p className="primary-stat">{avgCloudCover}% average</p>
            <p className="secondary-stat">
              {avgCloudCover < 30 ? 'Mostly clear' : avgCloudCover < 70 ? 'Partly cloudy' : 'Mostly cloudy'}
            </p>
            <p className="tertiary-stat">
              {avgCloudCover < 40 ? 'Great visibility' : 'Limited sunshine'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default WeatherSummary;