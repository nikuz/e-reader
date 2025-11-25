import { fromPromise } from 'xstate';
import { Preferences } from '@capacitor/preferences';
import { DefaultHighlightSettings, type HighlightSettings } from '../../../defaults';
import type { SettingsStateHighlightEvents } from '../../types';

export const highlightSettingsSaverActor = fromPromise(async (props: {
    input: {
        event: SettingsStateHighlightEvents,
        highlightSettings: HighlightSettings,
    },
}): Promise<HighlightSettings> => {
    const event = props.input.event;
    const currentHighlightSettings = props.input.highlightSettings.toObject();

    switch (event.type) {
        case 'SET_HIGHLIGHT_TYPE':
            currentHighlightSettings.selectedHighlightType = event.value;
            break;

        case 'SET_HIGHLIGHT_COLOR':
            currentHighlightSettings.highlightColor = event.value;
            break;
    }

    const newHighlightSettings = new DefaultHighlightSettings(currentHighlightSettings);

    await Preferences.set({
        key: DefaultHighlightSettings.id,
        value: newHighlightSettings.toString(),
    });

    return newHighlightSettings;
});
