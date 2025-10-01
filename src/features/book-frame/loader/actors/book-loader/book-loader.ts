import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { fromPromise } from 'xstate';
import { pathUtils } from 'src/utils';
import type { BookAttributes } from 'src/types';
import { INJECTED_CSS_PLACEHOLDER } from '../../../constants';
import injectedCss from '../../../injections/style/main.css?raw';
import { retrieveStaticContent } from '../../utils';

export const bookLoaderActor = fromPromise(async (props: {
    input: {
        bookAttributes: BookAttributes,
    },
}): Promise<BookAttributes> => {
    const { bookAttributes } = props.input;
    const spine = bookAttributes.spine;

    if (Capacitor.isNativePlatform()) {
        const jobs: Promise<void>[] = [];
        for (const chapterName in spine) {
            jobs.push(new Promise((resolve) => {
                const chapterPath = spine[chapterName];
                const chapterFullPath = pathUtils.join([bookAttributes.dirname, chapterPath]);

                Filesystem.readFile({
                    path: chapterFullPath,
                    directory: Directory.Documents,
                    encoding: Encoding.UTF8,
                }).then(((fileReadResponse) => {
                    let fileContent = fileReadResponse.data as string;
                    fileContent = fileContent.replace(INJECTED_CSS_PLACEHOLDER, injectedCss);

                    const blob = new Blob([fileContent], { type: 'text/html' });
                    const blobUrl = URL.createObjectURL(blob);

                    spine[chapterName] = blobUrl;
                    resolve();
                }));
            }));
        }

        await Promise.all(jobs);
    }
    // web platform requires reading every file and generating object URLs for linked static content
    else {
        const staticMapping: Map<string, string> = new Map();
        for (const chapterName in spine) {
            const chapterPath = spine[chapterName];
            const chapterFullPath = pathUtils.join([bookAttributes.dirname, chapterPath]);

            const fileReadResponse = await Filesystem.readFile({
                path: chapterFullPath,
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
            });

            let fileContent = fileReadResponse.data;
            if (fileContent instanceof Blob) {
                fileContent = await fileContent.text();
            }

            const xmlDoc = new DOMParser().parseFromString(fileContent, 'text/xml');

            await retrieveStaticContent({
                xmlDoc,
                staticMapping,
            });

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

    return bookAttributes;
});