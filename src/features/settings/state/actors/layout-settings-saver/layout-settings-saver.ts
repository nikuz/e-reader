import { fromPromise } from 'xstate';
import { Preferences } from '@capacitor/preferences';
import { DefaultLayoutSettings, type LayoutSettings } from '../../../defaults';
import type { SettingsStateLayoutEvents } from '../../types';

export const layoutSettingsSaverActor = fromPromise(async (props: {
    input: {
        event: SettingsStateLayoutEvents,
        layoutSettings: LayoutSettings,
    },
}): Promise<LayoutSettings> => {
    const event = props.input.event;
    const currentLayoutSettings = props.input.layoutSettings.toObject();

    switch (event.type) {
        case 'SET_LAYOUT_PARAGRAPH_MARGIN':
            currentLayoutSettings.paragraphMargin = event.value;
            break;
        
        case 'SET_LAYOUT_MARGIN_LEFT':
            currentLayoutSettings.marginLeft = event.value;
            break;
        
        case 'SET_LAYOUT_MARGIN_RIGHT':
            currentLayoutSettings.marginRight = event.value;
            break;
        
        case 'SET_LAYOUT_MARGIN_TOP':
            currentLayoutSettings.marginTop = event.value;
            break;
        
        case 'SET_LAYOUT_MARGIN_BOTTOM':
            currentLayoutSettings.marginBottom = event.value;
            break;
    }

    const newLayoutSettings = new DefaultLayoutSettings(currentLayoutSettings);

    // await Preferences.remove({
    //     key: DefaultLayoutSettings.id,
    // });

    await Preferences.set({
        key: DefaultLayoutSettings.id,
        value: newLayoutSettings.toString(),
    });

    return newLayoutSettings;
});
