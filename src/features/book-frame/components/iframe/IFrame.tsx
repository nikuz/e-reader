import { useEffect, useRef, type SyntheticEvent } from 'react';
import { useBookFrameStateSelect, bookFrameStateMachineActor } from '../../state';
import { FrameEventObserver } from './event-listeners';

export function BookFrameIFrame() {
    const chapterUrl = useBookFrameStateSelect('chapterUrl');
    const eventObserverRef = useRef<FrameEventObserver | null>(null);

    const frameContentLoadHandler = (event: SyntheticEvent<HTMLIFrameElement>) => {
        const iframeEl = event.currentTarget;

        eventObserverRef.current?.unsubscribe();
        const observer = new FrameEventObserver(iframeEl);
        observer.subscribe();
        eventObserverRef.current = observer;

        bookFrameStateMachineActor.send({
            type: 'CHAPTER_LOAD',
            iframeEl,
        });
    };

    useEffect(() => {
        return () => {
            eventObserverRef.current?.unsubscribe();
        };
    }, []);

    return (
        <iframe
            src={chapterUrl}
            className="w-full h-full border-0 bg-black"
            sandbox="allow-same-origin allow-scripts"
            onLoad={frameContentLoadHandler}
        />
    );
}
