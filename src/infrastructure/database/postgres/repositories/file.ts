import type { ID } from "@shared/types/id.js";

import type { NewFile, File, Path, FileType } from "@features/file/entity.js";
import type { FileRepository } from "@features/file/repository.js";
import type { FileState } from "@features/file/enums.js";

import type { DatabaseClient } from "@infrastructure/database/client.js";
import { SQL } from "@infrastructure/database/utils.js";

export class PostgresFileRepository implements FileRepository {
    constructor(
        private readonly client: DatabaseClient
    ) { }

    public async findAll(): Promise<File[]> {
        const query = SQL(
            "SELECT",
                "f.*,",
                "ft.id as ft_id,",
                "ft.name as ft_name,",
                "ft.extension as ft_extension,",
                "ft.mime_type as ft_mime_type",
            "FROM application.files f",
            "JOIN application.file_types ft ON f.type_id = ft.id;"
        );

        return this.client.query(query)
            .then((values: any[]) => {
                return values.map((value) => this.mapToEntityWithJoin(value));
            });
    }

    public async findByFilePath(filepath: Path, excludeIds?: ID[]): Promise<File | null> {
        throw new Error("Method not implemented.");
    }

    public async findById(id: ID): Promise<File | null> {
        const query = SQL(
            "SELECT",
                "f.*,",
                "ft.id as ft_id,",
                "ft.name as ft_name,",
                "ft.extension as ft_extension,",
                "ft.mime_type as ft_mime_type",
            "FROM application.files f",
            "JOIN application.file_types ft ON f.type_id = ft.id",
            "WHERE f.id = $1;"
        );
        const params = [id];

        return this.client.query(query, params)
            .then((values: any[]) => {
                const file = values?.shift();
                return file ? this.mapToEntityWithJoin(file) : null;
            });
    }

    public async create(file: NewFile): Promise<File> {
        const query = SQL(
            "INSERT INTO application.files (path, filename, type_id, state)",
            "VALUES ($1, $2, $3, $4)",
            "RETURNING *"
        );
        const params = [file.path, file.filename, file.type?.id, file.state as FileState];

        return this.client.query(query, params)
            .then((value: any) => {
                const entity = value?.shift();
                return this.mapToEntity(entity);
            });
    }

    public async update(id: ID, file: File): Promise<File | null> {
        const query = SQL(
            "UPDATE application.files SET",
                "path = $1,",
                "filename = $2,",
                "type_id = $3",
            "WHERE id = $4",
            "RETURNING *"
        );
        const params = [file.path, file.filename, file.type?.id, id];

        return this.client.query(query, params)
            .then((value: any) => {
                const entity = value?.shift();
                return this.mapToEntity(entity);
            });
    }

    public async updateState(id: ID, state: string): Promise<File> {
        const query = SQL(
            "UPDATE application.files SET",
                "state = $1",
            "WHERE id = $2",
            "RETURNING *"
        );
        const params = [state, id];

        return this.client.query(query, params)
            .then((value: any) => {
                return value?.shift() as File;
            });
    }

    public async delete(id: ID): Promise<boolean> {
        const query = SQL(
            "DELETE FROM application.files",
            "WHERE id = $1;"
        );
        const params = [id];

        return this.client.query(query, params)
            .then(() => true)
            .catch(() => false);
    }

    private async populateType(fileTypeId: ID) {
        const query = "SELECT * FROM application.file_types WHERE id = $1;";
        const params = [fileTypeId];

        return this.client.query(query, params)
            .then((values: any[]) => {
                const fileType = values?.shift();
                return {
                    id: fileType.id,
                    name: fileType.name,
                    mimeType: fileType.mime_type,
                    extension: fileType.extension
                } as FileType;
            });
    }

    private async mapToEntity(file: any) {
        return {
            id: file.id,
            path: file.path,
            filename: file.filename,
            type: await this.populateType(file.type_id),
            state: file.state as FileState
        };
    }

    private mapToEntityWithJoin(file: any): File {
        return {
            id: file["id"],
            path: file["path"],
            filename: file["filename"],
            type: {
                id: file["ft_id"],
                name: file["ft_name"],
                mimeType: file["ft_mime_type"],
                extension: file["ft_extension"]
            },
            state: file["state"] as FileState
        };
    }
}
