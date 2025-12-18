import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { X, Music } from 'lucide-react';

interface QueueListProps {
    isOpen: boolean;
    onClose: () => void;
}

const QueueList: React.FC<QueueListProps> = ({ isOpen, onClose }) => {
    const { queue, currentIndex, playSong } = usePlayer();

    if (!isOpen) return null;

    return (
        <div className="absolute bottom-full right-0 mb-4 w-80 bg-surface/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh] animate-in slide-in-from-bottom-2 fade-in duration-200">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <Music className="w-4 h-4 text-primary" />
                    Queue
                </h3>
                <button
                    onClick={onClose}
                    className="text-text-secondary hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
                {queue.length === 0 ? (
                    <div className="text-center py-8 text-text-muted text-sm">
                        Queue is empty
                    </div>
                ) : (
                    queue.map((song, index) => {
                        const isCurrent = index === currentIndex;
                        return (
                            <div
                                key={`${song.previewUrl}-${index}`}
                                onClick={() => playSong(song, queue)} // Keep queue, just jump to song
                                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors group ${isCurrent ? 'bg-white/10' : 'hover:bg-white/5'
                                    }`}
                            >
                                <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                                    {song.coverUrl ? (
                                        <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-surfaceHighlight" />
                                    )}
                                    {isCurrent && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <div className="w-1 h-3 bg-primary animate-pulse mx-0.5" />
                                            <div className="w-1 h-4 bg-primary animate-pulse mx-0.5 delay-75" />
                                            <div className="w-1 h-2 bg-primary animate-pulse mx-0.5 delay-150" />
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className={`text-sm font-medium truncate ${isCurrent ? 'text-primary' : 'text-white'}`}>
                                        {song.title}
                                    </p>
                                    <p className="text-xs text-text-secondary truncate">
                                        {song.artist || 'Unknown Artist'}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default QueueList;
