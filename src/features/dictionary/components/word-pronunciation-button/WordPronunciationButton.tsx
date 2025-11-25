import { useState, useRef, useMemo, useCallback, useEffect, useEffectEvent } from 'react';
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Box, IconButton, CircularProgress } from 'src/design-system/components';
import { PlayCircleIcon, StopCircleIcon } from 'src/design-system/icons';
import type { SxProps } from 'src/design-system/styles';
import { useSettingsStateSelect } from 'src/features/settings/state';
import { FileStorageController, FILE_STORAGE_DEFAULT_DIRECTORY } from 'src/controllers';
import { converterUtils } from 'src/utils';
import { Languages, type BookHighlight } from 'src/types';
import { dictionaryStateMachineActor, useDictionaryStateQueueSelect } from '../../state';
import type { DictionaryWord } from '../../types';

interface Props {
    word: DictionaryWord,
    highlight?: BookHighlight,
    sx?: SxProps,
}

export function DictionaryWordPronunciationButton(props: Props) {
    const { word, highlight } = props;
    const [blobSrc, setBlobSrc] = useState<string>();
    const [isPlaying, setIsPlaying] = useState(false);
    const highlightIsInQueue = useDictionaryStateQueueSelect(highlight?.id);
    const highlightPronunciationIsInQueue = useDictionaryStateQueueSelect(`${highlight?.id}-pronunciation`);
    const dictionarySettings = useSettingsStateSelect('dictionary');
    const isLoading = highlightIsInQueue || highlightPronunciationIsInQueue;
    const audioRef = useRef<HTMLAudioElement>(null);
    const isPronunciationRequested = useRef(false);   

    const nativeSrc = useMemo(() => {
        if (!word.pronunciation || !Capacitor.isNativePlatform()) {
            return undefined;
        }
        return Capacitor.convertFileSrc(word.pronunciation);
    }, [word]);

    // Use nativeSrc for native platforms, blobSrc for web
    const src = Capacitor.isNativePlatform() ? nativeSrc : blobSrc;

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
                        text: word.text,
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
            if (!src) {
                if (!highlight) {
                    return alert('No "src" and no "highlight: for this word');
                }
                isPronunciationRequested.current = true;
                dictionaryStateMachineActor.send({
                    type: 'REQUEST_PRONUNCIATION',
                    word,
                    highlight,
                });
                return;
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
    }, [word, highlight, src, isPlaying, dictionarySettings]);

    useEffect(() => {
        if (isPronunciationRequested.current && src) {
            isPronunciationRequested.current = false;
            audioRef.current?.play();
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsPlaying(true);
        }
    }, [src, playHandler]);

    const revokeObjectUrlSrc = useEffectEvent(() => {
        if (Capacitor.isNativePlatform() || !blobSrc) {
            return;
        }
        URL.revokeObjectURL(blobSrc);
    });

    useEffect(() => {
        if (!word.pronunciation || Capacitor.isNativePlatform()) {
            return;
        }

        async function startFetching() {
            setBlobSrc(undefined);

            if (!word || !word.pronunciation) {
                return;
            }

            const staticFileContent = await FileStorageController.readFile({
                path: word.pronunciation.replace(FILE_STORAGE_DEFAULT_DIRECTORY, ''),
            });

            if (!ignore) {
                const blobData = converterUtils.base64ToBlob(staticFileContent.data, 'audio/wav');
                const blobUrl = URL.createObjectURL(blobData);
                setBlobSrc(blobUrl);
            }
        }

        let ignore = false;
        startFetching();

        return () => {
            ignore = true;
            revokeObjectUrlSrc();
        };
    }, [word]);

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
        <Box sx={{
            position: 'relative',
            display: 'inline-block',
            ...props.sx,
        }}>
            {dictionarySettings.useAIVoice && (
                <audio
                    ref={audioRef}
                    src={src}
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
    );
}