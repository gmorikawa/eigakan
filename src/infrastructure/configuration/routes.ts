import type Fastify from "fastify";

import { UserController } from "@application/rest/controllers/user-controller.js";
import { UserService } from "@features/user/service.js";
import { PostgresUserRepository } from "@infrastructure/repositories/user-repository.js";
import { Client } from "pg";
import { Environment } from "./environment.js";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function initRoutes(app: ReturnType<typeof Fastify>) {
    const client = new Client({
        host: Environment.DATABASE_HOST,
        port: Environment.DATABASE_PORT,
        user: Environment.DATABASE_USER,
        password: Environment.DATABASE_PASSWORD,
        database: Environment.DATABASE_NAME
    });

    const repository = new PostgresUserRepository(client);
    const service = new UserService(repository);
    const controller = new UserController(service);

    app.get("/api/users", async function (request: FastifyRequest, response: FastifyReply) {
        const users = await controller.getAll();
        response.send(JSON.stringify(users));
    });

    app.get("/api/users/:id", async function (request: FastifyRequest<{ Params: { id: string } }>, response: FastifyReply) {
        const user = await controller.getById(request.params.id);
        response.send(JSON.stringify(user));
    });

    app.post("/api/users", async function (request: FastifyRequest<{ Body: any }>, response: FastifyReply) {
        const newUser = await controller.create(request.body);
        response.send(JSON.stringify(newUser));
    });

    app.put("/api/users/:id", async function (request: FastifyRequest<{ Params: { id: string }; Body: any }>, response: FastifyReply) {
        const updatedUser = await controller.update(request.params.id, request.body);
        response.send(JSON.stringify(updatedUser));
    });

    app.delete("/api/users/:id", async function (request: FastifyRequest<{ Params: { id: string } }>, response: FastifyReply) {
        const result = await controller.delete(request.params.id);
        response.send(JSON.stringify({ success: result }));
    });
}
