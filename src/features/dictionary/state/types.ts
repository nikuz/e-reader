import type { Navigator } from '@solidjs/router';
import type { DatabaseController } from 'src/controllers';
import type { DictionaryWord } from '../types';

export interface DictionaryStateContext {
    dbController: DatabaseController<DictionaryWord>,
    navigator?: Navigator,

    storedWords: DictionaryWord[],

    errorMessage?: string,
}

interface InitializeEvent { type: 'INITIALIZE' }

export type DictionaryStateEvents = 
    | InitializeEvent;
