import { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import config from '../config';

interface Song {
    id?: number | null;
    title: string;
    mood: string;
    previewUrl: string;
    coverUrl: string;
    artist?: string;
}

const LikedSongs = () => {
    const [likedSongs, setLikedSongs] = useState<Song[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { playSong } = usePlayer();

    useEffect(() => {
        fetch(`${config.API_URL}/api/liked`)
            .then(res => res.json())
            .then((data: Song[]) => {
                setLikedSongs(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error fetching liked songs:", err);
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="space-y-10 animate-fade-in">
            <section className="space-y-6">
                <h1 className="text-4xl font-bold text-white tracking-tight">Liked Songs</h1>
                <p className="text-text-secondary">Your favorite tracks</p>
            </section>

            {isLoading ? (
                <section>
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </section>
            ) : likedSongs.length > 0 ? (
                <section>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {likedSongs.map((song, index) => (
                            <div
                                key={index}
                                className="group relative bg-surfaceHighlight/50 hover:bg-surfaceHighlight rounded-lg p-4 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                                onClick={() => playSong(song, likedSongs)}
                            >
                                <div className="w-full aspect-square rounded-md mb-4 shadow-lg group-hover:shadow-xl transition-shadow relative overflow-hidden">
                                    {song.coverUrl ? (
                                        <img
                                            src={song.coverUrl}
                                            alt={song.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-500" />
                                    )}
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                    {song.previewUrl && (
                                        <button
                                            className="absolute bottom-2 right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/90 hover:scale-110"
                                        >
                                            <Play className="w-6 h-6 text-white fill-current ml-1" />
                                        </button>
                                    )}
                                </div>
                                <h3 className="text-white font-semibold truncate text-sm">{song.title}</h3>
                                <p className="text-xs text-text-secondary line-clamp-2 mt-1">{song.artist || 'Unknown Artist'}</p>
                            </div>
                        ))}
                    </div>
                </section>
            ) : (
                <section className="text-center py-12">
                    <p className="text-text-secondary text-lg">No liked songs yet. Start liking songs to build your collection!</p>
                </section>
            )}
        </div>
    );
};

export default LikedSongs;
