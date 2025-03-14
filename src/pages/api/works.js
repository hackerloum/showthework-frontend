import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFiles: 10,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Here you would typically:
    // 1. Save the work details to your database
    // 2. Process the uploaded files (e.g., optimize images)
    // 3. Store file references in your database

    const fileUrls = Object.values(files).map(file => {
      const relativePath = path.relative(process.cwd(), file.filepath);
      return `/${relativePath.replace(/\\/g, '/')}`;
    });

    return res.status(200).json({
      message: 'Work created successfully',
      work: {
        title: fields.title,
        description: fields.description,
        files: fileUrls,
      },
    });
  } catch (error) {
    console.error('Error handling upload:', error);
    return res.status(500).json({ error: 'Error uploading files' });
  }
} 
