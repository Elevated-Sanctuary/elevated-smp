// -------------------- Variables --------------------
const default_volume = 0.0;
// ---------------------------------------------------

// -------------------- Initialize --------------------
document.getElementById("main-page").classList.remove("d-none");
let serverdata = {};
let is_homepage = true;
// ----------------------------------------------------

async function get_server_data() {
    let response = await fetch("./data/serverdata.json");
    serverdata = await response.json();
    return serverdata;
}

function play_audio(default_volume = 0.5) {
    const audio = new Audio("/audio/ariamath.mp3");
    audio.loop = true;

    const muteBtn = document.getElementById("muteBtn");
    const volumeSlider = document.getElementById("volumeRange");

    audio.volume = default_volume;
    volumeSlider.value = default_volume;

    muteBtn.addEventListener("click", () => {
        audio.muted = !audio.muted;
        audio.play();
    }, { once: true });

    muteBtn.addEventListener("click", () => {
        audio.muted = !audio.muted;
        muteBtn.innerHTML = audio.muted ? `<i class="bi bi-volume-mute-fill"></i>` : `<i class="bi bi-volume-up-fill"></i>`;
    })

    volumeSlider.addEventListener("input", () => {
        audio.volume = volumeSlider.value;
        audio.muted = volumeSlider.value == 0;
        muteBtn.innerHTML = audio.muted ? `<i class="bi bi-volume-mute-fill"></i>` : `<i class="bi bi-volume-up-fill"></i>`;
    });
}

function scrolldir(dir) {
    return dir;
}

function home_scroll(dir) {
    if (is_homepage && dir == "down") {
        is_homepage = false;
        document.body.classList.add("scrolled");
    }
    else if (!is_homepage && dir == "up" && window.scrollY == 0) {
        is_homepage = true;
        document.body.classList.remove("scrolled");
    }
}

function scrollto(element_id) {
    document.getElementById(element_id).scrollIntoView({ behavior: 'smooth' });
}

get_server_data().then(() => {
    // console.log(serverdata);
    document.getElementById("server-name").innerHTML = serverdata.name;
    document.getElementById("server-desc").innerHTML = serverdata.description;
    if (serverdata.ip_playit && serverdata.ip_playit.length > 0) {
        let playit_ip_elem = document.getElementById("server-playit-ip");
        playit_ip_elem.innerHTML = `${serverdata.ip_playit}`;
        playit_ip_elem.classList.remove("d-none");
    }
    let version_elem = document.getElementById("append-version");
    version_elem.innerHTML += `${serverdata.version}`;
})

// Mouse whel scroll
window.addEventListener("wheel", (e) => {
    let dir = scrolldir(e.deltaY > 0 ? "down" : "up");
    home_scroll(dir);
})

// Mobile touch scroll
let startY = 0;
window.addEventListener("touchstart", e => {
    startY = e.touches[0].clientY;
});
window.addEventListener("touchend", e => {
    const endY = e.changedTouches[0].clientY;
    let dir = scrolldir(endY < startY ? "down" : "up");
    home_scroll(dir);
});

// Check scroll
window.addEventListener("scroll", () => {
    if (window.scrollY != 0 && is_homepage) {
        is_homepage = false;
        document.body.classList.add("scrolled");
    }
});

play_audio(default_volume);