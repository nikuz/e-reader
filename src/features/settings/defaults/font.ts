import { SettingsGroup } from './types';

export interface FontSettings extends SettingsGroup {
    fontSize: string,
    fontFamily: string,
    color: string,
}

export class DefaultFontSettings extends SettingsGroup implements FontSettings {
    static id = 'font';
    
    constructor(overrides?: Partial<FontSettings>) {
        super();
        if (overrides) {
            Object.assign(this, overrides);
        }
    }

    fontSize = '18px';
    fontFamily = 'Arial';
    color = '#FFF';

    toObject() {
        return {
            fontSize: this.fontSize,
            fontFamily: this.fontFamily,
            color: this.color,
        };
    }

    toString() {
        return JSON.stringify(this.toObject());
    }

    toCss(): string {
        const cssProps = this.getCssProps(this.toObject());
        return `* ${cssProps}`;
    }
}