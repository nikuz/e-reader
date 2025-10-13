import type { FontSettings } from '../defaults';

export interface SettingsStateContext {
    font: FontSettings,

    settingsCSS: string,

    errorMessage?: string,
}

export interface SetFontSizeEvent {
    type: 'SET_FONT_SIZE',
    value: string,
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

export type SettingsStateFontEvents = SetFontSizeEvent
    | SetFontFamilyEvent
    | SetFontColorEvent
    | SetFontLineHeightEvent;

export type SettingsStateEvents = 
    | SettingsStateFontEvents;
