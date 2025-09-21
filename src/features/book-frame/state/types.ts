import type { BookAttributes } from '../types';

export interface bookFrameStateContext {
    book?: BookAttributes,

    errorMessage?: string,
}

export interface LoadBookEvent {
    type: 'LOAD_BOOK',
    src: string,
}

export type bookFrameStateEvents =
    | LoadBookEvent;