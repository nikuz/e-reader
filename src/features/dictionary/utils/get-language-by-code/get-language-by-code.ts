import { Languages } from '../../constants';
import type { Language, LanguageCode } from '../../types';

export function getLanguageByCode(code: LanguageCode): Language {
    const language = Object.values(Languages).find(item => item.code === code);

    return language ?? Languages.ENGLISH;
}