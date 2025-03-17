const formidable = require('formidable');
const { v2: cloudinary } = require('cloudinary');
const mongoose = require('mongoose');
const crypto = require('crypto');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Validate MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

// Ensure the URI includes a database name
const mongoUri = MONGODB_URI.includes('/?') 
  ? MONGODB_URI.replace('/?', '/showthework?')
  : MONGODB_URI + '/showthework';

// MongoDB connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // Increased timeout for replica sets
  socketTimeoutMS: 45000,
  keepAlive: true,
  keepAliveInitialDelay: 300000,
  retryWrites: true,
  w: 'majority', // Write concern for replica sets
  maxPoolSize: 10,
  minPoolSize: 5,
};

// MongoDB Work Schema
const workSchema = new mongoose.Schema({
  title: String,
  description: String,
  files: [{
    url: String,
    publicId: String,
    type: String,
    name: String,
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

// Add indexes for better performance
workSchema.index({ accessCode: 1 }, { unique: true });
workSchema.index({ createdAt: -1 });

let Work;
try {
  Work = mongoose.model('Work');
} catch {
  Work = mongoose.model('Work', workSchema);
}

// Generate a random access code
function generateAccessCode() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

// MongoDB connection function with retry logic
async function connectToDatabase(retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Check if we already have a connection
      if (mongoose.connections[0].readyState === 1) {
        console.log('Using existing MongoDB connection');
        return;
      }

      // Close any existing connection that might be in a bad state
      if (mongoose.connections[0].readyState !== 0) {
        await mongoose.connection.close();
      }

      // Create new connection
      console.log(`Creating new MongoDB connection (attempt ${attempt}/${retries})...`);
      await mongoose.connect(mongoUri, mongoOptions);
      console.log('Successfully connected to MongoDB');
      return;
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt} failed:`, error);
      if (attempt === retries) {
        throw new Error(`Failed to connect to MongoDB after ${retries} attempts: ${error.message}`);
      }
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, attempt), 5000)));
    }
  }
}

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  let dbConnection = false;
  try {
    // Connect to MongoDB with retries
    await connectToDatabase();
    dbConnection = true;

    // Rest of your existing code...
    const form = formidable({
      maxFiles: 10,
      maxFileSize: 10 * 1024 * 1024,
      keepExtensions: true,
      multiples: true,
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(event, (err, fields, files) => {
        if (err) {
          console.error('Form parsing error:', err);
          reject(err);
        }
        resolve([fields, files]);
      });
    });

    if (!files || Object.keys(files).length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No files uploaded' }),
      };
    }

    const uploadPromises = Object.values(files).map(async (file) => {
      try {
        const result = await cloudinary.uploader.upload(file.filepath, {
          resource_type: 'auto',
          folder: 'show-the-work',
        });

        return {
          url: result.secure_url,
          publicId: result.public_id,
          type: file.mimetype,
          name: file.originalFilename,
        };
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error(`Failed to upload file ${file.originalFilename}`);
      }
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    let accessCode;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      accessCode = generateAccessCode();
      const existingWork = await Work.findOne({ accessCode });
      if (!existingWork) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new Error('Failed to generate unique access code');
    }

    const work = new Work({
      title: fields.title || 'Untitled',
      description: fields.description || '',
      files: uploadedFiles,
      accessCode,
    });

    await work.save();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Work created successfully',
        work: {
          title: work.title,
          description: work.description,
          files: work.files,
          accessCode: work.accessCode,
        },
      }),
    };
  } catch (error) {
    console.error('Error handling upload:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Error uploading files',
        details: error.message
      }),
    };
  } finally {
    // Only close the connection if we successfully opened one
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
