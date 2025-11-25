import { fromPromise } from 'xstate';
import { Preferences } from '@capacitor/preferences';
import { DefaultDictionarySettings, type DictionarySettings } from '../../../defaults';
import type { SettingsStateDictionaryEvents } from '../../types';

export const dictionarySettingsSaverActor = fromPromise(async (props: {
    input: {
        event: SettingsStateDictionaryEvents,
        dictionarySettings: DictionarySettings,
    },
}): Promise<DictionarySettings> => {
    const event = props.input.event;
    const currentDictionarySettings = props.input.dictionarySettings.toObject();

    switch (event.type) {
        case 'SET_DICTIONARY_VOICE':
            currentDictionarySettings.voice = event.value;
            break;
    }

    const newDictionarySettings = new DefaultDictionarySettings(currentDictionarySettings);

    // await Preferences.remove({
    //     key: DefaultDictionarySettings.id,
    // });

    await Preferences.set({
        key: DefaultDictionarySettings.id,
        value: newDictionarySettings.toString(),
    });

    return newDictionarySettings;
});
