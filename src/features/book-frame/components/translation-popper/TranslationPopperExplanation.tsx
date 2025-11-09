import { useDictionaryStateSelect } from 'src/features/dictionary/state';
import WordExplanation from 'src/features/dictionary/components/word-explanation';

export default function TranslationPopperExplanation() {
    const translatingWord = useDictionaryStateSelect('translatingWord');
    const selectedWord = useDictionaryStateSelect('selectedWord');
    const explanation = translatingWord?.explanation ?? selectedWord?.explanation;

    if (!explanation) {
        return null;
    }

    return <WordExplanation text={explanation} />;
}