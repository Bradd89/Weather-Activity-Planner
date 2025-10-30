/**
 * Main Server Entry Point
 * 
 * This file sets up the Express server and integrates Apollo GraphQL.
 * Separation of Concerns: This file only handles server initialization,
 * delegating GraphQL logic to schema.js and business logic to services.
 */

const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { json } = require('body-parser');
const cors = require('cors');
const { typeDefs, resolvers } = require('./graphql/schema');

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 4000;

/**
 * Start the server
 * Uses async/await pattern for proper initialization order
 */
async function startServer() {
  // Create Apollo Server instance with GraphQL schema
  // typeDefs: GraphQL type definitions (schema)
  // resolvers: Functions that populate the data for each field
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Start Apollo Server before applying middleware
  await server.start();

  // Middleware setup
  app.use(cors()); // Enable CORS for frontend communication
  app.use(express.json()); // Parse JSON request bodies

  // Apply GraphQL middleware to Express
  // This makes GraphQL available at /graphql endpoint
  app.use('/graphql', expressMiddleware(server));

  // Health check endpoint (useful for deployment monitoring)
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Start listening for requests
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    console.log(`📊 Health check at http://localhost:${PORT}/health`);
  });
}

// Execute server startup with error handling
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});