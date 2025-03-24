export default async function handler(req, res) {
  try {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const response = await fetch(`https://ipinfo.io/${ip}?token=289148321a0db5`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch IP details' });
  }
}