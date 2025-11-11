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
    type QueueManagerRequestImageEvent,
    type QueueManagerImageRequestSuccessEvent,
    type QueueManagerImageRequestErrorEvent,
    type QueueManagerRequestPronunciationEvent,
    type QueueManagerPronunciationRequestSuccessEvent,
    type QueueManagerPronunciationRequestErrorEvent,
    type QueueManagerRequestContextAnalysisEvent,
    type QueueManagerContextAnalysisRequestSuccessEvent,
    type QueueManagerContextAnalysisExplanationRequestSuccessEvent,
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

export interface ClearWordSelectionEvent { type: 'CLEAR_WORD_SELECTION' }

export interface ClearErrorMessageEvent { type: 'CLEAR_ERROR_MESSAGE' }

export interface ListGetWordsChunkEvent {
    type: 'LIST_GET_WORDS_CHUNK',
    from: number,
    to: number,
}

export interface CleanupEvent { type: 'CLEANUP' }

export interface ClearDatabaseEvent { type: 'CLEAR_DATABASE' }

export type DictionaryStateEvents =
    | InitializeEvent
    | RequestWordAnalysisEvent
    | QueueManagerWordAnalysisRequestSuccessEvent
    | QueueManagerWordAnalysisRequestErrorEvent
    | QueueManagerWordAnalysisTranslationRetrievedEvent
    | QueueManagerWordAnalysisExplanationRetrievedEvent
    | QueueManagerWordAnalysisPronunciationRetrievedEvent
    | QueueManagerRequestImageEvent
    | QueueManagerImageRequestSuccessEvent
    | QueueManagerImageRequestErrorEvent
    | QueueManagerRequestPronunciationEvent
    | QueueManagerPronunciationRequestSuccessEvent
    | QueueManagerPronunciationRequestErrorEvent
    | QueueManagerRequestContextAnalysisEvent
    | QueueManagerContextAnalysisRequestSuccessEvent
    | QueueManagerContextAnalysisExplanationRequestSuccessEvent
    | QueueManagerContextAnalysisRequestErrorEvent
    | ClearWordSelectionEvent
    | ClearErrorMessageEvent
    | ListGetWordsChunkEvent
    | CleanupEvent
    | ClearDatabaseEvent;
