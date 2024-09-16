import express from 'express';
import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app = express();
const upload = multer({ dest: 'uploads/' });

// Endpoint for uploading images
app.use(cors());
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ filePath: req.file.path });
});

// Endpoint for processing images
app.post('/process', upload.single('image'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imagePath = req.file.path;
    const outputFilePath = path.join('uploads', 'processed-' + req.file.filename + '.jpeg');
    
    await sharp(imagePath)
      .resize(800)  // Resize image
      .toFile(outputFilePath);  // Save processed image to file system

    // Send processed image path in response
    res.json({ previewPath: outputFilePath });

    // Clean up the original file after processing
    fs.unlinkSync(imagePath);

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
