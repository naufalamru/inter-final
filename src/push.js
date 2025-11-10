
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

    // ambil key dan ubah ke base64 string
    const rawKey = sub.getKey('p256dh');
    const key = btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey)));

    const rawAuth = sub.getKey('auth');
    const auth = btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuth)));

    // buat payload sesuai dokumentasi Dicoding
    const payload = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: key,
        auth: auth
      }
    };

    const token = window.AUTH_TOKEN || localStorage.getItem('token');

    const res = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log('Subscribe response:', data);

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
    if (sub) {
      await fetch(window.STORY_API_BASE + '/subscriptions/unsubscribe', {
        method: 'POST',
        headers: {'Content-Type':'application/json', 'Authorization': window.AUTH_TOKEN},
        body: JSON.stringify({endpoint: sub.endpoint})
      }).catch(()=>{});
      await sub.unsubscribe();
      console.log('Push unsubscribed');
    }
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
