import React, { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Mic2, X, Save, Loader2 } from 'lucide-react';
// @ts-ignore - no types available for lyrics-dumper  
import { getSong } from 'lyrics-dumper';
import config from '../config';

interface LyricsLine {
    text: string;
    time: number;
}

interface LyricsData {
    id: number;
    trackId: string;
    previewUrl: string;
    content: string; // JSON string
    synced: boolean;
}

interface LyricsViewProps {
    isOpen: boolean;
    onClose: () => void;
}

const LyricsView: React.FC<LyricsViewProps> = ({ isOpen, onClose }) => {
    const { currentSong, currentTime } = usePlayer();
    const [lyrics, setLyrics] = useState<LyricsLine[]>([]);
    const [rawText, setRawText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasLyrics, setHasLyrics] = useState(false);
    const activeLineRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isOpen && currentSong) {
            fetchLyrics();
        } else {
            // Reset state when closed or song changes
            setLyrics([]);
            setRawText('');
            setHasLyrics(false);
        }
    }, [isOpen, currentSong]);

    const fetchLyrics = async () => {
        if (!currentSong) return;
        setIsLoading(true);
        try {
            // Use previewUrl as trackId for now since we don't have a unique ID from iTunes sometimes
            const trackId = encodeURIComponent(currentSong.previewUrl);
            const res = await fetch(`${config.API_URL}/api/lyrics/${trackId}`);
            if (res.ok) {
                const data: LyricsData = await res.json();
                try {
                    const parsedContent = JSON.parse(data.content);
                    setLyrics(parsedContent);
                    setHasLyrics(true);
                    setIsLoading(false);
                } catch (e) {
                    console.error("Failed to parse lyrics content", e);
                    setHasLyrics(false);
                    setIsLoading(false);
                }
            } else {
                // No lyrics in DB - try auto-fetch
                console.log('No lyrics in DB, attempting auto-fetch...');
                await fetchLyricsAutomatically();
            }
        } catch (error) {
            console.error("Error fetching lyrics:", error);
            setHasLyrics(false);
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!currentSong || !rawText.trim()) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`${config.API_URL}/api/lyrics/align`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    trackId: currentSong.previewUrl,
                    previewUrl: currentSong.previewUrl,
                    text: rawText
                })
            });

            if (res.ok) {
                const data: LyricsData = await res.json();
                const parsedContent = JSON.parse(data.content);
                setLyrics(parsedContent);
                setHasLyrics(true);
            }
        } catch (error) {
            console.error("Error submitting lyrics:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchLyricsAutomatically = async () => {
        if (!currentSong) return;

        const artist = currentSong.artist || 'Unknown';
        const title = currentSong.title;

        console.log('🎵 Auto-fetching lyrics for:', { artist, title });
        setIsLoading(true);

        try {
            // Fetch lyrics using lyrics-dumper
            const result = await getSong(artist, title);

            if (result && result.lyrics) {
                console.log('✅ Lyrics fetched successfully');
                // Send to backend for alignment
                const res = await fetch(`${config.API_URL}/api/lyrics/align`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        trackId: currentSong.previewUrl,
                        previewUrl: currentSong.previewUrl,
                        text: result.lyrics
                    })
                });

                if (res.ok) {
                    const data: LyricsData = await res.json();
                    const parsedContent = JSON.parse(data.content);
                    setLyrics(parsedContent);
                    setHasLyrics(true);
                }
            } else {
                console.log('❌ No lyrics found');
                setHasLyrics(false);
            }
        } catch (error) {
            console.error('Error auto-fetching lyrics:', error);
            setHasLyrics(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Find active line index - must calculate before return for hooks
    const activeIndex = lyrics.findIndex((line, i) => {
        const nextLine = lyrics[i + 1];
        return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
    });

    // Auto-scroll to active line
    useEffect(() => {
        if (activeLineRef.current && isOpen) {
            activeLineRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [currentTime, isOpen]);

    // Debug logging
    useEffect(() => {
        if (isOpen && hasLyrics && lyrics.length > 0) {
            console.log('🎵 Lyrics Sync Debug:', {
                currentTime: currentTime.toFixed(2),
                activeIndex,
                totalLines: lyrics.length,
                firstLineTime: lyrics[0]?.time,
                lastLineTime: lyrics[lyrics.length - 1]?.time,
                activeLine: lyrics[activeIndex]?.text
            });
        }
    }, [currentTime, activeIndex, hasLyrics, lyrics, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="absolute bottom-full right-0 mb-4 w-96 h-[500px] bg-surface/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-2 fade-in duration-200 z-50">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <Mic2 className="w-4 h-4 text-primary" />
                    Lyrics
                </h3>
                <button
                    onClick={onClose}
                    className="text-text-secondary hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : hasLyrics ? (
                    <div className="space-y-6 text-center">
                        {lyrics.map((line, index) => {
                            const isActive = index === activeIndex;
                            return (
                                <p
                                    key={index}
                                    ref={isActive ? activeLineRef : null}
                                    className={`transition-all duration-300 ${isActive
                                        ? 'text-primary font-bold text-2xl scale-110'
                                        : 'text-text-muted text-base opacity-60 hover:text-white/80 hover:opacity-100'
                                        }`}
                                >
                                    {line.text}
                                </p>
                            );
                        })}
                        {lyrics.length === 0 && <p className="text-text-muted">No lyrics found.</p>}
                    </div>
                ) : (
                    <div className="h-full flex flex-col">
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 mb-4">
                            <Mic2 className="w-12 h-12 text-white/20" />
                            <p className="text-text-secondary">
                                No lyrics available for this track.<br />
                                Paste them below to sync automatically!
                            </p>
                        </div>
                        <textarea
                            className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none mb-4"
                            placeholder="Paste lyrics here..."
                            value={rawText}
                            onChange={(e) => setRawText(e.target.value)}
                        />
                        <button
                            onClick={handleSubmit}
                            disabled={!rawText.trim() || isSubmitting}
                            className="w-full py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Aligning...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save & Sync
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LyricsView;
