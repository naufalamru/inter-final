
// PWA & Push setup (auto-initialized)
import { subscribeUser, unsubscribeUser, isSubscribed } from './push.js';
import { initIDB, syncPending } from './idb-wrapper.js';

const VAPID_PUBLIC = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

export function initPWA () {
  // Register service worker
  if ('serviceWorker' in navigator) {
    const swPath = import.meta.env.PROD ? '/inter-final/sw.js' : './sw.js';
    navigator.serviceWorker.register(swPath).then(reg => {
      console.log('SW registered', reg);
    }).catch(err => console.warn('SW registration failed', err));
  }

  // Install prompt handling
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.createElement('button');
    installBtn.id = 'install-app-button';
    installBtn.textContent = 'Install App';
    installBtn.style.marginLeft = '8px';
    document.querySelector('header').appendChild(installBtn);
    installBtn.addEventListener('click', async () => {
      installBtn.disabled = true;
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      console.log('Install choice', choice);
      installBtn.remove();
    });
  });

  // Add push toggle UI
  const pushToggle = document.createElement('button');
  pushToggle.id = 'push-toggle';
  pushToggle.textContent = 'Enable Push';
  pushToggle.setAttribute('aria-pressed', 'false');
  pushToggle.style.marginLeft = '8px';
  pushToggle.addEventListener('click', async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert('Push notifications are not supported in this browser.');
      return;
    }
    const subscribed = await isSubscribed();
    if (!subscribed) {
      await subscribeUser(VAPID_PUBLIC);
      pushToggle.textContent = 'Disable Push';
      pushToggle.setAttribute('aria-pressed','true');
    } else {
      await unsubscribeUser();
      pushToggle.textContent = 'Enable Push';
      pushToggle.setAttribute('aria-pressed','false');
    }
  });
  const header = document.querySelector('header');
  if (header) header.appendChild(pushToggle);

  // Init IndexedDB and attempt sync when online
  initIDB();
  window.addEventListener('online', () => {
    syncPending(window.STORY_API_BASE, window.AUTH_TOKEN);
  });
}
