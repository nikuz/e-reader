import { fromPromise } from 'xstate';
import { Preferences } from '@capacitor/preferences';
import { DefaultFontSettings, DefaultLayoutSettings } from '../../../defaults';
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
    
    return contextUpdate;
});
