
export default class AddStoryView {
  
  static viewName = 'Tambah Story';

  constructor(controller) {
    this.controller = controller;
  }

  render() {
    const section = document.createElement('section');
    section.className = 'view card';
    section.setAttribute('role', 'region');
    section.setAttribute('aria-label', 'Form Tambah Story');

    const title = document.createElement('h2');
    title.textContent = 'Tambah Cerita Baru';
    section.appendChild(title);

    

    // Form upload story
    const form = document.createElement('form');
    form.innerHTML = `
      <div class="form-group">
        <label for="desc">Deskripsi</label>
        <textarea id="desc" name="description" required aria-required="true" placeholder="Tuliskan deskripsi cerita..."></textarea>
      </div>

      <div class="form-group">
        <label for="photo">Foto</label>
        <input id="photo" type="file" name="photo" accept="image/*" required aria-required="true">
      </div>

      <div style="margin-top:10px; margin-bottom:10px;">
        <div class="form-group">
          <label for="lat">Latitude</label>
          <input id="lat" name="lat" readonly required aria-required="true">
        </div>
        <div class="form-group">
          <label for="lon">Longitude</label>
          <input id="lon" name="lon" readonly required aria-required="true">
        </div>
      </div>

      <div id="map" style="height:300px; width:100%; margin-bottom:10px; border-radius:8px;"></div>

      <button type="submit">Kirim Story</button>
    `;
    section.appendChild(form);

    // Inisialisasi peta interaktif untuk memilih koordinat
    setTimeout(() => {
      if (!window.L) {
        const mapDiv = document.getElementById('map');
        mapDiv.innerHTML = '<p>Leaflet belum dimuat. Tambahkan script Leaflet di index.html.</p>';
        return;
      }

      // Inisialisasi peta default di Indonesia
      const map = L.map('map').setView([-2.5, 118], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      let marker;

      // Jika geolocation tersedia, pindahkan peta ke lokasi user
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            form.lat.value = latitude;
            form.lon.value = longitude;
            map.setView([latitude, longitude], 10);
            marker = L.marker([latitude, longitude]).addTo(map);
          },
          () => console.warn('Tidak dapat mengambil lokasi pengguna')
        );
      }

      // 🟢 Klik di peta → set koordinat di form
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        form.lat.value = lat.toFixed(6);
        form.lon.value = lng.toFixed(6);

        if (marker) map.removeLayer(marker);
        marker = L.marker([lat, lng]).addTo(map);
      });
    }, 0);

    // Submit form → kirim ke API
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = new FormData(form);

      if (!data.get('lat') || !data.get('lon')) {
        alert('Silakan pilih lokasi di peta terlebih dahulu.');
        return;
      }

      try {
        await this.controller.addStory(data);
        alert('✅ Story berhasil ditambahkan!');
        location.hash = '#/'; // kembali ke home
      } catch (err) {
        console.error(err);
        alert('Gagal menambahkan story. Silahkan Login Terlebih Dahulu!.');
        location.hash = '#/login';
      }
    });

    return section;
  }
}
