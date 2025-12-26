import { PassThrough } from "stream";
import busboy from "busboy";

import type { Request } from "@application/types/request.js";
import type { Response } from "@application/types/response.js";
import { Environment } from "@application/configuration/environment.js";

import type { DatabaseClient } from "@infrastructure/database/client.js";
import { LocalStorage } from "@infrastructure/storage/local.js";
import { PostgresFileRepository } from "@infrastructure/database/postgres/repositories/file.js";
import { PostgresFileTypeRepository } from "@infrastructure/database/postgres/repositories/file-type.js";

import { FileService } from "@features/file/service.js";

export class FileController {
    private service: FileService;

    constructor(database: DatabaseClient) {
        const repository = new PostgresFileRepository(database);
        const typeRepository = new PostgresFileTypeRepository(database);
        const storage = new LocalStorage(Environment.LOCAL_STORAGE_ROOT_PATH);
        this.service = new FileService(repository, typeRepository, storage);
    }

    public async upload(request: Request, response: Response) {
        const { id } = request.params;

        const passThrough = new PassThrough();

        const bb = busboy({ headers: request.headers });
        bb.on("file", (name, file, info) => {
            file.on("data", (data) => {
                passThrough.write(data);
            });

            file.on("end", () => {
                passThrough.end();
            });
        });

        bb.on("finish", () => {
            response.status(200).json({ message: "File uploaded successfully" });
        });

        request.pipe(bb);

        this.service.store(id, passThrough);
    }

    public async download(request: Request, response: Response) {
        const { id } = request.params;

        const file = await this.service.getById(id);
        const readStream = await this.service.retrieve(id);

        response.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);
        response.setHeader("Content-Type", file.type.mimeType);

        readStream.pipe(response);
    }

    public async getAllTypes(request: Request, response: Response) {
        const fileTypes = await this.service.getAllTypes();

        response.json(fileTypes);
    }

    public async getTypeById(request: Request, response: Response) {
        const { id } = request.params;

        const fileType = await this.service.getTypeById(id);

        response.json(fileType);
    }

    public async createType(request: Request, response: Response) {
        const loggedUser = request.user!;
        const fileType = request.body;

        const createdFileType = await this.service.createType(loggedUser, fileType);

        response.json(createdFileType);
    }

    public async updateType(request: Request, response: Response) {
        const loggedUser = request.user!;
        const { id } = request.params;
        const fileType = request.body;

        const updatedFileType = await this.service.updateType(loggedUser, id, fileType);

        response.json(updatedFileType);
    }

    public async deleteType(request: Request, response: Response) {
        const loggedUser = request.user!;
        const { id } = request.params;

        const result = await this.service.deleteType(loggedUser, id);

        response.json({ success: result });
    }
}