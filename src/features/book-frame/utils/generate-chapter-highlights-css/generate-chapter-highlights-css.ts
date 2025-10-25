import type { BookHighlight } from 'src/types';

export function generateChapterHighlightsCss(highlights: BookHighlight[] | undefined, cssValue: string): string {
    if (!highlights) {
        return '';
    }

    const selector = highlights.map(item => `::highlight(${item.id})`).join(',');

    return `${selector} { ${cssValue} }`;
}