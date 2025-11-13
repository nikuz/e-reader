import { useState, useMemo, useEffect, useEffectEvent } from 'react';
import { Capacitor } from '@capacitor/core';
import { Box, CircularProgress } from 'src/design-system/components';
import type { SxProps } from 'src/design-system/styles';
import { FileStorageController, FILE_STORAGE_DEFAULT_DIRECTORY } from 'src/controllers';
import { converterUtils } from 'src/utils';
import type { BookAttributes } from 'src/types';

interface Props {
    book: BookAttributes,
    sx?: SxProps,
}

export function BookCover(props: Props) {
    const { book } = props;
    const [blobSrc, setBlobSrc] = useState<string>();
    
    const nativeSrc = useMemo(() => {
        if (!book.cover || !Capacitor.isNativePlatform()) {
            return undefined;
        }
        return Capacitor.convertFileSrc(book.cover);
    }, [book]);

    const revokeObjectUrlSrc = useEffectEvent(() => {
        if (Capacitor.isNativePlatform() || !blobSrc) {
            return;
        }
        URL.revokeObjectURL(blobSrc);
    });

    useEffect(() => {
        if (!book.cover || Capacitor.isNativePlatform()) {
            return;
        }

        async function startFetching() {
            setBlobSrc(undefined);

            if (!book.cover) {
                return;
            }

            const staticFileContent = await FileStorageController.readFile({
                path: book.cover.replace(FILE_STORAGE_DEFAULT_DIRECTORY, ''),
            });

            if (!ignore) {
                const blobData = converterUtils.base64ToBlob(staticFileContent.data);
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
    }, [book]);

    // Use nativeSrc for native platforms, blobSrc for web
    const src = Capacitor.isNativePlatform() ? nativeSrc : blobSrc;

    return (
        <Box sx={{
            display: 'flex',
            position: 'relative',
            height: '100%',
        }}>
            {src && (
                <img src={src} alt={book.title} />
            )}
            {!src && (
                <CircularProgress
                    size={24}
                    sx={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        margin: '-12px -12px',
                    }}
                />
            )}
        </Box>
    );
}