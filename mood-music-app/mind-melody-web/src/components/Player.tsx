import { Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX, Repeat, Repeat1, Shuffle, Heart, Mic2, ListMusic } from 'lucide-react';
import DeviceButton from './DeviceButton';
import QueueList from './QueueList';
import LyricsView from './LyricsView';
import { usePlayer } from '../context/PlayerContext';
import { useToast } from '../context/ToastContext';
import { useState } from 'react';

const Player = () => {
    const [isQueueOpen, setIsQueueOpen] = useState(false);
    const { showToast } = useToast();
    const {
        currentSong,
        isPlaying,
        togglePlay,
        progress,
        currentTime,
        duration,
        seek,
        toggleLike,
        nextSong,
        prevSong,
        likedSongs,
        isShuffleOn,
        loopMode,
        toggleShuffle,
        toggleLoop,
        volume,
        setVolume,
        isMuted,
        toggleMute
    } = usePlayer();

    const [isLyricsOpen, setIsLyricsOpen] = useState(false);

    const formatTime = (time: number) => {
        if (!time) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = (parseFloat(e.target.value) / 100) * duration;
        seek(time);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value));
    };

    if (!currentSong) return null;

    const isLiked = currentSong && likedSongs.includes(currentSong.previewUrl);

    // Determine Loop Icon
    const getLoopIcon = () => {
        if (loopMode === 'one') return <Repeat1 className="w-4 h-4" />;
        return <Repeat className="w-4 h-4" />;
    };

    // Determine Volume Icon
    const getVolumeIcon = () => {
        if (isMuted || volume === 0) return <VolumeX className="w-5 h-5" />;
        if (volume < 0.5) return <Volume1 className="w-5 h-5" />;
        return <Volume2 className="w-5 h-5" />;
    };

    return (
        <div className="h-full bg-black/60 backdrop-blur-xl border-t border-white/5 px-6 flex items-center justify-between z-50">
            {/* Track Info */}
            <div className="flex items-center gap-4 w-[30%] min-w-[180px]">
                <div className="w-14 h-14 rounded-lg bg-surfaceHighlight flex-shrink-0 overflow-hidden shadow-lg">
                    {currentSong.coverUrl ? (
                        <img src={currentSong.coverUrl} alt={currentSong.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 animate-pulse-slow" />
                    )}
                </div>
                <div className="min-w-0">
                    <h4 className="text-white font-medium truncate hover:underline cursor-pointer">{currentSong.title}</h4>
                    <p className="text-xs text-text-secondary hover:text-white cursor-pointer transition-colors">{currentSong.artist || 'Unknown Artist'}</p>
                </div>
                <button
                    onClick={() => {
                        const wasLiked = isLiked;
                        toggleLike(currentSong);
                        showToast(wasLiked ? 'Removed from liked songs' : 'Added to liked songs');
                    }}
                    className={`transition-colors ml-2 ${isLiked ? 'text-accent' : 'text-text-muted hover:text-accent'}`}
                >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-2 w-[40%] max-w-[722px]">
                <div className="flex items-center gap-6">
                    <button
                        onClick={toggleShuffle}
                        className={`transition-colors ${isShuffleOn ? 'text-primary' : 'text-text-secondary hover:text-white'}`}
                        title="Shuffle"
                    >
                        <Shuffle className="w-4 h-4" />
                    </button>
                    <button onClick={prevSong} className="text-text-primary hover:text-white transition-colors">
                        <SkipBack className="w-5 h-5" />
                    </button>
                    <button
                        onClick={togglePlay}
                        className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-white/20"
                    >
                        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>
                    <button onClick={nextSong} className="text-text-primary hover:text-white transition-colors">
                        <SkipForward className="w-5 h-5" />
                    </button>
                    <button
                        onClick={toggleLoop}
                        className={`transition-colors ${loopMode !== 'off' ? 'text-primary' : 'text-text-secondary hover:text-white'}`}
                        title={`Loop: ${loopMode}`}
                    >
                        {getLoopIcon()}
                    </button>
                </div>

                <div className="w-full flex items-center gap-2 text-xs text-text-secondary font-medium">
                    <span>{formatTime(currentTime)}</span>
                    <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden cursor-pointer group relative">
                        <div
                            className="h-full bg-white group-hover:bg-primary transition-colors absolute top-0 left-0"
                            style={{ width: `${progress}%` }}
                        />
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress || 0}
                            onChange={handleSeek}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* Volume & Extras */}
            <div className="flex items-center justify-end gap-3 w-[30%] min-w-[180px] relative">
                <button
                    onClick={() => setIsLyricsOpen(!isLyricsOpen)}
                    className={`transition-colors ${isLyricsOpen ? 'text-primary' : 'text-text-secondary hover:text-white'}`}
                    title="Lyrics"
                >
                    <Mic2 className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setIsQueueOpen(!isQueueOpen)}
                    className={`transition-colors ${isQueueOpen ? 'text-primary' : 'text-text-secondary hover:text-white'}`}
                    title="Queue"
                >
                    <ListMusic className="w-4 h-4" />
                </button>

                <QueueList isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />
                <LyricsView isOpen={isLyricsOpen} onClose={() => setIsLyricsOpen(false)} />

                <DeviceButton />
                <div className="flex items-center gap-2 w-24 group">
                    <button onClick={toggleMute} className="text-text-secondary hover:text-white transition-colors">
                        {getVolumeIcon()}
                    </button>
                    <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden cursor-pointer relative">
                        <div
                            className={`h-full ${isMuted ? 'bg-text-muted' : 'bg-white group-hover:bg-primary'} transition-colors absolute top-0 left-0`}
                            style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                        />
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Player;

