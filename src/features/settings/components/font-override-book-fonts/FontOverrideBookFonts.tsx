import {
    Box,
    Typography,
    Switch,
} from 'src/design-system/components';
import {
    useSettingsStateSelect,
    settingsStateMachineActor,
} from '../../state';

export function FontOverrideBookFonts() {
    const fontSettings = useSettingsStateSelect('font');
    
    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        settingsStateMachineActor.send({
            type: 'SET_FONT_OVERRIDE_BOOK_FONTS',
            value: event.target.checked,
        });
    };

    return (
        <Box className="flex flex-1 items-center">
            <Typography className="flex-1">
                Override book fonts
            </Typography>
            <Switch
                checked={fontSettings.overrideBookFonts}
                onChange={changeHandler}
            />
        </Box>
    );
}
