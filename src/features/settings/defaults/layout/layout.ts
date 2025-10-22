import { SettingsGroup } from '../types';

const defaultLayoutValues = {
    paragraphMargin: '0px',
    marginLeft: '10px',
    marginRight: '10px',
    marginTop: '10px',
    marginBottom: '10px',
};

type LayoutProps = typeof defaultLayoutValues;

export type LayoutSettings = SettingsGroup<LayoutProps> & LayoutProps

export class DefaultLayoutSettings extends SettingsGroup<LayoutProps> implements LayoutSettings {
    static id = 'layout';
    
    declare paragraphMargin: string;
    declare marginLeft: string;
    declare marginRight: string;
    declare marginTop: string;
    declare marginBottom: string;
    
    constructor(overrides?: Partial<LayoutSettings>) {
        super();
        Object.assign(this, defaultLayoutValues, overrides);
    }

    toObject(): LayoutProps {
        return {
            paragraphMargin: this.paragraphMargin,
            marginLeft: this.marginLeft,
            marginRight: this.marginRight,
            marginTop: this.marginTop,
            marginBottom: this.marginBottom,
        };
    }

    toString() {
        return JSON.stringify(this.toObject());
    }

    toCss(): string {
        const bodyCss = this.getCssProps({
            padding: `${this.marginTop} 0 ${this.marginBottom}`,
            height: `calc(100% - ${this.marginTop} - ${this.marginBottom})`,
        });
        const bodyChildCss = this.getCssProps({
            margin: `0 ${this.marginRight} 0 ${this.marginLeft}`,
        });
        const paragraphCss = this.getCssProps({
            marginBottom: this.paragraphMargin,
        });
        
        return `
            body { ${bodyCss} }
            body > * { ${bodyChildCss} }
            p { ${paragraphCss} }
        `;
    }
}
