import type { ID } from "@shared/types/id.js";
import { EntityNotFoundError } from "@shared/errors.js";

import type { NewUser, User } from "@features/user/entity.js";
import type { UserRepository } from "@features/user/repository.js";
import { DuplicateEmailError } from "@features/user/exceptions.js";

export class UserService {
    constructor(
        private repository: UserRepository
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

    public async create(data: NewUser) {
        await this.ensureUsernameIsUnique(data.username);
        await this.ensureEmailIsUnique(data.email);

        return this.repository.create(data);
    }

    public async update(id: ID, data: User) {
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

    public async delete(id: string) {
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