import { getGenerativeModel } from 'firebase/ai';
import { firebaseAi } from '../app';

export const geminiTextModel = getGenerativeModel(firebaseAi, { model: 'gemini-2.5-flash-lite' });

export async function firebaseGetExplanation(prompt: string): Promise<string> {
    if (import.meta.env.DEV) {
        console.log('Explanation prompt:', prompt);
    }
    
    const result = await geminiTextModel.generateContent(prompt);

    return result.response.text();
}