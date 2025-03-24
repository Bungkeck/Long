import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { photo, location } = req.body;

    // Generate nama file unik
    const fileName = `photo_${Date.now()}.jpg`;
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

    // Simpan foto ke folder public/uploads
    const base64Data = photo.replace(/^data:image\/\w+;base64,/, '');
    fs.writeFileSync(filePath, base64Data, 'base64');

    // Simpan data lokasi ke file JSON
    const locationData = {
      fileName,
      latitude: location.latitude,
      longitude: location.longitude,
    };
    fs.writeFileSync(path.join(process.cwd(), 'public', 'uploads', `${fileName}.json`), JSON.stringify(locationData));

    // Kirim respons ke frontend
    res.status(200).json({ message: 'Data saved successfully', fileName });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}