import { useCallback } from 'react';
import { useBookFrameStateSelect } from 'src/features/book-frame/state';
import { debugStateMachineActor, useDebugStateMatch } from '../../state';
import './style.css';

export default function Overlay() {
    const screenRect = useBookFrameStateSelect('screenRect');
    const chapterRect = useBookFrameStateSelect('chapterRect');
    const scrollPosition = useBookFrameStateSelect('scrollPosition');
    const isVisible = useDebugStateMatch(['VISIBLE']);

    const hideHandler = useCallback(() => {
        debugStateMachineActor.send({ type: 'HIDE' });
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <div className="debug-overlay z-99999" onClick={hideHandler}>
            <div>
                Screen size: {screenRect.width}x{screenRect.height}
            </div>
            <div>
                Chapter size: {chapterRect.width}x{chapterRect.height}
            </div>
            <div>
                Scroll position: {scrollPosition}
            </div>
        </div>
    );
}
