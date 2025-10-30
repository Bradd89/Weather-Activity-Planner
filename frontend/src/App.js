import React, { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import ActivityDashboard from './components/ActivityDashboard';

function App() {
  const [location, setLocation] = useState('');

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather Activity Planner</h1>
        <p>Find the best activities based on weather forecasts</p>
      </header>

      <main className="App-main">
        <SearchBar onSearch={setLocation} />
        {location && <ActivityDashboard location={location} />}
      </main>

      <footer className="App-footer">
        <p>Data from Open-Meteo API</p>
      </footer>
    </div>
  );
}

export default App;