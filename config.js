// Tự động detect URL hiện tại
function getCurrentURL() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  // Fallback URLs cho các trường hợp phổ biến
  return "http://127.0.0.1:5500/index.html";
}

// Spotify API Configuration
const SPOTIFY_CONFIG = {
  CLIENT_ID: "a476a09eb7fc4432b5a4c782e3335115",
  CLIENT_SECRET: "9399686269b9472ca503aa8b0a999992",
  get REDIRECT_URI() {
    return getCurrentURL();
  },
};

console.log(`
🎵 SPORTIFY WEB PLAYER
📝 Cấu hình:
- Client ID: ${SPOTIFY_CONFIG.CLIENT_ID ? "✅" : "❌"}
- Client Secret: ${SPOTIFY_CONFIG.CLIENT_SECRET ? "✅" : "❌"}
- Redirect URI: ${SPOTIFY_CONFIG.REDIRECT_URI}
`);