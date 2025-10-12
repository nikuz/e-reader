import { createEffect } from 'solid-js';
import { settingsStateMachineActor, useSettingsStateSelect } from './state';

export default function Settings() {
    const fontSettings = useSettingsStateSelect('font');

    const setFontHandler = () => {
        settingsStateMachineActor.send({
            type: 'SET_FONT_SIZE',
            value: '20px',
        });
    };

    createEffect(() => {
        console.log(fontSettings().fontSize);
    });

    return (
        <div>
            <h1 class="text-center mt-2 text-lg">Setting</h1>
            <button class="btn" onClick={setFontHandler}>Set to 20</button>
        </div>
    );
}