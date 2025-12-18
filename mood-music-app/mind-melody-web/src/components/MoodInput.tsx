import { useState } from 'react';
import type { FormEvent, FC } from 'react';
import { analyzeMood, type MoodResult } from '../utils/moodAnalysis';
import { Send, Sparkles } from 'lucide-react';

interface MoodInputProps {
    onMoodAnalyzed: (result: MoodResult) => void;
}

const MoodInput: FC<MoodInputProps> = ({ onMoodAnalyzed }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const result = analyzeMood(input);
        onMoodAnalyzed(result);
        setInput('');
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-xl opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center bg-surface rounded-xl p-2">
                    <Sparkles className="w-6 h-6 text-secondary ml-3 mr-2 animate-pulse-slow" />
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="How are you feeling right now?"
                        className="w-full bg-transparent text-text-primary placeholder-text-muted focus:outline-none py-3 px-2 text-lg"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="p-3 bg-surfaceHighlight hover:bg-primary/20 text-primary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MoodInput;
