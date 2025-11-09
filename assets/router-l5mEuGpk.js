var H=Object.defineProperty;var D=(l,e,n)=>e in l?H(l,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):l[e]=n;var p=(l,e,n)=>D(l,typeof e!="symbol"?e+"":e,n);import{i as N,u as y,b as M,g as f}from"./index-Cf0nxp04.js";class v{constructor(e){this.controller=e}render(){const e=document.createElement("section");e.className="view card",e.setAttribute("role","region"),e.setAttribute("aria-label","Home");const n=document.createElement("h2");n.textContent="Cerita Terbaru",e.appendChild(n);const t=document.createElement("div");return t.id="story-list",e.appendChild(t),this.controller.loadStories().then(async o=>{if(!o||o.length===0)t.textContent="Tidak ada data.";else for(const a of o){const i=document.createElement("article");i.className="card",i.tabIndex=0;const r=document.createElement("img");r.alt=a.photoUrl?`Foto cerita ${a.name}`:"";const c="/inter-final/public/assets/placeholder.png";r.src=a.photoUrl||c,r.width=200,r.height=120,i.appendChild(r);const d=document.createElement("div"),u=a.createdAt?new Date(a.createdAt).toLocaleDateString("id-ID",{year:"numeric",month:"long",day:"numeric"}):"-";d.innerHTML=`<h3>${a.name||"Unknown"}</h3><p>${a.description?a.description.slice(0,120):"-"}</p><p class="created-at">Dibuat: ${u}</p>`;const s=document.createElement("button");s.className="bookmark-btn",s.setAttribute("aria-label","Bookmark story");let m=await N(a.id).catch(()=>!1);s.textContent=m?"★ Bookmarked":"☆ Bookmark",m&&(s.style.color="#ffd700"),s.style.marginTop="8px",s.style.padding="4px 8px",s.style.cursor="pointer",s.addEventListener("click",async h=>{h.stopPropagation();try{m?(await y(a.id),m=!1,s.textContent="☆ Bookmark",s.style.color=""):(await M(a),m=!0,s.textContent="★ Bookmarked",s.style.color="#ffd700")}catch(g){console.error("Bookmark error:",g)}}),d.appendChild(s),i.appendChild(d),t.appendChild(i)}}).catch(o=>{t.textContent="Gagal memuat data."}),e}}p(v,"viewName","Home");class w{constructor(e){this.controller=e}render(){const e=document.createElement("section");e.className="view card",e.setAttribute("role","region"),e.setAttribute("aria-label","Peta Cerita");const n=document.createElement("h2");n.textContent="Peta Cerita Pengguna",e.appendChild(n);const t=document.createElement("div");return t.id="map",t.style.height="500px",t.style.width="100%",t.setAttribute("aria-label","Peta yang menampilkan lokasi story pengguna"),e.appendChild(t),setTimeout(async()=>{try{const o=await this.controller.loadStories();if(!window.L){t.innerHTML="<p>⚠️ Leaflet belum dimuat. Pastikan sudah menambahkan script Leaflet di index.html.</p>";return}const a=L.map("map").setView([-2.5,118],5);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}).addTo(a);const i=[];(o||[]).forEach(r=>{var b,k;const c=parseFloat(r.lat||r.latitude||((b=r.location)==null?void 0:b.lat)),d=parseFloat(r.lon||r.longitude||((k=r.location)==null?void 0:k.lon));if(!isFinite(c)||!isFinite(d))return;const u=L.marker([c,d]).addTo(a),s=r.photoUrl||r.photo||"",m=r.name||r.username||"Anonim",h=r.createdAt?new Date(r.createdAt).toLocaleString("id-ID"):"Tanggal tidak diketahui",g=r.description||"-",S=r.id||r._id||"-",A=`
            <div style="max-width:240px; font-family:sans-serif;">
              ${s?`<img src="${s}" alt="Foto cerita dari ${m}" style="width:100%; height:120px; object-fit:cover; border-radius:8px; margin-bottom:8px;" />`:'<div style="background:#ccc;height:120px;border-radius:8px;margin-bottom:8px;display:flex;align-items:center;justify-content:center;">Tidak ada foto</div>'}
              <ul style="padding-left:18px; margin:0; line-height:1.4;">
                <li><strong>ID:</strong> ${S}</li>
                <li><strong>Nama:</strong> ${m}</li>
                <li><strong>Waktu Dibuat:</strong> ${h}</li>
              </ul>
              <p style="margin-top:6px; font-size:0.9em;">${g}</p>
            </div>
          `;u.bindPopup(A),i.push([c,d])}),i.length>0?a.fitBounds(i,{padding:[50,50]}):t.innerHTML="<p>⚠️ Tidak ada story dengan data lokasi.</p>"}catch(o){console.error("Gagal memuat peta:",o),t.innerHTML="<p>Gagal memuat data story. Pastikan koneksi dan token sudah benar.</p>"}},0),e}}p(w,"viewName","Peta Cerita");class x{constructor(e){this.controller=e}render(){const e=document.createElement("section");e.className="view card",e.setAttribute("role","region"),e.setAttribute("aria-label","Form Tambah Story");const n=document.createElement("h2");n.textContent="Tambah Cerita Baru",e.appendChild(n);const t=document.createElement("form");return t.innerHTML=`
      <div class="form-group">
        <label for="desc">Deskripsi</label>
        <textarea id="desc" name="description" required aria-required="true" placeholder="Tuliskan deskripsi cerita..."></textarea>
      </div>

      <div class="form-group">
        <label for="photo">Foto</label>
        <input id="photo" type="file" name="photo" accept="image/*" required aria-required="true">
      </div>

      <div style="margin-top:10px; margin-bottom:10px;">
        <div class="form-group">
          <label for="lat">Latitude</label>
          <input id="lat" name="lat" readonly required aria-required="true">
        </div>
        <div class="form-group">
          <label for="lon">Longitude</label>
          <input id="lon" name="lon" readonly required aria-required="true">
        </div>
      </div>

      <div id="map" style="height:300px; width:100%; margin-bottom:10px; border-radius:8px;"></div>

      <button type="submit">Kirim Story</button>
    `,e.appendChild(t),setTimeout(()=>{if(!window.L){const i=document.getElementById("map");i.innerHTML="<p>Leaflet belum dimuat. Tambahkan script Leaflet di index.html.</p>";return}const o=L.map("map").setView([-2.5,118],5);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}).addTo(o);let a;navigator.geolocation&&navigator.geolocation.getCurrentPosition(i=>{const{latitude:r,longitude:c}=i.coords;t.lat.value=r,t.lon.value=c,o.setView([r,c],10),a=L.marker([r,c]).addTo(o)},()=>console.warn("Tidak dapat mengambil lokasi pengguna")),o.on("click",i=>{const{lat:r,lng:c}=i.latlng;t.lat.value=r.toFixed(6),t.lon.value=c.toFixed(6),a&&o.removeLayer(a),a=L.marker([r,c]).addTo(o)})},0),t.addEventListener("submit",async o=>{o.preventDefault();const a=new FormData(t);if(!a.get("lat")||!a.get("lon")){alert("Silakan pilih lokasi di peta terlebih dahulu.");return}try{await this.controller.addStory(a),alert("✅ Story berhasil ditambahkan!"),location.hash="#/"}catch(i){console.error(i),alert("Gagal menambahkan story. Silahkan Login Terlebih Dahulu!."),location.hash="#/login"}}),e}}p(x,"viewName","Tambah Story");class T{constructor(e){this.controller=e}render(){const e=document.createElement("section");e.className="view card",e.setAttribute("aria-label","Halaman Login"),e.innerHTML=`
      <h2>Login</h2>
      <form aria-label="Form Login">
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" type="email" name="email" aria-label="Email" required autocomplete="username">
        </div>

        <div class="form-group">
          <label for="password">Kata Sandi</label>
          <input id="password" type="password" name="password" aria-label="Kata sandi" required autocomplete="current-password">
        </div>

        <button type="submit">Login</button>
      </form>
      <p>Belum punya akun? <a href="#/register">Daftar di sini</a></p>
    `;const n=e.querySelector("form");return n.addEventListener("submit",async t=>{t.preventDefault();const o=Object.fromEntries(new FormData(n));try{await this.controller.login(o),alert("Login berhasil!"),location.hash="#/"}catch(a){console.error(a),alert("Login gagal. Periksa kembali email dan kata sandi Anda.")}}),setTimeout(()=>{var t;return(t=e.querySelector("#email"))==null?void 0:t.focus()},100),e}}p(T,"viewName","Login");class E{constructor(e){this.controller=e}render(){const e=document.createElement("section");e.className="view card",e.innerHTML=`
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
    `;const n=e.querySelector("form");return n.addEventListener("submit",async t=>{t.preventDefault();const o=Object.fromEntries(new FormData(n));try{await this.controller.register(o),alert("Registrasi berhasil! Silakan login."),location.hash="#/login"}catch{alert("Registrasi gagal")}}),e}}p(E,"viewName","Register");class C{constructor(e){this.controller=e}render(){localStorage.removeItem("token"),window.AUTH_TOKEN="";const e=document.createElement("section");return e.className="view card",e.setAttribute("aria-label","Halaman Logout"),e.innerHTML=`
      <h2>Logout Berhasil</h2>
      <p>Anda telah keluar dari akun.</p>
      <p><a href="#/login">Klik di sini untuk login kembali</a></p>
    `,setTimeout(()=>{location.hash="#/login"},2e3),e}}p(C,"viewName","Logout");class B{constructor(e){this.controller=e}render(){const e=document.createElement("section");e.className="view card",e.setAttribute("role","region"),e.setAttribute("aria-label","Bookmarked Stories");const n=document.createElement("h2");n.textContent="Story yang Disimpan",e.appendChild(n);const t=document.createElement("div");return t.id="bookmark-list",e.appendChild(t),this.loadBookmarks(t),e}async loadBookmarks(e){try{const n=await f();if(!n||n.length===0){e.innerHTML="<p>Tidak ada story yang disimpan. Bookmark story dari halaman Home untuk menyimpannya di sini.</p>";return}e.innerHTML="";for(const t of n){const o=document.createElement("article");o.className="card",o.tabIndex=0;const a=document.createElement("img");a.alt=t.photoUrl?`Foto cerita ${t.name}`:"";const i="/inter-final/public/assets/placeholder.png";a.src=t.photoUrl||i,a.width=200,a.height=120,a.onerror=()=>{a.src=i},o.appendChild(a);const r=document.createElement("div"),c=t.createdAt?new Date(t.createdAt).toLocaleDateString("id-ID",{year:"numeric",month:"long",day:"numeric"}):"-";r.innerHTML=`
          <h3>${t.name||"Unknown"}</h3>
          <p>${t.description?t.description.slice(0,120):"-"}</p>
          <p class="created-at">Dibuat: ${c}</p>
        `;const d=document.createElement("button");d.className="bookmark-btn",d.textContent="★ Hapus dari Bookmark",d.style.color="#ffd700",d.style.marginTop="8px",d.style.padding="4px 8px",d.style.cursor="pointer",d.setAttribute("aria-label","Hapus bookmark"),d.addEventListener("click",async u=>{u.stopPropagation();try{await y(t.id),o.remove(),(await f()).length===0&&(e.innerHTML="<p>Tidak ada story yang disimpan. Bookmark story dari halaman Home untuk menyimpannya di sini.</p>")}catch(s){console.error("Unbookmark error:",s),alert("Gagal menghapus bookmark")}}),r.appendChild(d),o.appendChild(r),e.appendChild(o)}}catch(n){console.error("Error loading bookmarks:",n),e.innerHTML="<p>Gagal memuat data bookmark.</p>"}}}p(B,"viewName","Bookmark");function P(l,e){function n(){const o=localStorage.getItem("token"),a=document.getElementById("nav-login"),i=document.getElementById("nav-register"),r=document.getElementById("nav-logout");o?(a&&(a.style.display="none"),i&&(i.style.display="none"),r&&(r.style.display="block")):(a&&(a.style.display="block"),i&&(i.style.display="block"),r&&(r.style.display="none"))}async function t(){const o=location.hash||"#/";let a=v;o.startsWith("#/map")?a=w:o.startsWith("#/add")?a=x:o.startsWith("#/login")?a=T:o.startsWith("#/register")?a=E:o.startsWith("#/logout")?a=C:o.startsWith("#/bookmark")&&(a=B);const i=new a(e);document.startViewTransition?document.startViewTransition(()=>{l.innerHTML="",l.appendChild(i.render())}):(l.classList.add("view-exit-active"),requestAnimationFrame(()=>{l.innerHTML="",l.appendChild(i.render()),l.classList.remove("view-exit-active")})),document.title=`Story Map - ${a.viewName}`,n()}return window.addEventListener("hashchange",t),window.addEventListener("load",t),n(),{renderRoute:t}}export{P as default};
