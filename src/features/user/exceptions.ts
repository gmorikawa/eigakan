import { BusinessError } from "@shared/errors.js";

export class DuplicateUsernameError extends BusinessError {
    constructor(username: string) {
        super(`Username ${username} is already in use.`, 409);
        this.name = "DuplicateUsernameError";
    }
}

export class DuplicateEmailError extends BusinessError {
    constructor(email: string) {
        super(`Email ${email} is already in use.`, 409);
        this.name = "DuplicateEmailError";
    }
}
