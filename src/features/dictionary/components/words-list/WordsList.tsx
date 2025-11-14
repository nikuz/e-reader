import { useEffect, Fragment } from 'react';
import { Box, List, Divider, Typography } from 'src/design-system/components';
import { dictionaryStateMachineActor } from '../../state';
import { useDictionaryStateSelect } from '../../state/hooks';
import { DICTIONARY_LIST_ITEMS_PER_PAGE } from '../../constants';
import { WordsListItem } from './WordsListItem';
import type { DictionaryWord } from '../../types';

export function WordsList() {
    const storedWords = useDictionaryStateSelect('storedWords');
    const storedWordsCounter = useDictionaryStateSelect('storedWordsCounter');

    const handleDeleteWord = (word: DictionaryWord) => {
        dictionaryStateMachineActor.send({
            type: 'DELETE_WORD',
            wordId: word.id,
        });
    };

    useEffect(() => {
        dictionaryStateMachineActor.send({
            type: 'LIST_GET_WORDS_CHUNK',
            from: 0,
            to: DICTIONARY_LIST_ITEMS_PER_PAGE,
        });
    }, []);

    if (storedWordsCounter === 0) {
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
        <List>
            {storedWords.map((word, key) => (
                <Fragment key={word.id}>
                    <WordsListItem
                        word={word}
                        onDelete={handleDeleteWord}
                    />
                    {key < storedWords.length - 1 && (
                        <Divider />
                    )}
                </Fragment>
            ))}
        </List>
    );
}
