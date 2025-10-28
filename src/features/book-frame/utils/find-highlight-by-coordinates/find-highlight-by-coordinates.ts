import type { BookHighlight, Position } from 'src/types';

export function findHighlightByCoordinates(props: {
    coordinates: Position,
    iframeWindow: Window,
    iframeDocument: Document,
    chapterHighlights: BookHighlight[],
}): BookHighlight | undefined {
    const { coordinates, iframeWindow, iframeDocument, chapterHighlights } = props;

    const x = coordinates.x - iframeWindow.scrollX;
    const y = coordinates.y;

    const hit = iframeDocument.elementFromPoint(x, y);
    if (!hit || hit === iframeDocument.documentElement || hit === iframeDocument.body) {
        // Click landed in empty space – ignore
        return;
    }

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

    if (!textNode || offset === undefined) {
        return undefined;
    }

    for (const highlight of chapterHighlights) {
        const range = highlight.range;
        if (!range || !range.intersectsNode(textNode)) {
            continue;
        }

        if (
            (
                range.startContainer === textNode
                && range.endContainer === textNode
                && range.startOffset <= offset
                && range.endOffset >= offset
            )
            || (
                range.startContainer === textNode
                && range.endContainer !== textNode
                && range.startOffset <= offset
            )
            || (
                range.startContainer !== textNode
                && range.endContainer === textNode
                && range.endOffset >= offset
            )
            || (
                range.startContainer !== textNode
                && range.endContainer !== textNode
            )
        ) {
            return highlight;
        }
    }
    
    return undefined;
}