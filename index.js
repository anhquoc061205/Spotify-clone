let accesstoken;
let searchTimeout;

document.addEventListener("DOMContentLoaded", function () {
  initialApp();
  setupSearchListener();

});
function setupSearchListener(){
  const inputSearch = document.getElementById("searchInput");
  inputSearch.addEventListener("input",  (e) => {


    const querry = e.target.value.trim();
    clearTimeout(searchTimeout);
      // debounce
    searchTimeout = setTimeout( async () => {
      if(querry){
     const response = await getPopularTrack(querry);
        resetTrack();
        displayTrack(response.tracks.items);
       
    }
    },1000)
   
  });
}
function resetTrack(){
  const trackSection = document.getElementById("track-section");
      trackSection.innerHTML = ""; // xoá nội dung cũ
}
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
    // console.log(item.artists[0]);
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

async function getPopularTrack(querry = "top trending Việt Nam") {
  try {

    const query = document.getElementById("searchInput").value.trim(); // lấy nội input
    const actualQuery = query || "top trending Việt Nam"; // từ khoá mặt định nếu input rỗng

    

    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
      params: {
        q: querry,
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

// thêm sự kiện khi nhấn phím Enter:
document.getElementById("searchInput").addEventListener("keydown", function(e){
if (e.key === "Enter") {
  e.preventDefault(); // 🔥 Ngăn form reload
  const query = document.getElementById("searchInput").value.trim();
if (!query) {
  Swal.fire({
  icon: 'warning',
  title: 'Chưa nhập từ khóa!',
  text: 'Vui lòng nhập từ khóa tìm kiếm để hiển thị kết quả.',
  
});
  return;
    }

  getPopularTrack().then(data => {
      const trackSection = document.getElementById("track-section");
      trackSection.innerHTML = ""; // xoá nội dung cũ
      displayTrack(data.tracks.items); // gọi lại hàm hiển thị bài hát mới

  });
}
});

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
