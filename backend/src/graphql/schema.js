/**
 * GraphQL Schema and Resolvers
 * 
 * This file defines the GraphQL API structure and connects it to business logic.
 * Separation of Concerns: Schema definition is separate from business logic (services).
 */

const weatherService = require('../services/weatherService');
const activityRankingService = require('../services/activityRankingService');

/**
 * Type Definitions (Schema)
 * 
 * Defines the structure of the GraphQL API:
 * - Types: Custom object types that represent data structures
 * - Queries: Read operations available to clients
 */
const typeDefs = `#graphql
  """
  Represents a single day's weather forecast
  """
  type DailyWeather {
    date: String!
    maxTemp: Float!
    minTemp: Float!
    precipitation: Float!
    windSpeed: Float!
    snowfall: Float!
    cloudCover: Float!
  }

  """
  Represents the ranking score for a specific activity on a specific day
  """
  type ActivityDayScore {
    date: String!
    score: Int!
    conditions: String!
  }

  """
  Contains all rankings for a single activity across 7 days
  """
  type ActivityRanking {
    activity: String!
    averageScore: Int!
    dailyScores: [ActivityDayScore!]!
    recommendation: String!
  }

  """
  Complete response containing weather data and activity rankings
  """
  type ActivityForecast {
    location: String!
    latitude: Float!
    longitude: Float!
    dailyWeather: [DailyWeather!]!
    rankings: [ActivityRanking!]!
  }

  """
  Available queries
  """
  type Query {
    """
    Get weather forecast and activity rankings for a location
    
    Args:
      location: City or town name (e.g., "London", "New York")
    
    Returns:
      Complete forecast with weather data and activity rankings
    """
    getActivityForecast(location: String!): ActivityForecast!
  }
`;

/**
 * Resolvers
 * 
 * These functions determine how to fetch the data for each field in the schema.
 * They act as the bridge between GraphQL and your business logic services.
 * 
 * Best Practice: Resolvers are kept thin - they delegate to service layer
 * for actual business logic and data fetching.
 */
const resolvers = {
  Query: {
    /**
     * Resolver for getActivityForecast query
     * 
     * @param {Object} _ - Parent object (not used in root query)
     * @param {Object} args - Query arguments
     * @param {string} args.location - The location to fetch forecast for
     * @returns {Promise<Object>} Complete activity forecast
     */
    getActivityForecast: async (_, { location }) => {
      try {
        // Step 1: Get coordinates for the location
        // Geocoding converts city name to lat/lng coordinates
        const { latitude, longitude, displayName } = 
          await weatherService.geocodeLocation(location);

        // Step 2: Fetch 7-day weather forecast using coordinates
        const weatherData = await weatherService.getWeatherForecast(
          latitude, 
          longitude
        );

        // Step 3: Calculate activity rankings based on weather conditions
        const rankings = activityRankingService.calculateActivityRankings(
          weatherData
        );

        // Step 4: Return combined data matching GraphQL schema
        return {
          location: displayName,
          latitude,
          longitude,
          dailyWeather: weatherData,
          rankings,
        };
      } catch (error) {
        // Error handling: Provide meaningful error messages to client
        console.error('Error fetching activity forecast:', error);
        throw new Error(`Failed to fetch forecast for ${location}: ${error.message}`);
      }
    },
  },
};

// Export schema and resolvers for use in server.js
module.exports = { typeDefs, resolvers };