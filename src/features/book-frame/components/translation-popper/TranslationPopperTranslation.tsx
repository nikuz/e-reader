import { Typography } from 'src/design-system/components';
import { useDictionaryStateSelect } from 'src/features/dictionary/state';

export default function TranslationPopperTranslation() {
    const translatingWord = useDictionaryStateSelect('translatingWord');
    const selectedWord = useDictionaryStateSelect('selectedWord');
    const translation = translatingWord?.translation ?? selectedWord?.translation;
    const explanation = translatingWord?.explanation ?? selectedWord?.explanation;

    // If AI explanation is already available, hide the simple translation.
    // Since the explanation contains its own translation.
    if (explanation) {
        return null;
    }

    if (!translation) {
        return (
            <Typography className="loading-text">
                Translating...
            </Typography>
        );
    }

    return (
        <Typography>
            {translation}
        </Typography>
    );
}