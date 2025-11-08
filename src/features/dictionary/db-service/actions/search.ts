import { DatabaseController } from 'src/controllers';
import { DICTIONARY_DB_CONFIG } from '../../constants';
import type { DictionaryWord } from '../../types';

export async function searchInDB(props: {
    db: DatabaseController<DictionaryWord>,
    searchText: string,
    from: number,
    to: number,
}): Promise<DictionaryWord[]> {
    const { db, searchText, from, to } = props;
    const searchPattern = `%${searchText}%`;
    const searchPatternStart = `%${searchText}`;
    const searchPatternEnd = `${searchText}%`;
    
    return await db.query(
        `
            SELECT * FROM "${DICTIONARY_DB_CONFIG.name}"
            WHERE
                word LIKE :searchPattern
                OR translation LIKE :searchPattern
            ORDER BY
                CASE 
                WHEN word LIKE :searchText THEN 1
                WHEN translation LIKE :searchText THEN 1
                WHEN word LIKE :searchPatternEnd THEN 2
                WHEN translation LIKE :searchPatternEnd THEN 2
                WHEN word LIKE :searchPatternStart THEN 3
                WHEN translation LIKE :searchPatternStart THEN 3
                ELSE 4
            END,
            word ASC,
            created_at DESC
            LIMIT :limit OFFSET :offset;
        `,
        [
            searchPattern,
            searchPattern,
            searchText,
            searchText,
            searchPatternEnd,
            searchPatternEnd,
            searchPatternStart,
            searchPatternStart,
            to - from,
            from,
        ]
    );
}