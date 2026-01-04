import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadFiles = async (files) => {
  const uploadDir = path.join(__dirname, '../public/uploads');
  
  // Create uploads directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileInfos = [];

  for (const file of files) {
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);
    
    // Save file to local storage
    await fs.promises.writeFile(filePath, file.buffer);
    
    // Store file information
    fileInfos.push({
      fileName,
      originalName: file.originalname,
      path: `/uploads/${fileName}`, // This will be the URL path
      mimeType: file.mimetype,
      size: file.size
    });
  }

  return fileInfos;
};
