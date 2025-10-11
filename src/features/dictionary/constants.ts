import type { DatabaseConfig } from 'src/controllers';
import type { DictionaryWord } from './types';

export const DICTIONARY_DIRECTORY = 'dictionary';

export const DICTIONARY_DB_CONFIG: DatabaseConfig<DictionaryWord> = {
    name: 'dictionary-db',
    indexName: 'dictionary',
    indexKeyPath: 'id',
};