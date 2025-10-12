import { createEffect, onMount, onCleanup } from 'solid-js';
import { unwrap } from 'solid-js/store';
import { useSettingsStateSelect } from 'src/features/settings/state';
import { bookFrameStateMachineActor, useBookFrameStateSelect } from '../state';
import type {
    SettingsWatcherWorker,
    WorkerBookAttributesUpdateMessage,
} from './worker/types';

const worker: SettingsWatcherWorker = new Worker(new URL('./worker', import.meta.url));

export function SettingsWatcher() {
    const settingsCss = useSettingsStateSelect('settingsCSS');
    const bookAttributes = useBookFrameStateSelect('bookAttributes');

    const workerMessageHandler = (event: MessageEvent<WorkerBookAttributesUpdateMessage>) => {
        if (event.data.type === 'WORKER_BOOK_ATTRIBUTE_UPDATE') {
            bookFrameStateMachineActor.send({
                type: 'UPDATE_BOOK_ATTRIBUTES',
                bookAttributes: event.data.bookAttributes,
            });
        }
    };

    createEffect(() => {
        const _bookAttributes = unwrap(bookAttributes());
        if (!_bookAttributes) {
            return;
        }
        worker.postMessage({
            type: 'SETTINGS_CSS_CHANGE',
            bookAttributes: _bookAttributes,
            settingsCSS: settingsCss(),
        });
    });

    onMount(() => {
        worker.addEventListener('message', workerMessageHandler);
    });

    onCleanup(() => {
        worker.removeEventListener('message', workerMessageHandler);
    });
    
    return null;
}