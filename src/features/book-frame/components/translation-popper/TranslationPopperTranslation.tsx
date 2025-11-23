import { Typography } from 'src/design-system/components';
import { useDictionaryStateSelect } from 'src/features/dictionary/state';

export default function TranslationPopperTranslation() {
    const translatingWord = useDictionaryStateSelect('translatingWord');

    // If AI explanation is already available, hide the simple translation.
    // Since the explanation contains its own translation.
    if (translatingWord?.explanation) {
        return null;
    }

    if (!translatingWord?.translation) {
        return (
            <Typography className="loading-text">
                Translating...
            </Typography>
        );
    }

    return (
        <Typography>
            {translatingWord.translation}
        </Typography>
    );
}