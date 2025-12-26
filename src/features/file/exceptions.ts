import { BusinessError } from "@shared/errors.js";

export class FileUploadingError extends BusinessError {
    constructor(filename: string, details?: string) {
        super(`An error occurred while uploading the file '${filename}': ${details ? ` - ${details}` : ""}`, 500);
        this.name = "FileUploadingError";
    }
}

export class FileNotAvailableError extends BusinessError {
    constructor(filename: string) {
        super(`The file '${filename}' is not available for retrieval.`, 404);
        this.name = "FileNotAvailableError";
    }
}

export class ExtensionNotFoundError extends BusinessError {
    constructor() {
        super("The file extension could not be determined.", 400);
        this.name = "ExtensionNotFoundError";
    }
}

export class UnsupportedFileTypeError extends BusinessError {
    constructor(extension: string) {
        super(`The file type with extension '${extension}' is not supported.`, 415);
        this.name = "UnsupportedFileTypeError";
    }
}