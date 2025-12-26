import type { LanguageISOCode } from "@features/language/entity.js";
import { BusinessError } from "@shared/errors.js";

export class DuplicateISOCodeError extends BusinessError {
    constructor(code: LanguageISOCode) {
        super(`ISO code ${code} is already in use.`, 409);
        this.name = "DuplicateISOCodeError";
    }
}
