import { getGenerativeModel, ResponseModality } from 'firebase/ai';
import { firebaseAi } from '../app';

export const geminiImageModel = getGenerativeModel(firebaseAi, {
    model: 'gemini-2.5-flash-image',
    // Configure the model to respond with text and images (required)
    generationConfig: {
        responseModalities: [ResponseModality.TEXT, ResponseModality.IMAGE],
    },
});

export async function firebaseGetImage(prompt: string): Promise<{
    mimeType: string;
    data: string; // base64 string.
} | undefined> {
    if (import.meta.env.DEV) {
        console.log('Image prompt:', prompt);
    }

    const result = await geminiImageModel.generateContent(prompt);

    const inlineDataParts = result.response.inlineDataParts();
    if (inlineDataParts?.[0]) {
        const image = inlineDataParts[0].inlineData;
        return image;
    }
}