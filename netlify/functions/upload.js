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

  // Connect to MongoDB
  try {
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Database connection failed' }),
    };
  }

  try {
    // Parse the multipart form data
    const form = formidable({
      maxFiles: 10,
      maxFileSize: 10 * 1024 * 1024, // 10MB
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

    // Upload files to Cloudinary
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

    // Generate a unique access code
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

    // Create new work in database
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
  }
}; 
