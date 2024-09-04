document.addEventListener("DOMContentLoaded", function() {
    const blackScreen = document.createElement("div");
    blackScreen.className = "black-screen";
    blackScreen.textContent = "Нажмите, чтобы продолжить";
    document.body.appendChild(blackScreen);

    const musicIcon = document.createElement("div");
    musicIcon.className = "music-icon hidden";
    musicIcon.innerHTML = "&#9835;";
    document.body.appendChild(musicIcon);

    const audio = new Audio();
    const tracks = [
        { src: "music/Anguish-Gulyayu.mp3", color: '#FF5733' },
        { src: "music/Anguish-Navsegda.mp3", color: '#33FF57' }
    ];

    let currentTrackIndex = Math.floor(Math.random() * tracks.length);
    audio.src = tracks[currentTrackIndex].src;
    audio.loop = false;
    audio.volume = 0.15;

    function playTrack() {
        audio.play().catch(error => {
            console.error("Ошибка воспроизведения трека:", error);
        });
        dispatchTrackChangeEvent();
    }

    function pauseTrack() {
        audio.pause();
    }

    function togglePlayPause() {
        if (audio.paused) {
            playTrack();
            musicIcon.classList.add("playing");
        } else {
            pauseTrack();
            musicIcon.classList.remove("playing");
        }
    }

    function dispatchTrackChangeEvent() {
        const event = new CustomEvent('trackChange', { detail: { color: tracks[currentTrackIndex].color } });
        document.dispatchEvent(event);
    }

    musicIcon.addEventListener("click", () => {
        togglePlayPause();
    });

    blackScreen.addEventListener("click", () => {
        blackScreen.classList.add("hidden");
        musicIcon.classList.remove("hidden");
        playTrack();
    });

    audio.addEventListener("ended", () => {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        audio.src = tracks[currentTrackIndex].src;
        dispatchTrackChangeEvent();
        playTrack();
    });
});
