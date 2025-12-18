export class AuthenticationError extends Error {
    constructor(username: string) {
        super(`Authentication failed for user: ${username}`);
        this.name = "AuthenticationError";
    }
}

export class UnauthorizedAccessError extends Error {
    constructor(details?: string) {
        super(`Unauthorized access${details ? ": " + details : ""}.`);
        this.name = "UnauthorizedAccessError";
    }
}