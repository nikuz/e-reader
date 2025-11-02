import type { DatabaseConfig } from 'src/controllers';
import type { DictionaryWord } from './types';

export const DICTIONARY_DIRECTORY = 'dictionary';

export const DICTIONARY_DB_CONFIG: DatabaseConfig<DictionaryWord> = {
    name: 'dictionary-db',
    indexName: 'dictionary',
    indexKeyPath: 'id',
};

export const Languages = {
    ENGLISH: { code: 'en', name: 'English' },
    RUSSIAN: { code: 'ru', name: 'Russian' },
} as const;