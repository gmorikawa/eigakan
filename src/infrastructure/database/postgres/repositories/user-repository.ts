import type { ID } from "@shared/types/id.js";

import type { NewUser, User } from "@features/user/entity.js";
import type { UserRepository } from "@features/user/repository.js";

import type { UserRole, UserStatus } from "@features/user/enums.js";
import type { DatabaseClient } from "@infrastructure/database/client.js";

export class PostgresUserRepository implements UserRepository {
    constructor(
        private readonly client: DatabaseClient
    ) { }

    public async findAll(): Promise<User[]> {
        const query = "SELECT * FROM application.users;";

        return this.client.query(query)
            .then((values: any[]) => {
                return values.map((value) => this.mapToEntity(value));
            });
    }

    public async findById(id: ID): Promise<User | null> {
        const query = "SELECT * FROM application.users WHERE id = $1;";
        const params = [id];

        return this.client.query(query, params)
            .then((values: any[]) => {
                const user = values?.shift();
                return user ? this.mapToEntity(user) : null;
            });
    }

    public async findByUsername(username: string, excludeIds?: ID[]): Promise<User | null> {
        const query = excludeIds && excludeIds.length > 0
            ? `SELECT * FROM application.users WHERE username = $1 AND id NOT IN (${excludeIds.map((id, index) => `$${index + 2}`).join(", ")});`
            : "SELECT * FROM application.users WHERE username = $1;";
        const params = [username, ...(excludeIds || [])];

        return this.client.query(query, params)
            .then((values: any[]) => {
                const user = values?.shift();
                return user ? this.mapToEntity(user) : null;
            });
    }

    public async findByEmail(email: string, excludeIds?: ID[]): Promise<User | null> {
        const query = excludeIds && excludeIds.length > 0
            ? `SELECT * FROM application.users WHERE email = $1 AND id NOT IN (${excludeIds.map((id, index) => `$${index + 2}`).join(", ")});`
            : "SELECT * FROM application.users WHERE email = $1;";
        const params = [email, ...(excludeIds || [])];

        return this.client.query(query, params)
            .then((values: any[]) => {
                const user = values?.shift();
                return user ? this.mapToEntity(user) : null;
            });
    }

    public async create(user: NewUser): Promise<User> {
        const query = "INSERT INTO application.users (username, password, email, role, status, fullname) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
        const params = [user.username, user.password, user.email, user.role as UserRole, user.status as UserStatus, user.fullname];

        return this.client.query(query, params)
            .then((value: any) => {
                return value?.shift() as User;
            });
    }

    public async update(id: ID, user: Partial<NewUser>): Promise<User | null> {
        const query = "UPDATE application.users SET username = $1, password = $2, email = $3, role = $4, status = $5, fullname = $6 WHERE id = $7 RETURNING *";
        const params = [user.username, user.password, user.email, user.role as UserRole, user.status as UserStatus, user.fullname, id];

        return this.client.query(query, params)
            .then((value: any) => {
                return value?.shift() as User;
            });
    }

    public async delete(id: ID): Promise<boolean> {
        const query = "DELETE FROM application.users WHERE id = $1;";
        const params = [id];

        return this.client.query(query, params)
            .then(() => true)
            .catch(() => false);
    }

    private mapToEntity(user: any): User {
        return {
            id: user.id,
            username: user.username,
            password: user.password,
            email: user.email,
            role: user.role as UserRole,
            status: user.status as UserStatus,
            fullname: user.fullname
        };
    }
}