import HomeView from './views/HomeView.js';
import MapView from './views/MapView.js';
import AddStoryView from './views/AddStoryView.js';
import LoginView from './views/LoginView.js';
import RegisterView from './views/RegisterView.js';
import LogoutView from './views/LogoutView.js';

export default function initRouter(app, controller) {
  // Fungsi untuk update navbar berdasarkan status login
  function updateNavbar() {
    const savedToken = localStorage.getItem('token');
    const navLogin = document.getElementById('nav-login');
    const navRegister = document.getElementById('nav-register');
    const navLogout = document.getElementById('nav-logout');
    
    if (savedToken) {
      // Jika sudah login, sembunyikan Login dan Register
      if (navLogin) navLogin.style.display = 'none';
      if (navRegister) navRegister.style.display = 'none';
      if (navLogout) navLogout.style.display = 'block';
    } else {
      // Jika belum login, tampilkan Login dan Register
      if (navLogin) navLogin.style.display = 'block';
      if (navRegister) navRegister.style.display = 'block';
      if (navLogout) navLogout.style.display = 'none';
    }
  }

  async function renderRoute() {
    const hash = location.hash || '#/';
    let ViewClass = HomeView;

    if (hash.startsWith('#/map')) ViewClass = MapView;
    else if (hash.startsWith('#/add')) ViewClass = AddStoryView;
    else if (hash.startsWith('#/login')) ViewClass = LoginView;
    else if (hash.startsWith('#/register')) ViewClass = RegisterView;
    else if (hash.startsWith('#/logout')) ViewClass = LogoutView;

    const view = new ViewClass(controller);

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        app.innerHTML = '';
        app.appendChild(view.render());
      });
    } else {
      app.classList.add('view-exit-active');
      requestAnimationFrame(() => {
        app.innerHTML = '';
        app.appendChild(view.render());
        app.classList.remove('view-exit-active');
      });
    }

    document.title = `Story Map - ${ViewClass.viewName}`;
    // Update navbar setiap kali route berubah
    updateNavbar();
  }

  window.addEventListener('hashchange', renderRoute);
  window.addEventListener('load', renderRoute);
  // Update navbar saat load pertama kali
  updateNavbar();

  return { renderRoute };
}
