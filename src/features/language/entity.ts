import type { ID } from "@shared/types/id.js";

export interface Language {
    id: ID;
    name: string;
    code: LanguageISOCode;
}

export type NewLanguage = Omit<Language, "id">;
export type LanguageISOCode = string;