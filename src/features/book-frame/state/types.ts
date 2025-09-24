import type { Size, Position } from 'src/types';
import type { BookAttributes, BookSettings } from '../types';

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

export interface SelectTextEvent {
    type: 'SELECT_TEXT',
    position: Position,
}

export type BookFrameStateEvents =
    | LoadBookEvent
    | ChapterLoadEvent
    | FrameTouchStartEvent
    | FrameTouchMoveEvent
    | FrameResizeEvent
    | FrameBodyResizeEvent
    | FrameTouchEndEvent
    | FrameTouchCancelEvent
    | PageTurnNextEvent
    | PageTurnPrevEvent
    | SelectTextEvent;