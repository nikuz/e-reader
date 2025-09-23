import { bookFrameStateMachineActor } from '../../state';

export class FrameEventObserver {
    constructor(iframe: HTMLIFrameElement) {
        this.window = iframe.contentWindow;
        this.document = iframe.contentDocument;
    }

    window: Window | null;
    document: Document | null;

    subscribe = () => {
        if (!this.window) {
            return;
        }

        if ('ontouchstart' in this.window) {
            this.window.addEventListener('touchstart', this.touchStartEventHandler);
            this.window.addEventListener('touchmove', this.touchMoveEventHandler);
            this.window.addEventListener('touchend', this.touchEndEventHandler);
            this.window.addEventListener('touchcancel', this.touchCancelEventHandler);
        } else {
            this.window.addEventListener('mousedown', this.mouseDownEventHandler);
            this.window.addEventListener('mouseup', this.mouseUpEventHandler);
        }

        // disable default text selection contextual menu
        this.window.addEventListener('contextmenu', this.contextMenuHandler);

        this.window.addEventListener('resize', this.windowResizeHandler);
        
        // unsubscribe from all events on iframe content change
        this.window.addEventListener('beforeunload', this.unsubscribe);
    };

    unsubscribe = () => {
        if (!this.window) {
            return;
        }

        if ('ontouchstart' in this.window) {
            this.window.removeEventListener('touchstart', this.touchStartEventHandler);
            this.window.removeEventListener('touchmove', this.touchMoveEventHandler);
            this.window.removeEventListener('touchend', this.touchEndEventHandler);
            this.window.removeEventListener('touchcancel', this.touchCancelEventHandler);
        } else {
            this.window.removeEventListener('mousedown', this.mouseDownEventHandler);
            this.window.removeEventListener('mouseup', this.mouseUpEventHandler);
        }

        this.window.removeEventListener('contextmenu', this.contextMenuHandler);
        this.window.removeEventListener('resize', this.windowResizeHandler);
        this.window.removeEventListener('beforeunload', this.unsubscribe);
    };

    touchStartEventHandler = () => {
        bookFrameStateMachineActor.send(({ type: 'FRAME_TOUCH_START' }));
    };
    
    touchMoveEventHandler = () => {
        bookFrameStateMachineActor.send(({ type: 'FRAME_TOUCH_MOVE' }));
    };
    
    touchEndEventHandler = (event: TouchEvent) => {
        const touches = event.changedTouches;
        if (touches.length > 1) {
            return;
        }
        bookFrameStateMachineActor.send(({
            type: 'FRAME_TOUCH_END',
            position: {
                x: touches[0].pageX,
                y: touches[0].pageY,
            }
        }));
    };

    touchCancelEventHandler = () => {
        bookFrameStateMachineActor.send(({ type: 'FRAME_TOUCH_CANCEL' }));
    };

    mouseDownEventHandler = () => {
        bookFrameStateMachineActor.send(({ type: 'FRAME_TOUCH_START' }));
    };

    mouseUpEventHandler = (event: MouseEvent) => {
        bookFrameStateMachineActor.send(({
            type: 'FRAME_TOUCH_END',
            position: {
                x: event.pageX,
                y: event.pageY,
            }
        }));
    };

    contextMenuHandler = (event: MouseEvent) => {
        event.preventDefault();
    };
    
    windowResizeHandler = () => {
        bookFrameStateMachineActor.send(({ type: 'FRAME_RESIZE' }));
    };
}