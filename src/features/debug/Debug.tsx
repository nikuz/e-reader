import { Show } from 'solid-js';
import { useBookFrameStateSelect } from 'src/features/book-frame/state';
import { DEBUG_ENABLED } from './constants';
import './style.css';

export default function Debug() {
    const screenRect = useBookFrameStateSelect('screenRect');
    const chapterRect = useBookFrameStateSelect('chapterRect');
    const scrollPosition = useBookFrameStateSelect('scrollPosition');

    return (
        <Show when={DEBUG_ENABLED}>
            <div class="debug-overlay">
                <div>
                    Screen size: {screenRect().width}x{screenRect().height}
                </div>
                <div>
                    Chapter size: {chapterRect().width}x{chapterRect().height}
                </div>
                <div>
                    Scroll position: {scrollPosition()}
                </div>
            </div>
        </Show>
    );
}