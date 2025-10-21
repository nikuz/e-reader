import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import type { BookAttributes } from 'src/features/library/types';
import { FileStorageController, FileStorageEncoding } from 'src/controllers';
import { settingsStateMachineActor } from 'src/features/settings/state';
import { fromPromise } from 'xstate';
import { pathUtils } from 'src/utils';
import { INJECTED_CSS_PLACEHOLDER, FONT_CSS_PLACEHOLDER } from '../../../constants';
import {
    webRetrieveStaticContent,
    getReadProgressStorageKey,
    getInjectedCSS,
} from '../../../utils';
import type { BookReadProgress } from 'src/features/book-frame/types';

export const bookLoaderActor = fromPromise(async (props: {
    input: {
        bookAttributes: BookAttributes,
    },
}): Promise<{
    bookAttributes: BookAttributes,
    readProgress?: BookReadProgress,
}> => {
    const { bookAttributes } = props.input;
    const spine = [ ...bookAttributes.spine ];
    const settingsSnapshot = settingsStateMachineActor.getSnapshot().context;
    const settingsCSS = settingsSnapshot.settingsCSS;
    const fontCSS = settingsSnapshot.fontCSS;
    const injectedCSS = getInjectedCSS(settingsCSS);
    const readProgress = await Preferences.get({ key: getReadProgressStorageKey(bookAttributes) });

    if (Capacitor.isNativePlatform()) {
        const jobs: Promise<void>[] = [];
        for (const key in spine) {
            jobs.push((async () => {
                const chapter = spine[key];
                const chapterFullPath = pathUtils.join([bookAttributes.dirname, chapter.filePath]);

                const fileReadResponse = await FileStorageController.readFile({
                    path: chapterFullPath,
                    encoding: FileStorageEncoding.UTF8,
                });

                const originalContent = fileReadResponse.data as string;
                const modifiedContent = originalContent
                    .replace(INJECTED_CSS_PLACEHOLDER, injectedCSS)
                    .replace(FONT_CSS_PLACEHOLDER, fontCSS);

                const blob = new Blob([modifiedContent], { type: 'text/html' });
                const blobUrl = URL.createObjectURL(blob);

                spine[key] = {
                    ...chapter,
                    url: blobUrl,
                    content: originalContent,
                };
            })());
        }

        await Promise.all(jobs);
    }
    // web platform requires reading every file and generating object URLs for linked static content
    else {
        for (const key in spine) {
            const chapter = spine[key];
            const chapterFullPath = pathUtils.join([bookAttributes.dirname, chapter.filePath]);

            const fileContent = await FileStorageController.readFile({
                path: chapterFullPath,
                encoding: FileStorageEncoding.UTF8,
            });
            const xmlDoc = new DOMParser().parseFromString(fileContent.data, 'text/xml');
            
            await webRetrieveStaticContent({ xmlDoc });

            const serializer = new XMLSerializer();
            const originalContent = serializer.serializeToString(xmlDoc);
            const modifiedContent = originalContent
                .replace(INJECTED_CSS_PLACEHOLDER, injectedCSS)
                .replace(FONT_CSS_PLACEHOLDER, fontCSS);

            const blob = new Blob([modifiedContent], { type: 'text/html' });
            const blobUrl = URL.createObjectURL(blob);

            spine[key] = {
                ...chapter,
                url: blobUrl,
                content: originalContent,
            };
        }
    }

    return {
        bookAttributes: {
            ...bookAttributes,
            spine,
        },
        readProgress: readProgress.value ? JSON.parse(readProgress.value) : undefined
    };
});
