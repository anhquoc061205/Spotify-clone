let accesstoken;

document.addEventListener("DOMContentLoaded", function () {
  initialApp();
});

async function initialApp() {
  accesstoken = await getSpotifyToken();
  if (accesstoken) {
    const response = await getPopularTrack();
    displayTrack(response.tracks.items);
  }
}

async function displayTrack(data) {
  console.log(data);
  data.forEach((item) => {
    console.log(item.artists[0]);
    const imageURL = item.album.images[0].url;
    const name = item.album.name;
    
    // tạo ra thẻ div
    const element = document.createElement("div");

    // gắn class cho thẻ div đó
    element.className = "track-card";
    const artistsName = item.artists.map(artists => artists.name).join(", ");
    

    // gắn nội dung

    element.innerHTML = `
    <div class="track-card-container">

      <img src="${imageURL}">
      <h3>${name}</h3>
      <p>${artistsName}</p>

    </div>`;
    
    // gắn nguyên cái thẻ dive đó vào track-section
    const trackSection = document.getElementById("track-section");
    trackSection.appendChild(element);
  });
}

async function getPopularTrack() {
  try {
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
      params: {
        q: "albums viet nam",
        type: "track",
        limit: "12",
        market: "VN",
      }
    });
    // console.log(response);
    return response.data;
  } catch (e) {
    console.log(e);
  }
}

async function getSpotifyToken() {
  try {
    const credentials = btoa(
      `${SPOTIFY_CONFIG.CLIENT_ID}:${SPOTIFY_CONFIG.CLIENT_SECRET}`
    );

    const response = await axios.post(
      " https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
}
