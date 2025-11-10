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
    type QueueManagerImageRequestSuccessEvent,
    type QueueManagerImageRequestErrorEvent,
    type QueueManagerContextAnalysisRequestSuccessEvent,
    type QueueManagerContextAnalysisRequestErrorEvent,
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
    word: DictionaryWord,
}

export interface RequestContextAnalysisEvent {
    type: 'REQUEST_CONTEXT_ANALYSIS',
    highlight: BookHighlight,
    word: DictionaryWord,
}

export interface ClearWordSelectionEvent { type: 'CLEAR_WORD_SELECTION' }

export interface ClearDatabaseEvent { type: 'CLEAR_DATABASE' }

export type DictionaryStateEvents = 
    | InitializeEvent
    | RequestWordAnalysisEvent
    | QueueManagerWordAnalysisRequestSuccessEvent
    | QueueManagerWordAnalysisRequestErrorEvent
    | QueueManagerWordAnalysisTranslationRetrievedEvent
    | QueueManagerWordAnalysisExplanationRetrievedEvent
    | QueueManagerWordAnalysisPronunciationRetrievedEvent
    | RequestImageEvent
    | QueueManagerImageRequestSuccessEvent
    | QueueManagerImageRequestErrorEvent
    | RequestContextAnalysisEvent
    | QueueManagerContextAnalysisRequestSuccessEvent
    | QueueManagerContextAnalysisRequestErrorEvent
    | ClearWordSelectionEvent
    | ClearDatabaseEvent;
