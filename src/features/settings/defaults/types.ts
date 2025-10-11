export abstract class SettingsGroup {
    abstract toObject(): Record<string, string | number>;
    abstract toString(): string;
    
    getCssProps(properties: Record<string, string | number>) {
        const css: Record<string, string | number> = {};

        for (const key in properties) {
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            const value = properties[key];

            css[cssKey] = value;
        }

        return JSON.stringify(css)
            .replaceAll(',', ';')
            .replace(/"([^"]+)":/g, '$1:');
    }

    abstract toCss(): string;
}