import { useMemo } from 'react';
import { useDictionaryStateSelect } from 'src/features/dictionary/state';
import { DictionaryWordPronunciationButton } from 'src/features/dictionary/components';
import { DICTIONARY_MAX_PHRASE_LENGTH } from 'src/features/dictionary/constants';
import { useBookFrameStateSelect } from '../../state';

export default function TranslationPopperPronunciation() {
    const translatingWord = useDictionaryStateSelect('translatingWord');
    const selectedHighlight = useBookFrameStateSelect('selectedHighlight');

    const isLongTextSelection = useMemo(() => {
        if (!selectedHighlight) {
            return false;
        }
        return selectedHighlight.text.split(' ').length > DICTIONARY_MAX_PHRASE_LENGTH;
    }, [selectedHighlight]);

    if (!translatingWord || !selectedHighlight || isLongTextSelection) {
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