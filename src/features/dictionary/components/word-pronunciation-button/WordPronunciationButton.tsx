import { useState, useRef, useMemo, useEffect, useEffectEvent } from 'react';
import { Capacitor } from '@capacitor/core';
import { FileStorageController, FILE_STORAGE_DEFAULT_DIRECTORY } from 'src/controllers';
import { converterUtils } from 'src/utils';
import { Box, IconButton, CircularProgress } from 'src/design-system/components';
import { PlayCircleIcon, StopCircleIcon } from 'src/design-system/icons';
import type { DictionaryWord } from '../../types';

interface Props {
    word: DictionaryWord | undefined,
}

export function DictionaryWordPronunciationButton(props: Props) {
    const { word } = props;
    const [blobSrc, setBlobSrc] = useState<string>();
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const nativeSrc = useMemo(() => {
        if (!word?.pronunciation || !Capacitor.isNativePlatform()) {
            return undefined;
        }
        return Capacitor.convertFileSrc(word.pronunciation);
    }, [word]);

    const playHandler = () => {
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
    };

    const revokeObjectUrlSrc = useEffectEvent(() => {
        if (Capacitor.isNativePlatform() || !blobSrc) {
            return;
        }
        URL.revokeObjectURL(blobSrc);
    });

    useEffect(() => {
        if (!word?.pronunciation || Capacitor.isNativePlatform()) {
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

    if (!word) {
        return null;
    }

    // Use nativeSrc for native platforms, blobSrc for web
    const src = Capacitor.isNativePlatform() ? nativeSrc : blobSrc;
    const isLoading = !src;

    return (
        <Box>
            <audio
                ref={audioRef}
                src={src}
                style={{ display: 'none' }}
            />
            <IconButton
                disabled={isLoading}
                sx={{ opacity: isLoading ? 0.5 : 1 }}
                onClick={playHandler}
            >
                {isLoading && <CircularProgress size={24} />}
                {!isLoading && isPlaying && <StopCircleIcon />}
                {!isLoading && !isPlaying && <PlayCircleIcon />}
            </IconButton>
        </Box>
    );
}