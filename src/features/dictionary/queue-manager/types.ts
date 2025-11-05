import type { ActorRefFrom } from 'xstate';
import type { DatabaseController } from 'src/controllers';
import type { BookHighlight } from 'src/types';
import type { DictionaryWord } from '../types';
import { wordAnalysisRetrieverMachine } from './actors/word-analysis-retriever';
import { imageRetrieverMachine } from './actors/image-retriever';

export interface QueueManagerStateContext {
    dbController: DatabaseController<DictionaryWord>,
    requests: Record<string, ActorRefFrom<typeof wordAnalysisRetrieverMachine | typeof imageRetrieverMachine>>,
}

export interface RequestWordAnalysisEvent {
    type: 'REQUEST_WORD_ANALYSIS',
    highlight: BookHighlight,
}

export interface QueueManagerWordAnalysisRequestSuccessEvent {
    type: 'QUEUE_MANAGER_WORD_ANALYSIS_REQUEST_SUCCESS',
    highlight: BookHighlight,
    word: DictionaryWord,
}

export interface QueueManagerWordAnalysisRequestErrorEvent {
    type: 'QUEUE_MANAGER_WORD_ANALYSIS_REQUEST_ERROR',
    highlight: BookHighlight,
    error: unknown,
}

export interface QueueManagerWordAnalysisTranslationRetrievedEvent {
    type: 'QUEUE_MANAGER_WORD_ANALYSIS_TRANSLATION_RETRIEVED',
    highlight: BookHighlight,
    translation: string,
}

export interface QueueManagerWordAnalysisExplanationRetrievedEvent {
    type: 'QUEUE_MANAGER_WORD_ANALYSIS_EXPLANATION_RETRIEVED',
    highlight: BookHighlight,
    explanation: string,
}

export interface QueueManagerWordAnalysisPronunciationRetrievedEvent {
    type: 'QUEUE_MANAGER_WORD_ANALYSIS_PRONUNCIATION_RETRIEVED',
    highlight: BookHighlight,
    pronunciation: string,
}

export interface RequestImageEvent {
    type: 'REQUEST_IMAGE',
    highlight: BookHighlight,
    word: DictionaryWord,
}

export interface QueueManagerImageRequestSuccessEvent {
    type: 'QUEUE_MANAGER_IMAGE_REQUEST_SUCCESS',
    highlight: BookHighlight,
    word: DictionaryWord,
    image: string,
}

export interface QueueManagerImageRequestErrorEvent {
    type: 'QUEUE_MANAGER_IMAGE_REQUEST_ERROR',
    highlight: BookHighlight,
    word: DictionaryWord,
    error: unknown,
}

export type QueueManagerStateEvents = 
    | RequestWordAnalysisEvent
    | QueueManagerWordAnalysisRequestSuccessEvent
    | QueueManagerWordAnalysisRequestErrorEvent
    | RequestImageEvent
    | QueueManagerImageRequestSuccessEvent
    | QueueManagerImageRequestErrorEvent;
