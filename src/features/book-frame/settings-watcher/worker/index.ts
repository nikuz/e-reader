import { getInjectedCSS } from '../../utils/get-injected-css';
import { generateChapterHighlightsCss } from '../../utils/generate-chapter-highlights-css';
import {
    INJECTED_CSS_PLACEHOLDER,
    FONT_CSS_PLACEHOLDER,
    HIGHLIGHTS_CSS_PLACEHOLDER,
} from '../../constants';
import type {
    SettingsWatcherWorkerMessage,
    SettingsCSSChangeMessage,
    WorkerBookAttributesUpdateMessage,
} from './types';

self.onmessage = (event: MessageEvent<SettingsWatcherWorkerMessage>) => { 
    switch (event.data.type) {
        case 'SETTINGS_CSS_CHANGE':
            updateInjectedCSS(event.data);
            break;
    }
};

function updateInjectedCSS(event: SettingsCSSChangeMessage) {
    const {
        bookAttributes,
        settingsCSS,
        fontCSS,
        highlightsCSSValue,
        currentChapterUrl,
    } = event;

    const injectedCSS = getInjectedCSS(settingsCSS);
    const spine = [...bookAttributes.spine];
 
    for (const key in spine) {
        const chapter = { ...spine[key] };
        if (chapter.url && chapter.content) {
            // revoke old URL to prevent memory leak,
            // but keep current chapter url to prevent page flickering on settingsCSS change,
            // it will be revoked on chapter change
            if (currentChapterUrl !== chapter.url) {
                URL.revokeObjectURL(chapter.url);
            }

            const highlightCSS = generateChapterHighlightsCss(bookAttributes.highlights[key], highlightsCSSValue);
            const modifiedContent = chapter.content
                .replace(INJECTED_CSS_PLACEHOLDER, injectedCSS)
                .replace(FONT_CSS_PLACEHOLDER, fontCSS)
                .replace(HIGHLIGHTS_CSS_PLACEHOLDER, highlightCSS);
            
            const blob = new Blob([modifiedContent], { type: 'text/html' });
            const blobUrl = URL.createObjectURL(blob);
            chapter.url = blobUrl;
        }
        spine[key] = chapter;
    }

    const message: WorkerBookAttributesUpdateMessage = {
        type: 'WORKER_BOOK_ATTRIBUTE_UPDATE',
        bookAttributes: {
            ...bookAttributes,
            spine,
        },
    };

    self.postMessage(message);
}