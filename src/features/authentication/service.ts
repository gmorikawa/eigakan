import type { PasswordHasher } from "@features/authentication/password-hasher.js";
import type { SecretKey, TokenGenerator } from "@features/authentication/token-generator.js";
import { AuthenticationError } from "@features/authentication/exceptions.js";

import type { UserRepository } from "@features/user/repository.js";
import type { LoggedUser, NewUser } from "@features/user/entity.js";
import { UserRole, UserStatus } from "@features/user/enums.js";

export class AuthService {
    constructor(
        private userRepository: UserRepository,
        private passwordHasher: PasswordHasher,
        private tokenGenerator: TokenGenerator
    ) { }

    public async createAdminUser(user: NewUser) {
        user.role = UserRole.ADMIN;
        user.status = UserStatus.ACTIVE;

        return this.userRepository.create(user);
    }

    public async authenticate(username: string, password: string, secretKey: SecretKey) {
        const user = await this.userRepository.findByUsername(username);

        if (!user) {
            throw new AuthenticationError(username);
        }

        const isPasswordValid = await this.passwordHasher.compare(password, user.password);

        if (!isPasswordValid) {
            throw new AuthenticationError(username);
        }

        const loggedUser: LoggedUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            status: user.status,
            fullname: user.fullname
        };

        const token = await this.tokenGenerator.issue<LoggedUser>(loggedUser, secretKey, "7d");

        return { loggedUser, token };
    }
}