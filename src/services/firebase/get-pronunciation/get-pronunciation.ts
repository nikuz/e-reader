import { getGenerativeModel, ResponseModality } from 'firebase/ai';
import { firebaseAi } from '../app';

export const geminiTTSModel = getGenerativeModel(firebaseAi, {
    model: 'gemini-2.5-flash-preview-tts',
    // Configure the model to respond with text and audio (required)
    generationConfig: {
        responseModalities: [ResponseModality.AUDIO],
    },
});

export async function firebaseGetPronunciation(prompt: string): Promise<{
    mimeType: string;
    data: string; // base64 string.
} | undefined> {
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