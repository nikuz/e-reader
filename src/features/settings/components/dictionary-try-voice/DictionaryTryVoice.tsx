import { useState, useRef, useCallback, useEffect } from 'react';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import {
    Box,
    Typography,
    IconButton,
    CircularProgress,
} from 'src/design-system/components';
import { PlayCircleIcon, StopCircleIcon } from 'src/design-system/icons';
import { firebaseGetPronunciation } from 'src/services';
import { audioUtils } from 'src/utils';
import { Languages } from 'src/types';
import { useSettingsStateSelect } from '../../state';

const TEST_PHRASE = 'this was probably why they were heading west';

export function DictionaryTryVoice() {
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [aiPronunciationSrc, setAiPronunciationSrc] = useState<string>();
    const dictionarySettings = useSettingsStateSelect('dictionary');
    const audioRef = useRef<HTMLAudioElement>(null);

    const playHandler = useCallback(async () => {
        if (!dictionarySettings.useAIVoice) {
            if (isPlaying) {
                try {
                    await TextToSpeech.stop();
                } catch {
                    //
                }
                setIsPlaying(false);
            } else {
                setIsPlaying(true);
                try {
                    await TextToSpeech.speak({
                        text: TEST_PHRASE,
                        lang: Languages.ENGLISH.code,
                        queueStrategy: 1,
                        voice: dictionarySettings.voice,
                    });
                } catch {
                    //
                }
                setIsPlaying(false);
            }
        } else {
            if (!aiPronunciationSrc) {
                setIsLoading(true);
                const pronunciation = await firebaseGetPronunciation(`Pronounce this English phrase clearly and accurately: "${TEST_PHRASE}"`);
                setIsLoading(false);
                if (!pronunciation) {
                    console.log('Can\'t retrieve AI test pronunciation');
                    return;
                }
                const wavBase64 = audioUtils.pcm16ToWavBase64(pronunciation.data);
                setAiPronunciationSrc(`data:audio/wav;base64,${wavBase64}`);
            }

            const audioElement = audioRef.current;
            if (!audioElement) {
                return;
            }

            if (audioElement.paused || audioElement.ended) {
                audioElement.play();
                setIsPlaying(true);
            } else {
                audioElement.pause();
                audioElement.currentTime = 0;
                setIsPlaying(false);
            }
        }
    }, [dictionarySettings, aiPronunciationSrc, isPlaying]);

    useEffect(() => {
        const audioElement = audioRef.current;
        if (!audioElement) {
            return;
        }

        const handleEnded = () => {
            setIsPlaying(false);
        };

        audioElement.addEventListener('ended', handleEnded);

        return () => {
            audioElement.removeEventListener('ended', handleEnded);
        };
    }, []);

    useEffect(() => {
        return () => {
            if (!dictionarySettings.useAIVoice) {
                try {
                    TextToSpeech.stop();
                } catch {
                    //
                }
            }
        };
    }, [dictionarySettings]);

    return (
        <Box className="flex flex-1 items-center">
            <Typography className="flex-1">
                Try voice
            </Typography>
            <Box sx={{
                position: 'relative',
                display: 'inline-block',
            }}>
                {dictionarySettings.useAIVoice && (
                    <audio
                        ref={audioRef}
                        src={aiPronunciationSrc}
                        style={{ display: 'none' }}
                    />
                )}
                <IconButton
                    disabled={isLoading}
                    sx={{ opacity: isLoading ? 0.5 : 1 }}
                    onClick={playHandler}
                >
                    {isPlaying && <StopCircleIcon sx={{ fontSize: '30px' }} />}
                    {!isPlaying && <PlayCircleIcon sx={{ fontSize: '30px' }} />}
                </IconButton>
                {isLoading && (
                    <CircularProgress
                        size={28}
                        sx={{
                            position: 'absolute',
                            left: '20%',
                            top: '20%',
                        }}
                    />
                )}
            </Box>
        </Box>
    );
}
