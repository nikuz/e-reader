import { SettingsGroup } from '../types';

export const HIGHLIGHT_TYPES = ['color', 'underline', 'strikethrough', 'squiggly'] as const;

export type HighlightType = typeof HIGHLIGHT_TYPES[number];

type HighlightProps = {
    selectedHighlightType: HighlightType;
    highlightColor: string;
};

const defaultHighlightValues: HighlightProps = {
    selectedHighlightType: 'color',
    highlightColor: '#FFEB3B',
};

export type HighlightSettings = SettingsGroup<HighlightProps>
    & HighlightProps
    & {
        getHighlightCssValue: () => string,
    };

export class DefaultHighlightSettings extends SettingsGroup<HighlightProps> implements HighlightSettings {
    static id = 'highlight';
    static types: HighlightType[] = [...HIGHLIGHT_TYPES];

    declare selectedHighlightType: HighlightType;
    declare highlightColor: string;

    constructor(overrides?: Partial<HighlightSettings>) {
        super();
        Object.assign(this, defaultHighlightValues, overrides);
    }

    toObject(): HighlightProps {
        return {
            selectedHighlightType: this.selectedHighlightType,
            highlightColor: this.highlightColor,
        };
    }

    toString() {
        return JSON.stringify(this.toObject());
    }

    getHighlightCssValue(): string {
        let cssValue = '';

        switch (this.selectedHighlightType) {
            case 'underline':
                cssValue = this.getCssProps({
                    backgroundColor: 'transparent',
                    textDecoration: `underline 2px ${this.highlightColor}`,
                    textDecorationSkipInk: 'none',
                });
                break;

            case 'strikethrough':
                cssValue = this.getCssProps({
                    backgroundColor: 'transparent',
                    textDecoration: `line-through 1px ${this.highlightColor}`,
                });
                break;

            case 'squiggly':
                cssValue = this.getCssProps({
                    backgroundColor: 'transparent',
                    textDecoration: `underline wavy 2px ${this.highlightColor}`,
                    textDecorationSkipInk: 'none',
                });
                break;

            default:
                cssValue = this.getCssProps({
                    backgroundColor: this.highlightColor,
                    color: 'inherit',
                    textDecoration: 'none',
                });
                break;
        }

        return cssValue;
    }

    toCss(): string {
        const cssValue = this.getHighlightCssValue();

        return `::selection { ${cssValue} }`;
    }
}
