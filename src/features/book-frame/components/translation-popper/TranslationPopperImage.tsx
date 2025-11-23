import { useDictionaryStateSelect } from 'src/features/dictionary/state';
import { WordImageButton } from 'src/features/dictionary/components';
import { useBookFrameStateSelect } from '../../state';

export default function TranslationPopperImage() {
    const translatingWord = useDictionaryStateSelect('translatingWord');
    const selectedHighlight = useBookFrameStateSelect('selectedHighlight');

    if (!translatingWord || !translatingWord.explanation || !selectedHighlight) {
        return null;
    }

    return (
        <WordImageButton
            word={translatingWord}
            highlight={selectedHighlight}
            sx={{ display: 'block' }}
        />
    );
}