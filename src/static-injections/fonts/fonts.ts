interface FontParams {
    name: string,
    value: string,
    url?: string,
}

export const fontsList: FontParams[] = [
    {
        name: 'System default',
        value: 'Inter, Avenir, Helvetica, Arial, sans-serif',
    },
    {
        name: 'Merriweather Sans',
        value: 'MerriweatherSans-Italic',
        url: '/fonts/MerriweatherSans-Italic.ttf',
    }
];