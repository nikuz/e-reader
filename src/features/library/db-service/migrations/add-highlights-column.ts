import type { DatabaseMigration } from 'src/controllers';
import { LIBRARY_DB_CONFIG } from '../../constants';

export const addHighlightsColumn: DatabaseMigration = {
    toVersion: 2,
    statements: [
        `ALTER TABLE "${LIBRARY_DB_CONFIG.name}" ADD COLUMN highlights TEXT;`,
    ],
};
