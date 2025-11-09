import type { ActorRefFrom } from 'xstate';
import type { DatabaseController } from 'src/controllers';
import type { BookHighlight } from 'src/types';
import type { DictionaryWord, Language } from '../types';
import { wordAnalysisRetrieverMachine } from './actors/word-analysis-retriever';
import { imageRetrieverMachine } from './actors/image-retriever';

export interface QueueManagerStateContext {
    dbController: DatabaseController,
    requests: Record<string, ActorRefFrom<typeof wordAnalysisRetrieverMachine | typeof imageRetrieverMachine>>,
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

export interface RequestImageEvent {
    type: 'REQUEST_IMAGE',
    highlight: BookHighlight,
    word: DictionaryWord,
}

export interface QueueManagerImageRequestSuccessEvent {
    type: 'QUEUE_MANAGER_IMAGE_REQUEST_SUCCESS',
    word: DictionaryWord,
    image: string,
}

export interface QueueManagerImageRequestErrorEvent {
    type: 'QUEUE_MANAGER_IMAGE_REQUEST_ERROR',
    word: DictionaryWord,
    error: unknown,
}

export type QueueManagerStateEvents = 
    | QueueManagerRequestWordAnalysisEvent
    | QueueManagerWordAnalysisRequestSuccessEvent
    | QueueManagerWordAnalysisRequestErrorEvent
    | RequestImageEvent
    | QueueManagerImageRequestSuccessEvent
    | QueueManagerImageRequestErrorEvent;
