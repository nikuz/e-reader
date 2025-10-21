import { Stepper } from 'src/design-system/components';
import {
    useSettingsStateSelect,
    settingsStateMachineActor,
} from '../../state';

export function FontLineHeight() {
    const fontSettings = useSettingsStateSelect('font');
    const lineHeight = parseFloat(fontSettings.lineHeight);

    const changeHandler = (value: number) => {
        settingsStateMachineActor.send({
            type: 'SET_FONT_LINE_HEIGHT',
            value: `${value}em`,
        });
    };

    return (
        <Stepper
            label="Line height"
            value={lineHeight}
            step={0.1}
            onChange={changeHandler}
        />
    );
}
