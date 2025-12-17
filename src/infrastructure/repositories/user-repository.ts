import { Client } from "pg";

import type { ID } from "@shared/types/id.js";

import type { NewUser, User } from "@features/user/entity.js";
import type { UserRepository } from "@features/user/repository.js";

import type { UserRole, UserStatus } from "@features/user/enums.js";

export class PostgresUserRepository implements UserRepository {

    constructor(
        private readonly client: Client
    ) { }

    public async getAll(): Promise<User[]> {
        return [];
    }

    public async getById(id: ID): Promise<User | null> {
        return null;
    }

    public async create(user: NewUser): Promise<User> {
        return {} as User;
    }

    public async update(id: ID, user: Partial<NewUser>): Promise<User | null> {
        return null;
    }

    public async delete(id: ID): Promise<boolean> {
        return false;
    }

    // private mapToEntity(user: any): User {
    // }
}