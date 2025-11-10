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

    const imageSrc = useMemo(() => {
        let imageSrc = word.image;
        const contextId = converterUtils.stringToHash(highlight.context);
        const contextImage = word.contextImages.find(item => item.contextId === contextId);

        if (contextImage) {
            imageSrc = contextImage.src;
        }

        return imageSrc;
    }, [word, highlight]);

    const nativeSrc = useMemo(() => {
        if (!imageSrc || !Capacitor.isNativePlatform()) {
            return undefined;
        }
        return Capacitor.convertFileSrc(imageSrc);
    }, [imageSrc]);

    const clickHandler = useCallback(() => {
        if (imageSrc) {
            setIsPreviewOpen(true);
        } else {
            isImageRequested.current = true;
            dictionaryStateMachineActor.send({
                type: 'REQUEST_IMAGE',
                word,
            });
        }
    }, [word, imageSrc]);

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
        if (!imageSrc || Capacitor.isNativePlatform()) {
            return;
        }

        async function startFetching() {
            setBlobSrc(undefined);

            if (!imageSrc) {
                return;
            }

            const staticFileContent = await FileStorageController.readFile({
                path: imageSrc.replace(FILE_STORAGE_DEFAULT_DIRECTORY, ''),
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
    }, [imageSrc]);

    useEffect(() => {
        if (isImageRequested.current && imageSrc) {
            isImageRequested.current = false;
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsPreviewOpen(true);
        }
    }, [imageSrc]);

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
                {imageSrc ? <ImageIcon /> : <AddPhotoAlternateIcon />}
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