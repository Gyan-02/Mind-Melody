import { Home, Music, Heart, Clock, PlusSquare, Disc } from 'lucide-react';
import { clsx } from 'clsx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import config from '../config';

interface Playlist {
    id: number;
    name: string;
}

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    useEffect(() => {
        // Fetch user playlists
        fetch(`${config.API_URL}/api/playlists?userId=1`)
            .then(res => res.json())
            .then(data => setPlaylists(data))
            .catch(err => console.error("Error fetching playlists in sidebar:", err));
    }, []);

    const createPlaylist = async () => {
        const name = prompt("Enter new playlist name:");
        if (!name) return;

        try {
            const res = await fetch(`${config.API_URL}/api/playlists`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, userId: 1 })
            });
            const newPlaylist = await res.json();
            setPlaylists([...playlists, newPlaylist]);
            navigate(`/playlist/${newPlaylist.id}`);
        } catch (err) {
            console.error("Error creating playlist:", err);
        }
    };

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Disc, label: 'Blend', path: '/blend' },
        { icon: Music, label: 'Library', path: '/library' },
    ];

    return (
        <div className="h-full bg-black/40 backdrop-blur-xl border-r border-white/5 flex flex-col p-6">
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                    <Music className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                    Mind Melody
                </h1>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider px-2 mb-3">Menu</p>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                className={clsx(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                                    isActive
                                        ? "bg-white/10 text-white shadow-inner"
                                        : "text-text-secondary hover:text-white hover:bg-white/5"
                                )}
                            >
                                <item.icon className={clsx("w-5 h-5 transition-colors", isActive ? "text-primary" : "group-hover:text-white")} />
                                <span className="font-medium text-sm">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="space-y-2">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider px-2 mb-3">Your Collection</p>
                    <Link
                        to="/liked"
                        className={clsx(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                            location.pathname === '/liked'
                                ? "bg-white/10 text-white shadow-inner"
                                : "text-text-secondary hover:text-white hover:bg-white/5"
                        )}
                    >
                        <Heart className={clsx("w-5 h-5 transition-colors", location.pathname === '/liked' ? "text-accent fill-current" : "group-hover:text-accent")} />
                        <span className="font-medium text-sm">Liked Songs</span>
                    </Link>
                    <Link
                        to="/recently-played"
                        className={clsx(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                            location.pathname === '/recently-played'
                                ? "bg-white/10 text-white shadow-inner"
                                : "text-text-secondary hover:text-white hover:bg-white/5"
                        )}
                    >
                        <Clock className={clsx("w-5 h-5 transition-colors", location.pathname === '/recently-played' ? "text-primary" : "")} />
                        <span className="font-medium text-sm">Recently Played</span>
                    </Link>
                </div>

                <div className="pt-6 border-t border-white/5 flex-1 flex flex-col min-h-0">
                    <div className="flex items-center justify-between px-2 mb-3">
                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Playlists</p>
                        <PlusSquare
                            onClick={createPlaylist}
                            className="w-4 h-4 text-text-muted hover:text-white cursor-pointer transition-colors"
                        />
                    </div>
                    <div className="space-y-1 overflow-y-auto pr-2 custom-scrollbar flex-1">
                        {playlists.map((playlist) => (
                            <Link
                                key={playlist.id}
                                to={`/playlist/${playlist.id}`}
                                className={clsx(
                                    "block w-full text-left px-3 py-2 text-sm transition-colors truncate rounded-md",
                                    location.pathname === `/playlist/${playlist.id}`
                                        ? "bg-white/10 text-white"
                                        : "text-text-secondary hover:text-white hover:bg-white/5"
                                )}
                            >
                                {playlist.name}
                            </Link>
                        ))}
                        {playlists.length === 0 && (
                            <p className="text-xs text-text-muted px-3 py-2 italic">No playlists yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
