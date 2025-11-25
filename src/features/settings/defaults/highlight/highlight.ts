import { SettingsGroup } from '../types';

export const HIGHLIGHT_TYPES = ['color', 'underline', 'strikethrough', 'squiggly', 'text-shadow'] as const;

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
    getHighlightCssValue: (type: HighlightType) => string,
        getHighlightCss: () => string,
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

    getHighlightCssValue(type: HighlightType): string {
        let cssValue = '';

        switch (type) {
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
            
            case 'text-shadow':
                cssValue = this.getCssProps({
                    backgroundColor: 'transparent',
                    color: 'inherit',
                    textDecoration: 'none',
                    textShadow: `0.05em 0 ${this.highlightColor}, -0.05em 0 ${this.highlightColor}, 0 0.05em ${this.highlightColor}, 0 -0.05em ${this.highlightColor}`,
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

    getHighlightCss(): string {
        let cssValue = `/*current highlight type: ${this.selectedHighlightType}*/`;

        for (const type of HIGHLIGHT_TYPES) {
            cssValue += `
                ::highlight(${type}) {
                    ${this.getHighlightCssValue(type)}
                }
            `;
        }
        
        return cssValue;
    }

    toCss(): string {
        const cssValue = this.getHighlightCssValue(this.selectedHighlightType);

        return `::selection { ${cssValue} }`;
    }
}
