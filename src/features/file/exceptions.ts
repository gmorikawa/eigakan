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