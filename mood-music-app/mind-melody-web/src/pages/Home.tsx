import { useState, useEffect } from 'react';
import MoodInput from '../components/MoodInput';
import type { MoodResult } from '../utils/moodAnalysis';
import { Play, Search, SkipForward, PlusCircle } from 'lucide-react';
import AddToPlaylistModal from '../components/AddToPlaylistModal';
import config from '../config';

import { usePlayer } from '../context/PlayerContext';
import { useToast } from '../context/ToastContext';

interface Song {
    id?: number | null;
    title: string;
    mood: string;
    previewUrl: string;
    coverUrl: string;
    artist?: string;
}

const Home = () => {
    const [greeting, setGreeting] = useState('');
    const [currentMood, setCurrentMood] = useState<MoodResult | null>(null);
    const [songs, setSongs] = useState<Song[]>([]);
    const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Playlist Modal State
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);

    const openPlaylistModal = (song: Song) => {
        setSelectedSong(song);
        setIsPlaylistModalOpen(true);
    };

    const { playSong, playNext } = usePlayer();
    const { showToast } = useToast();

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        // Fetch recently played songs
        fetch(`${config.API_URL}/api/recently-played`)
            .then(res => res.json())
            .then(data => setRecentlyPlayed(data.slice(0, 7))) // Show only 7 recently played
            .catch(err => console.error("Error fetching recently played:", err));
    }, []);

    const handleMoodAnalyzed = async (result: MoodResult) => {
        setCurrentMood(result);
        console.log('Mood analyzed:', result);

        // Fetch songs from backend based on mood
        setIsLoading(true);
        try {
            const response = await fetch(`${config.API_URL}/api/songs/${result.mood}`);
            const data = await response.json();
            console.log('Songs fetched:', data);
            setSongs(data.songs || []);
        } catch (error) {
            console.error('Error fetching songs:', error);
            setSongs([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        setCurrentMood(null); // Clear mood when searching
        try {
            const response = await fetch(`${config.API_URL}/api/songs/search?query=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            console.log('Search results:', data);
            setSongs(data || []);
        } catch (error) {
            console.error('Error searching songs:', error);
            setSongs([]);
        } finally {
            setIsLoading(false);
        }
    };

    const featuredPlaylists = [
        { title: 'Deep Focus', desc: 'Keep calm and focus.', color: 'from-blue-600 to-cyan-500', mood: 'Relaxed' as const },
        { title: 'Mood Booster', desc: 'Get happy now!', color: 'from-yellow-500 to-orange-500', mood: 'Happy' as const },
        { title: 'Chill Hits', desc: 'Kick back to the best new chill tracks.', color: 'from-green-500 to-emerald-600', mood: 'Relaxed' as const },
        { title: 'Dark & Stormy', desc: 'Beautifully sad songs.', color: 'from-gray-700 to-gray-900', mood: 'Sad' as const },
    ];

    const handlePlaylistClick = async (mood: MoodResult['mood']) => {
        setIsLoading(true);
        setSearchQuery(''); // Clear search
        try {
            // Convert capitalized mood to lowercase for API call
            const response = await fetch(`${config.API_URL}/api/songs/${mood.toLowerCase()}`);
            const data = await response.json();
            console.log('Playlist songs fetched:', data);
            setSongs(data.songs || []);
            // Create a complete MoodResult object
            setCurrentMood({
                mood,
                words: [],
                score: 0,
                comparative: 0,
                tokens: [],
                positive: [],
                negative: []
            });
        } catch (error) {
            console.error('Error fetching playlist songs:', error);
            setSongs([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Hero Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-bold text-white tracking-tight">{greeting}</h1>
                    <form onSubmit={handleSearch} className="relative w-64">
                        <input
                            type="text"
                            placeholder="Search songs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/10 border border-white/10 rounded-full py-2 pl-10 pr-4 text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    </form>
                </div>

                <MoodInput onMoodAnalyzed={handleMoodAnalyzed} />

                {currentMood && (
                    <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10 animate-slide-up">
                        <p className="text-text-secondary">
                            Detected Mood: <span className="text-white font-bold capitalize">{currentMood.mood}</span>
                        </p>
                        <p className="text-sm text-text-muted mt-1">
                            Based on: {currentMood.words.join(', ')}
                        </p>
                    </div>
                )}
            </section>

            {/* Recently Played Section */}
            {recentlyPlayed.length > 0 && songs.length === 0 && (
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">Recently Played</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {recentlyPlayed.map((song, index) => (
                            <div
                                key={index}
                                className="group relative bg-surfaceHighlight/50 hover:bg-surfaceHighlight rounded-lg p-4 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                                onClick={() => playSong(song, recentlyPlayed)}
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
                                        <div className="absolute bottom-2 right-2 flex gap-2">
                                            {/* Play Now */}
                                            <button
                                                aria-label={`Play ${song.title}`}
                                                onClick={(e) => { e.stopPropagation(); playSong(song, songs.length ? songs : recentlyPlayed); }}
                                                className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/90 hover:scale-110"
                                            >
                                                <Play className="w-6 h-6 text-white fill-current ml-1" />
                                            </button>

                                            {/* Play Next */}
                                            <button
                                                aria-label={`Play ${song.title} next`}
                                                onClick={(e) => { e.stopPropagation(); playNext(song); showToast('Added to queue'); }}
                                                className="w-10 h-10 bg-white/6 rounded-full flex items-center justify-center shadow-lg translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/10"
                                                title="Play next"
                                            >
                                                <SkipForward className="w-5 h-5 text-white" />
                                            </button>

                                            {/* Add to Playlist */}
                                            <button
                                                aria-label={`Add ${song.title} to playlist`}
                                                onClick={(e) => { e.stopPropagation(); openPlaylistModal(song); }}
                                                className="w-10 h-10 bg-white/6 rounded-full flex items-center justify-center shadow-lg translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/10"
                                                title="Add to playlist"
                                            >
                                                <PlusCircle className="w-5 h-5 text-white" />
                                            </button>
                                        </div>
                                    )}

                                </div>
                                <h3 className="text-white font-semibold truncate text-sm">{song.title}</h3>
                                <p className="text-xs text-text-secondary line-clamp-2 mt-1">{song.artist || 'Unknown Artist'}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Songs List (Mood or Search Results) */}
            {songs.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">
                        {currentMood ? (
                            <>Songs for Your <span className="capitalize text-primary">{currentMood.mood}</span> Mood</>
                        ) : (
                            <>Search Results for "<span className="text-primary">{searchQuery}</span>"</>
                        )}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {songs.map((song, index) => (
                            <div
                                key={index}
                                className="group relative bg-surfaceHighlight/50 hover:bg-surfaceHighlight rounded-lg p-4 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                                onClick={() => playSong(song, songs)}
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
                                        <div className="absolute bottom-2 right-2 flex gap-2">
                                            {/* Play Now */}
                                            <button
                                                aria-label={`Play ${song.title}`}
                                                onClick={(e) => { e.stopPropagation(); playSong(song, songs.length ? songs : recentlyPlayed); }}
                                                className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/90 hover:scale-110"
                                            >
                                                <Play className="w-6 h-6 text-white fill-current ml-1" />
                                            </button>

                                            {/* Play Next */}
                                            <button
                                                aria-label={`Play ${song.title} next`}
                                                onClick={(e) => { e.stopPropagation(); playNext(song); showToast('Added to queue'); }}
                                                className="w-10 h-10 bg-white/6 rounded-full flex items-center justify-center shadow-lg translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/10"
                                                title="Play next"
                                            >
                                                <SkipForward className="w-5 h-5 text-white" />
                                            </button>

                                            {/* Add to Playlist */}
                                            <button
                                                aria-label={`Add ${song.title} to playlist`}
                                                onClick={(e) => { e.stopPropagation(); openPlaylistModal(song); }}
                                                className="w-10 h-10 bg-white/6 rounded-full flex items-center justify-center shadow-lg translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/10"
                                                title="Add to playlist"
                                            >
                                                <PlusCircle className="w-5 h-5 text-white" />
                                            </button>
                                        </div>
                                    )}

                                </div>
                                <h3 className="text-white font-semibold truncate text-sm">{song.title}</h3>
                                <p className="text-xs text-text-secondary line-clamp-2 mt-1">From iTunes</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {isLoading && (
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">Loading songs...</h2>
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </section>
            )}

            {/* Made For You */}
            <section>
                <h2 className="text-2xl font-bold text-white mb-6">Made For You</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {featuredPlaylists.map((playlist) => (
                        <div
                            key={playlist.title}
                            className="group relative bg-surfaceHighlight/50 hover:bg-surfaceHighlight rounded-lg p-4 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                            onClick={() => handlePlaylistClick(playlist.mood)}
                        >
                            <div className={`w-full aspect-square rounded-md bg-gradient-to-br ${playlist.color} mb-4 shadow-lg group-hover:shadow-xl transition-shadow relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                <button
                                    onClick={(e) => { e.stopPropagation(); handlePlaylistClick(playlist.mood); }}
                                    aria-label={`Play ${playlist.title}`}
                                    className="absolute bottom-2 right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/90 hover:scale-110"
                                >
                                    <Play className="w-6 h-6 text-white fill-current ml-1" />
                                </button>
                            </div>
                            <h3 className="text-white font-semibold truncate">{playlist.title}</h3>
                            <p className="text-sm text-text-secondary line-clamp-2 mt-1">{playlist.desc}</p>
                        </div>
                    ))}
                </div>
            </section>


            {/* Playlist Modal */}
            {selectedSong && (
                <AddToPlaylistModal
                    isOpen={isPlaylistModalOpen}
                    onClose={() => setIsPlaylistModalOpen(false)}
                    song={selectedSong}
                />
            )}
        </div>
    );
};

export default Home;
