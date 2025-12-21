import type { LanguageISOCode } from "@features/language/entity.js";

export class DuplicateISOCodeError extends Error {
    constructor(code: LanguageISOCode) {
        super(`ISO code ${code} is already in use.`);
        this.name = "DuplicateISOCodeError";
    }
}
