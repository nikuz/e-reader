import { Stepper } from 'src/design-system/components';
import {
    useSettingsStateSelect,
    settingsStateMachineActor,
} from '../../state';

export function FontLetterSpacing() {
    const fontSettings = useSettingsStateSelect('font');
    const letterSpacing = parseFloat(fontSettings.letterSpacing);

    const changeHandler = (value: number) => {
        settingsStateMachineActor.send({
            type: 'SET_FONT_LETTER_SPACING',
            value: `${value}px`,
        });
    };

    return (
        <Stepper
            label="Letter spacing"
            value={letterSpacing}
            step={1}
            min={0}
            max={10}
            onChange={changeHandler}
        />
    );
}
