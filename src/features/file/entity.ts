import type { ID } from "@shared/types/id.js";

import type { FileState } from "@features/file/enums.js";

export interface FileType {
    id: ID;
    name: string;
    extension: Extension;
    mimeType: MimeType;
}

export interface File {
    id: ID;
    path: Path;
    filename: string;
    type: FileType;
    state: FileState;
}

export type NewFileType = Omit<FileType, "id">;
export type NewFile = Omit<File, "id">;
export type Extension = string;
export type MimeType = string;
export type Path = string;
