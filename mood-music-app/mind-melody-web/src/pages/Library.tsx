import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Plus, Play } from 'lucide-react';
import config from '../config';

interface Playlist {
    id: number;
    name: string;
    songs: any[];
}

const Library = () => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${config.API_URL}/api/playlists?userId=1`)
            .then(res => res.json())
            .then(data => setPlaylists(data))
            .catch(err => console.error("Error fetching playlists:", err));
    }, []);

    const createPlaylist = async () => {
        const name = prompt("Enter playlist name:");
        if (!name) return;

        try {
            const res = await fetch(`${config.API_URL}/api/playlists`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, userId: 1 })
            });
            const newPlaylist = await res.json();
            setPlaylists([...playlists, newPlaylist]);
        } catch (err) {
            console.error("Error creating playlist:", err);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold text-white">Your Library</h1>
                <button
                    onClick={createPlaylist}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/80 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Create Playlist
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {/* Liked Songs Card */}
                <div
                    onClick={() => navigate('/liked')}
                    className="group relative bg-gradient-to-br from-violet-800 to-fuchsia-800 rounded-md p-4 aspect-square flex flex-col justify-end cursor-pointer hover:scale-105 transition-transform duration-200"
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Music className="w-16 h-16 text-white/40 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">Liked Songs</h3>
                        <p className="text-sm text-white/70">Auto-playlist</p>
                    </div>
                </div>

                {/* User Playlists */}
                {playlists.map((playlist) => (
                    <div
                        key={playlist.id}
                        onClick={() => navigate(`/playlist/${playlist.id}`)}
                        className="group bg-surfaceHighlight/30 hover:bg-surfaceHighlight rounded-md p-4 flex flex-col gap-4 cursor-pointer transition-all duration-200"
                    >
                        <div className="relative aspect-square bg-surfaceHighlight rounded-md shadow-lg flex items-center justify-center overflow-hidden">
                            <Music className="w-12 h-12 text-text-muted" />
                            <div className="absolute right-2 bottom-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                                <Play className="w-5 h-5 text-white fill-current translate-x-0.5" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-white truncate">{playlist.name}</h3>
                            <p className="text-sm text-text-secondary">By You</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Library;
