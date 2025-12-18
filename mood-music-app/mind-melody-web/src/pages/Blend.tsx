import { useState } from 'react';
import { Sparkles, Music2, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import config from '../config';

interface Blend {
    id: number;
    name: string;
    matchScore: number;
    user1: { name: string };
    user2?: { name: string };

    blendSongs: any[];
}

const Blend = () => {
    const [blends, setBlends] = useState<Blend[]>([]); // In reality, fetch these
    const [inviteCode, setInviteCode] = useState<string | null>(null);
    const [joinCode, setJoinCode] = useState("");
    const [guestName, setGuestName] = useState("");
    const navigate = useNavigate();

    const createBlend = async () => {
        try {
            const res = await fetch(`${config.API_URL}/api/blends`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 1 })
            });
            const data = await res.json();
            setInviteCode(data.inviteCode);
            alert(`Blend Created! Share this code: ${data.inviteCode}`);
        } catch (err) {
            console.error("Error creating blend:", err);
        }
    };

    const joinBlend = async () => {
        if (!joinCode || !guestName) {
            alert("Please enter both Invite Code and Your Name");
            return;
        }

        try {
            const res = await fetch(`${config.API_URL}/api/blends/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inviteCode: joinCode, guestName })
            });

            if (!res.ok) {
                const err = await res.text();
                alert("Error: " + err);
                return;
            }

            const data = await res.json();
            setBlends([...blends, data]);
            alert(`Joined Blend: ${data.name}!`);
            setJoinCode("");
            setGuestName("");
        } catch (err) {
            console.error("Error joining blend:", err);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Blend</h1>
                    <p className="text-text-secondary">Create shared playlists that mix your tastes.</p>
                </div>
                <button
                    onClick={createBlend}
                    className="px-6 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
                >
                    Create Invite
                </button>
            </div>

            {inviteCode && (
                <div className="bg-primary/20 border border-primary/50 text-white p-4 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="font-bold">Invite created!</p>
                        <p className="text-sm opacity-80">Share code: <span className="font-mono bg-black/30 px-2 py-1 rounded select-all">{inviteCode}</span></p>
                    </div>
                    <Copy
                        onClick={() => {
                            if (inviteCode) {
                                navigator.clipboard.writeText(inviteCode);
                                alert("Copied to clipboard!");
                            }
                        }}
                        className="w-5 h-5 cursor-pointer hover:text-primary transition-colors"
                    />
                </div>
            )}

            <div className="bg-surfaceHighlight/30 p-6 rounded-xl border border-white/5">
                <h3 className="text-lg font-bold text-white mb-4">Join a Blend</h3>
                <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Enter Invite Code"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value)}
                            className="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-primary flex-1"
                        />
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            className="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-primary flex-1"
                        />
                    </div>
                    <button
                        onClick={joinBlend}
                        disabled={!joinCode || !guestName}
                        className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end"
                    >
                        Join Blend
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Dynamically Created Blends */}
                {blends.map((blend) => (
                    <div
                        key={blend.id}
                        onClick={() => navigate(`/blend/${blend.id}`)}
                        className="bg-surfaceHighlight/50 border border-white/5 rounded-xl p-6 hover:bg-surfaceHighlight transition-colors cursor-pointer group"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex -space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-surface flex items-center justify-center font-bold text-xs uppercase" title={blend.user1.name}>
                                    {blend.user1.name.charAt(0)}
                                </div>
                                {blend.user2 && (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 border-2 border-surface flex items-center justify-center font-bold text-xs uppercase" title={blend.user2.name}>
                                        {blend.user2.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-1 text-green-400 bg-green-400/10 px-2 py-1 rounded-full text-xs font-bold">
                                <Sparkles className="w-3 h-3" />
                                {blend.matchScore}% Match
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{blend.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <Music2 className="w-4 h-4" />
                            {blend.blendSongs?.length || 0} mixed songs
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Blend;
