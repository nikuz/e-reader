import { SettingsGroup } from './types';

const defaultFontValues = {
    fontSize: '18px',
    color: '#FFFFFF',
    lineHeight: '1.5em',
    overrideBookFonts: false,
    fontFamily: 'MerriweatherSans-Italic',
};

export const fontsList: {
    name: string,
    value: string,
    url?: string,
}[] = [
    {
        name: 'System default',
        value: 'Inter, Avenir, Helvetica, Arial, sans-serif',
    },
    {
        name: 'Merriweather Sans',
        value: 'MerriweatherSans-Italic',
        url: '/fonts/MerriweatherSans-Italic.ttf',
    }
];

type FontProps = typeof defaultFontValues;

export type FontSettings = SettingsGroup<FontProps> & FontProps;

export class DefaultFontSettings extends SettingsGroup<FontProps> implements FontSettings {
    static id = 'font';
    
    declare fontSize: string;
    declare color: string;
    declare lineHeight: string;
    declare overrideBookFonts: boolean;
    declare fontFamily: string;
    
    constructor(overrides?: Partial<FontSettings>) {
        super();
        Object.assign(this, defaultFontValues, overrides);
    }

    toObject(): FontProps {
        return {
            fontSize: this.fontSize,
            color: this.color,
            lineHeight: this.lineHeight,
            overrideBookFonts: this.overrideBookFonts,
            fontFamily: this.fontFamily,
        };
    }

    toString() {
        return JSON.stringify(this.toObject());
    }

    toCss(): string {
        const bodyCss = this.getCssProps({
            fontSize: this.fontSize,
            lineHeight: this.lineHeight,
        });
        const allCssProps: Partial<FontProps> = {
            color: this.color,
        };
        if (this.overrideBookFonts) {
            allCssProps.fontFamily = this.fontFamily;
        }
        const allCss = this.getCssProps(allCssProps);
        const fontsCss = [];

        for (const font of fontsList) {
            if (font.url) {
                fontsCss.push(`
                    @font-face {
                        font-family: ${font.value};
                        src: url(${window.location.origin}${font.url});
                        font-style: normal;
                        font-weight: normal;
                    }
                `);
            }
        }

        return `
            ${fontsCss.join('')}
            body { ${bodyCss} }
            * { ${allCss} }
        `;
    }
}
