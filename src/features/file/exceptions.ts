export class FileUploadingError extends Error {
    constructor(filename: string, details?: string) {
        super(`An error occurred while uploading the file '${filename}': ${details ? ` - ${details}` : ""}`);
        this.name = "FileUploadingError";
    }
}

export class FileNotAvailableError extends Error {
    constructor(filename: string) {
        super(`The file '${filename}' is not available for retrieval.`);
        this.name = "FileNotAvailableError";
    }
}

export class ExtensionNotFoundError extends Error {
    constructor() {
        super("The file extension could not be determined.");
        this.name = "ExtensionNotFoundError";
    }
}

export class UnsupportedFileTypeError extends Error {
    constructor(extension: string) {
        super(`The file type with extension '${extension}' is not supported.`);
        this.name = "UnsupportedFileTypeError";
    }
}