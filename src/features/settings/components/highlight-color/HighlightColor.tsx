import { Box, Typography } from 'src/design-system/components';
import {
    useSettingsStateSelect,
    settingsStateMachineActor,
} from '../../state';

export function HighlightColor() {
    const highlightSettings = useSettingsStateSelect('highlight');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        settingsStateMachineActor.send({
            type: 'SET_HIGHLIGHT_COLOR',
            value: event.target.value,
        });
    };

    return (
        <Box className="flex flex-1 items-center">
            <Typography className="flex-1">
                Highlight color
            </Typography>
            <input
                type="color"
                value={highlightSettings.highlightColor}
                onChange={handleChange}
            />
        </Box>
    );
}
