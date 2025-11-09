
// Very small IndexedDB wrapper for stories and pending queue
const DB_NAME = 'storymap-db';
const DB_VERSION = 2; // Increment version untuk menambahkan bookmarks store
let db;

export function initIDB() {
  const req = indexedDB.open(DB_NAME, DB_VERSION);
  req.onupgradeneeded = (e) => {
    db = e.target.result;
    if (!db.objectStoreNames.contains('stories')) {
      db.createObjectStore('stories', {keyPath: 'id'});
    }
    if (!db.objectStoreNames.contains('pending')) {
      db.createObjectStore('pending', {autoIncrement: true});
    }
    // Tambahkan object store untuk bookmarks (story yang dipilih pengguna)
    if (!db.objectStoreNames.contains('bookmarks')) {
      db.createObjectStore('bookmarks', {keyPath: 'id'});
    }
  };
  req.onsuccess = (e) => { db = e.target.result; console.log('IDB ready'); };
  req.onerror = (e) => { console.error('IDB error', e); };
}

function tx(storeName, mode='readonly') {
  return db.transaction(storeName, mode).objectStore(storeName);
}

export function addStoryToIDB(story) {
  return new Promise((res,rej) => {
    const t = db.transaction('stories','readwrite');
    t.objectStore('stories').put(story).onsuccess = ()=>res(true);
    t.onerror = (e)=>rej(e);
  });
}

export function getAllStories() {
  return new Promise((res,rej) => {
    const arr=[];
    const r = db.transaction('stories','readonly').objectStore('stories').openCursor();
    r.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) { arr.push(cursor.value); cursor.continue(); }
      else res(arr);
    };
    r.onerror = (e)=>rej(e);
  });
}

export function deleteStory(id) {
  return new Promise((res,rej) => {
    const t = db.transaction('stories','readwrite');
    t.objectStore('stories').delete(id).onsuccess = ()=>res(true);
    t.onerror = (e)=>rej(e);
  });
}

// pending queue for offline-created stories
export function queuePending(story) {
  return new Promise((res,rej) => {
    const t = db.transaction('pending','readwrite');
    t.objectStore('pending').add(story).onsuccess = ()=>res(true);
    t.onerror = (e)=>rej(e);
  });
}

export async function syncPending(baseUrl, authToken) {
  if (!navigator.onLine) return;
  const arr = [];
  const r = db.transaction('pending','readonly').objectStore('pending').openCursor();
  r.onsuccess = async (e) => {
    const cursor = e.target.result;
    if (cursor) {
      arr.push({key: cursor.key, val: cursor.value});
      cursor.continue();
    } else {
      for (const item of arr) {
        try {
          // attempt to send to API
          const form = new FormData();
          for (const k in item.val) {
            form.append(k, item.val[k]);
          }
          await fetch(baseUrl + '/stories', {
            method: 'POST',
            headers: {'Authorization': authToken},
            body: form
          });
          // delete from pending
          const t = db.transaction('pending','readwrite');
          t.objectStore('pending').delete(item.key);
        } catch (e) {
          console.warn('sync failed', e);
        }
      }
    }
  };
}

// Fungsi untuk bookmark story (menyimpan story yang dipilih pengguna)
export function bookmarkStory(story) {
  return new Promise((res, rej) => {
    const t = db.transaction('bookmarks', 'readwrite');
    t.objectStore('bookmarks').put(story).onsuccess = () => res(true);
    t.onerror = (e) => rej(e);
  });
}

// Fungsi untuk unbookmark story
export function unbookmarkStory(storyId) {
  return new Promise((res, rej) => {
    const t = db.transaction('bookmarks', 'readwrite');
    t.objectStore('bookmarks').delete(storyId).onsuccess = () => res(true);
    t.onerror = (e) => rej(e);
  });
}

// Fungsi untuk cek apakah story sudah di-bookmark
export function isBookmarked(storyId) {
  return new Promise((res, rej) => {
    const t = db.transaction('bookmarks', 'readonly');
    const req = t.objectStore('bookmarks').get(storyId);
    req.onsuccess = () => res(!!req.result);
    req.onerror = (e) => rej(e);
  });
}

// Fungsi untuk mendapatkan semua bookmarks
export function getAllBookmarks() {
  return new Promise((res, rej) => {
    const arr = [];
    const r = db.transaction('bookmarks', 'readonly').objectStore('bookmarks').openCursor();
    r.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        arr.push(cursor.value);
        cursor.continue();
      } else {
        res(arr);
      }
    };
    r.onerror = (e) => rej(e);
  });
}
