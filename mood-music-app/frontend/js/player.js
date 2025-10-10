// new file
(function(){
    // demo preview map (replace with real hosted previews if available)
    const demoPreviews = {
        "Happy — Pharrell Williams": "",
        "Someone Like You — Adele": "",
        "Break Stuff — Limp Bizkit": "",
        "Weightless — Marconi Union": "",
        "Can't Stop the Feeling — Justin Timberlake": ""
    };

    function qs(name){ const u=new URLSearchParams(location.search); return u.get(name); }
    const song = qs('song') || 'No song selected';

    document.addEventListener('DOMContentLoaded', ()=>{
        const titleEl = document.createElement('div'); titleEl.style.padding='20px';
        titleEl.innerHTML = `<h2>${song}</h2><p>Use the mini-player on homepage to preview audio.</p>`;
        document.body.prepend(titleEl);
    });

    const params = new URLSearchParams(window.location.search);
    const playerTitle = document.getElementById('playerTitle');
    const playerArtist = document.getElementById('playerArtist');
    const playerCover = document.getElementById('playerCover');
    const playBtn = document.getElementById('playBtn');
    const audio = document.getElementById('playerAudio');
    const progressFill = document.getElementById('progressFill');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');

    playerTitle.textContent = song;
    playerArtist.textContent = 'Mind Melody';

    const preview = demoPreviews[song] || '';
    if (preview) audio.src = preview;
    else audio.removeAttribute('src');

    playerCover.src = ''; // optional: set cover URL if available

    playBtn.addEventListener('click', () => {
        if (!audio.src) return;
        if (audio.paused) {
            audio.play();
            playBtn.textContent = '⏸';
        } else {
            audio.pause();
            playBtn.textContent = '▶';
        }
    });

    audio.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const pct = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = pct + '%';
            currentTimeEl.textContent = formatTime(audio.currentTime);
        }
    });

    audio.addEventListener('ended', () => {
        playBtn.textContent = '▶';
    });

    function formatTime(sec){
        if (!isFinite(sec)) return '0:00';
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }
})();