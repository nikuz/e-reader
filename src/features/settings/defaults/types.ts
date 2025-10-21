export abstract class SettingsGroup<T extends Record<string, string | boolean | number>> {
    abstract toObject(): T;
    abstract toString(): string;
    
    getCssProps(properties: Record<string, string | boolean | number>): string {
        let result = '';

        for (const key in properties) {
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            const value = properties[key];

            result += `${cssKey}: ${value}!important;`;
        }

        return result;
    }

    abstract toCss(): string;
}