import { useRef, useEffect } from 'react';
import { Box, List, Typography } from 'src/design-system/components';
import { dictionaryStateMachineActor } from '../../state';
import { useDictionaryStateSelect, useDictionaryStateMatch } from '../../state/hooks';
import { DICTIONARY_LIST_ITEMS_PER_PAGE } from '../../constants';
import { WordsListItem } from './WordsListItem';
import type { DictionaryWord } from '../../types';

export function WordsList() {
    const storedWords = useDictionaryStateSelect('storedWords');
    const storedWordsCounter = useDictionaryStateSelect('storedWordsCounter');
    const searchWords = useDictionaryStateSelect('searchWords');
    const isLoading = useDictionaryStateMatch(['LOADING_WORDS_LIST']);
    const initialListLoaded = useRef(false);
    
    const displayWords = searchWords !== undefined ? searchWords : storedWords;

    const handleDeleteWord = (word: DictionaryWord) => {
        dictionaryStateMachineActor.send({
            type: 'DELETE_WORD',
            wordId: word.id,
        });
    };

    useEffect(() => {
        if (initialListLoaded.current) {
            return;
        }
        initialListLoaded.current = true;
        dictionaryStateMachineActor.send({
            type: 'GET_WORDS_LIST_CHUNK',
            from: 0,
            to: DICTIONARY_LIST_ITEMS_PER_PAGE,
        });
    }, []);

    // Show "no results" message when search is active but returned no results
    if (searchWords !== undefined && searchWords.length === 0) {
        return (
            <Box sx={{ paddingTop: 4 }}>
                <Typography textAlign="center" padding="0 70px" color="text.secondary">
                    No words found matching your search.
                </Typography>
            </Box>
        );
    }

    // Show empty state when dictionary has no words
    if (storedWordsCounter === 0 && !isLoading) {
        return (
            <Box className="h-full flex items-center">
                <Box>
                    <img src="/images/empty_dictionary.png" alt="" />
                    <Typography textAlign="center" padding="0 70px">
                        Start adding words to the dictionary
                        <br />
                        by selecting and translating them in your book.
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <List disablePadding className="h-full overflow-y-auto">
            {displayWords.map((word, key) => (
                <WordsListItem
                    key={key}
                    word={word}
                    divider={key < displayWords.length - 1}
                    onDelete={handleDeleteWord}
                />
            ))}
        </List>
    );
}
