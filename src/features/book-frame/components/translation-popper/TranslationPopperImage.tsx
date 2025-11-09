import { useDictionaryStateSelect } from 'src/features/dictionary/state';
import { WordImageButton } from 'src/features/dictionary/components';
import { useBookFrameStateSelect } from '../../state';

export default function TranslationPopperImage() {
    const selectedWord = useDictionaryStateSelect('selectedWord');
    const selectedHighlight = useBookFrameStateSelect('selectedHighlight');

    if (!selectedWord || !selectedHighlight) {
        return null;
    }

    return (
        <WordImageButton
            word={selectedWord}
            highlight={selectedHighlight}
            sx={{ display: 'block' }}
        />
    );
}