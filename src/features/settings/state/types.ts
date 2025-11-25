import type {
    FontSettings,
    LayoutSettings,
    HighlightSettings,
    HighlightType,
    DictionarySettings,
} from '../defaults';

export interface SettingsStateContext {
    font: FontSettings,
    layout: LayoutSettings,
    highlight: HighlightSettings,
    dictionary: DictionarySettings,

    settingsCSS: string,
    fontCSS: string,
    highlightsCSS: string,

    errorMessage?: string,
}

export interface SetFontSizeEvent {
    type: 'SET_FONT_SIZE',
    value: string,
}

export interface SetFontOverrideBookFonts {
    type: 'SET_FONT_OVERRIDE_BOOK_FONTS',
    value: boolean,
}

export interface SetFontFamilyEvent {
    type: 'SET_FONT_FAMILY',
    value: string,
}

export interface SetFontColorEvent {
    type: 'SET_FONT_COLOR',
    value: string,
}

export interface SetFontLineHeightEvent {
    type: 'SET_FONT_LINE_HEIGHT',
    value: string,
}

export interface SetFontWordSpacingEvent {
    type: 'SET_FONT_WORD_SPACING',
    value: string,
}

export interface SetFontLetterSpacingEvent {
    type: 'SET_FONT_LETTER_SPACING',
    value: string,
}

export interface SetLayoutParagraphMarginEvent {
    type: 'SET_LAYOUT_PARAGRAPH_MARGIN',
    value: string,
}

export interface SetLayoutMarginLeftEvent {
    type: 'SET_LAYOUT_MARGIN_LEFT',
    value: string,
}

export interface SetLayoutMarginRightEvent {
    type: 'SET_LAYOUT_MARGIN_RIGHT',
    value: string,
}

export interface SetLayoutMarginTopEvent {
    type: 'SET_LAYOUT_MARGIN_TOP',
    value: string,
}

export interface SetLayoutMarginBottomEvent {
    type: 'SET_LAYOUT_MARGIN_BOTTOM',
    value: string,
}

export interface SetHighlightTypeEvent {
    type: 'SET_HIGHLIGHT_TYPE',
    value: HighlightType,
}

export interface SetHighlightColorEvent {
    type: 'SET_HIGHLIGHT_COLOR',
    value: string,
}

export interface SetDictionaryVoiceEvent {
    type: 'SET_DICTIONARY_VOICE',
    value: number,
}

export type SettingsStateFontEvents = SetFontSizeEvent
    | SetFontOverrideBookFonts
    | SetFontFamilyEvent
    | SetFontColorEvent
    | SetFontLineHeightEvent
    | SetFontWordSpacingEvent
    | SetFontLetterSpacingEvent;

export type SettingsStateLayoutEvents = SetLayoutParagraphMarginEvent
    | SetLayoutMarginLeftEvent
    | SetLayoutMarginRightEvent
    | SetLayoutMarginTopEvent
    | SetLayoutMarginBottomEvent;

export type SettingsStateHighlightEvents = SetHighlightTypeEvent
    | SetHighlightColorEvent;

export type SettingsStateDictionaryEvents = SetDictionaryVoiceEvent;

export type SettingsStateEvents = 
    | SettingsStateFontEvents
    | SettingsStateLayoutEvents
    | SettingsStateHighlightEvents
    | SettingsStateDictionaryEvents;
