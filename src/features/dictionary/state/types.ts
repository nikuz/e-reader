import type { ActorRefFrom } from 'xstate';
import type { NavigateFunction } from 'react-router-dom';
import type { BookHighlight, Language } from 'src/types';
import {
    queueManagerStateMachine,
    type QueueManagerWordAnalysisRequestSuccessEvent,
    type QueueManagerWordAnalysisRequestErrorEvent,
    type QueueManagerWordAnalysisTranslationRetrievedEvent,
    type QueueManagerWordAnalysisExplanationRetrievedEvent,
    type QueueManagerWordAnalysisPronunciationRetrievedEvent,
    type QueueManagerWordAnalysisUpdateEvent,
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
import type { DictionaryWord } from '../types';

export interface DictionaryStateContext {
    navigator?: NavigateFunction,

    storedWords: DictionaryWord[],
    storedWordsCounter?: number,

    searchWords?: DictionaryWord[],
    searchWordsCounter?: number,

    translatingWord?: DictionaryWord,
    translatingHighlight?: BookHighlight,

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
    type: 'GET_WORDS_LIST_CHUNK',
    from: number,
    to: number,
}

export interface CleanupEvent { type: 'CLEANUP' }

export interface DeleteWordEvent {
    type: 'DELETE_WORD',
    wordId: number,
}

export interface SearchWordEvent {
    type: 'SEARCH_WORD',
    searchText: string,
}

export interface ClearSearchResultsEvent { type: 'CLEAR_SEARCH_RESULTS' }

export type DictionaryStateEvents =
    | InitializeEvent
    | RequestWordAnalysisEvent
    | QueueManagerWordAnalysisRequestSuccessEvent
    | QueueManagerWordAnalysisRequestErrorEvent
    | QueueManagerWordAnalysisTranslationRetrievedEvent
    | QueueManagerWordAnalysisExplanationRetrievedEvent
    | QueueManagerWordAnalysisPronunciationRetrievedEvent
    | QueueManagerWordAnalysisUpdateEvent
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
    | DeleteWordEvent
    | SearchWordEvent
    | ClearSearchResultsEvent;
