/**
 * Activity Ranking Service
 * 
 * Contains the business logic for scoring and ranking activities based on weather.
 * Separation of Concerns: All ranking algorithms are isolated here, making it
 * easy to modify scoring rules without touching API or presentation layers.
 * 
 * Scoring System: Each activity gets a score from 0-100 based on weather conditions
 * - 80-100: Excellent conditions
 * - 60-79: Good conditions
 * - 40-59: Fair conditions
 * - 20-39: Poor conditions
 * - 0-19: Very poor conditions
 */

// Calculate skiing conditions score based on weather
function scoreSkiing(weather) {
  let score = 0;

  // Check snow conditions
  if (weather.snowfall > 0) {
    score += Math.min(50, weather.snowfall * 5);
  }

  // Temperature score
  if (weather.maxTemp < 2) {
    score += 30;
  } else if (weather.maxTemp < 7) {
    score += 15;
  }

  // Wind conditions
  if (weather.windSpeed > 40) {
    score -= 15;  // Too windy
  }

  // Rain penalty
  if (weather.precipitation > 5) {
    score -= 10;
  }

  return Math.max(0, Math.min(100, score));
}

// Basic surfing score calculation
function scoreSurfing(weather) {
  let score = 50;  // Start with average conditions

  // Wind score - we want some wind but not too much
  if (weather.windSpeed > 10 && weather.windSpeed < 35) {
    score += 25;
  } else if (weather.windSpeed > 40) {
    score -= 20;
  }

  // Temperature bonus
  if (weather.maxTemp > 18) {
    score += 20;
  }

  // Rain impact
  if (weather.precipitation > 8) {
    score -= 15;
  }

  return Math.max(0, Math.min(100, score));
}

// Score outdoor sightseeing based on weather conditions
function scoreOutdoorSightseeing(weather) {
  let score = 60;

  // Cloud cover affects visibility
  if (weather.cloudCover < 40) {
    score += 20;
  } else if (weather.cloudCover > 80) {
    score -= 10;
  }

  // Temperature comfort
  if (weather.maxTemp >= 15 && weather.maxTemp <= 28) {
    score += 20;
  } else if (weather.maxTemp < 5 || weather.maxTemp > 35) {
    score -= 20;
  }

  // Rain check
  if (weather.precipitation > 0) {
    score -= weather.precipitation * 2;
  }

  return Math.max(0, Math.min(100, score));
}

// Indoor activities score - better when weather is bad
function scoreIndoorSightseeing(weather) {
  let score = 70;  // Always a decent option

  // More appealing in bad weather
  if (weather.precipitation > 5) {
    score += 15;
  }

  // Better for extreme temperatures
  if (weather.maxTemp < 5 || weather.maxTemp > 30) {
    score += 15;
  }

  // Less appealing in nice weather
  if (weather.precipitation === 0 && weather.cloudCover < 50 && 
      weather.maxTemp > 15 && weather.maxTemp < 25) {
    score -= 20;
  }

  return Math.max(0, Math.min(100, score));
}

// Convert score to text description
function getConditionDescription(score) {
  if (score >= 75) return 'Great';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'OK';
  return 'Poor';
}

// Get recommendation text based on average score
function getRecommendation(activity, avgScore) {
  if (avgScore >= 70) {
    return `Perfect week for ${activity}!`;
  } else if (avgScore >= 50) {
    return `Decent conditions for ${activity} this week.`;
  } else {
    return `Not the best week for ${activity}.`;
  }
}

// Calculate activity rankings for all activities
function calculateActivityRankings(weatherData) {
  const activities = [
    { name: 'Skiing', scoreFn: scoreSkiing },
    { name: 'Surfing', scoreFn: scoreSurfing },
    { name: 'Outdoor Sightseeing', scoreFn: scoreOutdoorSightseeing },
    { name: 'Indoor Sightseeing', scoreFn: scoreIndoorSightseeing },
  ];

  return activities.map(activity => {
    // Get daily scores
    const dailyScores = weatherData.map(day => ({
      date: day.date,
      score: activity.scoreFn(day),
      conditions: getConditionDescription(activity.scoreFn(day))
    }));

    // Calculate average
    const totalScore = dailyScores.reduce((sum, day) => sum + day.score, 0);
    const averageScore = Math.round(totalScore / dailyScores.length);

    return {
      activity: activity.name,
      averageScore,
      dailyScores,
      recommendation: getRecommendation(activity.name, averageScore)
    };
  });
}

// Export main function
module.exports = {
  calculateActivityRankings,
};