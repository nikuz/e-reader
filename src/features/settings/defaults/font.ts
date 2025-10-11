import { SettingsGroup } from './types';

export interface FontSettings extends SettingsGroup {
    fontSize: number,
    fontFamily: string,
}

export class DefaultFontSettings extends SettingsGroup implements FontSettings {
    static id = 'font';
    
    constructor(overrides?: Partial<FontSettings>) {
        super();
        if (overrides) {
            Object.assign(this, overrides);
        }
    }

    fontSize = 18;
    fontFamily = 'Arial';

    toObject() {
        return {
            fontSize: this.fontSize,
            fontFamily: this.fontFamily,
        };
    }

    toString() {
        return JSON.stringify(this.toObject());
    }

    toCss(): string {
        const cssProps = this.getCssProps(this.toObject());
        return `body ${cssProps}`;
    }
}