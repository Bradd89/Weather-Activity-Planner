/**
 * Activity Card Component
 * 
 * Presentational component that displays ranking for a single activity.
 * Separation of Concerns: Pure presentation - receives data via props,
 * no data fetching or business logic.
 * 
 * Features:
 * - Visual score representation
 * - Daily score chart
 * - Recommendation text
 */

import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import './ActivityCard.css';

/**
 * Get emoji icon for activity
 * Visual representation to make UI more engaging
 * 
 * @param {string} activity - Activity name
 * @returns {string} Emoji character
 */
function getActivityIcon(activity) {
  const icons = {
    'Skiing': '⛷️',
    'Surfing': '🏄',
    'Outdoor Sightseeing': '🏞️',
    'Indoor Sightseeing': '🏛️',
  };
  return icons[activity] || '🎯';
}

/**
 * Get color based on score
 * Visual feedback for score quality
 * 
 * @param {number} score - Score from 0-100
 * @returns {string} CSS color value
 */
function getScoreColor(score) {
  if (score >= 80) return '#10b981'; // Green - Excellent
  if (score >= 60) return '#3b82f6'; // Blue - Good
  if (score >= 40) return '#f59e0b'; // Orange - Fair
  if (score >= 20) return '#ef4444'; // Red - Poor
  return '#6b7280'; // Gray - Very Poor
}

/**
 * Format date for display
 * Converts ISO date string to readable format
 * 
 * @param {string} dateString - ISO date string (YYYY-MM-DD)
 * @returns {string} Formatted date (e.g., "Mon 10/20")
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
  const monthDay = date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
  return `${dayOfWeek} ${monthDay}`;
}

/**
 * @param {Object} props
 * @param {Object} props.ranking - Activity ranking data
 */
function ActivityCard({ ranking }) {
  /**
   * Prepare chart data
   * Transform daily scores into format required by Recharts library
   */
  const chartData = ranking.dailyScores.map((day) => ({
    date: formatDate(day.date),
    score: day.score,
    fullDate: day.date, // Keep for tooltip
  }));

  // Determine card styling based on average score
  const scoreColor = getScoreColor(ranking.averageScore);
  const activityIcon = getActivityIcon(ranking.activity);

  return (
    <div className="activity-card">
      {/* Card Header */}
      <div className="card-header">
        <div className="activity-title">
          <span className="activity-icon">{activityIcon}</span>
          <h4>{ranking.activity}</h4>
        </div>

        {/* Average Score Badge */}
        <div 
          className="score-badge" 
          style={{ backgroundColor: scoreColor }}
        >
          {ranking.averageScore}
        </div>
      </div>

      {/* Recommendation Text */}
      <p className="recommendation">{ranking.recommendation}</p>

      {/* Daily Scores Chart */}
      <div className="chart-container">
        <h5>7-Day Trend</h5>
        
        {/* 
          ResponsiveContainer: Makes chart responsive to parent container size
          LineChart: Main chart component
          CartesianGrid: Background grid lines
          XAxis/YAxis: Chart axes
          Tooltip: Hover tooltip
          Line: The actual data line
        */}
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            {/* Grid with subtle styling */}
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            
            {/* X-axis showing dates */}
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            
            {/* Y-axis showing scores (0-100) */}
            <YAxis 
              domain={[0, 100]} 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            
            {/* Tooltip on hover */}
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
              formatter={(value) => [`${value}/100`, 'Score']}
            />
            
            {/* Data line with dynamic color */}
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke={scoreColor}
              strokeWidth={2}
              dot={{ fill: scoreColor, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Breakdown List */}
      <div className="daily-breakdown">
        <h5>Daily Conditions</h5>
        <div className="daily-list">
          {ranking.dailyScores.map((day) => (
            <div key={day.date} className="daily-item">
              <span className="daily-date">{formatDate(day.date)}</span>
              <div className="daily-score-bar">
                {/* Visual bar representation of score */}
                <div 
                  className="score-fill" 
                  style={{ 
                    width: `${day.score}%`,
                    backgroundColor: getScoreColor(day.score)
                  }}
                />
              </div>
              <span 
                className="daily-conditions"
                style={{ color: getScoreColor(day.score) }}
              >
                {day.conditions}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ActivityCard;