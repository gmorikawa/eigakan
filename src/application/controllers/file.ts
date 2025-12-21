import { PassThrough } from "stream";
import busboy from "busboy";

import type { Request } from "@application/types/request.js";
import type { Response } from "@application/types/response.js";

import type { DatabaseClient } from "@infrastructure/database/client.js";
import { PostgresFileRepository, PostgresFileTypeRepository } from "@infrastructure/database/postgres/repositories/file.js";
import { LocalStorage } from "@infrastructure/storage/local.js";

import { FileService } from "@features/file/service.js";
import { FileState } from "@features/file/enums.js";

export class FileController {
    private service: FileService;

    constructor(database: DatabaseClient) {
        const repository = new PostgresFileRepository(database);
        const typeRepository = new PostgresFileTypeRepository(database);
        const storage = new LocalStorage("/home/gmorikawa/Library");
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

        this.service.store(id, passThrough)
    }

    public async download(request: Request, response: Response) {
        const { id } = request.params;

        const file = await this.service.getById(id);

        if (!file) {
            response.status(404).json({ error: "File not found" });
            return;
        }

        if (file.state !== FileState.AVAILABLE) {
            response.status(400).json({ error: "File is not available for download" });
            return;
        }

        const readStream = await this.service.retrieve(id);

        response.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);
        response.setHeader("Content-Type", file.type.mimeType);

        readStream.pipe(response);
    }
}