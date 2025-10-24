export interface BookReadProgress {
    chapter: number,
    page: number,
}

export interface SerializedRange {
    startXPath: string,
    startOffset: number,
    endXPath: string,
    endOffset: number,
};