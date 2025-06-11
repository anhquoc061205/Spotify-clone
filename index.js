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
    element.addEventListener("click", () => {
      playTrack(item.id,name,artistsName)
    });
    trackSection.appendChild(element);
  });
}

async function playTrack(id, name, artistsName){
  // console.log(id,name,artistsName);
  // console.log(id);
  // console.log(name);
  // console.log(artistsName);
  // const iframe = document.createElement("iframe");
  // iframe.src=`https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`;
  // console.log(iframe);
  const srcUrl = `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`;
  const iframe = document.getElementById("iframe");
  iframe.src = srcUrl;
  
  const modalName = document.getElementById("modal-name");
  console.log(modalName);
  modalName.innerHTML = `🎵 ${name}`;

   const modal = document.getElementById("modal");
    modal.style.display = "flex";
  

}

function closeModal (){
  const modal = document.getElementById("modal");
  modal.style.display = "none"
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
