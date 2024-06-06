let music;
let index;
let playmusic;
let currentFolder;
let playing = 1;
let currentVolume = 1;
let currentSong = new Audio();
let cards = document.querySelector(".cards");
let previous = document.querySelector("#prev");
let play = document.querySelector("#play");
let next = document.querySelector("#next");
let songinfo = document.querySelector(".songinfo");
let songduration = document.querySelector(".songduration");
let AudioDurationBar = document.querySelector(".seekbar-in-2");
let seekbarInner = document.querySelector(".seekbar-inner");
let hamburger = document.querySelector(".hamburger");
let close = document.querySelector(".close");
let left = document.querySelector(".left");
let volume = document.querySelector("#volumebtn");
let volumeBar = document.querySelector(".volume").getElementsByTagName("input")[0];
volumeBar.value = 100;

const SecToMin = (seconds) => {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    } else {
        const min = Math.floor(seconds / 60);
        const remainSecs = Math.floor(seconds % 60);
        const formattedMin = String(min).padStart(2, '0');
        const formattedSecs = String(remainSecs).padStart(2, '0');
        return `${formattedMin}:${formattedSecs}`;
    }
}

async function GetSongs(folder) {
    AudioDurationBar.style.width = "0%";
    currentFolder = folder;
    let a = await fetch(`/music/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let songdets = div.getElementsByTagName("a");
    music = [];
    for (let i = 0; i < songdets.length; i++) {
        const element = songdets[i];
        if (element.href.endsWith(".mp3")) {
            music.push(element.href.split(`/music/${folder}/`)[1]);
        }
    }

    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUl.innerHTML = "";
    for (const song of music) {
        songUl.innerHTML = songUl.innerHTML + `<li><div class="mainlist">
        <div class="songname">
            <img src="/svg/music.svg" alt="">
            <div>${decodeURI(song).split(".mp3")[0]}</div>
        </div>
        <div class="playnow">
            <h4>play now</h4>
            <img src="/svg/circlePlay.svg" alt="">
        </div>
    </div></li>`;
    }

    // Function to play the selected music 
    playmusic = (track, pause = false) => {
        currentSong.src = `/music/${currentFolder}/` + track;
        if (!pause) {
            currentSong.play();
            play.src = "/svg/pause.svg"
        }

        // show the name of the song
        songinfo.innerHTML = decodeURI(track).split(".mp3")[0];
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(element => {
        element.addEventListener("click", () => {
            playmusic(element.querySelector(".mainlist").querySelector(".songname").getElementsByTagName("div")[0].innerHTML + ".mp3");
        })
    })

    // Song duration and seekbar update function
    currentSong.addEventListener("timeupdate", () => {
        index = music.indexOf(currentSong.src.split(`/music/${currentFolder}/`)[1])
        songduration.innerHTML = `${SecToMin(currentSong.currentTime)} / ${SecToMin(currentSong.duration)}`;
        AudioDurationBar.style.width = ((currentSong.currentTime) / (currentSong.duration)) * 100 + "%"
        if (currentSong.currentTime == currentSong.duration) {
            play.src = "/svg/play.svg";
            if ((index + 1) < (music.length)) {
                playmusic(music[index + 1])
            } else {
                index = 0;
                playmusic(music[index]);
            }
        }
    })

    // Attaching an event listener to seek the duration bar 
    seekbarInner.addEventListener("click", (e) => {
        let audioDurationPercent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        AudioDurationBar.style.width = audioDurationPercent + "%";
        currentSong.currentTime = ((currentSong.duration) * audioDurationPercent) / 100
        currentSong.play();
        play.src = "/svg/pause.svg"
    })

    // Automatic detection of first song 
    playmusic(music[0], true)


}

const getFolders = async () => {
    let a = await fetch(`/music/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let array = Array.from(anchors);
    for (let i = 0; i < array.length; i++) {
        const e = array[i];
        if (e.href.includes("/music/") && !e.href.includes(".htaccess")) {
            let currentFolderName = e.href.split("/").slice("4")[0];
            try {
                let a = await fetch(`/music/${currentFolderName}/info.json`);
                let response = await a.json();
                cards.innerHTML = cards.innerHTML + `<div data-folder=${currentFolderName} class="card">
            <img src= "/music/${currentFolderName}/cover.jpg" alt="Album cover">
            <div class="scrollContainer"> <div class="cardTitle"> <h2>${decodeURI(currentFolderName)}</h2> </div> </div>
            <p>${response.description ? response.description : "Hits to boost your mood and fill you with happiness!"}</p>
        </div>`
            } catch (error) {
                console.warn(`Json file not found in "${currentFolderName}" folder Please Make a json file in it that contains description of your own and the syntax should be >>> {"description": "Write your own.."} with curly brackets and the name must be info.json`);
                cards.innerHTML = cards.innerHTML + `<div data-folder=${currentFolderName} class="card">
            <img src= "/music/${currentFolderName}/cover.jpg" alt="Album cover">
            <div class="scrollContainer"> <div class="cardTitle"> <h2>${decodeURI(currentFolderName)}</h2> </div> </div>
            <p>${response.description ? response.description : "Hits to boost your mood and fill you with happiness!"}</p>
        </div>`
            }
        }
    }
    // Adding an event listener to display songs of selected folder 
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async (item) => {
            await GetSongs(`${item.currentTarget.dataset.folder}`);
            play.src = "/svg/play.svg";
        })
    })
}

async function main() {
    // To load the default folder 
    await GetSongs("Favorite");

    // Attach an event listener to buttons to play/pause the song
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "/svg/pause.svg"
        } else {
            currentSong.pause();
            play.src = "/svg/play.svg"
        }
    })

    // Attaching an event listener to play previous song 
    previous.addEventListener("click", () => {
        index = music.indexOf(currentSong.src.split(`/music/${currentFolder}/`)[1]);
        if ((index - 1) >= 0) {
            playmusic(music[index - 1]);
        } else {
            index = ((music.length) - 1);
            playmusic(music[index]);
        }
    })

    // Attaching an event listener to play next song 
    next.addEventListener("click", () => {
        index = music.indexOf(currentSong.src.split(`/music/${currentFolder}/`)[1]);
        if ((index + 1) < (music.length)) {
            playmusic(music[index + 1]);
        } else {
            index = 0;
            playmusic(music[index]);
        }
    })

    // Attaching an event listener to open the menu section 
    hamburger.addEventListener("click", () => {
        left.style.left = "0%";
    })

    // Attaching an event listener to close the menu section 
    close.addEventListener("click", () => {
        left.style.left = "-100%";
    })

    // Attching an event listener to change the volume the song 
    volumeBar.addEventListener("change", (e) => {
        currentVolume = parseInt(e.target.value) / 100;
        currentSong.volume = currentVolume;
        volume.src = "/svg/volume.svg";
    })

    // Attching an event listener to mute and unmute the song 
    volume.addEventListener("click", () => {
        if (playing == 1) {
            playing = 0;
            volume.src = "/svg/mute.svg";
            currentSong.volume = 0;
            volumeBar.value = 0;
        } else {
            playing = 1;
            volume.src = "/svg/volume.svg";
            currentSong.volume = currentVolume;
            volumeBar.value = currentVolume * 100;
        }
    })
}

getFolders();
main();