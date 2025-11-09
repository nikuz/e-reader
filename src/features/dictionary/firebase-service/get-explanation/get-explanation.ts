import { getGenerativeModel } from 'firebase/ai';
import type { Language } from '../../types';
import { firebaseAi } from '../app';

export const geminiTextModel = getGenerativeModel(firebaseAi, { model: 'gemini-2.5-flash-lite' });

interface Props {
    word: string,
    sourceLanguage: Language,
    targetLanguage: Language,
    context?: string,
}

export async function firebaseGetExplanation(props: Props): Promise<string> {
    const {
        word,
        context,
        sourceLanguage,
        targetLanguage,
    } = props;

    let contextPromptAddition = '';
    if (context) {
        contextPromptAddition = `in this context "${context}"`;
    }

    const prompt = `Give explanation of a word "${word}" ${contextPromptAddition}, and translate it from ${sourceLanguage.name} to ${targetLanguage.name}. Keep it concise.`;

    if (import.meta.env.DEV) {
        console.log('Explanation prompt:', prompt);
    }
    
    const result = await geminiTextModel.generateContent(prompt);

    return result.response.text();
}