document.addEventListener('DOMContentLoaded', ()=> {
  const API_BASE = ''; // same origin

  // Get references to existing elements
  const moodBtns = document.querySelectorAll('.mood-btn');
  const currentMoodEl = document.getElementById('currentMood');
  const moodTopSongEl = document.getElementById('moodTopSong');
  const suggestionGrid = document.getElementById('suggestionGrid');
  const ctaPlayBtn = document.getElementById('ctaPlay');

  const miniPlayer = document.getElementById('miniPlayer');
  const miniTitle = document.getElementById('miniTitle');
  const miniArtist = document.getElementById('miniArtist');
  const miniCover = document.getElementById('miniCover');
  const miniAudio = document.getElementById('miniAudio');
  const miniPlay = document.getElementById('miniPlay');

  // Track mood play in database
  async function trackMoodPlay(moodType, songTitle = null) {
    try {
      const sessionId = localStorage.getItem('mindmelody_session_id') ||
                       (localStorage.setItem('mindmelody_session_id', Date.now() + '-' + Math.random().toString(36).substr(2, 9)), localStorage.getItem('mindmelody_session_id'));

      await fetch(`${API_BASE}/api/moods/track-play`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moodType, songTitle, sessionId })
      });
    } catch(e) {
      console.warn('Failed to track mood play:', e);
    }
  }

  async function getSongsByMood(mood){
    try {
      const resp = await fetch(`${API_BASE}/api/songs/${encodeURIComponent(mood)}`);
      if (!resp.ok) throw new Error('no songs');
      const data = await resp.json();
      const arr = Array.isArray(data.songs) ? data.songs : (Array.isArray(data) ? data : []);
      return arr.map(it => (typeof it === 'string') ? { title: it } : it);
    } catch(e){
      // fallback mapping
      const local = {
        Happy:[{title:'Happy — Pharrell Williams', preview:'/assets/previews/happy.mp3', cover:'/assets/covers/happy.jpg'}],
        Sad:[{title:'Someone Like You — Adele', preview:'/assets/previews/someone-like-you.mp3', cover:'/assets/covers/adele.jpg'}],
        Angry:[{title:'Break Stuff — Limp Bizkit', preview:'/assets/previews/break-stuff.mp3', cover:'/assets/covers/limp.jpg'}],
        Relaxed:[{title:'Weightless — Marconi Union', preview:'/assets/previews/weightless.mp3', cover:'/assets/covers/marconi.jpg'}],
        Excited:[{title:"Can't Stop the Feeling — Justin Timberlake", preview:'/assets/previews/cant-stop-the-feeling.mp3', cover:'/assets/covers/justin.jpg'}],
        Energetic:[{title:'Blinding Lights — The Weeknd', preview:'/assets/previews/blinding-lights.mp3', cover:'/assets/covers/weeknd.jpg'}],
        Romantic:[{title:'Perfect — Ed Sheeran', preview:'/assets/previews/perfect.mp3', cover:'/assets/covers/ed-sheeran.jpg'}],
        Night:[{title:'Night Changes — One Direction', preview:'/assets/previews/night-changes.mp3', cover:'/assets/covers/one-direction.jpg'}]
      };
      return local[mood] || [];
    }
  }

  async function addMood(moodType, songRecommendation, preview='', cover=''){
    try {
      const resp = await fetch(`${API_BASE}/api/moods`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ moodType, songRecommendation, preview, cover })
      });
      const data = await resp.json().catch(()=>null);
      loadMoods();
      return data;
    } catch(e){
      console.error('addMood failed', e);
    }
  }

  function createSongCard(song, mood){
    const card = document.createElement('div');
    card.className = 'song-card';
    card.innerHTML = `
      <div class="song-art" style="background: linear-gradient(135deg, var(--neon1), var(--neon2))"></div>
      <div>
        <div class="song-title">${escapeHtml(song.title || song.name || 'Unknown Song')}</div>
        <div class="song-artist">${escapeHtml(song.artist || '')}</div>
      </div>
    `;

    card.addEventListener('click', () => {
      if (song.preview || song.preview_url) {
        showMiniPlayer(song.title || song.name || 'Unknown Song', song.artist || '', song.preview || song.preview_url, song.cover || song.cover_url);
      }
    });

    return card;
  }

  async function loadMoods(){
    // This function is now mainly for API integration if needed
    // The main mood functionality is handled by the emoji buttons
    console.log('Mood system initialized');
  }

  function showMiniPlayer(title, artist, previewUrl, coverUrl){
    if (!miniPlayer) return;
    miniTitle.textContent = title || 'No song';
    miniArtist.textContent = artist || '';
    if (miniCover) miniCover.src = coverUrl || '';
    if (previewUrl){
      miniAudio.src = previewUrl;
      try{ miniAudio.load(); }catch(e){}
      miniPlay.disabled = false; miniPlay.textContent='▶';
    } else {
      miniAudio.removeAttribute('src');
      miniPlay.disabled = true; miniPlay.textContent='▶';
    }

    miniPlayer.classList.remove('d-none');
    miniPlayer.classList.add('active');

    // Update current mood display
    if (currentMoodEl && title !== 'No song') {
      const moodFromTitle = title.split(' — ')[0];
      if (moodFromTitle) currentMoodEl.textContent = moodFromTitle;
    }
  }

  // ensure when mini-player is closed/paused we optionally remove active state
  if (miniAudio) {
    miniAudio.addEventListener('pause', () => {
      miniPlay.textContent = '▶';
    });
    miniAudio.addEventListener('ended', () => {
      miniPlay.textContent = '▶';
    });
  }

  // Mood button click handler
  moodBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const mood = btn.dataset.mood;
      if (!mood) return;

      // Update UI
      moodBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      if (currentMoodEl) currentMoodEl.textContent = mood;

      // Track mood play
      await trackMoodPlay(mood);

      // Get songs for this mood
      const songs = await getSongsByMood(mood);
      const first = songs && songs[0] ? songs[0] : null;

      // Update suggestion grid
      if (suggestionGrid) {
        suggestionGrid.innerHTML = '';
        if (songs && songs.length > 0) {
          songs.forEach(song => {
            const card = createSongCard(song, mood);
            suggestionGrid.appendChild(card);
          });
        }
      }

      // Update top song display
      if (moodTopSongEl) {
        moodTopSongEl.textContent = first ? `Top suggestion: ${first.title || first.name || 'Unknown'}` : 'No suggestions available';
      }

      // Show mini player with first song if available
      if (first) {
        showMiniPlayer(
          first.title || first.name || `${mood} Mix`,
          first.artist || '',
          first.preview || first.preview_url || '',
          first.cover || first.cover_url || ''
        );
      }
    });
  });

  // --- new: POST-based lookup with fallback to GET mapper ---
  async function postSongsForMood(mood) {
    try {
      const resp = await fetch(`${API_BASE || ''}/api/songs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood })
      });
      if (!resp.ok) throw new Error('POST /api/songs failed');
      const data = await resp.json().catch(()=>null);
      // normalize to array of song objects
      let arr = [];
      if (Array.isArray(data)) arr = data;
      else if (Array.isArray(data.songs)) arr = data.songs;
      else if (data && (data.song || data.title)) arr = [data];
      // convert strings to objects
      arr = arr.map(it => typeof it === 'string' ? { title: it } : it);
      if (arr.length === 0) {
        // fallback to GET-style local mapper
        return await getSongsByMood(mood);
      }
      return arr;
    } catch (err) {
      console.warn('postSongsForMood failed, falling back:', err);
      return await getSongsByMood(mood);
    }
  }

  // hover and active state helpers for emoji buttons
  function attachEmojiInteractivity(container) {
    // hover visuals
    container.addEventListener('mouseover', (ev) => {
      const b = ev.target.closest('.emoji-btn, .mood-btn');
      if (b) b.classList.add('hover');
    });
    container.addEventListener('mouseout', (ev) => {
      const b = ev.target.closest('.emoji-btn, .mood-btn');
      if (b) b.classList.remove('hover');
    });

    // click (delegated) — uses POST endpoint first
    container.addEventListener('click', async (ev) => {
      const btn = ev.target.closest('.emoji-btn, .mood-btn');
      if (!btn) return;
      const mood = btn.dataset.mood || btn.getAttribute('data-mood') || btn.textContent.trim();

      // active toggle
      document.querySelectorAll('.emoji-btn.selected, .mood-btn.selected').forEach(x => x.classList.remove('selected'));
      btn.classList.add('selected');

      // small UX feedback
      btn.classList.add('loading');
      const songs = await postSongsForMood(mood);
      btn.classList.remove('loading');

      const first = Array.isArray(songs) && songs.length ? songs[0] : null;
      const title = first && (first.title || first.name) ? (first.title || first.name) : `${mood} — No song`;
      const artist = first && (first.artist) ? first.artist : '';
      const preview = first && (first.preview || first.preview_url) ? (first.preview || first.preview_url) : '';
      const cover = first && (first.cover || first.cover_url) ? (first.cover || first.cover_url) : '';

      // Update current mood display
      if (currentMoodEl) currentMoodEl.textContent = mood;

      // Update top song display
      if (moodTopSongEl) {
        moodTopSongEl.textContent = first ? `Top suggestion: ${title}` : 'No suggestions available';
      }

      // Update suggestion grid
      if (suggestionGrid) {
        suggestionGrid.innerHTML = '';
        if (songs && songs.length > 0) {
          songs.forEach(song => {
            const card = createSongCard(song, mood);
            suggestionGrid.appendChild(card);
          });
        }
      }

      // persist last selection for player page
      const payload = { title, artist, preview, cover, mood, ts: Date.now() };
      try { localStorage.setItem('mindmelody_last_song', JSON.stringify(payload)); } catch(e){}

      // add to moods store (POST)
      await addMood(mood, title, preview, cover);

      // update mini-player and show "Open Player" CTA
      showMiniPlayer(title, artist, preview, cover);

      // create or update Open Player button
      let openBtn = document.getElementById('openPlayerBtn');
      if (!openBtn) {
        openBtn = document.createElement('button');
        openBtn.id = 'openPlayerBtn';
        openBtn.className = 'btn btn-sm btn-outline-light ms-2';
        openBtn.textContent = 'Open Player';
        const controls = miniPlayer.querySelector('.mini-controls') || miniPlayer;
        controls.appendChild(openBtn);
        openBtn.addEventListener('click', () => {
          // pass via query params when safe, fallback to localStorage
          const params = new URLSearchParams();
          params.set('song', title);
          if (artist) params.set('artist', artist);
          if (preview) params.set('preview', preview);
          if (cover) params.set('cover', cover);
          if (mood) params.set('mood', mood);

          const url = 'player.html?' + params.toString();
          window.location.href = url;
        });
      } else {
        // update existing button text and click handler
        openBtn.textContent = 'Open Player';
        openBtn.onclick = () => {
          const params = new URLSearchParams();
          params.set('song', title);
          if (artist) params.set('artist', artist);
          if (preview) params.set('preview', preview);
          if (cover) params.set('cover', cover);
          if (mood) params.set('mood', mood);

          const url = 'player.html?' + params.toString();
          window.location.href = url;
        };
      }
    });
  }

  // Initialize on page load
  loadMoods();

  // Set up emoji button event delegation for the emoji grid
  const emojiGrid = document.getElementById('emojiGrid') || document.querySelector('.emoji-grid');
  if (emojiGrid) {
    attachEmojiInteractivity(emojiGrid);
  }

});