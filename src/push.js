
export async function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function subscribeUser(vapidPublicKey) {
  try {
    const reg = await navigator.serviceWorker.ready;

    // Buat langganan push
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: await urlBase64ToUint8Array(vapidPublicKey)
    });

    console.log('Push subscribed', sub);

    // Ambil token login (dari window atau localStorage)
    const rawToken = window.AUTH_TOKEN || localStorage.getItem('token');
    if (!rawToken) {
      console.error('Token tidak ditemukan. Pastikan user sudah login.');
      return;
    }
    const token = rawToken.startsWith('Bearer ') ? rawToken : `Bearer ${rawToken}`;

    // Ambil key dari subscription
    const p256dhKey = sub.getKey('p256dh');
    const authKey = sub.getKey('auth');

    if (!p256dhKey || !authKey) {
      console.error('Kunci subscription tidak valid:', p256dhKey, authKey);
      return;
    }

    // Bentuk payload sesuai dokumentasi Dicoding
    const payload = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: btoa(String.fromCharCode(...new Uint8Array(p256dhKey))),
        auth: btoa(String.fromCharCode(...new Uint8Array(authKey)))
      }
    };

    console.log('Payload final sebelum dikirim:', JSON.stringify(payload, null, 2));
    console.log('Authorization header:', token);

    // Kirim request ke API Dicoding
    const res = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    console.log('Server response:', text, 'status:', res.status);

    if (!res.ok) {
      console.error('Gagal subscribe:', res.status, res.statusText, text);
    } else {
      console.log('Berhasil subscribe!');
    }

    return sub;
  } catch (err) {
    console.error('Failed to subscribe', err);
    throw err;
  }
}

export async function unsubscribeUser() {
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();

    if (!sub) {
      console.log('No push subscription to unsubscribe.');
      return;
    }

    const rawToken = window.AUTH_TOKEN || localStorage.getItem('token') || '';
    const token = rawToken.startsWith('Bearer ') ? rawToken : `Bearer ${rawToken}`;
    const body = JSON.stringify({ subscription: JSON.stringify({ endpoint: sub.endpoint }) });

    const url = 'https://story-api.dicoding.dev/v1/notifications/unsubscribe';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body
      });

      if (!res.ok) {
        const text = await res.text();
        console.warn('Unsubscribe API gagal (mungkin CORS):', res.status, text);
      } else {
        console.log('Unsubscribe API sukses:', await res.text());
      }
    } catch (e) {
      console.warn('Unsubscribe gagal karena CORS, lanjut unsubscribe lokal.');
    }

    // tetap hapus subscription di client
    await sub.unsubscribe();
    console.log('Push unsubscribed (client).');
  } catch (err) {
    console.error('Failed to unsubscribe', err);
  }
}

export async function isSubscribed() {
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    return !!sub;
  } catch (e) { return false; }
}
