import type { Response } from "@application/types/response.js";
import type { Request } from "@application/types/request.js";

import type { DatabaseClient } from "@infrastructure/database/client.js";
import { PostgresLanguageRepository } from "@infrastructure/database/postgres/repositories/language.js";

import { LanguageService } from "@features/language/service.js";

export class LanguageController {
    private service: LanguageService;

    constructor(database: DatabaseClient) {
        const repository = new PostgresLanguageRepository(database);
        this.service = new LanguageService(repository);
    }

    public async getAll(request: Request, response: Response) {
        const languages = await this.service.getAll();

        response.send(JSON.stringify(languages));
    }

    public async getById(request: Request, response: Response) {
        const { id } = request.params;

        const language = await this.service.getById(id);
        response.send(JSON.stringify(language));
    }

    public async getByCode(request: Request, response: Response) {
        const { code } = request.params;

        const language = await this.service.getByCode(code);
        response.send(JSON.stringify(language));
    }

    public async create(request: Request, response: Response) {
        const loggedUser = request.user!;
        const language = request.body;

        const newLanguage = await this.service.create(loggedUser, language);
        response.send(JSON.stringify(newLanguage));
    }

    public async update(request: Request, response: Response) {
        const loggedUser = request.user!;
        const { id } = request.params;
        const language = request.body;

        const updatedLanguage = await this.service.update(loggedUser, id, language);
        response.send(JSON.stringify(updatedLanguage));
    }

    public async delete(request: Request, response: Response) {
        const loggedUser = request.user!;
        const { id } = request.params;

        const result = await this.service.delete(loggedUser, id);
        response.send(JSON.stringify({ success: result }));
    }
}