import type { BookFrameStateContext } from '../../types';

export function selectTextAction(props: {
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    const iframeEl = props.context.iframeEl;
    const iframeDocument = iframeEl?.contentDocument;
    const iframeWindow = iframeEl?.contentWindow;
    const frameInteractionStartPosition = props.context.frameInteractionStartPosition;
    
    if (!iframeEl || !iframeDocument || !iframeWindow || !frameInteractionStartPosition) {
        return;
    }

    const x = frameInteractionStartPosition.x - iframeWindow.scrollX;
    const y = frameInteractionStartPosition.y;
    let textNode;
    let offset;

    if (iframeDocument.caretPositionFromPoint) {
        const caretPosition = iframeDocument.caretPositionFromPoint(x, y);
        textNode = caretPosition?.offsetNode;
        offset = caretPosition?.offset;
    }
    // Use WebKit-proprietary fallback method
    else if (iframeDocument.caretRangeFromPoint) {
        const caretPosition = iframeDocument.caretRangeFromPoint(x, y);
        textNode = caretPosition?.startContainer;
        offset = caretPosition?.startOffset;
    }

    const textContent = textNode?.textContent;
    
    if (!textNode || !textContent || offset === 0 || offset === textContent.length) {
        return;
    }

    // Find the start and end of the word
    // Go backwards from the offset to find the start of the word
    let start = textContent.lastIndexOf(' ', offset) + 1;
    if (start === 0 && textContent[0] !== ' ') {
        start = 0; // The word is at the very beginning of the string
    }

    // Go forwards from the offset to find the end of the word
    let end = textContent.indexOf(' ', offset);
    if (end === -1) {
        end = textContent.length; // The word is at the very end of the string
    }

    // Clean up any trailing punctuation from the end of the word
    while (end > start && /[.,;!?'"]/.test(textContent[end - 1])) {
        end--;
    }

    // Create a Range object and set its boundaries
    const selectionRange = iframeDocument.createRange();
    selectionRange.setStart(textNode, start);
    selectionRange.setEnd(textNode, end);

    const selection = iframeDocument.getSelection();

    // Clear any previous selections
    selection?.removeAllRanges();

    // Add the new range to the selection
    selection?.addRange(selectionRange);

    if (selection) {
        props.enqueue.assign({
            textSelection: selection,
            textSelectionBaseRange: selectionRange.cloneRange(),
            textSelectionCreateEndtimeTime: Date.now(),
        });
    }
}
