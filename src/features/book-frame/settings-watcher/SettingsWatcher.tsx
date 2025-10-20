import { useCallback, useEffect } from 'react';
import { useSettingsStateSelect } from 'src/features/settings/state';
import { bookFrameStateMachineActor, useBookFrameStateSnapshot } from '../state';
import type {
    SettingsWatcherWorker,
    WorkerBookAttributesUpdateMessage,
} from './worker/types';

const worker: SettingsWatcherWorker = new Worker(new URL('./worker', import.meta.url));

export function SettingsWatcher() {
    const settingsCSS = useSettingsStateSelect('settingsCSS');
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
        bookFrameStateMachineActor.send({
            type: 'UPDATE_SETTINGS_CSS',
            settingsCSS,
        });

        const bookAttributes = bookAttributesSnapshot();
        if (bookAttributes) {
            worker.postMessage({
                type: 'SETTINGS_CSS_CHANGE',
                bookAttributes,
                settingsCSS,
                currentChapterUrl: currentChapterUrlSnapshot(),
            });
        }
    }, [settingsCSS, bookAttributesSnapshot, currentChapterUrlSnapshot]);

    useEffect(() => {
        worker.addEventListener('message', workerMessageHandler);
        return () => {
            worker.removeEventListener('message', workerMessageHandler);
        };
    }, [workerMessageHandler]);

    return null;
}
