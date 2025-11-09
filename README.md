# Dicoding Submission - Story Map (Mapbox + OSM)

This project includes a Map page with two tile layers (OpenStreetMap + Mapbox Streets).
Mapbox is used only if you provide a token in STUDENT.txt (MAPBOX_TOKEN).

Steps:
1. Copy STUDENT.txt.example to STUDENT.txt and add MAPBOX_TOKEN if you want Mapbox.
2. npm install
3. npm run dev
4. Open the URL shown by vite (default http://localhost:5173)

Notes:
- Leaflet is loaded from CDN in index.html.
- The Map page fetches stories from https://story-api.dicoding.dev/v1/stories and places markers if lat/lon exist.
