import type { BookAttributes, BookSettings, Position } from '../types';

export interface BookFrameStateContext {
    book?: BookAttributes,
    settings: BookSettings,

    iframeEl?: HTMLIFrameElement,

    frameInteractionStartTime?: number,

    errorMessage?: string,
}

export interface LoadBookEvent {
    type: 'LOAD_BOOK',
    src: string,
}

export interface ChapterLoadEvent {
    type: 'CHAPTER_LOAD',
    iframeEl: HTMLIFrameElement,
}

interface FrameTouchStartEvent { type: 'FRAME_TOUCH_START' }

interface FrameTouchMoveEvent { type: 'FRAME_TOUCH_MOVE' }

export interface FrameTouchEndEvent {
    type: 'FRAME_TOUCH_END',
    position: Position,
}

interface FrameTouchCancelEvent { type: 'FRAME_TOUCH_CANCEL' }

interface PageTurnNextEvent { type: 'PAGE_TURN_NEXT' }

interface PageTurnPrevEvent { type: 'PAGE_TURN_PREV' }

export interface SelectTextEvent {
    type: 'SELECT_TEXT',
    position: Position,
}

export type BookFrameStateEvents =
    | LoadBookEvent
    | ChapterLoadEvent
    | FrameTouchStartEvent
    | FrameTouchMoveEvent
    | FrameTouchEndEvent
    | FrameTouchCancelEvent
    | PageTurnNextEvent
    | PageTurnPrevEvent
    | SelectTextEvent;