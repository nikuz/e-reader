import type { DatabaseConfig } from 'src/controllers';

export const DICTIONARY_DIRECTORY = 'dictionary';
export const DICTIONARY_IMAGES_DIRECTORY = 'dictionary/images';
export const DICTIONARY_PRONUNCIATIONS_DIRECTORY = 'dictionary/pronunciations';
export const DICTIONARY_LIST_ITEMS_PER_PAGE = 20;

export const DICTIONARY_DB_CONFIG: DatabaseConfig = {
    name: 'dictionary-db',
    indexName: 'dictionary',
    version: 1,
};

export const Languages = {
    ENGLISH: { code: 'en', name: 'English' },
    RUSSIAN: { code: 'ru', name: 'Russian' },
} as const;