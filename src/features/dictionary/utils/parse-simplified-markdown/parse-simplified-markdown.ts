interface TextSegment {
    text: string;
    bold: boolean;
}

export function parseSimplifiedMarkdown(text: string): TextSegment[] {
    const segments: TextSegment[] = [];
    const boldPattern = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = boldPattern.exec(text)) !== null) {
        // Add regular text before the bold text
        if (match.index > lastIndex) {
            segments.push({
                text: text.slice(lastIndex, match.index),
                bold: false,
            });
        }

        // Add bold text
        segments.push({
            text: match[1],
            bold: true,
        });

        lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
        segments.push({
            text: text.slice(lastIndex),
            bold: false,
        });
    }

    return segments;
}