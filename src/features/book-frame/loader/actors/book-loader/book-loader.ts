import { Capacitor } from '@capacitor/core';
import type { BookAttributes } from 'src/features/library/types';
import { FileStorageController, FileStorageEncoding } from 'src/controllers';
import { fromPromise } from 'xstate';
import { pathUtils } from 'src/utils';
import { INJECTED_CSS_PLACEHOLDER } from '../../../constants';
import injectedCss from '../../../injections/style/main.css?raw';
import { webRetrieveStaticContent } from '../../../utils';

export const bookLoaderActor = fromPromise(async (props: {
    input: {
        bookAttributes: BookAttributes,
    },
}): Promise<BookAttributes> => {
    const { bookAttributes } = props.input;
    const spine = { ...bookAttributes.spine };

    if (Capacitor.isNativePlatform()) {
        const jobs: Promise<void>[] = [];
        for (const chapterName in spine) {
            jobs.push((async () => {
                const chapterPath = spine[chapterName];
                const chapterFullPath = pathUtils.join([bookAttributes.dirname, chapterPath]);

                const fileReadResponse = await FileStorageController.readFile({
                    path: chapterFullPath,
                    encoding: FileStorageEncoding.UTF8,
                });

                let fileContent = fileReadResponse.data as string;
                fileContent = fileContent.replace(INJECTED_CSS_PLACEHOLDER, injectedCss);

                const blob = new Blob([fileContent], { type: 'text/html' });
                const blobUrl = URL.createObjectURL(blob);

                spine[chapterName] = blobUrl;
            })());
        }

        await Promise.all(jobs);
    }
    // web platform requires reading every file and generating object URLs for linked static content
    else {
        for (const chapterName in spine) {
            const chapterPath = spine[chapterName];
            const chapterFullPath = pathUtils.join([bookAttributes.dirname, chapterPath]);

            const fileContent = await FileStorageController.readFile({
                path: chapterFullPath,
                encoding: FileStorageEncoding.UTF8,
            });
            const xmlDoc = new DOMParser().parseFromString(fileContent.data, 'text/xml');

            await webRetrieveStaticContent({ xmlDoc });

            const styleEl = xmlDoc.createElement('style');
            styleEl.textContent = injectedCss;

            xmlDoc.head.appendChild(styleEl);

            const serializer = new XMLSerializer();
            const modifiedContent = serializer.serializeToString(xmlDoc);
            const blob = new Blob([modifiedContent], { type: 'text/html' });
            const blobUrl = URL.createObjectURL(blob);

            spine[chapterName] = blobUrl;
        }
    }

    return {
        ...bookAttributes,
        spine,
    };
});
