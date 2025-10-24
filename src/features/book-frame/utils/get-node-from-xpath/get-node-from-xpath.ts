export function getNodeFromXPath(xpath: string, root: Document): Node | null {
    const result = root.evaluate(
        xpath,
        root,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    );
    return result.singleNodeValue;
}