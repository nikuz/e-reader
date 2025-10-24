import type { SerializedRange } from '../../types';
import { getNodeFromXPath } from '../get-node-from-xpath';

export function deserializeTextSelection(data: SerializedRange, root: Document): Range | null {
    const range = document.createRange();
    const startNode = getNodeFromXPath(data.startXPath, root);
    const endNode = getNodeFromXPath(data.endXPath, root);

    if (!startNode || !endNode) return null;

    // Guard: make sure offsets are within bounds
    const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

    // Ranges may start/end in either Text or Element nodes.
    // setStart/setEnd accept element nodes (offset = child index) or text nodes (offset = char index).
    const startMax = startNode.nodeType === Node.TEXT_NODE
        ? (startNode.nodeValue ?? '').length
        : (startNode.childNodes?.length ?? 0);

    const endMax = endNode.nodeType === Node.TEXT_NODE
        ? (endNode.nodeValue ?? '').length
        : (endNode.childNodes?.length ?? 0);

    const startOffset = clamp(data.startOffset, 0, startMax);
    const endOffset = clamp(data.endOffset, 0, endMax);

    try {
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);
    } catch {
        return null;
    }
    
    return range;
}