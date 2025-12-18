import type { Response } from "@application/types/response.js";
import type { Request } from "@application/types/request.js";

import type { DatabaseClient } from "@infrastructure/database/client.js";
import { PostgresUserRepository } from "@infrastructure/database/postgres/repositories/user-repository.js";
import { BcryptPasswordHasher } from "@infrastructure/password-hasher/bcrypt.js";

import { UserService } from "@features/user/service.js";

export class UserController {
    private service: UserService;

    constructor(database: DatabaseClient) {
        const passwordHasher = new BcryptPasswordHasher();
        const repository = new PostgresUserRepository(database);
        this.service = new UserService(repository, passwordHasher);
    }

    public async getAll(request: Request, response: Response) {
        const users = await this.service.getAll();

        response.send(JSON.stringify(users));
    }

    public async getById(request: Request, response: Response) {
        const { id } = request.params;

        const user = await this.service.getById(id);
        response.send(JSON.stringify(user));
    }

    public async create(request: Request, response: Response) {
        const loggedUser = request.user!;
        const user = request.body;

        const newUser = await this.service.create(loggedUser, user);
        response.send(JSON.stringify(newUser));
    }

    public async update(request: Request, response: Response) {
        const loggedUser = request.user!;
        const { id } = request.params;
        const user = request.body;

        const updatedUser = await this.service.update(loggedUser, id, user);
        response.send(JSON.stringify(updatedUser));
    }

    public async delete(request: Request, response: Response) {
        const loggedUser = request.user!;
        const { id } = request.params;

        const result = await this.service.delete(loggedUser, id);
        response.send(JSON.stringify({ success: result }));
    }
}