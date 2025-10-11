import type { FontSettings } from '../defaults';

export interface SettingsStateContext {
    font: FontSettings,

    settingsCSS: string,

    errorMessage?: string,
}

export interface SetFontSizeEvent {
    type: 'SET_FONT_SIZE',
    value: number,
}

export interface SetFontFamilyEvent {
    type: 'SET_FONT_FAMILY',
    value: string,
}

export type SettingsStateFontEvents = SetFontSizeEvent
    | SetFontFamilyEvent;

export type SettingsStateEvents = 
    | SettingsStateFontEvents;
