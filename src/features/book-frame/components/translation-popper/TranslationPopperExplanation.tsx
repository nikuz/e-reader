import { Typography } from 'src/design-system/components';
import { useDictionaryStateSelect } from 'src/features/dictionary/state';

export default function TranslationPopperExplanation() {
    const translatingWord = useDictionaryStateSelect('translatingWord');
    const selectedWord = useDictionaryStateSelect('selectedWord');
    const explanations = translatingWord?.explanations ?? selectedWord?.explanations;

    return (
        <Typography>
            {explanations?.[0].text}
        </Typography>
    );
}