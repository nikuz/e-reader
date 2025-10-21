import { Stepper } from 'src/design-system/components';
import {
    useSettingsStateSelect,
    settingsStateMachineActor,
} from '../../state';

export function FontWordSpacing() {
    const fontSettings = useSettingsStateSelect('font');
    const wordSpacing = parseFloat(fontSettings.wordSpacing);

    const changeHandler = (value: number) => {
        settingsStateMachineActor.send({
            type: 'SET_FONT_WORD_SPACING',
            value: `${value}px`,
        });
    };

    return (
        <Stepper
            label="Word spacing"
            value={wordSpacing}
            step={1}
            min={0}
            max={10}
            onChange={changeHandler}
        />
    );
}
