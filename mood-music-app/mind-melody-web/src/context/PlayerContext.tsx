import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import config from '../config';

export interface Song {
  id?: number | null;
  title: string;
  mood: string;
  previewUrl: string;
  coverUrl: string;
  artist?: string;
}

export type LoopMode = 'off' | 'all' | 'one';

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  likedSongs: string[]; // Store previewUrls of liked songs
  isShuffleOn: boolean;
  loopMode: LoopMode;
  playSong: (song: Song, queue?: Song[]) => void;
  playNext: (song: Song) => void;
  togglePlay: () => void;
  toggleLike: (song: Song) => void;
  toggleShuffle: () => void;
  toggleLoop: () => void;
  nextSong: () => void;
  prevSong: () => void;
  progress: number;
  duration: number;
  currentTime: number;
  seek: (time: number) => void;
  // Added volume controls
  volume: number;
  setVolume: (v: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
  // Queue access
  queue: Song[];
  currentIndex: number;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedSongs, setLikedSongs] = useState<string[]>([]);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [loopMode, setLoopMode] = useState<LoopMode>('off');

  // volume
  const [volume, setVolumeState] = useState(0.66);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<Song[]>([]);
  const currentIndexRef = useRef<number>(-1);

  // refs for loop/shuffle so audio handlers see latest values
  const loopRef = useRef<LoopMode>(loopMode);
  const shuffleRef = useRef<boolean>(isShuffleOn);

  // update refs whenever state changes
  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => { loopRef.current = loopMode; }, [loopMode]);
  useEffect(() => { shuffleRef.current = isShuffleOn; }, [isShuffleOn]);

  // Fetch liked songs on mount
  useEffect(() => {
    fetch(`${config.API_URL}/api/liked`)
      .then(res => res.json())
      .then((data: Song[]) => {
        setLikedSongs(data.map(s => s.previewUrl));
      })
      .catch(err => console.error("Error fetching liked songs:", err));
  }, []);

  // Initialize audio element and handlers
  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;

    // set initial volume/mute
    audio.volume = volume;
    audio.muted = isMuted;

    const updateProgress = () => {
      if (!audio) return;
      if (audio.duration && !Number.isNaN(audio.duration)) {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);

      // Use refs to get latest loop/shuffle/queue/index
      const currentLoopMode = loopRef.current;
      const shuffleState = shuffleRef.current;
      const q = queueRef.current;
      const idx = currentIndexRef.current;

      // 1. Handle Loop One
      if (currentLoopMode === 'one' && currentSong) {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
        }
        return;
      }

      // 2. Handle Shuffle
      if (shuffleState && q.length > 0) {
        // Play random song (avoid the same index if there are multiple songs)
        if (q.length === 1) {
          // If only 1 song and not loop one, we still replay it if loop all? 
          // Or just stop? Usually shuffle on 1 song repeats it if loop is on.
          // Let's just replay it.
          playSongInternal(q[0], 0);
        } else {
          let randomIndex = Math.floor(Math.random() * q.length);
          // avoid immediate repeat if possible
          if (randomIndex === idx && q.length > 1) {
            randomIndex = (randomIndex + 1) % q.length;
          }
          playSongInternal(q[randomIndex], randomIndex);
        }
        return;
      }

      // 3. Normal Next
      if (idx < q.length - 1) {
        const nextIndex = idx + 1;
        playSongInternal(q[nextIndex], nextIndex);
      } else {
        // End of queue
        if (currentLoopMode === 'all' && q.length > 0) {
          // Loop back to start
          playSongInternal(q[0], 0);
        } else {
          // Stop
          setIsPlaying(false);
        }
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // mount only

  // Sync volume/mute with audio element
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted;
  }, [isMuted]);

  // playSongInternal ensures refs/states are kept consistent
  const playSongInternal = (song: Song, index: number) => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    // update refs/state
    queueRef.current = queue; // ensure it's current (in case playSong set it)
    currentIndexRef.current = index;

    audio.src = song.previewUrl;
    audio.load();

    // attempt playback
    audio.play()
      .then(() => {
        setIsPlaying(true);
        setCurrentSong(song);
        setCurrentIndex(index);
        // Track recently played
        fetch(`${config.API_URL}/api/recently-played`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(song)
        }).catch(err => console.error("Error tracking play:", err));
      })
      .catch(e => {
        console.error("Playback failed", e);
        // still update current song/index so UI is consistent
        setCurrentSong(song);
        setCurrentIndex(index);
      });
  };

  // Public playSong: synchronously update refs so internal handlers see them
  const playSong = (song: Song, newQueue?: Song[]) => {
    if (newQueue) {
      setQueue(newQueue);
      queueRef.current = newQueue; // immediate sync to ref to avoid race
      const index = newQueue.findIndex(s => s.previewUrl === song.previewUrl);
      const idx = index !== -1 ? index : 0;
      playSongInternal(song, idx);
    } else {
      setQueue([song]);
      queueRef.current = [song];
      playSongInternal(song, 0);
    }
  };

  //for queue
  // Insert a song to play next (right after currentIndexRef.current)
  const playNext = (song: Song) => {
    // If no audio element / no queue currently, just set queue to [song] and play
    const q = queueRef.current ? [...queueRef.current] : [];

    // If nothing is currently playing, immediately play this song
    if (currentIndexRef.current === -1 || !currentSong) {
      // Make this the single-item queue (or append then play)
      const newQueue = [song, ...q.filter(s => s.previewUrl !== song.previewUrl)];
      setQueue(newQueue);
      queueRef.current = newQueue;
      // Play immediately
      playSongInternal(song, 0);
      return;
    }

    // Remove existing occurrences of this song in the queue (we will re-insert next)
    const existingIndex = q.findIndex(s => s.previewUrl === song.previewUrl);
    if (existingIndex !== -1) {
      q.splice(existingIndex, 1);
      // If the removed index was before the insert point, the insert index shifts -1
      if (existingIndex <= currentIndexRef.current) {
        // adjust currentIndexRef and currentIndex state to reflect removal before current
        const newIdx = currentIndexRef.current - 1;
        currentIndexRef.current = newIdx;
        setCurrentIndex(newIdx);
      }
    }

    // Compute insertion index: immediately after current index
    const insertAt = Math.max(0, currentIndexRef.current + 1);

    // Insert the song into the queue copy
    q.splice(insertAt, 0, song);

    // Commit queue state + refs
    setQueue(q);
    queueRef.current = q;

    // No automatic play switch: it will play when current track ends or controller presses Next.
    // If you want to auto-skip to this song immediately, uncomment below:
    // playSongInternal(song, insertAt);
  };


  const togglePlay = () => {
    if (!audioRef.current || !currentSong) return;
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const toggleLike = (song: Song) => {
    const isLiked = likedSongs.includes(song.previewUrl);

    if (isLiked) {
      // Unlike
      fetch(`${config.API_URL}/api/liked?previewUrl=${encodeURIComponent(song.previewUrl)}`, {
        method: 'DELETE'
      })
        .then(() => {
          setLikedSongs(prev => prev.filter(url => url !== song.previewUrl));
        })
        .catch(err => console.error("Error unliking song:", err));
    } else {
      // Like
      fetch(`${config.API_URL}/api/liked`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(song)
      })
        .then(res => res.json())
        .then(() => {
          setLikedSongs(prev => [...prev, song.previewUrl]);
        })
        .catch(err => console.error("Error liking song:", err));
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
      if (audioRef.current.duration && audioRef.current.duration > 0) {
        setProgress((time / audioRef.current.duration) * 100);
      }
    }
  };

  const nextSong = () => {
    const q = queueRef.current;
    const idx = currentIndexRef.current;

    if (isShuffleOn && q.length > 0) {
      if (q.length === 1) {
        playSongInternal(q[0], 0);
      } else {
        let randomIndex = Math.floor(Math.random() * q.length);
        if (randomIndex === idx) randomIndex = (randomIndex + 1) % q.length;
        playSongInternal(q[randomIndex], randomIndex);
      }
      return;
    }

    if (idx < q.length - 1) {
      const nextIndex = idx + 1;
      playSongInternal(q[nextIndex], nextIndex);
    } else {
      // end of queue
      if (loopMode === 'all' && q.length > 0) {
        playSongInternal(q[0], 0);
      } else {
        setIsPlaying(false);
      }
    }
  };

  const prevSong = () => {
    const idx = currentIndexRef.current;
    const q = queueRef.current;
    if (idx > 0) {
      const prevIndex = idx - 1;
      playSongInternal(q[prevIndex], prevIndex);
    } else {
      if (audioRef.current) audioRef.current.currentTime = 0;
    }
  };

  const toggleShuffle = () => {
    setIsShuffleOn(prev => {
      const next = !prev;
      shuffleRef.current = next;
      return next;
    });
  };

  const toggleLoop = () => {
    setLoopMode(prev => {
      let next: LoopMode = 'off';
      if (prev === 'off') next = 'all';
      else if (prev === 'all') next = 'one';
      else next = 'off';

      loopRef.current = next;
      return next;
    });
  };

  // Volume controls (exposed)
  const setVolume = (v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    if (audioRef.current) audioRef.current.volume = clamped;
    if (clamped > 0 && isMuted) setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(m => {
      const next = !m;
      if (audioRef.current) audioRef.current.muted = next;
      return next;
    });
  };

  // Keep refs synced when external code sets queue/currentIndex via setState
  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);

  return (
    <PlayerContext.Provider value={{
      currentSong,
      isPlaying,
      likedSongs,
      isShuffleOn,
      loopMode,
      playSong,
      playNext,
      togglePlay,
      toggleLike,
      toggleShuffle,
      toggleLoop,
      nextSong,
      prevSong,
      progress,
      duration,
      currentTime,
      seek,
      volume,
      setVolume,
      isMuted,
      toggleMute,
      queue,
      currentIndex
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

