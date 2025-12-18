import type { ID } from "@shared/types/id.js";
import { EntityNotFoundError } from "@shared/errors.js";

import type { PasswordHasher } from "@features/authentication/password-hasher.js";
import type { LoggedUser, NewUser, User } from "@features/user/entity.js";
import type { UserRepository } from "@features/user/repository.js";
import { UnauthorizedAccessError } from "@features/authentication/exceptions.js";
import { UserRole } from "@features/user/enums.js";
import { DuplicateEmailError } from "@features/user/exceptions.js";

export class UserService {
    constructor(
        private repository: UserRepository,
        private passwordHasher: PasswordHasher,
    ) { }

    public async getAll() {
        return this.repository.findAll();
    }

    public async getById(id: ID) {
        return this.repository.findById(id);
    }

    public async getByUsername(username: string) {
        return this.repository.findByUsername(username);
    }

    public async getByEmail(email: string) {
        return this.repository.findByEmail(email);
    }

    public async create(loggedUser: LoggedUser, data: NewUser) {
        if (loggedUser.role !== UserRole.ADMIN) {
            throw new UnauthorizedAccessError("Only admin users can create new users.");
        }

        await this.ensureUsernameIsUnique(data.username);
        await this.ensureEmailIsUnique(data.email);

        data.password = await this.passwordHasher.hash(data.password);

        return this.repository.create(data);
    }

    public async update(loggedUser: LoggedUser, id: ID, data: User) {
        if (loggedUser.role !== UserRole.ADMIN && loggedUser.id !== id) {
            throw new UnauthorizedAccessError("It is not allowed to update other users' information.");
        }

        await this.ensureUsernameIsUnique(data.username);
        await this.ensureEmailIsUnique(data.email);

        const existingUser = await this.repository.findById(id);

        if (!existingUser) {
            throw new EntityNotFoundError("User", id);
        }

        existingUser.fullname = data.fullname;
        existingUser.email = data.email;

        return this.repository.update(id, existingUser);
    }

    public async delete(loggedUser: LoggedUser, id: string) {
        if (loggedUser.role !== UserRole.ADMIN && loggedUser.id !== id) {
            throw new UnauthorizedAccessError("It is not allowed to update other users' information.");
        }

        return this.repository.delete(id);
    }

    private async ensureEmailIsUnique(email: string) {
        const existingUser = await this.repository.findByEmail(email);

        if (existingUser) {
            throw new DuplicateEmailError(email);
        }
    }

    private async ensureUsernameIsUnique(username: string) {
        const existingUser = await this.repository.findByUsername(username);

        if (existingUser) {
            throw new DuplicateEmailError(username);
        }
    }
}