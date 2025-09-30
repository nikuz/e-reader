import type { ActorRefFrom } from 'xstate';
import type { BookAttributes, BookSettings, Size, Position } from 'src/types';
import { bookLoaderStateMachine } from '../loader/state';

export interface BookFrameStateContext {
    book?: BookAttributes,
    settings: BookSettings,

    iframeEl?: HTMLIFrameElement,
    scrollPosition: number,
    screenRect: Size,

    frameInteractionStartTime?: number,
    frameInteractionStartPosition?: Position,
    
    chapterContent?: string,
    prevChapter?: number,
    chapterRect: Size,

    textSelection?: Selection,

    errorMessage?: string,

    loaderMachineRef?: ActorRefFrom<typeof bookLoaderStateMachine>,
}

export interface LoadBookEvent {
    type: 'LOAD_BOOK',
    src: string,
}

export interface BookLoadSuccessEvent {
    type: 'BOOK_LOAD_SUCCESS',
    book: BookAttributes,
}

export interface BookLoadErrorEvent {
    type: 'BOOK_LOAD_ERROR',
    errorMessage?: string,
}

export interface ChapterLoadEvent {
    type: 'CHAPTER_LOAD',
    iframeEl: HTMLIFrameElement,
}

export interface FrameTouchStartEvent {
    type: 'FRAME_TOUCH_START',
    position: Position,
}

export interface FrameTouchMoveEvent {
    type: 'FRAME_TOUCH_MOVE',
    position: Position,
}

interface FrameResizeEvent { type: 'FRAME_RESIZE' }

interface FrameBodyResizeEvent {
    type: 'FRAME_BODY_RESIZE',
    rect: DOMRect,
}

export interface FrameTouchEndEvent {
    type: 'FRAME_TOUCH_END',
    position: Position,
}

interface FrameTouchCancelEvent { type: 'FRAME_TOUCH_CANCEL' }

interface PageTurnNextEvent { type: 'PAGE_TURN_NEXT' }

interface PageTurnPrevEvent { type: 'PAGE_TURN_PREV' }

export interface SetTextSelectionEvent {
    type: 'SET_TEXT_SELECTION',
    textSelection: Selection,
}

export type BookFrameStateEvents =
    | LoadBookEvent
    | BookLoadSuccessEvent
    | BookLoadErrorEvent
    | ChapterLoadEvent
    | FrameTouchStartEvent
    | FrameTouchMoveEvent
    | FrameResizeEvent
    | FrameBodyResizeEvent
    | FrameTouchEndEvent
    | FrameTouchCancelEvent
    | PageTurnNextEvent
    | PageTurnPrevEvent
    | SetTextSelectionEvent;