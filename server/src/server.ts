import express from 'express';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { ApolloServer } from 'apollo-server-express';
import db from './config/connection.js';
import { authMiddleware } from './services/auth.js';
import typeDefs from './schemas/typeDef.js';
import resolvers from './schemas/resolvers.js';
import dotenv from 'dotenv';
import cors from 'cors';
import type { Application } from 'express';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all origins (including Render)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  })
);

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  cache: 'bounded',
  persistedQueries: false,
});

// Start Apollo Server and apply middleware
async function startServer() {
  await server.start();
  server.applyMiddleware({ app: app as Application, path: '/graphql' });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Correct static file path for deployed app
  const clientBuildPath = path.resolve(__dirname, '../client');
  app.use(
    express.static(clientBuildPath, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript');
        }
      },
    })
  );

  // Catch-all route for React SPA
  app.get('*', (_, res) => {
    res.sendFile(path.resolve(clientBuildPath, 'index.html'));
  });

  // Health check route
  app.get('/health', (_, res) => {
    res.send('Server is running!');
  });

  // Listen for requests
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}

startServer();
