export interface BookAttributes {
    eisbn: string,
    language: string,
    creator: string,
    navigation: string,
    dirname: string,

    spine: Map<string, string>,
}

export interface BookSettings {
    chapter: number,
    chapterUrl: string,
    page: number,
}

export interface Position {
    x: number,
    y: number,
}