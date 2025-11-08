import { useDictionaryStateSelect } from 'src/features/dictionary/state';
import { DictionaryWordPronunciationButton } from 'src/features/dictionary/components';

export default function TranslationPopperPronunciation() {
    const translatingWord = useDictionaryStateSelect('translatingWord');
    const selectedWord = useDictionaryStateSelect('selectedWord');

    return (
        <DictionaryWordPronunciationButton
            word={translatingWord ?? selectedWord}
        />
    );
}