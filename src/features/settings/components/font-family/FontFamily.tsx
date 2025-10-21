import {
    Box,
    Typography,
    Select,
    MenuItem,
    FormControl,
    OutlinedInput,
} from 'src/design-system/components';
import type { SelectChangeEvent } from 'src/design-system/types';
import {
    useSettingsStateSelect,
    settingsStateMachineActor,
} from '../../state';
import { fontsList } from '../../defaults/font';

export function FontFamily() {
    const fontSettings = useSettingsStateSelect('font');

    const changeHandler = (event: SelectChangeEvent<string>) => {
        settingsStateMachineActor.send({
            type: 'SET_FONT_FAMILY',
            value: event.target.value,
        });
    };

    return (
        <Box className="flex flex-1 items-center">
            <Typography className="flex-1">
                Font family
            </Typography>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <Select
                    labelId="font-family-label"
                    value={fontSettings.fontFamily}
                    label="Age"
                    input={<OutlinedInput />}
                    disabled={!fontSettings.overrideBookFonts}
                    onChange={changeHandler}
                >
                    {fontsList.map((item, key) => (
                        <MenuItem
                            key={key}
                            value={item.value}
                        >
                            {item.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}
