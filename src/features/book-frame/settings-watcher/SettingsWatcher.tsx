import { useCallback, useEffect } from 'react';
import { useSettingsStateSelect } from 'src/features/settings/state';
import { useLast } from 'src/hooks';
import { bookFrameStateMachineActor, useBookFrameStateSnapshot } from '../state';
import type {
    SettingsWatcherWorker,
    WorkerBookAttributesUpdateMessage,
} from './worker/types';

const worker: SettingsWatcherWorker = new Worker(new URL('./worker', import.meta.url));

export function SettingsWatcher() {
    const settingsCSS = useSettingsStateSelect('settingsCSS');
    const lastSettingsCSS = useLast(settingsCSS);
    const fontCSS = useSettingsStateSelect('fontCSS');
    const lastFontCSS = useLast(fontCSS);
    const highlightsCSS = useSettingsStateSelect('highlightsCSS');
    const lastHighlightsCSS = useLast(highlightsCSS);
    const bookSnapshot = useBookFrameStateSnapshot('book');
    const currentChapterUrlSnapshot = useBookFrameStateSnapshot('chapterUrl');

    const workerMessageHandler = useCallback((event: MessageEvent<WorkerBookAttributesUpdateMessage>) => {
        if (event.data.type === 'WORKER_BOOK_ATTRIBUTE_UPDATE') {
            bookFrameStateMachineActor.send({
                type: 'UPDATE_BOOK_SPINE',
                spine: event.data.bookAttributes.spine,
            });
        }
    }, []);
    
    useEffect(() => {
        if (
            (lastSettingsCSS === undefined && lastFontCSS === undefined && lastFontCSS === undefined)
            || (settingsCSS === lastSettingsCSS && fontCSS === lastFontCSS && highlightsCSS === lastHighlightsCSS)
        ) {
            return;
        }

        if (settingsCSS !== lastSettingsCSS) {
            bookFrameStateMachineActor.send({
                type: 'UPDATE_SETTINGS_CSS',
                settingsCSS,
            });
        }
        if (fontCSS !== lastFontCSS) {
            bookFrameStateMachineActor.send({
                type: 'UPDATE_FONT_CSS',
                fontCSS,
            });
        }

        if (highlightsCSS !== lastHighlightsCSS) {
            bookFrameStateMachineActor.send({
                type: 'UPDATE_HIGHLIGHTS_CSS',
                highlightsCSS,
            });
        }

        const book = bookSnapshot();
        if (book) {
            worker.postMessage({
                type: 'SETTINGS_CSS_CHANGE',
                bookAttributes: book.toTransferableObject(),
                settingsCSS,
                fontCSS,
                highlightsCSS,
                currentChapterUrl: currentChapterUrlSnapshot(),
            });
        }
    }, [
        settingsCSS,
        lastSettingsCSS,
        fontCSS,
        lastFontCSS,
        highlightsCSS,
        lastHighlightsCSS,
        bookSnapshot,
        currentChapterUrlSnapshot,
    ]);

    useEffect(() => {
        worker.addEventListener('message', workerMessageHandler);
        return () => {
            worker.removeEventListener('message', workerMessageHandler);
        };
    }, [workerMessageHandler]);

    return null;
}
