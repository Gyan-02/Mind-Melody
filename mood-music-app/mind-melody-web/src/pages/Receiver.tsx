import { useEffect, useRef, useState, useCallback } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { Play, Pause, Music } from 'lucide-react';
import config from '../config';

const Receiver = () => {
    const [currentTrack, setCurrentTrack] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const deviceId = useRef('receiver-' + Math.random().toString(36).substr(2, 9));

    const handleMessage = useCallback((data: any) => {
        if (data.type === 'transfer') {
            console.log("Received transfer:", data);
            setCurrentTrack(data.metadata);
            if (audioRef.current) {
                audioRef.current.src = data.trackUri;
                audioRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(e => console.error("Auto-play failed", e));
            }
        }
    }, []);

    const { sendMessage, isConnected } = useWebSocket(`${config.WS_URL}/ws`, handleMessage);

    useEffect(() => {
        if (isConnected) {
            // Register as receiver
            sendMessage({
                type: 'register',
                userId: 'user-1',
                deviceId: deviceId.current,
                name: 'Receiver Device',
                deviceType: 'Speaker'
            });
        }
    }, [isConnected, sendMessage]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
            <div className="max-w-md w-full bg-surface border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse-slow">
                    <Music className="w-12 h-12 text-white" />
                </div>

                <h1 className="text-2xl font-bold mb-2">Ready to Cast</h1>
                <p className="text-text-secondary mb-8">This device is visible as "{'Receiver Device'}"</p>

                {currentTrack ? (
                    <div className="bg-white/5 rounded-xl p-4 mb-6">
                        <img
                            src={currentTrack.coverUrl}
                            alt={currentTrack.title}
                            className="w-full aspect-square object-cover rounded-lg mb-4 shadow-lg"
                        />
                        <h2 className="text-xl font-bold truncate">{currentTrack.title}</h2>
                        <p className="text-text-secondary">{currentTrack.artist}</p>
                    </div>
                ) : (
                    <div className="h-40 flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl mb-6">
                        <p className="text-text-muted">Waiting for playback...</p>
                    </div>
                )}

                <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />

                {currentTrack && (
                    <button
                        onClick={togglePlay}
                        className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto hover:scale-105 transition-transform shadow-lg shadow-primary/20"
                    >
                        {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Receiver;
