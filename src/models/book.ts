import type { BookAttributes, BookChapter, BookHighlight } from 'src/types';

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

    constructor(attributes: BookAttributes) {
        this.attributes = structuredClone(attributes);
        this.#spine = structuredClone(attributes.spine);
        this.#highlights = structuredClone(attributes.highlights);
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

    clone() {
        const newInstance = new BookModel(this.attributes);
        if (this.cover) {
            newInstance.cover = this.cover;
        }
        newInstance.spine = this.spine;
        newInstance.highlights = this.highlights;

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
        };
    }
}