import type { DatabaseConfig } from 'src/controllers';

export const DICTIONARY_DIRECTORY = 'dictionary';
export const DICTIONARY_IMAGES_DIRECTORY = 'dictionary/images';
export const DICTIONARY_PRONUNCIATIONS_DIRECTORY = 'dictionary/pronunciations';
export const DICTIONARY_LIST_ITEMS_PER_PAGE = 20;
export const DICTIONARY_QUEUE_MANAGER_RETRY_ATTEMPT = 3;
export const DICTIONARY_QUEUE_MANAGER_RETRY_TIMEOUT = 500;
export const DICTIONARY_MAX_PHRASE_LENGTH = 3; // words

export const DICTIONARY_DB_CONFIG: DatabaseConfig = {
    name: 'dictionary-db',
    indexName: 'dictionary',
    version: 1,
};