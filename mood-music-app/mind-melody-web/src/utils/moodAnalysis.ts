import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export interface MoodResult {
    score: number;
    comparative: number;
    tokens: string[];
    words: string[];
    positive: string[];
    negative: string[];
    mood: 'Happy' | 'Sad' | 'Neutral' | 'Mixed' | 'Energetic' | 'Relaxed';
}

export const analyzeMood = (text: string): MoodResult => {
    const result = sentiment.analyze(text);

    let mood: MoodResult['mood'] = 'Neutral';

    if (result.score > 3) mood = 'Happy';
    else if (result.score < -3) mood = 'Sad';
    else if (result.score > 0 && result.score <= 3) mood = 'Energetic';
    else if (result.score < 0 && result.score >= -3) mood = 'Relaxed';

    // Simple heuristic for mixed: significant presence of both positive and negative words
    if (result.positive.length > 0 && result.negative.length > 0) {
        // If the counts are somewhat balanced
        const ratio = result.positive.length / result.negative.length;
        if (ratio > 0.5 && ratio < 2.0) {
            mood = 'Mixed';
        }
    }

    return {
        ...result,
        mood,
    };
};
