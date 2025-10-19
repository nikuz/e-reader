import { onCleanup } from 'solid-js';
import { FrameEventObserver } from '../../injections';
import { useBookFrameStateSelect, bookFrameStateMachineActor } from '../../state';

export function BookFrameIFrame() {
    const chapterUrl = useBookFrameStateSelect('chapterUrl');
    let eventObserver: FrameEventObserver;

    const frameContentLoadHandler = (event: Event) => {
        const iframeEl = event.target as HTMLIFrameElement;

        eventObserver = new FrameEventObserver(iframeEl);
        eventObserver.subscribe();

        bookFrameStateMachineActor.send({
            type: 'CHAPTER_LOAD',
            iframeEl,
        });
    };

    onCleanup(() => {
        eventObserver?.unsubscribe();
    });

    return (
        <iframe
            src={chapterUrl()}
            class="w-full h-full border-0 bg-black"
            sandbox="allow-same-origin allow-scripts"
            onLoad={frameContentLoadHandler}
        />
    );
}