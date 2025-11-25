import type { Language } from 'src/types';

interface Props {
    word: string,
    sourceLanguage: Language,
    targetLanguage: Language,
}

export async function getTextTranslation(props: Props): Promise<string> {
    const { word, sourceLanguage, targetLanguage } = props;

    const response = await fetch(`https://translate.googleapis.com/translate_a/single?q=${word}&sl=${sourceLanguage.code}&tl=${targetLanguage.code}&client=gtx&dt=t&ie=UTF-8&oe=UTF-8`);
    const data = await response.json();

    return data[0][0][0];
}