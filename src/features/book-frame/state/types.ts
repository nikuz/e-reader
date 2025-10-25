import type { ActorRefFrom } from 'xstate';
import type { BookAttributes, Size, Position } from 'src/types';
import type { BookReadProgress } from '../types';
import { bookLoaderStateMachine } from '../loader/state';
import type { SaveReadProgressEvent } from '../loader/types';

export interface BookFrameStateContext {
    bookAttributes?: BookAttributes,
    readProgress: BookReadProgress,

    iframeEl?: HTMLIFrameElement,
    scrollPosition: number,
    screenRect: Size,

    frameTouchStartTime?: number,
    frameTouchMoveTime?: number,
    frameInteractionStartPosition?: Position,
    
    chapterUrl?: string,
    deferredRevokeChapterUrl?: string,
    prevChapter?: number,
    chapterRect: Size,

    textSelection?: Selection,
    textSelectionBaseRange?: Range,
    textSelectionCreateEndtimeTime?: number,

    menuPanelsVisible: boolean,

    errorMessage?: string,

    loaderMachineRef?: ActorRefFrom<typeof bookLoaderStateMachine>,
}

export interface LoadBookEvent {
    type: 'LOAD_BOOK',
    bookAttributes: BookAttributes,
}

export interface BookLoadSuccessEvent {
    type: 'BOOK_LOAD_SUCCESS',
    bookAttributes: BookAttributes,
    readProgress?: BookReadProgress,
}

export interface BookLoadErrorEvent {
    type: 'BOOK_LOAD_ERROR',
    errorMessage?: string,
}

export interface CloseBookLoadErrorEvent { type: 'CLOSE_BOOK_LOAD_ERROR' }

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

export interface UpdateBookAttributesEvent {
    type: 'UPDATE_BOOK_ATTRIBUTES',
    bookAttributes: BookAttributes,
}

export interface UpdateSettingsCSSEvent {
    type: 'UPDATE_SETTINGS_CSS',
    settingsCSS: string,
}

export interface UpdateFontCSSEvent {
    type: 'UPDATE_FONT_CSS',
    fontCSS: string,
}

export interface UpdateHighlightsCSSEvent {
    type: 'UPDATE_HIGHLIGHTS_CSS',
    highlightsCSSValue: string,
}

export interface HideMenuPanelsEvent {
    type: 'HIDE_MENU_PANELS',
}

export interface StoreHighlightAction {
    type: 'STORE_HIGHLIGHT',
}

export type BookFrameStateEvents =
    | LoadBookEvent
    | BookLoadSuccessEvent
    | BookLoadErrorEvent
    | CloseBookLoadErrorEvent
    | ChapterLoadEvent
    | FrameTouchStartEvent
    | FrameTouchMoveEvent
    | FrameResizeEvent
    | FrameBodyResizeEvent
    | FrameTouchEndEvent
    | FrameTouchCancelEvent
    | PageTurnNextEvent
    | PageTurnPrevEvent
    | SetTextSelectionEvent
    | SaveReadProgressEvent
    | UpdateBookAttributesEvent
    | UpdateSettingsCSSEvent
    | UpdateFontCSSEvent
    | UpdateHighlightsCSSEvent
    | HideMenuPanelsEvent
    | StoreHighlightAction;
