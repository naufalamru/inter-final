
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
    // send subscription to server for demo; the story-api provides endpoint
    await fetch(window.STORY_API_BASE + '/notifications/subscribe', {
      method: 'POST',
      headers: {'Content-Type':'application/json', 'Authorization': window.AUTH_TOKEN},
      body: JSON.stringify(sub)
    }).catch(e=>console.warn('subscription send failed',e));
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
