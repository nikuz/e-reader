import { fromPromise } from 'xstate';
import type { BookHighlight } from 'src/types';
import { upsertWordInDB } from '../../../db-service';
import { getNewDictionaryWord } from '../../../utils';
import type { Language } from '../../../types';

export const dbUpsertActor = fromPromise(async (props: {
    input: {
        bookId: string,
        highlight: BookHighlight,
        translation?: string,
        explanation?: string,
        pronunciation?: string,
        sourceLanguage: Language,
        targetLanguage: Language,
    },
}): Promise<void> => {
    const {
        bookId,
        highlight,
        translation,
        explanation,
        pronunciation,
        sourceLanguage,
        targetLanguage,
    } = props.input;

    const newWord = getNewDictionaryWord({
        bookId,
        highlight,
        translation: translation || '',
        explanation: explanation || '',
        pronunciation,
        sourceLanguage,
        targetLanguage,
    });

    await upsertWordInDB({
        bookId,
        word: newWord,
    });
});
