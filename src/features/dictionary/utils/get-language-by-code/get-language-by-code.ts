import {
    Languages,
    type Language,
    type LanguageCode,
} from 'src/types';

export function getLanguageByCode(code: LanguageCode): Language {
    const language = Object.values(Languages).find(item => item.code === code);

    return language ?? Languages.ENGLISH;
}