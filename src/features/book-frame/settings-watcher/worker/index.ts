import { getInjectedCSS } from '../../utils/get-injected-css';
import { INJECTED_CSS_PLACEHOLDER } from '../../constants';
import type {
    SettingsWatcherWorkerMessage,
    SettingsCSSChangeMessage,
} from './types';

self.onmessage = (event: MessageEvent<SettingsWatcherWorkerMessage>) => { 
    switch (event.data.type) {
        case 'SETTINGS_CSS_CHANGE':
            updateInjectedCSS(event.data);
            break;
    }
    // self.postMessage({ type: '' });
};

function updateInjectedCSS(event: SettingsCSSChangeMessage) {
    const { bookAttributes, settingsCSS } = event;
    const injectedCss = getInjectedCSS(settingsCSS);
    const spine = [...bookAttributes.spine];
    
    for (const key in spine) {
        const chapter = { ...bookAttributes.spine[key] };
        if (chapter.url && chapter.content) {
            // revoke old URL to prevent memory leak
            URL.revokeObjectURL(chapter.url);

            const modifiedContent = chapter.content.replace(INJECTED_CSS_PLACEHOLDER, injectedCss);;
            const blob = new Blob([modifiedContent], { type: 'text/html' });
            const blobUrl = URL.createObjectURL(blob);
            chapter.url = blobUrl;
        }
        spine[key] = chapter;
    }

    self.postMessage({
        type: 'WORKER_BOOK_ATTRIBUTE_UPDATE',
        bookAttributes: {
            ...bookAttributes,
            spine,
        },
    });
}