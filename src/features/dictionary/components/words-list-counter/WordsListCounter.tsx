import { useEffect } from 'react';
import { Box, Typography } from 'src/design-system/components';
import { dictionaryStateMachineActor } from '../../state';
import { useDictionaryStateSelect } from '../../state/hooks';
import { DICTIONARY_LIST_ITEMS_PER_PAGE } from '../../constants';

export function WordsListCounter() {
    const storedWordsCounter = useDictionaryStateSelect('storedWordsCounter');
    const searchWordsCounter = useDictionaryStateSelect('searchWordsCounter');

    const displayCounter = searchWordsCounter !== undefined ? searchWordsCounter : storedWordsCounter;

    useEffect(() => {
        dictionaryStateMachineActor.send({
            type: 'GET_WORDS_LIST_CHUNK',
            from: 0,
            to: DICTIONARY_LIST_ITEMS_PER_PAGE,
        });
    }, []);

    if (storedWordsCounter !== undefined && storedWordsCounter === 0) {
        return (
            <Box />
        );
    }

    return (
        <Typography
            sx={{
                padding: 2,
                paddingTop: 0,
                paddingBottom: 1,
            }}
        >
            <Typography component="span" fontWeight="bold">{displayCounter}</Typography>
            &nbsp;
            {displayCounter === 1 ? 'word' : 'words'}
        </Typography>
    );
}
