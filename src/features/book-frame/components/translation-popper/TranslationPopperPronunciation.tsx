import { useDictionaryStateSelect } from 'src/features/dictionary/state';
import { DictionaryWordPronunciationButton } from 'src/features/dictionary/components';
import { useBookFrameStateSelect } from '../../state';

export default function TranslationPopperPronunciation() {
    const translatingWord = useDictionaryStateSelect('translatingWord');
    const selectedHighlight = useBookFrameStateSelect('selectedHighlight');

    if (!translatingWord || !selectedHighlight) {
        return null;
    }

    return (
        <DictionaryWordPronunciationButton
            word={translatingWord}
            highlight={selectedHighlight}
            sx={{ display: 'block' }}
        />
    );
}