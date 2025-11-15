import type {
    BookAttributes,
    BookChapter,
    BookHighlight,
    BookNavigationEpub2,
} from 'src/types';

export class BookModel implements BookAttributes {
    private attributes: BookAttributes;
    declare eisbn: string;
    declare title: string;
    declare author: string;
    declare language: string;
    declare dirname: string;
    declare createdAt: number;
    declare updatedAt?: number;
    #cover: string | undefined;
    #spine: BookChapter[];
    #highlights: BookHighlight[][];
    #navigationEpub2Src?: string;
    #navigationEpub2?: BookNavigationEpub2;
    #navigationEpub3Src?: string;

    constructor(attributes: BookAttributes) {
        this.attributes = structuredClone(attributes);
        this.#spine = structuredClone(attributes.spine);
        this.#highlights = structuredClone(attributes.highlights);
        this.#navigationEpub2 = structuredClone(attributes.navigationEpub2);
        Object.assign(this, attributes);
    }

    set cover(cover: string | undefined) {
        this.#cover = cover;
    }
    get cover(): string | undefined {
        return this.#cover;
    }

    set spine(spine: BookChapter[]) {
        this.#spine = spine;
    }
    get spine(): BookChapter[] {
        return this.#spine;
    }

    set highlights(highlights: BookHighlight[][]) {
        this.#highlights = highlights;
    }
    get highlights(): BookHighlight[][] {
        return this.#highlights;
    }
    
    set navigationEpub2Src(src: string) {
        this.#navigationEpub2Src = src;
    }
    get navigationEpub2Src(): string | undefined {
        return this.#navigationEpub2Src;
    }
    
    set navigationEpub2(navigation: BookNavigationEpub2) {
        this.#navigationEpub2 = navigation;
    }
    get navigationEpub2(): BookNavigationEpub2 | undefined {
        return this.#navigationEpub2;
    }
    
    set navigationEpub3Src(src: string) {
        this.#navigationEpub3Src = src;
    }
    get navigationEpub3Src(): string | undefined {
        return this.#navigationEpub3Src;
    }

    clone() {
        const newInstance = new BookModel(this.attributes);
        if (this.cover) {
            newInstance.cover = this.cover;
        }
        newInstance.spine = this.spine;
        newInstance.highlights = this.highlights;

        if (this.navigationEpub2Src) {
            newInstance.navigationEpub2Src = this.navigationEpub2Src;
        }
        if (this.navigationEpub2) {
            newInstance.navigationEpub2 = this.navigationEpub2;
        }
        if (this.navigationEpub3Src) {
            newInstance.navigationEpub3Src = this.navigationEpub3Src;
        }

        return newInstance;
    }

    toOriginal() {
        return {
            ...this.attributes,
            highlights: this.highlights.map(chapter => chapter?.map((item): BookHighlight => ({
                id: item.id,
                startXPath: item.startXPath,
                startOffset: item.startOffset,
                endXPath: item.endXPath,
                endOffset: item.endOffset,
                text: item.text,
                context: item.context,
            }))),
        };
    }

    toTransferableObject(): BookAttributes {
        return {
            ...this.toOriginal(),
            cover: this.cover,
            spine: this.spine,
            navigationEpub2Src: this.navigationEpub2Src,
            navigationEpub2: this.navigationEpub2,
            navigationEpub3Src: this.navigationEpub3Src,
        };
    }
}