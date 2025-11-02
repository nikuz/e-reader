import { getGenerativeModel, ResponseModality } from 'firebase/ai';
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
}

export async function firebaseGetPronunciation(props: Props): Promise<{
    mimeType: string;
    data: string; // base64 string.
} | undefined> {
    const { word } = props;
    
    const prompt = `Say the following: "${word}"`;

    const result = await geminiTTSModel.generateContent(prompt);

    const inlineDataParts = result.response.inlineDataParts();
    if (inlineDataParts?.[0]) {
        const voice = inlineDataParts[0].inlineData;
        return voice;
    }
}