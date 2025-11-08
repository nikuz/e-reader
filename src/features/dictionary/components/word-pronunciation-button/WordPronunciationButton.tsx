import { useState, useMemo, useEffect, useEffectEvent } from 'react';
import { Capacitor } from '@capacitor/core';
import { FileStorageController, FILE_STORAGE_DEFAULT_DIRECTORY } from 'src/controllers';
import { converterUtils } from 'src/utils';
import { Box } from 'src/design-system/components';
import type { DictionaryWord } from '../../types';

interface Props {
    word: DictionaryWord | undefined,
}

export function DictionaryWordPronunciationButton(props: Props) {
    const { word } = props;
    const [blobSrc, setBlobSrc] = useState<string>();

    const nativeSrc = useMemo(() => {
        if (!word?.pronunciation || !Capacitor.isNativePlatform()) {
            return undefined;
        }
        return Capacitor.convertFileSrc(word.pronunciation);
    }, [word]);

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

    if (!word) {
        return null;
    }
    
    // Use nativeSrc for native platforms, blobSrc for web
    const src = Capacitor.isNativePlatform() ? nativeSrc : blobSrc;

    return (
        <Box>
            <audio src={src} controls />
        </Box>
    );
}