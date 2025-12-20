import type { ID } from "@shared/types/id.js";
import type { Repository } from "@shared/repository.js";

import type { NewFile, File, FileType, NewFileType } from "@features/file/entity.js";
import type { Path } from "@features/file/entity.js";

export interface FileRepository extends Repository<ID, File, NewFile> {
    findByFilePath(filepath: Path, excludeIds?: ID[]): Promise<File | null>;
    updateState(id: ID, state: string): Promise<File>;
}

export interface FileTypeRepository extends Repository<ID, FileType, NewFileType> {
    findByExtension(extension: string, excludeIds?: ID[]): Promise<FileType | null>;
}