import type { BookHighlight } from 'src/types';
import type { HighlightType } from 'src/features/settings/defaults/highlight';

export function setChapterHighlights(props: {
    iframeWindow: Window,
    chapterHighlights: BookHighlight[],
    selectedHighlightType: HighlightType,
}) {
    const {
        iframeWindow,
        chapterHighlights,
        selectedHighlightType,
    } = props;
    const cssHighlight = new Highlight();

    for (let i = 0, l = chapterHighlights.length; i < l; i++) {
        const highlight = chapterHighlights[i];
        if (highlight.range) {
            cssHighlight.add(highlight.range);
        }
    }

    iframeWindow.CSS?.highlights.clear();
    iframeWindow.CSS?.highlights.set(selectedHighlightType, cssHighlight);
}