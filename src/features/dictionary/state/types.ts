import type { NavigateFunction } from 'react-router-dom';
import type { DatabaseController } from 'src/controllers';
import type { BookHighlight } from 'src/types';
import type { DictionaryWord } from '../types';

export interface DictionaryStateContext {
    dbController: DatabaseController<DictionaryWord>,
    navigator?: NavigateFunction,

    storedWords: DictionaryWord[],

    errorMessage?: string,
}

interface InitializeEvent { type: 'INITIALIZE' }

export interface RequestTranslationAction {
    type: 'REQUEST_TRANSLATION',
    highlight: BookHighlight,
}

export type DictionaryStateEvents = 
    | InitializeEvent
    | RequestTranslationAction;
