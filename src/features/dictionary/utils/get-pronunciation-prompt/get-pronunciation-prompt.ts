import type { Language } from 'src/types';

interface Props {
    word: string,
    sourceLanguage: Language,
}

export function getPronunciationPrompt(props: Props): string {
    const { word, sourceLanguage } = props;
    const isPhrase = word.split(' ').length > 1;
    const wordType = isPhrase ? 'phrase' : 'word';

    return `Pronounce this ${sourceLanguage.name} ${wordType} clearly and accurately: "${word}"`;
}