import type { BookFrameStateContext, FrameTouchMoveEvent } from '../../types';

export function frameTouchMoveAction(props: {
    event: FrameTouchMoveEvent,
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    if (!props.context.frameTouchMoveTime) {
        props.enqueue.assign({
            frameTouchMoveTime: Date.now(),
        });
    }

    const textSelection = props.context.textSelection;
    const baseRange = props.context.textSelectionBaseRange;
    const iframeEl = props.context.iframeEl;
    const iframeDocument = iframeEl?.contentDocument;
    const iframeWindow = iframeEl?.contentWindow;

    if (!textSelection || !baseRange || !iframeEl || !iframeDocument || !iframeWindow) {
        return;
    }

    const x = props.event.position.x - iframeWindow.scrollX;
    const y = props.event.position.y;

    const caretPosition = resolveCaretTextPosition(iframeDocument, x, y);

    if (!caretPosition) {
        return;
    }

    const wordRange = createWordRange(iframeDocument, caretPosition.node, caretPosition.offset);

    if (!wordRange) {
        return;
    }

    const startRelation = baseRange.comparePoint(wordRange.startContainer, wordRange.startOffset);
    const endRelation = baseRange.comparePoint(wordRange.endContainer, wordRange.endOffset);

    const nextSelectionRange = baseRange.cloneRange();

    if (startRelation === 1) {
        nextSelectionRange.setEnd(wordRange.endContainer, wordRange.endOffset);
    } else if (endRelation === -1) {
        nextSelectionRange.setStart(wordRange.startContainer, wordRange.startOffset);
    }

    textSelection.removeAllRanges();
    textSelection.addRange(nextSelectionRange);

    props.enqueue.assign({
        textSelectionCreateEndtimeTime: Date.now(),
    });
}

function resolveCaretTextPosition(document: Document, x: number, y: number): { node: Text, offset: number } | null {
    let node: Node | null = null;
    let offset: number | null = null;

    if (document.caretPositionFromPoint) {
        const caret = document.caretPositionFromPoint(x, y);
        node = caret?.offsetNode ?? null;
        offset = caret?.offset ?? null;
    } else if (document.caretRangeFromPoint) {
        const range = document.caretRangeFromPoint(x, y);
        node = range?.startContainer ?? null;
        offset = range?.startOffset ?? null;
    }

    if (!node || offset === null) {
        return null;
    }

    if (node.nodeType === Node.TEXT_NODE) {
        return { node: node as Text, offset };
    }

    const childNodes = node.childNodes;

    if (childNodes?.length) {
        const childIndex = Math.min(offset, childNodes.length - 1);
        const child = childNodes[childIndex];

        if (child?.nodeType === Node.TEXT_NODE) {
            return { node: child as Text, offset: 0 };
        }
    }

    const prevSibling = node.previousSibling;

    if (prevSibling?.nodeType === Node.TEXT_NODE) {
        const textNode = prevSibling as Text;
        return { node: textNode, offset: textNode.textContent?.length ?? 0 };
    }

    const nextSibling = node.nextSibling;

    if (nextSibling?.nodeType === Node.TEXT_NODE) {
        return { node: nextSibling as Text, offset: 0 };
    }

    return null;
}

function createWordRange(document: Document, node: Text, offset: number): Range | null {
    const textContent = node.textContent ?? '';

    if (!textContent.length) {
        return null;
    }

    let index = Math.min(Math.max(offset, 0), textContent.length - 1);

    const whitespacePattern = /\s/;

    if (whitespacePattern.test(textContent[index])) {
        let left = index - 1;

        while (left >= 0 && whitespacePattern.test(textContent[left])) {
            left--;
        }

        if (left >= 0) {
            index = left;
        } else {
            let right = index + 1;

            while (right < textContent.length && whitespacePattern.test(textContent[right])) {
                right++;
            }

            if (right >= textContent.length) {
                return null;
            }

            index = right;
        }
    }

    let start = index;

    while (start > 0 && !whitespacePattern.test(textContent[start - 1])) {
        start--;
    }

    let end = index + 1;

    while (end < textContent.length && !whitespacePattern.test(textContent[end])) {
        end++;
    }

    while (end > start && /[.,;!?'"]/.test(textContent[end - 1])) {
        end--;
    }

    if (end <= start) {
        return null;
    }

    const range = document.createRange();
    range.setStart(node, start);
    range.setEnd(node, end);

    return range;
}
