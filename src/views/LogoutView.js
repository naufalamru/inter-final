export default class LogoutView {
  static viewName = 'Logout';

  constructor(controller) {
    this.controller = controller;
  }

  render() {
    // Hapus token agar sesi benar-benar berakhir
    localStorage.removeItem('token');
    window.AUTH_TOKEN = '';

    const section = document.createElement('section');
    section.className = 'view card';
    section.setAttribute('aria-label', 'Halaman Logout');

    section.innerHTML = `
      <h2>Logout Berhasil</h2>
      <p>Anda telah keluar dari akun.</p>
      <p><a href="#/login">Klik di sini untuk login kembali</a></p>
    `;

    // Beri sedikit delay lalu arahkan ke login
    setTimeout(() => {
      location.hash = '#/login';
    }, 2000);

    return section;
  }
}
