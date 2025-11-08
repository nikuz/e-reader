import { Typography } from 'src/design-system/components';
import { useDictionaryStateSelect } from 'src/features/dictionary/state';

export default function TranslationPopperTranslation() {
    const translatingWord = useDictionaryStateSelect('translatingWord');
    const selectedWord = useDictionaryStateSelect('selectedWord');
    const translation = translatingWord?.translation ?? selectedWord?.translation;
    const explanations = translatingWord?.explanations ?? selectedWord?.explanations;

    // If AI explanation is already available, hide the simple translation.
    // Since the explanation contains its own translation.
    if (explanations && explanations.length) {
        return null;
    }

    return (
        <Typography>
            {translation}
        </Typography>
    );
}