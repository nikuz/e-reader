import { useMemo } from 'react';
import { Typography } from 'src/design-system/components';
import { useDictionaryStateSelect } from 'src/features/dictionary/state';
import { DICTIONARY_MAX_PHRASE_LENGTH } from 'src/features/dictionary/constants';
import { useSettingsStateSelect } from 'src/features/settings/state';
import { useBookFrameStateSelect } from '../../state';

export default function TranslationPopperTranslation() {
    const translatingWord = useDictionaryStateSelect('translatingWord');
    const dictionarySettings = useSettingsStateSelect('dictionary');
    const selectedHighlight = useBookFrameStateSelect('selectedHighlight');

    const isLongTextSelection = useMemo(() => {
        if (!selectedHighlight) {
            return false;
        }
        return selectedHighlight.text.split(' ').length > DICTIONARY_MAX_PHRASE_LENGTH;
    }, [selectedHighlight]);

    // If AI explanation is already available, hide the simple translation.
    // Since the explanation contains its own translation.
    if (translatingWord?.explanation || (!dictionarySettings.showTranslation && !isLongTextSelection)) {
        return null;
    }

    return (
        <Typography>
            {translatingWord?.translation}
        </Typography>
    );
}