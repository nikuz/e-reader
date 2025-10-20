import type { NavigateFunction } from 'react-router-dom';
import type { DatabaseController } from 'src/controllers';
import type { DictionaryWord } from '../types';

export interface DictionaryStateContext {
    dbController: DatabaseController<DictionaryWord>,
    navigator?: NavigateFunction,

    storedWords: DictionaryWord[],

    errorMessage?: string,
}

interface InitializeEvent { type: 'INITIALIZE' }

export type DictionaryStateEvents = 
    | InitializeEvent;
