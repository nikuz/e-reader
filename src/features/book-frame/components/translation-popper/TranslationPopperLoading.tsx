import { Typography } from 'src/design-system/components';
import { useDictionaryStateSelect } from 'src/features/dictionary/state';
import { useSettingsStateSelect } from 'src/features/settings/state';

export default function TranslationPopperLoading() {
    const translatingWord = useDictionaryStateSelect('translatingWord');
    const dictionarySettings = useSettingsStateSelect('dictionary');

    if (translatingWord?.explanation || (dictionarySettings.showTranslation && translatingWord?.translation)) {
        return null;
    }

    return (
        <Typography className="loading-text">
            Analyzing...
        </Typography>
    );
}