import { fromPromise } from 'xstate';
import type { DatabaseController } from 'src/controllers';
import type { BookHighlight } from 'src/types';
import { createWordInDB, getWordFromDB } from '../../../db-service';
import { getNewDictionaryWord } from '../../../utils';
import type { DictionaryWord, Language } from '../../../types';

export const dbSaverActor = fromPromise(async (props: {
    input: {
        dbController: DatabaseController,
        bookId: string,
        highlight: BookHighlight,
        translation?: string,
        explanation?: string,
        pronunciation?: string,
        sourceLanguage: Language,
        targetLanguage: Language,
    },
}): Promise<DictionaryWord> => {
    const {
        dbController,
        bookId,
        highlight,
        translation,
        explanation,
        pronunciation,
        sourceLanguage,
        targetLanguage,
    } = props.input;

    if (!translation || !explanation) {
        throw new Error('Can\'t create new dictionary word without "translation" and "explanation".');
    }

    const newWord = getNewDictionaryWord({
        bookId,
        highlight,
        translation,
        explanation,
        pronunciation,
        sourceLanguage,
        targetLanguage,
    });

    await createWordInDB({
        db: dbController,
        bookId,
        word: newWord,
    });

    const storedWord = await getWordFromDB({
        db: dbController,
        text: newWord.text,
        sourceLanguage: newWord.sourceLanguage,
        targetLanguage: newWord.targetLanguage,
    });

    if (!storedWord) {
        throw new Error('Can\'t retrieve just saved word from local DB');
    }

    return storedWord;
});