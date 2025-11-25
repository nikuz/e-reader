import { fromPromise } from 'xstate';
import { Preferences } from '@capacitor/preferences';
import {
    DefaultFontSettings,
    DefaultLayoutSettings,
    DefaultHighlightSettings,
    DefaultDictionarySettings,
} from '../../../defaults';
import type { SettingsStateContext } from '../../types';

export const initializerActor = fromPromise(async (): Promise<Partial<SettingsStateContext>> => {
    const contextUpdate: Partial<SettingsStateContext> = {};
    
    const storedFontSettings = await Preferences.get({ key: DefaultFontSettings.id });
    if (storedFontSettings.value) {
        contextUpdate.font = new DefaultFontSettings(JSON.parse(storedFontSettings.value));
    }

    const storedLayoutSettings = await Preferences.get({ key: DefaultLayoutSettings.id });
    if (storedLayoutSettings.value) {
        contextUpdate.layout = new DefaultLayoutSettings(JSON.parse(storedLayoutSettings.value));
    }

    const storedHighlightSettings = await Preferences.get({ key: DefaultHighlightSettings.id });
    if (storedHighlightSettings.value) {
        contextUpdate.highlight = new DefaultHighlightSettings(JSON.parse(storedHighlightSettings.value));
    }
    
    const storedDictionarySettings = await Preferences.get({ key: DefaultDictionarySettings.id });
    if (storedDictionarySettings.value) {
        contextUpdate.dictionary = new DefaultDictionarySettings(JSON.parse(storedDictionarySettings.value));
    }
    
    return contextUpdate;
});
