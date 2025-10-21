import { Box, Typography } from 'src/design-system/components';
import {
    useSettingsStateSelect,
    settingsStateMachineActor,
} from '../../state';

export function FontColor() {
    const fontSettings = useSettingsStateSelect('font');

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        settingsStateMachineActor.send({
            type: 'SET_FONT_COLOR',
            value: event.target.value,
        });
    };

    return (
        <Box className="flex flex-1 items-center">
            <Typography className="flex-1">
                Font color
            </Typography>
            <input
                type="color"
                value={fontSettings.color}
                onChange={changeHandler}
            />
        </Box>
    );
}
