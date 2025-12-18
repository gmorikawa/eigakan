import type { PasswordHasher } from "@features/authentication/password-hasher.js";
import type { SecretKey, TokenGenerator } from "@features/authentication/token-generator.js";
import { AuthenticationError } from "@features/authentication/exceptions.js";

import type { UserService } from "@features/user/service.js";
import type { LoggedUser } from "@features/user/entity.js";

export class AuthService {
    constructor(
        private userService: UserService,
        private passwordHasher: PasswordHasher,
        private tokenGenerator: TokenGenerator
    ) { }

    public async authenticate(username: string, password: string, secretKey: SecretKey) {
        const user = await this.userService.getByUsername(username);

        if (!user) {
            throw new AuthenticationError("Invalid username or password");
        }

        const isPasswordValid = await this.passwordHasher.compare(password, user.password);

        if (!isPasswordValid) {
            throw new AuthenticationError("Invalid username or password");
        }

        const loggedUser: LoggedUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            status: user.status,
            fullname: user.fullname
        };

        return this.tokenGenerator.issue<LoggedUser>(loggedUser, secretKey, "7d");
    }
}