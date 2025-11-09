import { useState, useRef, useMemo, useCallback, useEffect, useEffectEvent } from 'react';
import { Capacitor } from '@capacitor/core';
import { Box, IconButton, CircularProgress, DialogContent, Dialog } from 'src/design-system/components';
import { AddPhotoAlternateIcon, ImageIcon } from 'src/design-system/icons';
import type { SxProps } from 'src/design-system/styles';
import { FileStorageController, FILE_STORAGE_DEFAULT_DIRECTORY } from 'src/controllers';
import { converterUtils } from 'src/utils';
import type { BookHighlight } from 'src/types';
import { dictionaryStateMachineActor, useDictionaryStateQueueSelect } from '../../state';
import type { DictionaryWord } from '../../types';

interface Props {
    word: DictionaryWord,
    highlight: BookHighlight,
    sx?: SxProps,
}

export function WordImageButton(props: Props) {
    const { word, highlight } = props;
    const [blobSrc, setBlobSrc] = useState<string>();
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const wordIsInQueue = useDictionaryStateQueueSelect(word.id);
    const isLoading = wordIsInQueue;
    const isImageRequested = useRef(false);

    const nativeSrc = useMemo(() => {
        if (!word.image || !Capacitor.isNativePlatform()) {
            return undefined;
        }
        return Capacitor.convertFileSrc(word.image);
    }, [word]);

    const clickHandler = useCallback(() => {
        if (word.image) {
            setIsPreviewOpen(true);
        } else {
            isImageRequested.current = true;
            dictionaryStateMachineActor.send({
                type: 'REQUEST_IMAGE',
                word,
                highlight,
            });
        }
    }, [word, highlight]);

    const closePreviewHandler = useCallback(() => {
        setIsPreviewOpen(false);
    }, []);

    const revokeObjectUrlSrc = useEffectEvent(() => {
        if (Capacitor.isNativePlatform() || !blobSrc) {
            return;
        }
        URL.revokeObjectURL(blobSrc);
    });

    useEffect(() => {
        if (!word.image || Capacitor.isNativePlatform()) {
            return;
        }

        async function startFetching() {
            setBlobSrc(undefined);

            if (!word || !word.image) {
                return;
            }

            const staticFileContent = await FileStorageController.readFile({
                path: word.image.replace(FILE_STORAGE_DEFAULT_DIRECTORY, ''),
            });

            if (!ignore) {
                const blobData = converterUtils.base64ToBlob(staticFileContent.data, 'image/png');
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
        if (isImageRequested.current && word.image) {
            isImageRequested.current = false;
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsPreviewOpen(true);
        }
    }, [word]);

    // Use nativeSrc for native platforms, blobSrc for web
    const src = Capacitor.isNativePlatform() ? nativeSrc : blobSrc;

    return <>
        <Box sx={{
            position: 'relative',
            display: 'inline-block',
            ...props.sx,
        }}>
            <IconButton
                disabled={isLoading}
                onClick={clickHandler}
            >
                {word.image ? <ImageIcon /> : <AddPhotoAlternateIcon />}
            </IconButton>
            {isLoading && (
                <CircularProgress
                    size={24}
                    sx={{
                        position: 'absolute',
                        left: '20%',
                        top: '20%',
                    }}
                />
            )}
        </Box>

        <Dialog
            open={isPreviewOpen}
            onClose={closePreviewHandler}
        >
            <DialogContent>
                <img src={src} alt="" />
            </DialogContent>
        </Dialog>
    </>;
}