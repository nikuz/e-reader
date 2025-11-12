declare global {
    interface Window {
        CSS?: {
            highlights: HighlightRegistry;
        };
    }
}

export {};