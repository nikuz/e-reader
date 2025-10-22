import {
    Box,
    Typography,
    Select,
    type SelectChangeEvent,
    MenuItem,
    FormControl,
    OutlinedInput,
} from 'src/design-system/components';
import {
    useSettingsStateSelect,
    settingsStateMachineActor,
} from '../../state';
import { HIGHLIGHT_TYPES, type HighlightType as HighlightTypeValue } from '../../defaults';

export function HighlightType() {
    const highlightSettings = useSettingsStateSelect('highlight');

    const handleChange = (event: SelectChangeEvent<HighlightTypeValue>) => {
        settingsStateMachineActor.send({
            type: 'SET_HIGHLIGHT_TYPE',
            value: event.target.value,
        });
    };

    return (
        <Box className="flex flex-1 items-center">
            <Typography className="flex-1">
                Highlight type
            </Typography>
            <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
                <Select
                    labelId="highlight-type-label"
                    value={highlightSettings.selectedHighlightType}
                    input={<OutlinedInput />}
                    onChange={handleChange}
                >
                    {HIGHLIGHT_TYPES.map((type) => (
                        <MenuItem
                            key={type}
                            value={type}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}
