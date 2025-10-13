import { createEffect, onMount, onCleanup, untrack } from 'solid-js';
import { unwrap } from 'solid-js/store';
import { useSettingsStateSelect } from 'src/features/settings/state';
import { bookFrameStateMachineActor, useBookFrameStateSelect } from '../state';
import type {
    SettingsWatcherWorker,
    WorkerBookAttributesUpdateMessage,
} from './worker/types';

const worker: SettingsWatcherWorker = new Worker(new URL('./worker', import.meta.url));

export function SettingsWatcher() {
    const settingsCSS = useSettingsStateSelect('settingsCSS');
    const bookAttributes = useBookFrameStateSelect('bookAttributes');
    const currentChapterUrl = useBookFrameStateSelect('chapterUrl');

    const workerMessageHandler = (event: MessageEvent<WorkerBookAttributesUpdateMessage>) => {
        if (event.data.type === 'WORKER_BOOK_ATTRIBUTE_UPDATE') {
            bookFrameStateMachineActor.send({
                ...event.data,
                type: 'UPDATE_BOOK_ATTRIBUTES',
            });
        }
    };

    createEffect(() => {
        const _bookAttributes = untrack(bookAttributes);
        const _currentChapterUrl = untrack(currentChapterUrl);
        const _settingsCSS = settingsCSS();
        
        bookFrameStateMachineActor.send({
            type: 'UPDATE_SETTINGS_CSS',
            settingsCSS: _settingsCSS,
        });

        if (_bookAttributes) {
            worker.postMessage({
                type: 'SETTINGS_CSS_CHANGE',
                bookAttributes: unwrap(_bookAttributes),
                settingsCSS: _settingsCSS,
                currentChapterUrl: _currentChapterUrl,
            });
        }
    });

    onMount(() => {
        worker.addEventListener('message', workerMessageHandler);
    });

    onCleanup(() => {
        worker.removeEventListener('message', workerMessageHandler);
    });
    
    return null;
}