import type { ID } from "@shared/types/id.js";

import type { NewLanguage, Language } from "@features/language/entity.js";
import type { LanguageRepository } from "@features/language/repository.js";

import type { DatabaseClient } from "@infrastructure/database/client.js";
import { SQL } from "@infrastructure/database/utils.js";

export class PostgresLanguageRepository implements LanguageRepository {
    constructor(
        private readonly client: DatabaseClient
    ) { }

    public async findAll(): Promise<Language[]> {
        const query = SQL(
            "SELECT",
                "*",
            "FROM application.languages;"
        );

        return this.client.query(query)
            .then((values: any[]) => {
                return values.map((value) => this.mapToEntity(value));
            });
    }

    public async findById(id: ID): Promise<Language | null> {
        const query = SQL(
            "SELECT",
                "*",
            "FROM application.languages",
            "WHERE id = $1;"
        );
        const params = [id];

        return this.client.query(query, params)
            .then((values: any[]) => {
                const language = values?.shift();
                return language ? this.mapToEntity(language) : null;
            });
    }

    public async findByCode(code: string, excludeIds?: ID[]): Promise<Language | null> {
        const query = SQL(
            "SELECT",
                "*",
            "FROM application.languages",
            "WHERE code = $1",
            (excludeIds && excludeIds.length > 0)
                ? `AND id NOT IN (${excludeIds.map((_, index) => `$${index + 2}`).join(", ")});`
                : ";"
        );
        const params = [code, ...(excludeIds || [])];

        return this.client.query(query, params)
            .then((values: any[]) => {
                const language = values?.shift();
                return language ? this.mapToEntity(language) : null;
            });
    }

    public async create(language: NewLanguage): Promise<Language> {
        const query = SQL(
            "INSERT INTO application.languages (name, code)",
            "VALUES ($1, $2)",
            "RETURNING *"
        );
        const params = [language.name, language.code];

        return this.client.query(query, params)
            .then((value: any) => {
                const entity = value?.shift();
                return this.mapToEntity(entity);
            });
    }

    public async update(id: ID, language: Language): Promise<Language> {
        const query = SQL(
            "UPDATE application.languages SET",
                "name = $1,",
                "code = $2",
            "WHERE id = $3",
            "RETURNING *"
        );
        const params = [language.name, language.code, id];

        return this.client.query(query, params)
            .then((value: any) => {
                const entity = value?.shift();
                return this.mapToEntity(entity);
            });
    }

    public async delete(id: ID): Promise<boolean> {
        const query = SQL(
            "DELETE FROM application.languages",
            "WHERE id = $1;"
        );
        const params = [id];

        return this.client.query(query, params)
            .then(() => true)
            .catch(() => false);
    }

    private mapToEntity(value: any): Language {
        return {
            id: value["id"],
            name: value["name"],
            code: value["code"]
        };
    }
}