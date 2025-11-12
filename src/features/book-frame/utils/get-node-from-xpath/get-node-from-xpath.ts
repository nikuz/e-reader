export function getNodeFromXPath(xpath: string, root: Document): Node | null {
    const result = root.evaluate(
        xpath,
        root,
        customResolver,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    );
    return result.singleNodeValue;
}

const nameSpaces: Record<string, string> = {
    xhtml: 'http://www.w3.org/1999/xhtml',
    html: 'http://www.w3.org/1999/xhtml'
};

function customResolver(prefix: string | null) {
    return nameSpaces[prefix || ''] || null;
}