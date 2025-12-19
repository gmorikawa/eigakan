import { FileService } from "@features/file/service.js";
import type { DatabaseClient } from "@infrastructure/database/client.js";
import { PostgresFileRepository, PostgresFileTypeRepository } from "@infrastructure/database/postgres/repositories/file.js";
import { LocalStorage } from "@infrastructure/storage/local.js";

export class FileController {
    private service: FileService;

    constructor(database: DatabaseClient) {
        const repository = new PostgresFileRepository(database);
        const typeRepository = new PostgresFileTypeRepository(database);
        const storage = new LocalStorage();
        this.service = new FileService(repository, typeRepository, storage);
    }
}