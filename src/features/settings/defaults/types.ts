export abstract class SettingsGroup {
    abstract toObject(): Record<string, string>;
    abstract toString(): string;
    
    getCssProps(properties: Record<string, string>) {
        const css: Record<string, string> = {};

        for (const key in properties) {
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            const value = properties[key];

            css[cssKey] = `${value}!important`;
        }

        return JSON.stringify(css)
            .replaceAll(',', ';')
            .replaceAll('"', '');
    }

    abstract toCss(): string;
}