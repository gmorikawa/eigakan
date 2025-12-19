import type { LoggedUser } from "@features/user/entity.js";
import type { Token } from "@features/authentication/token-generator.js";

export interface Credentials {
    username: string;
    password: string;
}

export interface Authentication {
    loggedUser: LoggedUser;
    token: Token;
}