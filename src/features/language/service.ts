import type { ID } from "@shared/types/id.js";
import { EntityNotFoundError } from "@shared/errors.js";

import type { LoggedUser } from "@features/user/entity.js";
import type { Language, LanguageISOCode, NewLanguage } from "@features/language/entity.js";
import type { LanguageRepository } from "@features/language/repository.js";
import { UnauthorizedAccessError } from "@features/authentication/exceptions.js";
import { UserRole } from "@features/user/enums.js";
import { DuplicateISOCodeError } from "@features/language/exceptions.js";

export class LanguageService {
    constructor(
        private repository: LanguageRepository
    ) { }

    public async getAll() {
        return this.repository.findAll();
    }

    public async getById(id: ID) {
        return this.repository.findById(id)
            .then((language: Language | null) => {
                if (!language) {
                    throw new EntityNotFoundError("Language", id);
                }

                return language;
            });
    }

    public async getByCode(code: LanguageISOCode) {
        return this.repository.findByCode(code);
    }

    public async create(loggedUser: LoggedUser, data: NewLanguage) {
        if (loggedUser.role !== UserRole.ADMIN) {
            throw new UnauthorizedAccessError("Only admin users can create new languages.");
        }

        await this.ensureISOCodeIsUnique(data.code);

        return this.repository.create(data);
    }

    public async update(loggedUser: LoggedUser, id: ID, data: Language) {
        if (loggedUser.role !== UserRole.ADMIN) {
            throw new UnauthorizedAccessError("Only admin users can update languages.");
        }

        await this.ensureISOCodeIsUnique(data.code, [id]);

        const existingLanguage = await this.repository.findById(id);

        if (!existingLanguage) {
            throw new EntityNotFoundError("Language", id);
        }

        existingLanguage.name = data.name;
        existingLanguage.code = data.code;

        return this.repository.update(id, existingLanguage);
    }

    public async delete(loggedUser: LoggedUser, id: ID) {
        if (loggedUser.role !== UserRole.ADMIN) {
            throw new UnauthorizedAccessError("Only admin users can delete languages.");
        }

        return this.repository.delete(id);
    }

    private async ensureISOCodeIsUnique(code: LanguageISOCode, excludeIds?: ID[]) {
        const existingLanguage = await this.repository.findByCode(code, excludeIds);

        if (existingLanguage) {
            throw new DuplicateISOCodeError(code);
        }
    }
}