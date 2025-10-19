import { createMemo } from 'solid-js';
import { Stepper } from 'src/design-system/components';
import {
    useSettingsStateSelect,
    settingsStateMachineActor,
} from '../../state';

export function FontSize() {
    const fontSettings = useSettingsStateSelect('font');

    const fontSize = createMemo<number>(() => {
        return parseInt(fontSettings().fontSize, 10);
    });

    const changeHandler = (value: number) => {
        settingsStateMachineActor.send({
            type: 'SET_FONT_SIZE',
            value: `${value}px`,
        });
    };

    return (
        <Stepper
            label="Font size"
            value={fontSize()}
            onChange={changeHandler}
        />
    );
}