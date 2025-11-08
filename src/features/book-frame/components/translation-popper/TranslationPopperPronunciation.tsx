import { Capacitor } from '@capacitor/core';
import { Box } from 'src/design-system/components';
import { useDictionaryStateSelect } from 'src/features/dictionary/state';

export default function TranslationPopperPronunciation() {
    const translatingWord = useDictionaryStateSelect('translatingWord');
    const selectedWord = useDictionaryStateSelect('selectedWord');
    const pronunciation = translatingWord?.pronunciation ?? selectedWord?.pronunciation;

    if (!pronunciation) {
        return;
    }

    const webviewPath = Capacitor.convertFileSrc(pronunciation);

    return (
        <Box>
            <audio src={webviewPath} controls />``
        </Box>
    );
}