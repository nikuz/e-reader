interface TextSegment {
    text: string;
    bold: boolean;
}

export function parseSimplifiedMarkdown(text: string): TextSegment[] {
    // Preprocess: convert headers (lines starting with #) to bold markdown
    const processedText = text.replace(/^(#+)\s+(.+)$/gm, '**$2**');

    const segments: TextSegment[] = [];
    const boldPattern = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = boldPattern.exec(processedText)) !== null) {
        // Add regular text before the bold text
        if (match.index > lastIndex) {
            segments.push({
                text: processedText.slice(lastIndex, match.index),
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
    if (lastIndex < processedText.length) {
        segments.push({
            text: processedText.slice(lastIndex),
            bold: false,
        });
    }

    return segments;
}