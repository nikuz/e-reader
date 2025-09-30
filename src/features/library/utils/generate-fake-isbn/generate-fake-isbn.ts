export function generateFakeIsbn(author: string, title: string): string {
    const inputString = `${author}${title}`;
    let hash = 0;

    if (inputString.length === 0) return String(hash);

    for (let i = 0; i < inputString.length; i++) {
        const char = inputString.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
    }

    return Math.abs(hash).toString();
}