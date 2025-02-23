import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// ✅ Use MongoDB URI from environment variables with fallback
const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bookSearchDB';

async function connectToDatabase() {
  try {
    // Connect without deprecated options
    await mongoose.connect(connectionString);
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1); // Exit the application on failure
  }
}

const db = mongoose.connection;

// ✅ Event listeners for database connection
db.on('error', (err) => console.error('❌ MongoDB connection error:', err));
db.once('open', () => console.log('✅ MongoDB connection established successfully'));

connectToDatabase();

export default db;
