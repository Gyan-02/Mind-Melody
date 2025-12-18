import { useState, useEffect } from 'react';
import { X, Plus, Music } from 'lucide-react';
import config from '../config';

interface Playlist {
    id: number;
    name: string;
}

interface AddToPlaylistModalProps {
    isOpen: boolean;
    onClose: () => void;
    song: any;
}

const AddToPlaylistModal = ({ isOpen, onClose, song }: AddToPlaylistModalProps) => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [newPlaylistName, setNewPlaylistName] = useState("");

    useEffect(() => {
        if (isOpen) {
            fetch(`${config.API_URL}/api/playlists?userId=1`)
                .then(res => res.json())
                .then(data => setPlaylists(data))
                .catch(err => console.error("Error fetching playlists:", err));
        }
    }, [isOpen]);

    const createPlaylist = async () => {
        if (!newPlaylistName.trim()) return;
        try {
            const res = await fetch(`${config.API_URL}/api/playlists`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newPlaylistName, userId: 1 })
            });
            const newPlaylist = await res.json();
            setPlaylists([...playlists, newPlaylist]);
            setNewPlaylistName("");
            // Optionally auto-add to this new playlist
            addToPlaylist(newPlaylist.id);
        } catch (err) {
            console.error("Error creating playlist:", err);
        }
    };

    const addToPlaylist = async (playlistId: number) => {
        try {
            await fetch(`${config.API_URL}/api/playlists/${playlistId}/songs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ songId: song.id })
            });
            alert(`Added to playlist!`);
            onClose();
        } catch (err) {
            console.error("Error adding to playlist:", err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#181818] border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Add to Playlist</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-6 flex gap-2">
                    <input
                        type="text"
                        placeholder="New Playlist Name"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        className="bg-white/10 border border-transparent focus:border-primary rounded-md px-3 py-2 text-white flex-1 outline-none transition-colors"
                    />
                    <button
                        onClick={createPlaylist}
                        disabled={!newPlaylistName.trim()}
                        className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-md disabled:opacity-50"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                    {playlists.map((playlist) => (
                        <button
                            key={playlist.id}
                            onClick={() => addToPlaylist(playlist.id)}
                            className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-white/10 text-left group transition-colors"
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded flex items-center justify-center">
                                <Music className="w-5 h-5 text-gray-400 group-hover:text-white" />
                            </div>
                            <span className="text-white font-medium">{playlist.name}</span>
                        </button>
                    ))}
                    {playlists.length === 0 && (
                        <p className="text-text-muted text-center py-4">No playlists found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddToPlaylistModal;
