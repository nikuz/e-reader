import type { ActorRefFrom } from 'xstate';
import type { BookModel } from 'src/models';
import type { BookChapter, Size, Position, BookHighlight } from 'src/types';
import type { BookReadProgress } from '../types';
import { bookLoaderStateMachine } from '../loader/state';
import type { SaveReadProgressEvent } from '../loader/types';

export interface BookFrameStateContext {
    book?: BookModel,
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
    chapterHadBeenInteracted: boolean,
    chapterScrolledToEnd: boolean,

    textSelection?: Selection,
    textSelectionBaseRange?: Range,
    textSelectionCreateEndTime?: number,
    selectedHighlight?: BookHighlight,

    menuPanelsVisible: boolean,

    errorMessage?: string,

    loaderMachineRef?: ActorRefFrom<typeof bookLoaderStateMachine>,
}

export interface LoadBookEvent {
    type: 'LOAD_BOOK',
    book: BookModel,
}

export interface BookLoadSuccessEvent {
    type: 'BOOK_LOAD_SUCCESS',
    book: BookModel,
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

export interface FrameBodyResizeEvent {
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

export interface UpdateBookAttributesEvent {
    type: 'UPDATE_BOOK_SPINE',
    spine: BookChapter[],
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

export interface StoreHighlightEvent {
    type: 'STORE_HIGHLIGHT',
}

export interface RestoreHighlightsEvent {
    type: 'RESTORE_HIGHLIGHTS',
}

export interface DeleteHighlightEvent {
    type: 'DELETE_HIGHLIGHT',
    highlight: BookHighlight,
}

export interface RequestWordAnalysisEvent { type: 'REQUEST_WORD_ANALYSIS' }

export type BookFrameStateEvents =
    | LoadBookEvent
    | BookLoadSuccessEvent
    | BookLoadErrorEvent
    | CloseBookLoadErrorEvent
    | ChapterLoadEvent
    | FrameTouchStartEvent
    | FrameTouchMoveEvent
    | FrameBodyResizeEvent
    | FrameTouchEndEvent
    | FrameTouchCancelEvent
    | PageTurnNextEvent
    | PageTurnPrevEvent
    | SaveReadProgressEvent
    | UpdateBookAttributesEvent
    | UpdateSettingsCSSEvent
    | UpdateFontCSSEvent
    | UpdateHighlightsCSSEvent
    | HideMenuPanelsEvent
    | StoreHighlightEvent
    | RestoreHighlightsEvent
    | DeleteHighlightEvent
    | RequestWordAnalysisEvent;
