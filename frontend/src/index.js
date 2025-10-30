/**
 * Application Entry Point
 * 
 * This file initializes the React application and sets up Apollo Client
 * for GraphQL communication with the backend.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

/**
 * Apollo Client Configuration
 * 
 * ApolloClient manages:
 * - GraphQL queries and mutations
 * - Caching of query results
 * - Network requests to the GraphQL server
 * 
 * Configuration options:
 * - uri: GraphQL endpoint URL (must match backend server)
 * - cache: In-memory cache for query results (improves performance)
 */
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // Backend GraphQL endpoint
  cache: new InMemoryCache({
    // Cache configuration
    // typePolicies can be added here for advanced caching strategies
  }),
});

/**
 * Render the application
 * 
 * Wraps the App component with ApolloProvider to make Apollo Client
 * available throughout the component tree via React Context.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);