export class DuplicateUsernameError extends Error {
    constructor(username: string) {
        super(`Username ${username} is already in use.`);
        this.name = "DuplicateUsernameError";
    }
}

export class DuplicateEmailError extends Error {
    constructor(email: string) {
        super(`Email ${email} is already in use.`);
        this.name = "DuplicateEmailError";
    }
}
