import { fromPromise } from 'xstate';
import { Preferences } from '@capacitor/preferences';
import { DefaultFontSettings, type FontSettings } from '../../../defaults';
import type { SettingsStateFontEvents } from '../../types';

export const saveFontSettingsActor = fromPromise(async (props: {
    input: {
        event: SettingsStateFontEvents,
        fontSettings: FontSettings,
    },
}): Promise<FontSettings> => {
    const event = props.input.event;
    const currentFontSettings = props.input.fontSettings.toObject();

    switch (event.type) {
        case 'SET_FONT_SIZE':
            currentFontSettings.fontSize = event.value;
            break;
        
        case 'SET_FONT_FAMILY':
            currentFontSettings.fontFamily = event.value;
            break;
        
        case 'SET_FONT_COLOR':
            currentFontSettings.color = event.value;
            break;
        
        case 'SET_FONT_LINE_HEIGHT':
            currentFontSettings.lineHeight = event.value;
            break;
    }

    const newFontSettings = new DefaultFontSettings(currentFontSettings);

    // await Preferences.remove({
    //     key: DefaultFontSettings.id,
    // });

    await Preferences.set({
        key: DefaultFontSettings.id,
        value: newFontSettings.toString(),
    });

    return newFontSettings;
});
