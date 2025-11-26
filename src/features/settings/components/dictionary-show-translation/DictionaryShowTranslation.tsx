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
            <Typography className="flex-1">
                Show word translation
            </Typography>
            <Switch
                checked={dictionarySettings.showTranslation}
                onChange={changeHandler}
            />
        </Box>
    );
}
