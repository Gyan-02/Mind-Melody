import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Sparkles, Play, Clock } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import config from '../config';

interface BlendSong {
    id: number;
    song: {
        id: number;
        title: string;
        artist: string;
        mood: string;
        coverUrl: string;
        previewUrl: string;
    };
    addedBy: {
        id: number;
        name: string;
        avatarUrl: string;
    };
}

interface Blend {
    id: number;
    name: string;
    matchScore: number;
    user1: { name: string; avatarUrl: string };
    user2: { name: string; avatarUrl: string };
    blendSongs: BlendSong[];
}

const BlendDetail = () => {
    const { id } = useParams();
    const [blend, setBlend] = useState<Blend | null>(null);
    const { playSong } = usePlayer();

    useEffect(() => {
        fetch(`${config.API_URL}/api/blends/${id}`)
            .then(res => res.json())
            .then(data => setBlend(data))
            .catch(err => console.error("Error fetching blend:", err));
    }, [id]);

    if (!blend) return <div className="p-8 text-white">Loading...</div>;

    return (
        <div className="p-8 pb-32 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-end gap-6">
                <div className="relative w-52 h-52 shadow-2xl flex items-center justify-center rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                    <div className="absolute inset-0 flex items-center justify-center opacity-50 mix-blend-overlay">
                        <Sparkles className="w-24 h-24 text-white" />
                    </div>
                    {/* Overlapping Avatars Concept */}
                    <div className="absolute left-4 w-28 h-28 rounded-full border-4 border-black overflow-hidden bg-gray-800">
                        {blend.user1.avatarUrl ? <img src={blend.user1.avatarUrl} alt={blend.user1.name} /> : <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white">{blend.user1.name[0]}</div>}
                    </div>
                    <div className="absolute right-4 w-28 h-28 rounded-full border-4 border-black overflow-hidden bg-gray-700 translate-y-4">
                        {blend.user2?.avatarUrl ? <img src={blend.user2.avatarUrl} alt={blend.user2?.name} /> : <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white">{blend.user2?.name?.[0] || "?"}</div>}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <span className="text-sm font-bold uppercase text-white">Blend</span>
                    <h1 className="text-7xl font-bold text-white mb-2">{blend.name}</h1>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <span className="text-green-400 font-bold bg-green-400/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> {blend.matchScore}% Match
                        </span>
                        <span>•</span>
                        <span>{blend.blendSongs.length} songs</span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 py-4">
                <button
                    onClick={() => {
                        if (blend.blendSongs.length > 0) playSong(blend.blendSongs[0].song);
                    }}
                    className="w-14 h-14 bg-primary rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg group"
                >
                    <Play className="w-7 h-7 text-white fill-current translate-x-0.5" />
                </button>
            </div>

            {/* Songs List */}
            <div className="space-y-2">
                <div className="grid grid-cols-[16px_4fr_3fr_2fr_1fr] gap-4 px-4 py-2 border-b border-white/10 text-sm text-text-muted uppercase tracking-wider">
                    <span>#</span>
                    <span>Title</span>
                    <span>Album</span>
                    <span>Added By</span>
                    <Clock className="w-4 h-4 justify-self-end" />
                </div>

                {blend.blendSongs.map((item, index) => (
                    <div
                        key={item.id}
                        onClick={() => playSong(item.song)}
                        className="grid grid-cols-[16px_4fr_3fr_2fr_1fr] gap-4 px-4 py-3 rounded-md hover:bg-white/10 group cursor-pointer items-center transition-colors"
                    >
                        <span className="text-text-muted group-hover:text-white">{index + 1}</span>
                        <div className="flex items-center gap-3">
                            <img src={item.song.coverUrl || "/api/placeholder/40/40"} alt={item.song.title} className="w-10 h-10 rounded shadow-md" />
                            <div>
                                <div className="font-medium text-white group-hover:text-primary transition-colors">{item.song.title}</div>
                                <div className="text-sm text-text-secondary">{item.song.artist || "Unknown Artist"}</div>
                            </div>
                        </div>
                        <span className="text-sm text-text-secondary truncate">Single</span>

                        {/* Added By User */}
                        <div className="flex items-center gap-2">
                            {item.addedBy.avatarUrl ? (
                                <img src={item.addedBy.avatarUrl} alt={item.addedBy.name} className="w-6 h-6 rounded-full" />
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs text-white font-bold">
                                    {item.addedBy.name[0]}
                                </div>
                            )}
                            <span className="text-sm text-text-secondary group-hover:text-white">{item.addedBy.name}</span>
                        </div>

                        <span className="text-sm text-text-secondary justify-self-end">
                            3:45
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlendDetail;
