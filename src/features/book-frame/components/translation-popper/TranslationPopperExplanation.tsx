import { useDictionaryStateSelect } from 'src/features/dictionary/state';
import WordExplanation from 'src/features/dictionary/components/word-explanation';

export default function TranslationPopperExplanation() {
    const translatingWord = useDictionaryStateSelect('translatingWord');
    const selectedWord = useDictionaryStateSelect('selectedWord');
    const explanations = translatingWord?.explanations ?? selectedWord?.explanations;
    const explanationText = explanations?.[0]?.text;

    if (!explanationText) {
        return null;
    }

    return <WordExplanation text={explanationText} />;
}