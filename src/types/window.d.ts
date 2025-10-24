declare global {
    interface Window {
        CSS?: {
            highlights: {
                set: (name: string, highlight: Highlight) => void;
                get: (name: string) => Highlight | undefined;
            };
        };
    }
}

export {};