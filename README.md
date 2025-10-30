***ARCHITECTURE OVERVIEW AND TECHNICAL CHOICES***

Implemented seperation of concerns by creating seperate frontend components and backend services. The frontend focuses on user interaction while the backend handles the data processing, business logic, and integrations. The advantages of this are that the best technologies can be used for each components, and enhancements made to each components can be tested and deployed without affecting the whole system.

Frontend:
- I used simple React components (SearchBar, ActivityDashboard) for simplicity.
- I used Apollo Client for GraphQL data fetching
- I used basic CSS for styling - main focus was on functionality.

Backend:
- Express server was used with Apollo Server for GraphQL.
- I split the logic into separate services (weather, activity ranking)
- I used Open-Meteo API for weather data as suggested, it is free and reliable.

GraphQL was optimum over REST or SOAP because:
- Only had to fetch what was needed, no unnecessary overhaul.
- The frontend can request different data without backend changes.
- Better developer experience with the Apollo tools

For readability, consistent commenting has been done throughout the code. This will enable any other software engineers to understand the code and to build on it effectively and without ambiguity.

***HOW AI ASSISTED ME***

I used Claude to help me quickly implement common data type declarations and initializations, give some css methods that meet my UI expectations, and double check my GraphQL schema design. This enabled faster, efficient coding while I focused my effort on the system's logic, structure, and data handling. Also to add some descriptive comments for different components of the app.

I made sure to understand and customize any AI suggestions rather than just copying them directly.

***Trade-offs and Future Improvements***

Things I skipped to focus on core functionality:
1. Error retry - Currently just shows error message on API fails
2. Input validation - Basic checks only, could be more robust
3. Mobile optimization - Works but not fully responsive
4. Testing - Manual testing only, needs unit tests

Given more time I would:
- Add proper exception handling and retries.
- Make the UI properly responsive, and maybe add some log analytics and performance monitoring.
- Cache weather data to avoid repeated API calls - increase app performance.

The scoring system is basic - it works but could be more complex with more weather data points.