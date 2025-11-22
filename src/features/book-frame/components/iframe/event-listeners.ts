import { bookFrameStateMachineActor } from '../../state';

export class FrameEventObserver {
    constructor(iframe: HTMLIFrameElement) {
        this.window = iframe.contentWindow;
        this.document = iframe.contentDocument;
        this.bodyResizeObserver = new ResizeObserver(this.resizeHandler);
        this.createResizeProbe();
        this.createFontPropsProbe();
        this.resizeProbeResizeObserver = new ResizeObserver(this.resizeHandler);
    }

    window: Window | null;
    document: Document | null;

    bodyResizeObserver: ResizeObserver | null;

    resizeProbeEl: HTMLParagraphElement | undefined;
    fontPropsChangeProbeEl: HTMLParagraphElement | undefined;
    resizeProbeResizeObserver: ResizeObserver | null;

    subscribe = () => {
        if (!this.window || !this.document) {
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

        // disable native text selection
        this.window.addEventListener('selectstart', this.selectStartEventHandler);

        // disable default text drag behavior
        this.window.addEventListener('dragstart', this.dragStartEventHandler);

        this.window.addEventListener('resize', this.resizeHandler);

        this.bodyResizeObserver?.observe(this.document.body);
        
        if (this.resizeProbeEl) {
            this.resizeProbeResizeObserver?.observe(this.resizeProbeEl);
        }
        if (this.fontPropsChangeProbeEl) {
            this.resizeProbeResizeObserver?.observe(this.fontPropsChangeProbeEl);
        }
        this.document.fonts.addEventListener('loadingdone', this.resizeHandler);

        // unsubscribe from all events on iframe content change
        this.window.addEventListener('beforeunload', this.unsubscribe);

    };

    unsubscribe = () => {
        if (!this.window || !this.document) {
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
        this.window.removeEventListener('selectstart', this.selectStartEventHandler);
        this.window.removeEventListener('dragstart', this.dragStartEventHandler);
        this.window.removeEventListener('resize', this.resizeHandler);

        this.bodyResizeObserver?.unobserve(this.document.body);

        if (this.resizeProbeEl) {
            this.resizeProbeResizeObserver?.unobserve(this.resizeProbeEl);
        }
        if (this.fontPropsChangeProbeEl) {
            this.resizeProbeResizeObserver?.unobserve(this.fontPropsChangeProbeEl);
        }
        this.document.fonts.removeEventListener('loadingdone', this.resizeHandler);

        this.window.removeEventListener('beforeunload', this.unsubscribe);
    };

    touchStartEventHandler = (event: TouchEvent) => {
        const touches = event.changedTouches;
        if (touches.length > 1) {
            return;
        }
        bookFrameStateMachineActor.send(({
            type: 'FRAME_TOUCH_START',
            position: {
                x: touches[0].pageX,
                y: touches[0].pageY,
            },
        }));
    };
    
    touchMoveEventHandler = (event: TouchEvent) => {
        const touches = event.changedTouches;
        if (touches.length > 1) {
            return;
        }
        bookFrameStateMachineActor.send(({
            type: 'FRAME_TOUCH_MOVE',
            position: {
                x: touches[0].pageX,
                y: touches[0].pageY,
            },
        }));
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
            },
        }));
    };

    touchCancelEventHandler = () => {
        bookFrameStateMachineActor.send(({ type: 'FRAME_TOUCH_CANCEL' }));
    };

    mouseDownEventHandler = (event: MouseEvent) => {
        bookFrameStateMachineActor.send(({
            type: 'FRAME_TOUCH_START',
            position: {
                x: event.pageX,
                y: event.pageY,
            },
        }));
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

    selectStartEventHandler = (event: Event) => {
        // Prevent native text selection from starting
        event.preventDefault();
    };

    dragStartEventHandler = (event: DragEvent) => {
        // Prevent the browser from converting a long-press text selection into a drag-and-drop gesture.
        event.preventDefault();
    };
    
    createResizeProbe = () => {
        if (!this.document) {
            return;
        }
        const el = this.document.createElement('p');
        el.id = 'book-resize-probe';
        this.document.body.appendChild(el);
        this.resizeProbeEl = el;
    };
    
    createFontPropsProbe = () => {
        if (!this.document) {
            return;
        }
        const el = this.document.createElement('p');
        el.id = 'book-font-props-probe';
        el.textContent = 'H p x g y M W — 1 2 3 '; // tall + deep + wide glyphs
        this.document.body.appendChild(el);
        this.fontPropsChangeProbeEl = el;
    };

    resizeHandler = () => {
        const bodyEl = this.document?.body;
        if (import.meta.env.DEV) {
            console.log('Iframe contents size change');
        }
        if (!bodyEl) {
            return;
        }
        bookFrameStateMachineActor.send(({
            type: 'FRAME_BODY_RESIZE',
            rect: new DOMRect(0, 0, bodyEl.scrollWidth, bodyEl.clientHeight),
        }));
    };
}
