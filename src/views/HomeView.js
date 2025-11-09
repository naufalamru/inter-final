import { bookmarkStory, unbookmarkStory, isBookmarked } from '../idb-wrapper.js';

export default class HomeView{
  static viewName = 'Home'
  constructor(controller){ this.controller = controller }
  render(){
    const container = document.createElement('section')
    container.className = 'view card'
    container.setAttribute('role','region')
    container.setAttribute('aria-label','Home')

    const title = document.createElement('h2')
    title.textContent = 'Cerita Terbaru'
    container.appendChild(title)

    const list = document.createElement('div')
    list.id = 'story-list'
    container.appendChild(list)

    this.controller.loadStories()
      .then(async stories => {
        if(!stories || stories.length === 0) list.textContent = 'Tidak ada data.'
        else{
          for (const s of stories) {
            const card = document.createElement('article')
            card.className = 'card'
            card.tabIndex = 0
            const img = document.createElement('img')
            img.alt = s.photoUrl ? `Foto cerita ${s.name}` : ''
            const placeholderPath = import.meta.env.PROD ? '/inter-final/public/assets/placeholder.png' : '/public/assets/placeholder.png';
            img.src = s.photoUrl || placeholderPath;
            img.width = 200
            img.height = 120
            card.appendChild(img)
            const meta = document.createElement('div')
            // Format tanggal createdAt
            const createdAt = s.createdAt ? new Date(s.createdAt).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : '-'
            meta.innerHTML = `<h3>${s.name || 'Unknown'}</h3><p>${s.description ? s.description.slice(0,120) : '-'}</p><p class="created-at">Dibuat: ${createdAt}</p>`
            
            // Tambahkan tombol bookmark
            const bookmarkBtn = document.createElement('button')
            bookmarkBtn.className = 'bookmark-btn'
            bookmarkBtn.setAttribute('aria-label', 'Bookmark story')
            let isBookmarkedState = await isBookmarked(s.id).catch(() => false)
            bookmarkBtn.textContent = isBookmarkedState ? '★ Bookmarked' : '☆ Bookmark'
            if (isBookmarkedState) {
              bookmarkBtn.style.color = '#ffd700'
            }
            bookmarkBtn.style.marginTop = '8px'
            bookmarkBtn.style.padding = '4px 8px'
            bookmarkBtn.style.cursor = 'pointer'
            bookmarkBtn.addEventListener('click', async (e) => {
              e.stopPropagation()
              try {
                if (isBookmarkedState) {
                  await unbookmarkStory(s.id)
                  isBookmarkedState = false
                  bookmarkBtn.textContent = '☆ Bookmark'
                  bookmarkBtn.style.color = ''
                } else {
                  await bookmarkStory(s)
                  isBookmarkedState = true
                  bookmarkBtn.textContent = '★ Bookmarked'
                  bookmarkBtn.style.color = '#ffd700'
                }
              } catch (err) {
                console.error('Bookmark error:', err)
              }
            })
            meta.appendChild(bookmarkBtn)
            card.appendChild(meta)
            list.appendChild(card)
          }
        }
      })
      .catch(err => { list.textContent = 'Gagal memuat data.' })

    return container
  }
}
