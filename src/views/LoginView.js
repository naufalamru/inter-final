export default class LoginView {
  static viewName = 'Login';

  constructor(controller) {
    this.controller = controller;
  }

  render() {
    const section = document.createElement('section');
    section.className = 'view card';
    section.setAttribute('aria-label', 'Halaman Login');

    section.innerHTML = `
      <h2>Login</h2>
      <form aria-label="Form Login">
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" type="email" name="email" aria-label="Email" required autocomplete="username">
        </div>

        <div class="form-group">
          <label for="password">Kata Sandi</label>
          <input id="password" type="password" name="password" aria-label="Kata sandi" required autocomplete="current-password">
        </div>

        <button type="submit">Login</button>
      </form>
      <p>Belum punya akun? <a href="#/register">Daftar di sini</a></p>
    `;

    const form = section.querySelector('form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));

      try {
        await this.controller.login(data);
        alert('Login berhasil!');
        location.hash = '#/'; // kembali ke home - ini akan trigger hashchange dan update navbar
      } catch (err) {
        console.error(err);
        alert('Login gagal. Periksa kembali email dan kata sandi Anda.');
      }
    });

    // Fokus otomatis ke input email untuk aksesibilitas
    setTimeout(() => section.querySelector('#email')?.focus(), 100);

    return section;
  }
}
