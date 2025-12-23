import type { Readable } from "stream";
import { createHash } from "crypto";

import type { ID } from "@shared/types/id.js";
import { EntityNotFoundError } from "@shared/errors.js";

import type { LoggedUser } from "@features/user/entity.js";
import type { NewVideo, Video } from "@features/video/entity.js";
import type { VideoRepository } from "@features/video/repository.js";
import type { FileService } from "@features/file/service.js";
import { UnauthorizedAccessError } from "@features/authentication/exceptions.js";
import { UserRole } from "@features/user/enums.js";
import { FileState } from "@features/file/enums.js";
import { ExtensionNotFoundError, UnsupportedFileTypeError } from "@features/file/exceptions.js";

export class VideoService {
    constructor(
        private readonly repository: VideoRepository,
        private readonly fileService: FileService
    ) { }

    public async getAll() {
        return this.repository.findAll();
    }

    public async getById(id: ID) {
        return this.repository.findById(id);
    }

    public async create(loggedUser: LoggedUser, data: NewVideo) {
        if (loggedUser.role === UserRole.VIEWER) {
            throw new UnauthorizedAccessError("Only admin and editor users can create new videos.");
        }

        return this.repository.create(data);
    }

    public async update(loggedUser: LoggedUser, id: ID, data: Video) {
        if (loggedUser.role === UserRole.VIEWER) {
            throw new UnauthorizedAccessError("Only admin and editor users can update videos.");
        }

        const existingVideo = await this.repository.findById(id);

        if (!existingVideo) {
            throw new EntityNotFoundError("Video", id);
        }

        existingVideo.title = data.title;
        existingVideo.description = data.description;
        existingVideo.releasedAt = data.releasedAt;
        existingVideo.language = data.language;
        existingVideo.file = data.file;
        existingVideo.tags = data.tags;

        return this.repository.update(id, existingVideo);
    }

    public async delete(loggedUser: LoggedUser, id: ID) {
        if (loggedUser.role === UserRole.VIEWER) {
            throw new UnauthorizedAccessError("Only admin and editor users can delete videos.");
        }

        const existingVideo = await this.repository.findById(id);

        if (!existingVideo) {
            throw new EntityNotFoundError("Video", id);
        }

        return this.repository.delete(id);
    }

    public async storeFile(loggedUser: LoggedUser, id: ID, stream: Readable, originalFilename: string) {
        const extension = originalFilename.split('.').pop() ?? "";

        if (!extension) {
            throw new ExtensionNotFoundError();
        }

        const fileType = await this.fileService.getTypeByExtension(extension);

        if (!fileType) {
            throw new UnsupportedFileTypeError(extension);
        }

        const file = await this.fileService.create(loggedUser, {
            filename: this.generateFilename(id.toString()),
            path: "/videos",
            state: FileState.UPLOADING,
            type: fileType
        });

        await this.fileService.store(file.id, stream);
    }

    public async retrieveFile(id: ID) {
        const video = await this.repository.findById(id);

        if (!video) {
            throw new EntityNotFoundError("Video", id);
        }

        if (!video.file) {
            throw new EntityNotFoundError("File for Video", id);
        }

        return this.fileService.retrieve(video.file.id);
    }

    private generateFilename(title: string) {
        const hash = createHash("sha256")
            .update(title + Date.now().toString())
            .digest("hex");
        return hash;
    }
}