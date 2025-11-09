import type { ActorRefFrom } from 'xstate';
import type { NavigateFunction } from 'react-router-dom';
import type { DatabaseController } from 'src/controllers';
import type { BookHighlight } from 'src/types';
import {
    queueManagerStateMachine,
    type QueueManagerWordAnalysisRequestSuccessEvent,
    type QueueManagerWordAnalysisRequestErrorEvent,
    type QueueManagerWordAnalysisTranslationRetrievedEvent,
    type QueueManagerWordAnalysisExplanationRetrievedEvent,
    type QueueManagerWordAnalysisPronunciationRetrievedEvent,
} from '../queue-manager';
import type { DictionaryWord, Language } from '../types';

export interface DictionaryStateContext {
    dbController: DatabaseController,
    navigator?: NavigateFunction,

    storedWords: DictionaryWord[],

    translatingWord?: DictionaryWord,
    selectedWord?: DictionaryWord,

    errorMessage?: string,

    queueManagerRef?: ActorRefFrom<typeof queueManagerStateMachine>,
}

interface InitializeEvent { type: 'INITIALIZE' }

export interface RequestWordAnalysisEvent {
    type: 'REQUEST_WORD_ANALYSIS',
    bookId: string,
    highlight: BookHighlight,
    sourceLanguage: Language,
    targetLanguage: Language,
}

export interface RequestImageEvent {
    type: 'REQUEST_IMAGE',
    highlight: BookHighlight,
    word: DictionaryWord,
}

export interface ClearWordSelectionEvent { type: 'CLEAR_WORD_SELECTION' }

export interface ClearDatabaseEvent { type: 'CLEAR_DATABASE' }

export type DictionaryStateEvents = 
    | InitializeEvent
    | RequestWordAnalysisEvent
    | RequestImageEvent
    | QueueManagerWordAnalysisRequestSuccessEvent
    | QueueManagerWordAnalysisRequestErrorEvent
    | QueueManagerWordAnalysisTranslationRetrievedEvent
    | QueueManagerWordAnalysisExplanationRetrievedEvent
    | QueueManagerWordAnalysisPronunciationRetrievedEvent
    | ClearWordSelectionEvent
    | ClearDatabaseEvent;
