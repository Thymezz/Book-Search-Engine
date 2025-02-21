import express, { Application } from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import db from './config/connection.js';
import { ApolloServer} from 'apollo-server-express';
import { authMiddleware } from './services/auth.js';
import typeDefs from './schemas/typeDef.js';
import resolvers from './schemas/resolvers.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;


// Fix for import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Enable CORS for client connection
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });


  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Test route
  app.get('/test', (_, res) => {
    res.json({ message: 'Server is running correctly' });
  });

  // Serve static files
  app.use(express.static(path.join(__dirname, '../../client/dist')));

  // Catch-all route
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Server running on http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}

startServer();
