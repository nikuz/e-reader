import { Stepper } from 'src/design-system/components';
import {
    useSettingsStateSelect,
    settingsStateMachineActor,
} from '../../state';

export function LayoutParagraphMargin() {
    const layoutSettings = useSettingsStateSelect('layout');
    const paragraphMargin = parseInt(layoutSettings.paragraphMargin, 10);

    const changeHandler = (value: number) => {
        settingsStateMachineActor.send({
            type: 'SET_LAYOUT_PARAGRAPH_MARGIN',
            value: `${value}px`,
        });
    };

    return (
        <Stepper
            label="Paragraph margin"
            value={paragraphMargin}
            min={0}
            max={30}
            onChange={changeHandler}
        />
    );
}
