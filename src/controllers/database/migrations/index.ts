import type { DatabaseMigration } from '../types';
import { createTables } from './001-create-tables';

export const migrations: DatabaseMigration[] = [
    createTables,
];
