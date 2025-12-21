import type { ID } from "@shared/types/id.js";
import type { Repository } from "@shared/repository.js";

import type { Language, LanguageISOCode, NewLanguage } from "@features/language/entity.js";

export interface LanguageRepository extends Repository<ID, Language, NewLanguage> {
    findByCode(code: LanguageISOCode, excludeIds?: ID[]): Promise<Language | null>;
}