import { fromPromise } from 'xstate';
import { Preferences } from '@capacitor/preferences';
import { DefaultFontSettings } from '../../../defaults';
import type { SettingsStateContext } from '../../types';

export const initializerActor = fromPromise(async (): Promise<Partial<SettingsStateContext>> => {
    const contextUpdate: Partial<SettingsStateContext> = {};
    
    const storedFontSettings = await Preferences.get({ key: DefaultFontSettings.id });
    if (storedFontSettings.value) {
        contextUpdate.font = new DefaultFontSettings(JSON.parse(storedFontSettings.value));
        console.log(contextUpdate.font.toCss());
    }
    
    return contextUpdate;
});
