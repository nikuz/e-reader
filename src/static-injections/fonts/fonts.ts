interface FontParams {
    id: string,
    name: string,
    value: string,
    url?: string,
}

export const fontsList: FontParams[] = [
    {
        id: 'default',
        name: 'System default',
        value: 'Inter, Avenir, Helvetica, Arial, sans-serif',
    },
    {
        id: 'merriweather',
        name: 'Merriweather Sans',
        value: 'MerriweatherSans-Italic',
        url: '/fonts/MerriweatherSans-Italic.ttf',
    }
];