import { Stepper } from 'src/design-system/components';
import {
    useSettingsStateSelect,
    settingsStateMachineActor,
} from '../../state';
import type { SettingsStateLayoutEvents } from '../../state/types';

interface Props {
    side: 'left' | 'right' | 'top' | 'bottom',
}

export function LayoutMargin({ side }: Props) {
    const layoutSettings = useSettingsStateSelect('layout');
    let settingValue = '';

    switch (side) {
        case 'left':
            settingValue = layoutSettings.marginLeft;
            break;

        case 'right':
            settingValue = layoutSettings.marginRight;
            break;

        case 'top':
            settingValue = layoutSettings.marginTop;
            break;

        case 'bottom':
            settingValue = layoutSettings.marginBottom;
            break;
    }

    
    const changeHandler = (value: number) => {
        let eventType: SettingsStateLayoutEvents['type'] | undefined;

        switch (side) {
            case 'left':
                eventType = 'SET_LAYOUT_MARGIN_LEFT';
                break;
            
            case 'right':
                eventType = 'SET_LAYOUT_MARGIN_RIGHT';
                break;
            
            case 'top':
                eventType = 'SET_LAYOUT_MARGIN_TOP';
                break;
            
            case 'bottom':
                eventType = 'SET_LAYOUT_MARGIN_BOTTOM';
                break;
        }

        if (eventType) {
            settingsStateMachineActor.send({
                type: eventType,
                value: `${value}px`,
            });
        }
    };

    return (
        <Stepper
            label={`Margin ${side}`}
            value={parseInt(settingValue, 10)}
            min={0}
            max={100}
            onChange={changeHandler}
        />
    );
}
