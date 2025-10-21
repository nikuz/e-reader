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
    const bookAttributesSnapshot = useBookFrameStateSnapshot('bookAttributes');
    const currentChapterUrlSnapshot = useBookFrameStateSnapshot('chapterUrl');

    const workerMessageHandler = useCallback((event: MessageEvent<WorkerBookAttributesUpdateMessage>) => {
        if (event.data.type === 'WORKER_BOOK_ATTRIBUTE_UPDATE') {
            bookFrameStateMachineActor.send({
                ...event.data,
                type: 'UPDATE_BOOK_ATTRIBUTES',
            });
        }
    }, []);
    
    useEffect(() => {
        if (!lastSettingsCSS || (settingsCSS === lastSettingsCSS && fontCSS === lastFontCSS)) {
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

        const bookAttributes = bookAttributesSnapshot();
        if (bookAttributes) {
            worker.postMessage({
                type: 'SETTINGS_CSS_CHANGE',
                bookAttributes,
                settingsCSS,
                fontCSS,
                currentChapterUrl: currentChapterUrlSnapshot(),
            });
        }
    }, [settingsCSS, lastSettingsCSS, fontCSS, lastFontCSS, bookAttributesSnapshot, currentChapterUrlSnapshot]);

    useEffect(() => {
        worker.addEventListener('message', workerMessageHandler);
        return () => {
            worker.removeEventListener('message', workerMessageHandler);
        };
    }, [workerMessageHandler]);

    return null;
}
