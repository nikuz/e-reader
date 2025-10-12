export interface BookAttributes {
    eisbn: string,
    title: string,
    author: string,
    language: string,
    dirname: string,

    // cover
    cover?: string,

    // navigation
    navigationEpub2Src?: string,
    navigationEpub2?: BookNavigationEpub2,
    navigationEpub3Src?: string,

    // spine
    spine: BookChapter[],

    addedAt: number,
}

export interface BookChapter {
    filePath: string,
    url?: string,
    content?: string,
}

export interface BookNavigationEpub2NavPoint {
    text: string;
    src: string;
    children: BookNavigationEpub2NavPoint[];
}

export interface BookNavigationEpub2 {
    navMap: BookNavigationEpub2NavPoint[];
}