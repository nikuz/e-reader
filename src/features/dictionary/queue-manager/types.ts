import type { BookHighlight, Language } from 'src/types';
import type { DictionaryWord, DictionaryWordContext } from '../types';

export interface QueueManagerStateContext {
    requests: Record<string, string>,
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
    highlight: BookHighlight,
}

export interface QueueManagerWordAnalysisRequestErrorEvent {
    type: 'QUEUE_MANAGER_WORD_ANALYSIS_REQUEST_ERROR',
    word: DictionaryWord,
    highlight: BookHighlight,
    error: unknown,
}

export interface QueueManagerWordAnalysisTranslationRetrievedEvent {
    type: 'QUEUE_MANAGER_WORD_ANALYSIS_TRANSLATION_RETRIEVED',
    word: DictionaryWord,
    translation: string,
    highlight: BookHighlight,
}

export interface QueueManagerWordAnalysisExplanationRetrievedEvent {
    type: 'QUEUE_MANAGER_WORD_ANALYSIS_EXPLANATION_RETRIEVED',
    word: DictionaryWord,
    explanation: string,
    highlight: BookHighlight,
}

export interface QueueManagerWordAnalysisPronunciationRetrievedEvent {
    type: 'QUEUE_MANAGER_WORD_ANALYSIS_PRONUNCIATION_RETRIEVED',
    word: DictionaryWord,
    pronunciation: string,
    highlight: BookHighlight,
}

export interface QueueManagerWordAnalysisUpdateEvent {
    type: 'QUEUE_MANAGER_WORD_ANALYSIS_UPDATE',
    word: DictionaryWord,
    highlight: BookHighlight,
    translation: string | undefined,
    explanation: string | undefined,
    pronunciation: string | undefined,
}

export interface QueueManagerRequestImageEvent {
    type: 'REQUEST_IMAGE',
    word: DictionaryWord,
    highlight: BookHighlight,
}

export interface QueueManagerImageRequestSuccessEvent {
    type: 'QUEUE_MANAGER_IMAGE_REQUEST_SUCCESS',
    word: DictionaryWord,
    highlight: BookHighlight,
}

export interface QueueManagerImageRequestErrorEvent {
    type: 'QUEUE_MANAGER_IMAGE_REQUEST_ERROR',
    word: DictionaryWord,
    highlight: BookHighlight,
    error: unknown,
}

export interface QueueManagerRequestPronunciationEvent {
    type: 'REQUEST_PRONUNCIATION',
    word: DictionaryWord,
    highlight: BookHighlight,
}

export interface QueueManagerPronunciationRequestSuccessEvent {
    type: 'QUEUE_MANAGER_PRONUNCIATION_REQUEST_SUCCESS',
    word: DictionaryWord,
    highlight: BookHighlight,
}

export interface QueueManagerPronunciationRequestErrorEvent {
    type: 'QUEUE_MANAGER_PRONUNCIATION_REQUEST_ERROR',
    word: DictionaryWord,
    highlight: BookHighlight,
    error: unknown,
}

export interface QueueManagerRequestContextAnalysisEvent {
    type: 'REQUEST_CONTEXT_ANALYSIS',
    word: DictionaryWord,
    context: DictionaryWordContext,
    highlight: BookHighlight,
}

export interface QueueManagerContextAnalysisExplanationRequestSuccessEvent {
    type: 'QUEUE_MANAGER_CONTEXT_ANALYSIS_EXPLANATION_REQUEST_SUCCESS',
    word: DictionaryWord,
    highlight: BookHighlight,
}

export interface QueueManagerContextAnalysisRequestSuccessEvent {
    type: 'QUEUE_MANAGER_CONTEXT_ANALYSIS_REQUEST_SUCCESS',
    word: DictionaryWord,
    context: DictionaryWordContext,
    highlight: BookHighlight,
}

export interface QueueManagerContextAnalysisRequestErrorEvent {
    type: 'QUEUE_MANAGER_CONTEXT_ANALYSIS_REQUEST_ERROR',
    word: DictionaryWord,
    context: DictionaryWordContext,
    highlight: BookHighlight,
    error: unknown,
}

export type QueueManagerStateEvents = 
    | QueueManagerRequestWordAnalysisEvent
    | QueueManagerWordAnalysisTranslationRetrievedEvent
    | QueueManagerWordAnalysisExplanationRetrievedEvent
    | QueueManagerWordAnalysisPronunciationRetrievedEvent
    | QueueManagerWordAnalysisUpdateEvent
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
