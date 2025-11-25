import { useCallback } from 'react';
import {
    Box,
    Typography,
    Switch,
} from 'src/design-system/components';
import {
    useSettingsStateSelect,
    settingsStateMachineActor,
} from '../../state';

export function DictionaryAIVoice() {
    const dictionarySettings = useSettingsStateSelect('dictionary');

    const changeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        settingsStateMachineActor.send({
            type: 'SET_USE_AI_VOICE',
            value: event.target.checked,
        });
    }, []);

    return (
        <Box className="flex flex-1 items-center">
            <Typography className="flex-1">
                Use Cloud AI Voice
            </Typography>
            <Switch
                checked={dictionarySettings.useAIVoice}
                onChange={changeHandler}
            />
        </Box>
    );
}
