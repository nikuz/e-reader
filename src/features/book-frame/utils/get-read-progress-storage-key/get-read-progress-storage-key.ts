import type { BookAttributes } from 'src/types';

export function getReadProgressStorageKey(bookAttributes: BookAttributes): string {
    return `${bookAttributes.eisbn}-read-progress`;
}