import { useEffect, Fragment } from 'react';
import { List, Divider } from 'src/design-system/components';
import { dictionaryStateMachineActor } from '../../state';
import { useDictionaryStateSelect } from '../../state/hooks';
import { DICTIONARY_LIST_ITEMS_PER_PAGE } from '../../constants';
import { WordsListItem } from './WordsListItem';
import type { DictionaryWord } from '../../types';

export function WordsList() {
    const storedWords = useDictionaryStateSelect('storedWords');

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
