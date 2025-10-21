import { fontsList } from 'src/static-injections/fonts';
import { SettingsGroup } from './types';

const defaultFontValues = {
    fontSize: '18px',
    color: '#FFFFFF',
    lineHeight: '1.5em',
    wordSpacing: '0px',
    letterSpacing: '0px',
    overrideBookFonts: false,
    fontFamily: fontsList.find(item => item.name === 'System default')?.value ?? '',
};

type FontProps = typeof defaultFontValues;

export type FontSettings = SettingsGroup<FontProps>
    & FontProps
    & { getFontCss: () => string };

export class DefaultFontSettings extends SettingsGroup<FontProps> implements FontSettings {
    static id = 'font';
    
    declare fontSize: string;
    declare color: string;
    declare lineHeight: string;
    declare wordSpacing: string;
    declare letterSpacing: string;
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
            wordSpacing: this.wordSpacing,
            letterSpacing: this.letterSpacing,
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
            wordSpacing: this.wordSpacing,
            letterSpacing: this.letterSpacing,
        });
        const allCssProps: Partial<FontProps> = {
            color: this.color,
        };
        if (this.overrideBookFonts) {
            allCssProps.fontFamily = this.fontFamily;
        }
        const allCss = this.getCssProps(allCssProps);
        
        return `    
            body { ${bodyCss} }
            :not(a) { ${allCss} }
        `;
    }

    getFontCss(): string {
        if (!this.overrideBookFonts) {
            return '';
        }

        const selectedFont = fontsList.find(item => item.value === this.fontFamily);
        if (!selectedFont) {
            return '';
        }

        return `
            @font-face {
                font-family: ${selectedFont.value};
                src: url(${window.location.origin}${selectedFont.url});
                font-style: normal;
                font-weight: normal;
            }
        `;
    }
}
