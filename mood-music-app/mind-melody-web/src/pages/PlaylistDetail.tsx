import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Music, Clock, Play } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import config from '../config';

interface Song {
    id: number;
    title: string;
    artist: string;
    mood: string;
    coverUrl: string;
    previewUrl: string;
    duration?: string;
}

interface Playlist {
    id: number;
    name: string;
    songs: Song[];
}

const PlaylistDetail = () => {
    const { id } = useParams();
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const { playSong } = usePlayer();

    useEffect(() => {
        fetch(`${config.API_URL}/api/playlists/${id}`)
            .then(res => res.json())
            .then(data => setPlaylist(data))
            .catch(err => console.error("Error fetching playlist:", err));
    }, [id]);

    if (!playlist) return <div className="p-8 text-white">Loading...</div>;

    return (
        <div className="p-8 pb-32 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-end gap-6">
                <div className="w-52 h-52 bg-gradient-to-br from-gray-700 to-gray-900 shadow-2xl flex items-center justify-center rounded-md">
                    <Music className="w-20 h-20 text-gray-500" />
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-bold uppercase text-white">Playlist</span>
                    <h1 className="text-7xl font-bold text-white mb-4">{playlist.name}</h1>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <span className="font-bold text-white">User</span>
                        <span>•</span>
                        <span>{playlist.songs.length} songs</span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            {playlist.songs.length > 0 && (
                <div className="flex items-center gap-4 py-4">
                    <button
                        onClick={() => playSong(playlist.songs[0])}
                        className="w-14 h-14 bg-primary rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg group"
                    >
                        <Play className="w-7 h-7 text-white fill-current translate-x-0.5" />
                    </button>
                </div>
            )}

            {/* Songs List */}
            <div className="space-y-2">
                <div className="grid grid-cols-[16px_4fr_3fr_1fr] gap-4 px-4 py-2 border-b border-white/10 text-sm text-text-muted uppercase tracking-wider">
                    <span>#</span>
                    <span>Title</span>
                    <span>Album</span>
                    <Clock className="w-4 h-4 justify-self-end" />
                </div>

                {playlist.songs.map((song, index) => (
                    <div
                        key={song.id}
                        onClick={() => playSong(song)}
                        className="grid grid-cols-[16px_4fr_3fr_1fr] gap-4 px-4 py-3 rounded-md hover:bg-white/10 group cursor-pointer items-center transition-colors"
                    >
                        <span className="text-text-muted group-hover:text-white">{index + 1}</span>
                        <div className="flex items-center gap-3">
                            <img src={song.coverUrl || "/api/placeholder/40/40"} alt={song.title} className="w-10 h-10 rounded shadow-md" />
                            <div>
                                <div className="font-medium text-white group-hover:text-primary transition-colors">{song.title}</div>
                                <div className="text-sm text-text-secondary">{song.artist || "Unknown Artist"}</div>
                            </div>
                        </div>
                        <span className="text-sm text-text-secondary hover:text-white transition-colors truncate">
                            Single
                        </span>
                        <span className="text-sm text-text-secondary justify-self-end">
                            3:45
                        </span>
                    </div>
                ))}

                {playlist.songs.length === 0 && (
                    <div className="text-center py-10 text-text-secondary italic">
                        This playlist is empty. Add some songs!
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaylistDetail;
