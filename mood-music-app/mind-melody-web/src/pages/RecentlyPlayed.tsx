import { useState, useEffect } from 'react';
import { Play, Clock } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import config from '../config';

interface Song {
    id?: number | null;
    title: string;
    mood: string;
    previewUrl: string;
    coverUrl: string;
    artist?: string;
    playedAt?: string;
}

const RecentlyPlayed = () => {
    const [recentSongs, setRecentSongs] = useState<Song[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { playSong, currentSong, isPlaying } = usePlayer();

    useEffect(() => {
        fetch(`${config.API_URL}/api/recently-played`)
            .then(res => res.json())
            .then((data: Song[]) => {
                setRecentSongs(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error fetching recently played:", err);
                setIsLoading(false);
            });
    }, []);

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="space-y-10 animate-fade-in">
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <Clock className="w-10 h-10 text-primary" />
                    <h1 className="text-4xl font-bold text-white tracking-tight">Recently Played</h1>
                </div>
                <p className="text-text-secondary">Your listening history</p>
            </section>

            {isLoading ? (
                <section>
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </section>
            ) : recentSongs.length > 0 ? (
                <section>
                    <div className="space-y-2">
                        {recentSongs.map((song, index) => {
                            const isCurrentSong = currentSong?.previewUrl === song.previewUrl;
                            return (
                                <div
                                    key={index}
                                    className={`group flex items-center gap-4 p-3 rounded-lg hover:bg-surfaceHighlight/50 transition-all cursor-pointer ${isCurrentSong ? 'bg-surfaceHighlight/30' : ''}`}
                                    onClick={() => playSong(song, recentSongs)}
                                >
                                    <div className="flex-shrink-0 w-8 text-center text-text-secondary text-sm">
                                        {isCurrentSong && isPlaying ? (
                                            <div className="flex gap-0.5 items-center justify-center">
                                                <div className="w-0.5 h-3 bg-primary animate-pulse"></div>
                                                <div className="w-0.5 h-4 bg-primary animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="w-0.5 h-3 bg-primary animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                            </div>
                                        ) : (
                                            <span>{index + 1}</span>
                                        )}
                                    </div>

                                    <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 shadow-md">
                                        {song.coverUrl ? (
                                            <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-500" />
                                        )}
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                        <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                                                <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                                            </div>
                                        </button>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-medium truncate ${isCurrentSong ? 'text-primary' : 'text-white'}`}>
                                            {song.title}
                                        </h3>
                                        <p className="text-sm text-text-secondary truncate">{song.artist || 'Unknown Artist'}</p>
                                    </div>

                                    <div className="text-sm text-text-muted">
                                        {formatDate(song.playedAt)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            ) : (
                <section className="text-center py-12">
                    <p className="text-text-secondary text-lg">No recently played songs yet. Start listening to build your history!</p>
                </section>
            )}
        </div>
    );
};

export default RecentlyPlayed;
