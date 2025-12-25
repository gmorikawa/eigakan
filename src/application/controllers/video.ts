import busboy from "busboy";
import { PassThrough } from "stream";

import type { Response } from "@application/types/response.js";
import type { Request } from "@application/types/request.js";
import { Environment } from "@application/configuration/environment.js";

import type { DatabaseClient } from "@infrastructure/database/client.js";
import { LocalStorage } from "@infrastructure/storage/local.js";
import { PostgresVideoRepository } from "@infrastructure/database/postgres/repositories/video.js";
import { PostgresFileRepository } from "@infrastructure/database/postgres/repositories/file.js";
import { PostgresFileTypeRepository } from "@infrastructure/database/postgres/repositories/file-type.js";

import { FileService } from "@features/file/service.js";
import { VideoService } from "@features/video/service.js";

export class VideoController {
    private readonly service: VideoService;

    constructor(database: DatabaseClient) {
        const repository = new PostgresVideoRepository(database);
        const fileRepository = new PostgresFileRepository(database);
        const fileTypeRepository = new PostgresFileTypeRepository(database);
        const storage = new LocalStorage(Environment.LOCAL_STORAGE_ROOT_PATH);
        const fileService = new FileService(fileRepository, fileTypeRepository, storage);

        this.service = new VideoService(repository, fileService);
    }

    public async getAll(request: Request, response: Response) {
        const videos = await this.service.getAll();

        response.send(JSON.stringify(videos));
    }

    public async getById(request: Request, response: Response) {
        const { id } = request.params;

        const video = await this.service.getById(id);
        response.send(JSON.stringify(video));
    }

    public async create(request: Request, response: Response) {
        const loggedUser = request.user!;
        const video = request.body;

        const newVideo = await this.service.create(loggedUser, video);
        response.send(JSON.stringify(newVideo));
    }

    public async update(request: Request, response: Response) {
        const loggedUser = request.user!;
        const { id } = request.params;
        const video = request.body;

        const updatedVideo = await this.service.update(loggedUser, id, video);
        response.send(JSON.stringify(updatedVideo));
    }

    public async delete(request: Request, response: Response) {
        const loggedUser = request.user!;
        const { id } = request.params;

        const result = await this.service.delete(loggedUser, id);
        response.send(JSON.stringify({ success: result }));
    }

    public async upload(request: Request, response: Response) {
        const loggedUser = request.user!;
        const { id } = request.params;

        const passThrough = new PassThrough();

        const bb = busboy({ headers: request.headers });
        bb.on("file", async (name, stream, info) => {
            const { filename: originalFilename } = info;

            stream.on("data", (data) => {
                passThrough.write(data);
            });

            stream.on("end", () => {
                passThrough.end();
            });

            this.service.storeFile(loggedUser, id, passThrough, originalFilename);
        });

        bb.on("finish", () => {
            response.status(200).json({ message: "File uploaded successfully" });
        });

        request.pipe(bb);
    }

    public async download(request: Request, response: Response) {
        const { id } = request.params;
        const range = request.headers.range;

        const video = await this.service.getById(id);
        const bytes = await this.service.getFileBytes(id);

        if (!video) {
            response.status(404).json({ error: "Video not found" });
            return;
        }

        if (!video.file) {
            response.status(404).json({ error: "File for video not found" });
            return;
        }

        const parts = range ? range.replace(/bytes=/, "").split("-") : [];
        const start = parts[0] ? parseInt(parts[0], 10) : 0;
        const end = parts[1] ? parseInt(parts[1], 10) : bytes - 1;
        const chunkSize = (end - start) + 1;

        const readStream = await this.service.retrieveFile(id, { rangeStart: start, rangeEnd: end });

        response.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${bytes}`,
            "Accept-Ranges": "bytes",
            "Content-Disposition": `attachment; filename="${video.file.filename}"`,
            "Content-Length": chunkSize,
            "Content-Type": video.file.type.mimeType,
        });

        readStream.pipe(response);
    }
}