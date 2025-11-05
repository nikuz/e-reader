import type { ActorRefFrom } from 'xstate';
import type { NavigateFunction } from 'react-router-dom';
import type { DatabaseController } from 'src/controllers';
import type { BookHighlight } from 'src/types';
import { queueManagerStateMachine } from '../queue-manager';
import type { DictionaryWord } from '../types';

export interface DictionaryStateContext {
    dbController: DatabaseController<DictionaryWord>,
    navigator?: NavigateFunction,

    storedWords: DictionaryWord[],

    errorMessage?: string,

    queueManagerRef?: ActorRefFrom<typeof queueManagerStateMachine>,
}

interface InitializeEvent { type: 'INITIALIZE' }

export interface RequestWordAnalysisEvent {
    type: 'REQUEST_WORD_ANALYSIS',
    highlight: BookHighlight,
}

export interface RequestImageEvent {
    type: 'REQUEST_IMAGE',
    highlight: BookHighlight,
    word: DictionaryWord,
}

export type DictionaryStateEvents = 
    | InitializeEvent
    | RequestWordAnalysisEvent
    | RequestImageEvent;
