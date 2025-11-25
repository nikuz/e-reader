export abstract class SettingsGroup<T extends Record<string, string | boolean | number | undefined>> {
    abstract toObject(): T;

    toString() {
        return JSON.stringify(this.toObject());
    }
    
    getCssProps(properties: Record<string, string | boolean | number>): string {
        let result = '';

        for (const key in properties) {
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            const value = properties[key];

            result += `${cssKey}: ${value}!important;`;
        }

        return result;
    }

    toCss(): string {
        return '';
    }
}