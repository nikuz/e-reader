import { useMemo, useCallback } from 'react';
import { Box, Skeleton, Button } from 'src/design-system/components';
import { AddIcon } from 'src/design-system/icons';
import {
    useDictionaryStateSelect,
    dictionaryStateMachineActor,
    useDictionaryStateQueueSelect,
} from 'src/features/dictionary/state';
import WordExplanation from 'src/features/dictionary/components/word-explanation';
import { converterUtils } from 'src/utils';
import { useBookFrameStateSelect } from '../../state';

export default function TranslationPopperExplanation() {
    const selectedHighlight = useBookFrameStateSelect('selectedHighlight');
    const translatingWord = useDictionaryStateSelect('translatingWord');
    const contextId = useMemo(() => (
        selectedHighlight ? converterUtils.stringToHash(selectedHighlight.context) : ''
    ), [selectedHighlight]);
    const isContextLoading = useDictionaryStateQueueSelect(`${selectedHighlight?.id}-${contextId}`);
    const wordImageIsInQueue = useDictionaryStateQueueSelect(`${selectedHighlight?.id}-image`);

    const contextExplanation = useMemo(() => {
        if (!selectedHighlight || !translatingWord || !translatingWord.contextExplanations.length) {
            return undefined;
        }

        const highlightContextId = converterUtils.stringToHash(selectedHighlight.context);

        return translatingWord.contextExplanations.find(item => item.contextId === highlightContextId)?.text;
    }, [translatingWord, selectedHighlight]);

    const explainInContextHandler = useCallback(() => {
        if (!translatingWord || !selectedHighlight) {
            return;
        }
        dictionaryStateMachineActor.send({
            type: 'REQUEST_CONTEXT_ANALYSIS',
            word: translatingWord,
            context: {
                id: contextId,
                text: selectedHighlight.context,
            },
            highlight: selectedHighlight,
        });
    }, [translatingWord, selectedHighlight, contextId]);

    const explanation = contextExplanation ?? translatingWord?.explanation;

    return (
        <Box>
            {!explanation && <>
                <Skeleton variant="text" animation="wave" height={20} />
                <Skeleton variant="text" animation="wave" height={20} />
                <Skeleton variant="text" animation="wave" height={20} />
            </>}
            {explanation && <WordExplanation text={explanation} />}
            {explanation && !contextExplanation && (
                <Button
                    size="small"
                    variant="outlined"
                    loading={isContextLoading}
                    startIcon={<AddIcon />}
                    disabled={isContextLoading || wordImageIsInQueue}
                    sx={{
                        mt: 1.5,
                        '& .MuiButton-icon': {
                            mr: '5px',
                        }
                    }}
                    onClick={explainInContextHandler}
                >
                    context
                </Button>
            )}
        </Box>
    );
}