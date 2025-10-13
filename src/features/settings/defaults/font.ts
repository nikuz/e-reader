import { SettingsGroup } from './types';

const fontCSSProperties = {
    fontSize: '18px',
    fontFamily: 'Inter, Avenir, Helvetica, Arial, sans-serif',
    color: '#FFF',
    lineHeight: '1.5em',
};

type FontProps = typeof fontCSSProperties;

export type FontSettings = SettingsGroup<FontProps> & FontProps;

export class DefaultFontSettings extends SettingsGroup<FontProps> implements FontSettings {
    static id = 'font';
    
    declare fontSize: string;
    declare fontFamily: string;
    declare color: string;
    declare lineHeight: string;
    
    constructor(overrides?: Partial<FontSettings>) {
        super();
        Object.assign(this, fontCSSProperties, overrides);
    }

    toObject() {
        const result = {} as FontProps;
        for (const key in fontCSSProperties) {
            const keyTyped = key as keyof FontProps;
            result[keyTyped] = this[keyTyped];
        }
        return result;
    }

    toString() {
        return JSON.stringify(this.toObject());
    }

    toCss(): string {
        const cssProps = this.getCssProps(this.toObject());
        return `* { ${cssProps} }`;
    }
}
