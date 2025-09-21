export class EventObserver {
    constructor(iframe: HTMLIFrameElement) {
        this.window = iframe.contentWindow;
        this.document = iframe.contentDocument;


    }

    window: Window | null;
    document: Document | null;

    subscribe = () => {
        this.document?.addEventListener('touchstart', this.touchEventHandler);
        this.document?.addEventListener('touchmove', this.touchEventHandler);
        this.document?.addEventListener('touchend', this.touchEventHandler);
        this.document?.addEventListener('touchcancel', this.touchEventHandler);

        this.document?.addEventListener('mousedown', this.mouseEventHandler);
        this.document?.addEventListener('mousemove', this.mouseEventHandler);
        this.document?.addEventListener('mouseup', this.mouseEventHandler);
    };

    unsubscribe = () => {
        this.document?.removeEventListener('touchstart', this.touchEventHandler);
        this.document?.removeEventListener('touchmove', this.touchEventHandler);
        this.document?.removeEventListener('touchend', this.touchEventHandler);
        this.document?.removeEventListener('touchcancel', this.touchEventHandler);

        this.document?.removeEventListener('mousedown', this.mouseEventHandler);
        this.document?.removeEventListener('mousemove', this.mouseEventHandler);
        this.document?.removeEventListener('mouseup', this.mouseEventHandler);
    };

    touchEventHandler = (event: TouchEvent) => {
        console.log(event);
    };

    mouseEventHandler = (event: MouseEvent) => {
        console.log(event);
    };
}