import { BusinessError } from "@shared/errors.js";

export class AuthenticationError extends BusinessError {
    constructor(username: string) {
        super(`Authentication failed for user: ${username}`, 401);
        this.name = "AuthenticationError";
    }
}

export class UnauthorizedAccessError extends BusinessError {
    constructor(details?: string) {
        super(`Unauthorized access${details ? ": " + details : ""}.`, 403);
        this.name = "UnauthorizedAccessError";
    }
}