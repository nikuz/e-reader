export interface DatabaseConfig {
    name: string;
    indexName: string;
    version?: number;
}

export interface DatabaseMigration {
    toVersion: number,
    statements: string[],
}