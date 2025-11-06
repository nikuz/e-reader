import { Capacitor } from '@capacitor/core';
import { Box } from 'src/design-system/components';
import { useDictionaryStateSelect } from 'src/features/dictionary/state';

export default function TranslationPopperPronunciation() {
    const translatingWord = useDictionaryStateSelect('translatingWord');
    const selectedWord = useDictionaryStateSelect('selectedWord');
    const aiPronunciation = translatingWord?.aiPronunciation ?? selectedWord?.aiPronunciation;

    if (!aiPronunciation) {
        return;
    }

    const webviewPath = Capacitor.convertFileSrc(aiPronunciation);

    return (
        <Box>
            <audio src={webviewPath} controls />``
        </Box>
    );
}