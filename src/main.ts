import Fastify from "fastify";
import type { FastifyRequest, FastifyReply } from "fastify";
import type { Server } from "@/shared/types/server.js";

import { UserController } from "@application/rest/controllers/user-controller.js";
import { UserService } from "@features/user/service.js";
import { PostgresUserRepository } from "@infrastructure/repositories/user-repository.js";

import { initDatabase } from "@infrastructure/configuration/database.js";
import { initMigrations } from "@infrastructure/configuration/migration.js";
import { initRoutes } from "@infrastructure/configuration/routes.js";

class FastifyServer implements Server {
    async run(): Promise<void> {
        const app = Fastify({
            logger: true
        });

        await initDatabase();
        await initMigrations();
        await initRoutes(app);

        app.listen({ port: 3020 }, function (err, address) {
            if (err) {
                app.log.error(err);
                process.exit(1);
            }
        });
    }
}

const server = new FastifyServer();
server.run();