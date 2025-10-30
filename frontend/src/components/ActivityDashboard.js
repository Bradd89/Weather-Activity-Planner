import React from 'react';
import { useQuery, gql } from '@apollo/client';
import './ActivityDashboard.css';
import ActivityCard from './ActivityCard';
import WeatherSummary from './WeatherSummary';

// GraphQL query to fetch weather data and rankings
const GET_ACTIVITY_FORECAST = gql`
  query GetActivityForecast($location: String!) {
    getActivityForecast(location: $location) {
      location
      latitude
      longitude
      dailyWeather {
        date
        maxTemp
        minTemp
        precipitation
        windSpeed
        snowfall
        cloudCover
      }
      rankings {
        activity
        averageScore
        dailyScores {
          date
          score
          conditions
        }
        recommendation
      }
    }
  }
`;

function ActivityDashboard({ location }) {
  const { loading, error, data } = useQuery(GET_ACTIVITY_FORECAST, {
    variables: { location }
  });

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error">
          <h2>Error</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  const forecast = data.getActivityForecast;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>{forecast.location}</h2>
        <p className="coordinates">
          {forecast.latitude.toFixed(2)}°, {forecast.longitude.toFixed(2)}°
        </p>
      </div>

      <WeatherSummary weatherData={forecast.dailyWeather} />

      <div className="rankings-section">
        <h3>Activities</h3>
        <div className="activity-grid">
          {forecast.rankings
            .sort((a, b) => b.averageScore - a.averageScore)
            .map(ranking => (
              <ActivityCard 
                key={ranking.activity} 
                ranking={ranking} 
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default ActivityDashboard;