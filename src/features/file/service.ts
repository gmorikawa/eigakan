import type { Readable } from "stream";

import type { ID } from "@shared/types/id.js";
import { EntityNotFoundError } from "@shared/errors.js";

import type { LoggedUser } from "@features/user/entity.js";
import type { Storage } from "@features/file/storage.js";
import type { NewFile, File, NewFileType, FileType } from "@features/file/entity.js";
import type { FileRepository, FileTypeRepository } from "@features/file/repository.js";
import { UnauthorizedAccessError } from "@features/authentication/exceptions.js";
import { UserRole } from "@features/user/enums.js";
import { FileState } from "@features/file/enums.js";
import { FileNotAvailableError, FileUploadingError } from "@features/file/exceptions.js";

export class FileService {
    constructor(
        private repository: FileRepository,
        private typeRepository: FileTypeRepository,
        private storage: Storage,
    ) { }

    public async getAll() {
        return this.repository.findAll();
    }

    public async getById(id: ID) {
        return this.repository.findById(id);
    }

    public async create(loggedUser: LoggedUser, data: NewFile) {
        if (loggedUser.role === UserRole.VIEWER) {
            throw new UnauthorizedAccessError("Viewers are not allowed to create new files.");
        }

        return this.repository.create(data);
    }

    public async createType(loggedUser: LoggedUser, data: NewFileType) {
        if (loggedUser.role !== UserRole.ADMIN) {
            throw new UnauthorizedAccessError("Only admins are allowed to create new file types.");
        }

        return this.typeRepository.create(data);
    }

    public async update(loggedUser: LoggedUser, id: ID, data: File) {
        if (loggedUser.role === UserRole.VIEWER) {
            throw new UnauthorizedAccessError("Viewers are not allowed to update files.");
        }

        const existingFile = await this.repository.findById(id);

        if (!existingFile) {
            throw new EntityNotFoundError("File", id);
        }

        existingFile.path = data.path;
        existingFile.filename = data.filename;
        existingFile.type = data.type;

        return this.repository.update(id, existingFile);
    }

    public async updateType(loggedUser: LoggedUser, id: ID, data: FileType) {
        if (loggedUser.role !== UserRole.ADMIN) {
            throw new UnauthorizedAccessError("Only admins are allowed to update file types.");
        }

        const existingType = await this.typeRepository.findById(id);

        if (!existingType) {
            throw new EntityNotFoundError("File Type", id);
        }

        existingType.name = data.name;
        existingType.extension = data.extension;
        existingType.mimeType = data.mimeType;

        return this.typeRepository.update(id, existingType);
    }

    public async delete(loggedUser: LoggedUser, id: string) {
        if (loggedUser.role === UserRole.VIEWER) {
            throw new UnauthorizedAccessError("Viewers are not allowed to remove files.");
        }

        return this.repository.delete(id);
    }

    public async deleteType(loggedUser: LoggedUser, id: string) {
        if (loggedUser.role !== UserRole.ADMIN) {
            throw new UnauthorizedAccessError("Only admins are allowed to remove file types.");
        }

        return this.typeRepository.delete(id);
    }

    public async store(id: ID, data: Readable) {
        const file = await this.repository.findById(id);

        if (!file) {
            throw new EntityNotFoundError("File", id);
        }

        const fullpath = `${file.path}/${file.filename}`;

        await this.changeState(id, FileState.UPLOADING);
        return this.storage.write(fullpath, data)
            .then(async () => {
                return this.changeState(id, FileState.AVAILABLE);
            })
            .catch(async (error) => {
                await this.changeState(id, FileState.CORRUPTED);
                throw new FileUploadingError(file.filename, error.message);
            });
    }

    public async retrieve(id: ID) {
        const file = await this.repository.findById(id);

        if (!file) {
            throw new EntityNotFoundError("File", id);
        }

        if (file.state !== FileState.AVAILABLE) {
            throw new FileNotAvailableError(file.filename);
        }

        const fullpath = `${file.path}/${file.filename}`;

        return this.storage.read(fullpath);
    }

    private async changeState(id: ID, state: FileState) {
        return this.repository.updateState(id, state);
    }
}