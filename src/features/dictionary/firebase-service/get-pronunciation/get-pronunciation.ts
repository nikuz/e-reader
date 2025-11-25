import { getGenerativeModel, ResponseModality } from 'firebase/ai';
import type { Language } from 'src/types';
import { firebaseAi } from '../app';

export const geminiTTSModel = getGenerativeModel(firebaseAi, {
    model: 'gemini-2.5-flash-preview-tts',
    // Configure the model to respond with text and audio (required)
    generationConfig: {
        responseModalities: [ResponseModality.AUDIO],
    },
});

interface Props {
    word: string,
    sourceLanguage: Language,
}

export async function firebaseGetPronunciation(props: Props): Promise<{
    mimeType: string;
    data: string; // base64 string.
} | undefined> {
    const { word, sourceLanguage } = props;
    const isPhrase = word.split(' ').length > 1;
    const wordType = isPhrase ? 'phrase' : 'word';
    
    const prompt = `Pronounce this ${sourceLanguage.name} ${wordType} clearly and accurately: "${word}"`;

    if (import.meta.env.DEV) {
        console.log('Pronunciation prompt:', prompt);
    }

    const result = await geminiTTSModel.generateContent(prompt);

    const inlineDataParts = result.response.inlineDataParts();
    if (inlineDataParts?.[0]) {
        const voice = inlineDataParts[0].inlineData;
        return voice;
    }
}