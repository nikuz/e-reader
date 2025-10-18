import { createEffect } from 'solid-js';
import { Typography, Button } from 'src/design-system/components';
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
            <Typography variant="h6" class="text-center mt-2!">Setting</Typography>
            <Button variant="outlined" onClick={setFontHandler}>Set to 20</Button>
        </div>
    );
}