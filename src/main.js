// ==========================================================
// 🔹 Import CSS
// ==========================================================
import './styles.css';

// ==========================================================
// 🔹 Base URL API
// ==========================================================
window.STORY_API_BASE = 'https://story-api.dicoding.dev/v1';

// ==========================================================
// 🔹 Jalankan pengecekan login setelah halaman siap
// ==========================================================
window.addEventListener('DOMContentLoaded', () => {
  const savedToken = localStorage.getItem('token');
  const currentHash = location.hash;

  // ==========================================================
  // 🔸 Paksa user login jika belum punya token
  // ==========================================================
  if (!savedToken && !currentHash.startsWith('#/login') && !currentHash.startsWith('#/register')) {
    location.hash = '#/login';
  }

  // ==========================================================
  // 🔸 Cegah user mengakses login/register jika sudah login
  // ==========================================================
  if (savedToken && (currentHash.startsWith('#/login') || currentHash.startsWith('#/register'))) {
    location.hash = '#/';
  }

  // ==========================================================
  // 🔸 Simpan token global agar bisa diakses oleh model/controller
  // ==========================================================
  // Token sudah disimpan dengan prefix "Bearer " di appController, jadi langsung gunakan
  window.AUTH_TOKEN = savedToken || null;

  // ==========================================================
  // 🔸 Import router dan controller setelah pengecekan token
  // ==========================================================
  import('./router.js').then(({ default: initRouter }) => {
    import('./controllers/appController.js').then(({ default: AppController }) => {
      const app = document.getElementById('app');
      const controller = new AppController(app);
      initRouter(app, controller);
    });
  });
});

// ==========================================================
// 🔹 Shortcut keyboard: tekan 'M' untuk langsung ke peta
// ==========================================================
window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'm' && !e.metaKey && !e.ctrlKey) {
    location.hash = '#/map';
  }
});

// ==========================================================
// 🔹 Inisialisasi PWA (tetap aktif)
// ==========================================================
import { initPWA } from './pwa.js';
window.addEventListener('load', () => {
  try {
    initPWA();
  } catch (e) {
    console.warn('PWA init failed', e);
  }
});
