export default class RegisterView {
  static viewName = 'Register';
  constructor(controller) { this.controller = controller; }

  render() {
    const section = document.createElement('section');
    section.className = 'view card';
    section.innerHTML = `
      <h2>Register</h2>
      <form aria-label="Form Register">
        <div class="form-group">
          <label for="name">Nama</label>
          <input id="name" type="text" name="name" required aria-label="Nama">
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" type="email" name="email" required aria-label="Email" autocomplete="username">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" type="password" name="password" required aria-label="Password" autocomplete="new-password">
        </div>
        <button type="submit">Daftar</button>
      </form>
      <p>Sudah punya akun? <a href="#/login">Login</a></p>
    `;

    const form = section.querySelector('form');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      try {
        await this.controller.register(data);
        alert('Registrasi berhasil! Silakan login.');
        location.hash = '#/login';
      } catch {
        alert('Registrasi gagal');
      }
    });

    return section;
  }
}
