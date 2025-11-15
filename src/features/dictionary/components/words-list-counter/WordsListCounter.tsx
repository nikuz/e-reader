import { Box, Typography } from 'src/design-system/components';
import { useDictionaryStateSelect } from '../../state/hooks';

export function WordsListCounter() {
    const storedWordsCounter = useDictionaryStateSelect('storedWordsCounter');
    const searchWordsCounter = useDictionaryStateSelect('searchWordsCounter');
    const searchWords = useDictionaryStateSelect('searchWords');

    const displayCounter = searchWordsCounter !== undefined
        ? searchWordsCounter
        : storedWordsCounter;

    if (
        (searchWords !== undefined && searchWords.length === 0)
        || (storedWordsCounter !== undefined && storedWordsCounter === 0)
    ) {
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
