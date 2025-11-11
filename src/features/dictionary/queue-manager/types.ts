import type { ActorRefFrom } from 'xstate';
import type { DatabaseController } from 'src/controllers';
import type { BookHighlight } from 'src/types';
import type { DictionaryWord, DictionaryWordContext, Language } from '../types';
import { wordAnalysisRetrieverMachine } from './actors/word-analysis-retriever';
import { imageRetrieverMachine } from './actors/image-retriever';
import { pronunciationRetrieverMachine } from './actors/pronunciation-retriever';
import { contextAnalysisRetrieverMachine } from './actors/context-analysis-retriever';

export interface QueueManagerStateContext {
    dbController: DatabaseController,
    requests: Record<string, ActorRefFrom<
        typeof wordAnalysisRetrieverMachine
        | typeof imageRetrieverMachine
        | typeof pronunciationRetrieverMachine
        | typeof contextAnalysisRetrieverMachine
    >>,
}

export interface QueueManagerRequestWordAnalysisEvent {
    type: 'REQUEST_WORD_ANALYSIS',
    bookId: string,
    highlight: BookHighlight,
    word: DictionaryWord,
    sourceLanguage: Language,
    targetLanguage: Language,
}

export interface QueueManagerWordAnalysisRequestSuccessEvent {
    type: 'QUEUE_MANAGER_WORD_ANALYSIS_REQUEST_SUCCESS',
    word: DictionaryWord,
}

export interface QueueManagerWordAnalysisRequestErrorEvent {
    type: 'QUEUE_MANAGER_WORD_ANALYSIS_REQUEST_ERROR',
    word: DictionaryWord,
    error: unknown,
}

export interface QueueManagerWordAnalysisTranslationRetrievedEvent {
    type: 'QUEUE_MANAGER_WORD_ANALYSIS_TRANSLATION_RETRIEVED',
    word: DictionaryWord,
    translation: string,
}

export interface QueueManagerWordAnalysisExplanationRetrievedEvent {
    type: 'QUEUE_MANAGER_WORD_ANALYSIS_EXPLANATION_RETRIEVED',
    word: DictionaryWord,
    explanation: string,
}

export interface QueueManagerWordAnalysisPronunciationRetrievedEvent {
    type: 'QUEUE_MANAGER_WORD_ANALYSIS_PRONUNCIATION_RETRIEVED',
    word: DictionaryWord,
    pronunciation: string,
}

export interface QueueManagerRequestImageEvent {
    type: 'REQUEST_IMAGE',
    word: DictionaryWord,
}

export interface QueueManagerImageRequestSuccessEvent {
    type: 'QUEUE_MANAGER_IMAGE_REQUEST_SUCCESS',
    word: DictionaryWord,
}

export interface QueueManagerImageRequestErrorEvent {
    type: 'QUEUE_MANAGER_IMAGE_REQUEST_ERROR',
    word: DictionaryWord,
    error: unknown,
}

export interface QueueManagerRequestPronunciationEvent {
    type: 'REQUEST_PRONUNCIATION',
    word: DictionaryWord,
}

export interface QueueManagerPronunciationRequestSuccessEvent {
    type: 'QUEUE_MANAGER_PRONUNCIATION_REQUEST_SUCCESS',
    word: DictionaryWord,
}

export interface QueueManagerPronunciationRequestErrorEvent {
    type: 'QUEUE_MANAGER_PRONUNCIATION_REQUEST_ERROR',
    word: DictionaryWord,
    error: unknown,
}

export interface QueueManagerRequestContextAnalysisEvent {
    type: 'REQUEST_CONTEXT_ANALYSIS',
    word: DictionaryWord,
    context: DictionaryWordContext,
}

export interface QueueManagerContextAnalysisExplanationRequestSuccessEvent {
    type: 'QUEUE_MANAGER_CONTEXT_ANALYSIS_EXPLANATION_REQUEST_SUCCESS',
    word: DictionaryWord,
}

export interface QueueManagerContextAnalysisRequestSuccessEvent {
    type: 'QUEUE_MANAGER_CONTEXT_ANALYSIS_REQUEST_SUCCESS',
    word: DictionaryWord,
    context: DictionaryWordContext,
}

export interface QueueManagerContextAnalysisRequestErrorEvent {
    type: 'QUEUE_MANAGER_CONTEXT_ANALYSIS_REQUEST_ERROR',
    word: DictionaryWord,
    context: DictionaryWordContext,
    error: unknown,
}

export type QueueManagerStateEvents = 
    | QueueManagerRequestWordAnalysisEvent
    | QueueManagerWordAnalysisRequestSuccessEvent
    | QueueManagerWordAnalysisRequestErrorEvent
    | QueueManagerRequestImageEvent
    | QueueManagerImageRequestSuccessEvent
    | QueueManagerImageRequestErrorEvent
    | QueueManagerRequestPronunciationEvent
    | QueueManagerPronunciationRequestSuccessEvent
    | QueueManagerPronunciationRequestErrorEvent
    | QueueManagerRequestContextAnalysisEvent
    | QueueManagerContextAnalysisExplanationRequestSuccessEvent
    | QueueManagerContextAnalysisRequestSuccessEvent
    | QueueManagerContextAnalysisRequestErrorEvent;
