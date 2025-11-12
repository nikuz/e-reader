export function getXpathForNode(node: Node, root: Node): string {
    if (node === root) return '/';

    const segments: string[] = [];

    for (let n: Node | null = node; n && n !== root; n = n.parentNode) {
        if (!n.parentNode) break;

        // Element node
        if (n.nodeType === Node.ELEMENT_NODE) {
            const el = n as Element;
            const tag = el.tagName.toLowerCase();

            // Add xhtml prefix for XHTML namespace elements
            const prefix = el.namespaceURI === 'http://www.w3.org/1999/xhtml' ? 'xhtml:' : '';

            // position among same-tag siblings (1-based)
            let index = 1;
            let sib = el.previousElementSibling;
            while (sib) {
                if (sib.tagName.toLowerCase() === tag) index++;
                sib = sib.previousElementSibling;
            }
            segments.push(`${prefix}${tag}[${index}]`);
        }
        // Text node
        else if (n.nodeType === Node.TEXT_NODE) {
            let index = 1;
            let sib: Node | null = n.previousSibling;
            while (sib) {
                if (sib.nodeType === Node.TEXT_NODE) index++;
                sib = sib.previousSibling;
            }
            segments.push(`text()[${index}]`);
        }
        // Other node types (rare in book content) – treat as generic node()
        else {
            let index = 1;
            let sib: Node | null = n.previousSibling;
            while (sib) {
                index++;
                sib = sib.previousSibling;
            }
            segments.push(`node()[${index}]`);
        }
    }

    return '/' + segments.reverse().join('/');
}