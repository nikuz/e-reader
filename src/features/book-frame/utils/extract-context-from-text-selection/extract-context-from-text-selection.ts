export function extractContextFromTextSelection(iframeDocument: Document, selectionRange: Range): string {
    const commonAncestor = selectionRange.commonAncestorContainer;

    if (commonAncestor.nodeType === Node.TEXT_NODE) {
        const parent = commonAncestor.parentElement;
        return parent?.innerText ?? commonAncestor.nodeValue ?? '';
    }

    const walker = iframeDocument.createTreeWalker(
        selectionRange.commonAncestorContainer,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode(node) {
                // skip empty whitespace-only nodes
                if (!node.nodeValue?.trim()) {
                    return NodeFilter.FILTER_REJECT;
                }
                // include only nodes that intersect with the selection range
                return selectionRange.intersectsNode(node)
                    ? NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_REJECT;
            }
        }
    );

    let result = '';
    let currentNode = walker.nextNode();

    while (currentNode) {
        if (currentNode.nodeType === Node.TEXT_NODE) {
            const parent = currentNode.parentElement;
            result += parent?.innerText ?? currentNode.nodeValue ?? '';
        } else {
            result += currentNode.nodeValue;
        }
        currentNode = walker.nextNode();
    }

    return result;
}