import { getGenerativeModel, ResponseModality } from 'firebase/ai';
import { firebaseAi } from '../app';

export const geminiImageModel = getGenerativeModel(firebaseAi, {
    model: 'gemini-2.5-flash-image',
    // Configure the model to respond with text and images (required)
    generationConfig: {
        responseModalities: [ResponseModality.TEXT, ResponseModality.IMAGE],
    },
});

interface Props {
    textExplanation: string,
    style?: string,
    context?: string,
}

export async function firebaseGetImage(props: Props): Promise<{
    mimeType: string;
    data: string; // base64 string.
} | undefined> {
    const {
        textExplanation,
        context,
        style,
    } = props;

    let contextPromptAddition = '';
    if (context) {
        contextPromptAddition = `in this context "${context}"`;
    }
    
    let stylePromptAddition = '';
    if (style) {
        stylePromptAddition = `Make it in ${style} style.`;
    }
    
    const preventTextOverlayPromptAddition = 'Don\'t embed any text into the image.';
    const prompt = `Generate image based on this word explanation: ${textExplanation} ${contextPromptAddition}. ${stylePromptAddition}. ${preventTextOverlayPromptAddition}`;

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