export default class MapView {
  static viewName = 'Peta Cerita';

  constructor(controller) {
    this.controller = controller;
  }

  render() {
    const section = document.createElement('section');
    section.className = 'view card';
    section.setAttribute('role', 'region');
    section.setAttribute('aria-label', 'Peta Cerita');

    const title = document.createElement('h2');
    title.textContent = 'Peta Cerita Pengguna';
    section.appendChild(title);

    // Kontainer peta
    const mapContainer = document.createElement('div');
    mapContainer.id = 'map';
    mapContainer.style.height = '500px';
    mapContainer.style.width = '100%';
    mapContainer.setAttribute('aria-label', 'Peta yang menampilkan lokasi story pengguna');
    section.appendChild(mapContainer);

    // Tunggu elemen siap dirender dulu
    setTimeout(async () => {
      try {
        const stories = await this.controller.loadStories();

        if (!window.L) {
          mapContainer.innerHTML = '<p>⚠️ Leaflet belum dimuat. Pastikan sudah menambahkan script Leaflet di index.html.</p>';
          return;
        }

        // Inisialisasi peta
        const map = L.map('map').setView([-2.5, 118], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        const bounds = [];

        // Tambahkan marker untuk setiap story
        (stories || []).forEach((story) => {
          const lat = parseFloat(story.lat || story.latitude || story.location?.lat);
          const lon = parseFloat(story.lon || story.longitude || story.location?.lon);
          if (!isFinite(lat) || !isFinite(lon)) return;

          const marker = L.marker([lat, lon]).addTo(map);

          const photo = story.photoUrl || story.photo || '';
          const name = story.name || story.username || 'Anonim';
          const created = story.createdAt
            ? new Date(story.createdAt).toLocaleString('id-ID')
            : 'Tanggal tidak diketahui';
          const desc = story.description || '-';
          const id = story.id || story._id || '-';

          // ✅ Minimal 3 teks (ID, Nama, Waktu)
          const popupContent = `
            <div style="max-width:240px; font-family:sans-serif;">
              ${
                photo
                  ? `<img src="${photo}" alt="Foto cerita dari ${name}" style="width:100%; height:120px; object-fit:cover; border-radius:8px; margin-bottom:8px;" />`
                  : '<div style="background:#ccc;height:120px;border-radius:8px;margin-bottom:8px;display:flex;align-items:center;justify-content:center;">Tidak ada foto</div>'
              }
              <ul style="padding-left:18px; margin:0; line-height:1.4;">
                <li><strong>ID:</strong> ${id}</li>
                <li><strong>Nama:</strong> ${name}</li>
                <li><strong>Waktu Dibuat:</strong> ${created}</li>
              </ul>
              <p style="margin-top:6px; font-size:0.9em;">${desc}</p>
            </div>
          `;

          marker.bindPopup(popupContent);
          bounds.push([lat, lon]);
        });

        // Jika ada data, sesuaikan tampilan peta
        if (bounds.length > 0) {
          map.fitBounds(bounds, { padding: [50, 50] });
        } else {
          mapContainer.innerHTML = '<p>⚠️ Tidak ada story dengan data lokasi.</p>';
        }
      } catch (error) {
        console.error('Gagal memuat peta:', error);
        mapContainer.innerHTML =
          '<p>Gagal memuat data story. Pastikan koneksi dan token sudah benar.</p>';
      }
    }, 0);

    return section;
  }
}
