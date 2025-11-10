
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
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: await urlBase64ToUint8Array(vapidPublicKey)
    });
    console.log('Push subscribed', sub);

    // Ambil token login
    const rawToken = window.AUTH_TOKEN || localStorage.getItem('token');
    if (!rawToken) {
      console.error('Token tidak ditemukan. Pastikan user sudah login.');
      return;
    }
    const token = rawToken.startsWith('Bearer ') ? rawToken : `Bearer ${rawToken}`;

    // Format sesuai dokumentasi Dicoding
    const payload = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: btoa(String.fromCharCode(...new Uint8Array(sub.getKey('p256dh')))),
        auth: btoa(String.fromCharCode(...new Uint8Array(sub.getKey('auth'))))
      }
    };

    console.log('Payload dikirim:', payload);
    console.log('Authorization header:', token);

    const res = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Gagal subscribe:', res.status, res.statusText, errText);
    } else {
      const data = await res.json();
      console.log('Berhasil subscribe:', data);
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

    // ambil token dari window atau localStorage
    const rawToken = window.AUTH_TOKEN || localStorage.getItem('token') || '';
    if (!rawToken) {
      console.error('Token tidak ditemukan. Pastikan user sudah login sebelum unsubscribe.');
      // tetap coba unsubscribe lokal agar browser tidak menyimpan subscription
      await sub.unsubscribe().catch(e => console.warn('Local unsubscribe error', e));
      return;
    }
    const token = rawToken.startsWith('Bearer ') ? rawToken : `Bearer ${rawToken}`;

    // badan request sesuai dokumentasi Dicoding: { endpoint: sub.endpoint }
    const body = JSON.stringify({ endpoint: sub.endpoint });

    // Kirim request ke endpoint yang benar
    const url = 'https://story-api.dicoding.dev/v1/notifications/unsubscribe';

    // lakukan fetch, tangani response dengan baik
    const res = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body
    });

    if (!res.ok) {
      // tampilkan pesan server agar mudah debugging
      const text = await res.text().catch(() => null);
      console.error('Unsubscribe API gagal:', res.status, res.statusText, text);
      // tetap coba unsubscribe di client agar tidak meninggalkan subscription di browser
      await sub.unsubscribe().catch(e => console.warn('Local unsubscribe failed after API error', e));
      return;
    }

    console.log('Unsubscribe API response:', await res.json().catch(() => 'no-json'));
    // hapus subscription di browser
    const unsubbed = await sub.unsubscribe();
    console.log('Push unsubscribed (client):', unsubbed);
  } catch (err) {
    console.error('Failed to unsubscribe', err);
    // jika error, coba tetap unsubscribe di client
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
        console.log('Push unsubscribed (client, after error).');
      }
    } catch (e) {
      console.warn('Failed to cleanup local subscription after error', e);
    }
  }
}

export async function isSubscribed() {
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    return !!sub;
  } catch (e) { return false; }
}
