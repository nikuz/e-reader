import { SettingsGroup } from '../types';

const defaultDictionaryProps = {
    voice: undefined as number | undefined,
};

type DictionaryProps = typeof defaultDictionaryProps;

export type DictionarySettings = SettingsGroup<DictionaryProps>
    & DictionaryProps;

export class DefaultDictionarySettings extends SettingsGroup<DictionaryProps> implements DictionarySettings {
    static id = 'voice';
    
    declare voice: number | undefined;
    
    constructor(overrides?: Partial<DictionarySettings>) {
        super();
        Object.assign(this, defaultDictionaryProps, overrides);
    }

    toObject(): DictionaryProps {
        return {
            voice: this.voice,
        };
    }

    toString() {
        return JSON.stringify(this.toObject());
    }

    toCss(): string {
        return '';
    }
}
