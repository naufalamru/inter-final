import { getAllBookmarks, unbookmarkStory } from '../idb-wrapper.js';

export default class BookmarkView {
  static viewName = 'Bookmark';

  constructor(controller) {
    this.controller = controller;
  }

  render() {
    const container = document.createElement('section');
    container.className = 'view card';
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Bookmarked Stories');

    const title = document.createElement('h2');
    title.textContent = 'Story yang Disimpan';
    container.appendChild(title);

    const list = document.createElement('div');
    list.id = 'bookmark-list';
    container.appendChild(list);

    this.loadBookmarks(list);

    return container;
  }

  async loadBookmarks(list) {
    try {
      const bookmarks = await getAllBookmarks();
      
      if (!bookmarks || bookmarks.length === 0) {
        list.innerHTML = '<p>Tidak ada story yang disimpan. Bookmark story dari halaman Home untuk menyimpannya di sini.</p>';
        return;
      }

      list.innerHTML = '';
      
      for (const story of bookmarks) {
        const card = document.createElement('article');
        card.className = 'card';
        card.tabIndex = 0;
        
        const img = document.createElement('img');
        img.alt = story.photoUrl ? `Foto cerita ${story.name}` : '';
        const placeholderPath = import.meta.env.PROD ? '/inter-final/public/assets/placeholder.png' : '/public/assets/placeholder.png';
        img.src = story.photoUrl || placeholderPath;
        img.width = 200;
        img.height = 120;
        img.onerror = () => {
          img.src = placeholderPath;
        };
        card.appendChild(img);

        const meta = document.createElement('div');
        const createdAt = story.createdAt ? new Date(story.createdAt).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : '-';
        
        meta.innerHTML = `
          <h3>${story.name || 'Unknown'}</h3>
          <p>${story.description ? story.description.slice(0, 120) : '-'}</p>
          <p class="created-at">Dibuat: ${createdAt}</p>
        `;

        // Tambahkan tombol unbookmark
        const unbookmarkBtn = document.createElement('button');
        unbookmarkBtn.className = 'bookmark-btn';
        unbookmarkBtn.textContent = '★ Hapus dari Bookmark';
        unbookmarkBtn.style.color = '#ffd700';
        unbookmarkBtn.style.marginTop = '8px';
        unbookmarkBtn.style.padding = '4px 8px';
        unbookmarkBtn.style.cursor = 'pointer';
        unbookmarkBtn.setAttribute('aria-label', 'Hapus bookmark');
        
        unbookmarkBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          try {
            await unbookmarkStory(story.id);
            // Hapus card dari DOM
            card.remove();
            // Jika tidak ada bookmark lagi, tampilkan pesan
            const remainingBookmarks = await getAllBookmarks();
            if (remainingBookmarks.length === 0) {
              list.innerHTML = '<p>Tidak ada story yang disimpan. Bookmark story dari halaman Home untuk menyimpannya di sini.</p>';
            }
          } catch (err) {
            console.error('Unbookmark error:', err);
            alert('Gagal menghapus bookmark');
          }
        });
        
        meta.appendChild(unbookmarkBtn);
        card.appendChild(meta);
        list.appendChild(card);
      }
    } catch (err) {
      console.error('Error loading bookmarks:', err);
      list.innerHTML = '<p>Gagal memuat data bookmark.</p>';
    }
  }
}

