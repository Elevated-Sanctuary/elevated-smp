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

async function load_mod_data(mod_list) {
    for (let mod_filename of mod_list) {
        let response = await fetch(`./data/mod_${mod_filename}.json`);
        let moddata = await response.json();
        if (moddata != null && document.getElementById(`mod-${mod_filename}`) != null) {
            let mod_elem = document.getElementById(`mod-${mod_filename}`);
            let table_elem = mod_elem.querySelector("#mod-table-body");
            mod_elem.querySelector("#mod-title").innerHTML = moddata.name;
            mod_elem.querySelector("#mod-desc").innerHTML = moddata.desc;
            mod_elem.querySelector(".download-btn").href = moddata.download_link;
            if (moddata.recommended == 1) {
                mod_elem.querySelector("#mod-recommended").innerHTML += " [Recommended]";
                mod_elem.querySelector("#mod-recommended").style.color = "rgba(0, 255, 0, 1)";
            }
            else if (moddata.recommended == -1) {
                mod_elem.querySelector("#mod-recommended").innerHTML += " [Not Recommended]";
                mod_elem.querySelector("#mod-recommended").style.color = "rgba(255, 0, 0, 1)";
            }
            for (let mod of moddata.mods) {
                table_elem.innerHTML += `
                <tr>
                    <td>${mod.name}</td>
                    <td>${mod.description}</td>
                    <td class="mod-link"><a href="${mod.link}" target="_blank">${mod.link}</a></td>
                </tr>
                `;
            }
        }
    }
}

function play_audio(default_volume = 0.5) {
    const audio = new Audio("./audio/ariamath.mp3");
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
load_mod_data(['addition', 'barebone', 'extreme', 'optimized'])