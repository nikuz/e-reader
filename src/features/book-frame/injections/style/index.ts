import mainStyleString from './main.css?raw';

export function injectStyle(iframe: HTMLIFrameElement) {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
        return;
    }

    const styleEl = iframeDoc.createElement('style');

    styleEl.textContent = mainStyleString;

    iframeDoc.head.appendChild(styleEl);
}