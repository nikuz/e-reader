export interface BookAttributes {
    eisbn: string,
    title: string,
    author: string,
    language: string,
    navigation: string,
    dirname: string,
    cover?: string,

    spine: Record<string, string>,
}

export interface BookSettings {
    chapter: number,
    page: number,
}
