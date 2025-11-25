import { useState, useMemo, useCallback, useEffect } from 'react';
import { TextToSpeech, type SpeechSynthesisVoice } from '@capacitor-community/text-to-speech';
import {
    Box,
    Typography,
    Select,
    type SelectChangeEvent,
    MenuItem,
    ListItemIcon,
    ListItemText,
    FormControl,
    OutlinedInput,
} from 'src/design-system/components';
import { CloudQueueIcon } from 'src/design-system/icons';
import { Languages } from 'src/features/dictionary/constants';
import {
    useSettingsStateSelect,
    settingsStateMachineActor,
} from '../../state';

interface VoiceWithIndex extends SpeechSynthesisVoice {
    index: number,
}

export function DictionaryVoice() {
    const [availableVoices, setAvailableVoices] = useState<VoiceWithIndex[]>([]);
    const dictionarySettings = useSettingsStateSelect('dictionary');

    const selectedVoice = useMemo(() => {
        if (dictionarySettings.voice !== undefined) {
            return dictionarySettings.voice;
        }
        return availableVoices.find(item => item.default)?.index ?? availableVoices[0]?.index;
    }, [dictionarySettings, availableVoices]);

    const changeHandler = useCallback((event: SelectChangeEvent<number>) => {
        settingsStateMachineActor.send({
            type: 'SET_DICTIONARY_VOICE',
            value: event.target.value,
        });
    }, []);

    useEffect(() => {
        const voiceRetriever = async () => {
            const result = await TextToSpeech.getSupportedVoices();
            const availableVoices: VoiceWithIndex[] = [];

            for (let i = 0, l = result.voices.length; i < l; i++) {
                const voice = result.voices[i];
                if (voice.lang.includes(Languages.ENGLISH.code)) {
                    availableVoices.push({
                        default: voice.default,
                        lang: voice.lang,
                        localService: voice.localService,
                        name: voice.name,
                        voiceURI: voice.voiceURI,
                        index: i,
                    });
                }
            }

            setAvailableVoices(availableVoices);
        };
        voiceRetriever();
    }, []);

    if (!availableVoices.length) {
        return null;
    }

    return (
        <Box className="flex flex-1 items-center">
            <Typography className="flex-1">
                Voice
            </Typography>
            <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
                <Select<number>
                    value={selectedVoice}
                    input={<OutlinedInput />}
                    renderValue={(value: number) => (
                        <Typography>{availableVoices.find(item => item.index === value)?.name}</Typography>
                    )}
                    disabled={dictionarySettings.useAIVoice}
                    onChange={changeHandler}
                >
                    {availableVoices.map((voice) => {
                        return (
                            <MenuItem
                                key={voice.index}
                                value={voice.index}
                            >
                                <ListItemText>{voice.name}</ListItemText>
                                <ListItemIcon sx={{ ml: 2 }}>
                                    {!voice.localService && <CloudQueueIcon />}
                                </ListItemIcon>
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        </Box>
    );
}
