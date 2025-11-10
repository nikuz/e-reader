import { useState, useMemo, useCallback } from 'react';
import { Box, Button } from 'src/design-system/components';
import {
    useDictionaryStateSelect,
    dictionaryStateMachineActor,
} from 'src/features/dictionary/state';
import WordExplanation from 'src/features/dictionary/components/word-explanation';
import { converterUtils } from 'src/utils';
import { useBookFrameStateSelect } from '../../state';

export default function TranslationPopperExplanation() {
    const [isContextLoading, setIsContextLoading] = useState(false);
    const selectedHighlight = useBookFrameStateSelect('selectedHighlight');
    const translatingWord = useDictionaryStateSelect('translatingWord');
    const selectedWord = useDictionaryStateSelect('selectedWord');

    const contextExplanation = useMemo(() => {
        if (!selectedHighlight || !selectedWord || !selectedWord.contextExplanations.length) {
            return undefined;
        }

        const highlightContextId = converterUtils.stringToHash(selectedHighlight.context);

        return selectedWord.contextExplanations.find(item => item.contextId === highlightContextId)?.text;
    }, [selectedWord, selectedHighlight]);

    const explainInContextHandler = useCallback(() => {
        if (!selectedWord || !selectedHighlight) {
            return;
        }
        setIsContextLoading(true);
        dictionaryStateMachineActor.send({
            type: 'REQUEST_CONTEXT_ANALYSIS',
            word: selectedWord,
            highlight: selectedHighlight,
        });
    }, [selectedWord, selectedHighlight]);

    const explanation = contextExplanation ?? translatingWord?.explanation ?? selectedWord?.explanation;

    if (!explanation) {
        return null;
    }

    return (
        <Box>
            <WordExplanation text={explanation} />
            {!contextExplanation && (
                <Button
                    size="small"
                    variant="outlined"
                    sx={{ mt: 1.5 }}
                    loading={isContextLoading}
                    onClick={explainInContextHandler}
                >
                    + context
                </Button>
            )}
        </Box>
    );
}