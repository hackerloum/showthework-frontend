const mongoose = require('mongoose');
const { google } = require('googleapis');

// Validate MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

// MongoDB connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  keepAlive: true,
  keepAliveInitialDelay: 300000,
  retryWrites: true,
  w: 'majority',
};

// MongoDB Work Schema
const workSchema = new mongoose.Schema({
  title: String,
  description: String,
  files: [{
    fileId: String,
    name: String,
    mimeType: String,
    webViewLink: String,
    thumbnailLink: String
  }],
  accessCode: {
    type: String,
    required: true,
    unique: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

workSchema.index({ accessCode: 1 }, { unique: true });

let Work;
try {
  Work = mongoose.model('Work');
} catch {
  Work = mongoose.model('Work', workSchema);
}

// MongoDB connection function with retry logic
async function connectToDatabase(retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (mongoose.connections[0].readyState === 1) {
        console.log('Using existing MongoDB connection');
        return;
      }

      if (mongoose.connections[0].readyState !== 0) {
        await mongoose.connection.close();
      }

      console.log(`Creating new MongoDB connection (attempt ${attempt}/${retries})...`);
      await mongoose.connect(MONGODB_URI, mongoOptions);
      console.log('Successfully connected to MongoDB');
      return;
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt} failed:`, error);
      if (attempt === retries) {
        throw new Error(`Failed to connect to MongoDB after ${retries} attempts: ${error.message}`);
      }
      await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, attempt), 5000)));
    }
  }
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  let dbConnection = false;
  try {
    // Get access code from query parameters
    const params = new URLSearchParams(event.queryStringParameters);
    const accessCode = params.get('code');

    if (!accessCode) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Access code is required' })
      };
    }

    // Connect to MongoDB
    await connectToDatabase();
    dbConnection = true;

    // Find work by access code
    const work = await Work.findOne({ accessCode });

    if (!work) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Work not found' })
      };
    }

    // Increment view count
    work.views += 1;
    await work.save();

    // Return work details
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Work found',
        work: {
          title: work.title,
          description: work.description,
          files: work.files,
          views: work.views,
          createdAt: work.createdAt
        }
      })
    };
  } catch (error) {
    console.error('Error retrieving work:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Error retrieving work',
        details: error.message
      })
    };
  } finally {
    if (dbConnection && mongoose.connection.readyState !== 0) {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
      } catch (error) {
        console.error('Error closing MongoDB connection:', error);
      }
    }
  }
}; 
