import type { ActorRefFrom } from 'xstate';
import type { DatabaseController } from 'src/controllers';
import type { BookHighlight } from 'src/types';
import type { DictionaryWord } from '../types';
import { translationRetrieverMachine } from './actors/translation-retriever';

export interface QueueManagerStateContext {
    dbController: DatabaseController<DictionaryWord>,
    requests: Record<string, ActorRefFrom<typeof translationRetrieverMachine>>,
}

export interface RequestTranslationEvent {
    type: 'REQUEST_TRANSLATION',
    highlight: BookHighlight,
}

export interface QueueManagerTranslationRequestSuccessEvent {
    type: 'QUEUE_MANAGER_TRANSLATION_REQUEST_SUCCESS',
    highlight: BookHighlight,
    word: DictionaryWord,
}

export interface QueueManagerTranslationRequestErrorEvent {
    type: 'QUEUE_MANAGER_TRANSLATION_REQUEST_ERROR',
    highlight: BookHighlight,
    error: unknown,
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
}

export interface QueueManagerImageRequestErrorEvent {
    type: 'QUEUE_MANAGER_TRANSLATION_REQUEST_ERROR',
    highlight: BookHighlight,
    word: DictionaryWord,
    error: unknown,
}

export type QueueManagerStateEvents = 
    | RequestTranslationEvent
    | QueueManagerTranslationRequestSuccessEvent
    | QueueManagerTranslationRequestErrorEvent
    | RequestImageEvent;
