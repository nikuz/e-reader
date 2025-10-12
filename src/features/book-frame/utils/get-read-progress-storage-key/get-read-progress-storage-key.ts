import type { BookAttributes } from 'src/features/library/types';

export function getReadProgressStorageKey(bookAttributes: BookAttributes): string {
    return `${bookAttributes.eisbn}-read-progress`;
}