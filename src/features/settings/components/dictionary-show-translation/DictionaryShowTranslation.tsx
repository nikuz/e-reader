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

export function DictionaryShowTranslation() {
    const dictionarySettings = useSettingsStateSelect('dictionary');

    const changeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        settingsStateMachineActor.send({
            type: 'SET_DICTIONARY_SHOW_TRANSLATION',
            value: event.target.checked,
        });
    }, []);

    return (
        <Box className="flex flex-1 items-center">
            <Box className="flex-1">
                <Typography>
                    Show word translation
                </Typography>
                <Typography fontSize="12px" color="textDisabled">
                    * for short selections only
                </Typography>
            </Box>
            <Switch
                checked={dictionarySettings.showTranslation}
                onChange={changeHandler}
            />
        </Box>
    );
}
