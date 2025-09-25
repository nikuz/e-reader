import { fromPromise } from 'xstate';
import injectedCss from '../../injections/style/main.css?raw';
import type { BookAttributes } from '../../types';
import {
    retrieveBookAttributes,
    retrieveStaticContent,
} from '../utils';

export const bookLoaderActor = fromPromise(async (props: {
    input: {
        src: string,
    },
}): Promise<BookAttributes> => {
    const { src } = props.input;

    const bookAttributes = await retrieveBookAttributes(src);
    const spine = bookAttributes.spine;
    const staticMapping: Map<string, string> = new Map();

    for (const chapter of spine) {
        const src = `${bookAttributes.dirname}/${chapter[1]}`;
        const response = await fetch(src);
        if (!response.ok) {
            continue;
        }

        const content = await response.text();
        const xmlDoc = new DOMParser().parseFromString(content, 'text/xml');

        const chapterDirname = src.slice(0, src.lastIndexOf('/'));
        
        await retrieveStaticContent({
            xmlDoc,
            chapterDirname,
            staticMapping,
        });

        const styleEl = xmlDoc.createElement('style');
        styleEl.textContent = injectedCss;

        xmlDoc.head.appendChild(styleEl);

        const serializer = new XMLSerializer();
        const modifiedContent = serializer.serializeToString(xmlDoc);
        const blob = new Blob([modifiedContent], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        
        spine.set(chapter[0], blobUrl);
        // spine.set(chapter[0], modifiedContent);
    }

    return bookAttributes;
});