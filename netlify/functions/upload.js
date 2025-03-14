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
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Connect to MongoDB
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  try {
    const form = formidable({
      maxFiles: 10,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(event, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Upload files to Cloudinary
    const uploadPromises = Object.values(files).map(async (file) => {
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
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    // Generate a unique access code
    let accessCode;
    let isUnique = false;
    while (!isUnique) {
      accessCode = generateAccessCode();
      const existingWork = await Work.findOne({ accessCode });
      if (!existingWork) {
        isUnique = true;
      }
    }

    // Create new work in database
    const work = new Work({
      title: fields.title,
      description: fields.description,
      files: uploadedFiles,
      accessCode,
    });

    await work.save();

    return {
      statusCode: 200,
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
      body: JSON.stringify({ error: 'Error uploading files' }),
    };
  }
}; 
