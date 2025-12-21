import type { ID } from "@shared/types/id.js";

import type { FileType, NewFileType, Extension } from "@features/file/entity.js";
import type { FileTypeRepository } from "@features/file/repository.js";

import type { DatabaseClient } from "@infrastructure/database/client.js";
import { SQL } from "@infrastructure/database/utils.js";

export class PostgresFileTypeRepository implements FileTypeRepository {
    constructor(
        private readonly client: DatabaseClient
    ) { }

    public async findAll(): Promise<FileType[]> {
        const query = SQL(
            "SELECT * FROM application.file_types;"
        );

        return this.client.query(query)
            .then((values: any[]) => {
                return values.map((value) => this.mapToEntity(value));
            });
    }

    public async findByExtension(extension: Extension, excludeIds?: ID[]): Promise<FileType | null> {
        const query = SQL(
            "SELECT * FROM application.file_types",
            "WHERE extension = $1",
            excludeIds && excludeIds.length > 0 ? `AND id NOT IN (${excludeIds.map((_, index) => `$${index + 2}`).join(", ")});` : ";"
        );
        const params = [extension, ...(excludeIds ?? [])];

        return this.client.query(query, params)
            .then((values: any[]) => {
                const fileType = values?.shift();
                return fileType ? this.mapToEntity(fileType) : null;
            });
    }

    public async findById(id: ID): Promise<FileType | null> {
        const query = SQL(
            "SELECT * FROM application.file_types",
            "WHERE id = $1;"
        );
        const params = [id];

        return this.client.query(query, params)
            .then((values: any[]) => {
                const fileType = values?.shift();
                return fileType ? this.mapToEntity(fileType) : null;
            });
    }

    public async create(file: NewFileType): Promise<FileType> {
        const query = SQL(
            "INSERT INTO application.file_types (name, mime_type, extension)",
            "VALUES ($1, $2, $3)",
            "RETURNING *"
        );
        const params = [file.name, file.mimeType, file.extension];

        return this.client.query(query, params)
            .then((value: any) => {
                return value?.shift() as FileType;
            });
    }

    public async update(id: ID, file: FileType): Promise<FileType | null> {
        const query = SQL(
            "UPDATE application.file_types SET",
                "name = $1,",
                "mime_type = $2,",
                "extension = $3",
            "WHERE id = $4",
            "RETURNING *"
        );
        const params = [file.name, file.mimeType, file.extension, id];

        return this.client.query(query, params)
            .then((value: any) => {
                return value?.shift() as FileType;
            });
    }

    public async delete(id: ID): Promise<boolean> {
        const query = SQL(
            "DELETE FROM application.file_types",
            "WHERE id = $1;"
        );
        const params = [id];

        return this.client.query(query, params)
            .then(() => true)
            .catch(() => false);
    }

    private mapToEntity(fileType: any): FileType {
        return {
            id: fileType["id"],
            name: fileType["name"],
            mimeType: fileType["mime_type"],
            extension: fileType["extension"]
        };
    }
}
