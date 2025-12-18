export class AuthenticationError extends Error {
    constructor(username: string) {
        super(`Username ${username} is already in use.`);
        this.name = "AuthenticationError";
    }
}