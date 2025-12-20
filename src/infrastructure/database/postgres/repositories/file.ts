import type { ID } from "@shared/types/id.js";

import type { NewFile, File, Path, FileType, NewFileType, Extension } from "@features/file/entity.js";
import type { FileRepository, FileTypeRepository } from "@features/file/repository.js";

import type { DatabaseClient } from "@infrastructure/database/client.js";
import type { FileState } from "@features/file/enums.js";

export class PostgresFileRepository implements FileRepository {
    constructor(
        private readonly client: DatabaseClient
    ) { }

    public async findAll(): Promise<File[]> {
        const query = "SELECT f.*, ft.* FROM application.files f JOIN application.file_types ft ON f.type_id = ft.id;";

        return this.client.query(query)
            .then((values: any[]) => {
                return values.map((value) => this.mapToEntity(value));
            });
    }

    public async findByFilePath(filepath: Path, excludeIds?: ID[]): Promise<File | null> {
        throw new Error("Method not implemented.");
    }

    public async findById(id: ID): Promise<File | null> {
        const query = "SELECT * FROM application.files WHERE id = $1;";
        const params = [id];

        return this.client.query(query, params)
            .then((values: any[]) => {
                const file = values?.shift();
                return file ? this.mapToEntity(file) : null;
            });
    }

    public async create(file: NewFile): Promise<File> {
        const query = "INSERT INTO application.files (path, filename, type_id, state) VALUES ($1, $2, $3, $4) RETURNING *";
        const params = [file.path, file.filename, file.type?.id, file.state as FileState];
        return this.client.query(query, params)
            .then((value: any) => {
                return value?.shift() as File;
            });
    }

    public async update(id: ID, file: File): Promise<File | null> {
        const query = "UPDATE application.files SET path = $1, filename = $2, type_id = $3 WHERE id = $4 RETURNING *";
        const params = [file.path, file.filename, file.type?.id, id];

        return this.client.query(query, params)
            .then((value: any) => {
                return value?.shift() as File;
            });
    }

    public async updateState(id: ID, state: string): Promise<File> {
        const query = "UPDATE application.files SET state = $1 WHERE id = $2 RETURNING *";
        const params = [state, id];

        return this.client.query(query, params)
            .then((value: any) => {
                return value?.shift() as File;
            });
    }

    public async delete(id: ID): Promise<boolean> {
        const query = "DELETE FROM application.files WHERE id = $1;";
        const params = [id];

        return this.client.query(query, params)
            .then(() => true)
            .catch(() => false);
    }

    private mapToEntity(file: any): File {
        return {
            id: file.id,
            path: file.path,
            filename: file.filename,
            type: {
                id: file.type_id,
                name: file.type_name,
                mimeType: file.type_mime_type,
                extension: file.type_extension
            },
            state: file.state as FileState
        };
    }
}

export class PostgresFileTypeRepository implements FileTypeRepository {
    constructor(
        private readonly client: DatabaseClient
    ) { }

    public async findAll(): Promise<FileType[]> {
        const query = "SELECT * FROM application.file_types;";

        return this.client.query(query)
            .then((values: any[]) => {
                return values.map((value) => this.mapToEntity(value));
            });
    }

    public async findByExtension(extension: Extension, excludeIds?: ID[]): Promise<FileType | null> {
        throw new Error("Method not implemented.");
    }

    public async findById(id: ID): Promise<FileType | null> {
        const query = "SELECT * FROM application.file_types WHERE id = $1;";
        const params = [id];

        return this.client.query(query, params)
            .then((values: any[]) => {
                const fileType = values?.shift();
                return fileType ? this.mapToEntity(fileType) : null;
            });
    }

    public async create(file: NewFileType): Promise<FileType> {
        const query = "INSERT INTO application.file_types (name, mime_type, extension) VALUES ($1, $2, $3) RETURNING *";
        const params = [file.name, file.mimeType, file.extension];
        return this.client.query(query, params)
            .then((value: any) => {
                return value?.shift() as FileType;
            });
    }

    public async update(id: ID, file: FileType): Promise<FileType | null> {
        const query = "UPDATE application.file_types SET name = $1, mime_type = $2, extension = $3 WHERE id = $4 RETURNING *";
        const params = [file.name, file.mimeType, file.extension, id];

        return this.client.query(query, params)
            .then((value: any) => {
                return value?.shift() as FileType;
            });
    }

    public async delete(id: ID): Promise<boolean> {
        const query = "DELETE FROM application.file_types WHERE id = $1;";
        const params = [id];

        return this.client.query(query, params)
            .then(() => true)
            .catch(() => false);
    }

    private mapToEntity(fileType: any): FileType {
        return {
            id: fileType.id,
            name: fileType.name,
            mimeType: fileType.mime_type,
            extension: fileType.extension
        };
    }
}