import { initDatabase } from "@application/configuration/database.js";
import { initMigrations } from "@application/configuration/migration.js";
import { initRoutes } from "@application/configuration/routes.js";
import type { DatabaseClient } from "@infrastructure/database/client.js";

import Fastify from "fastify";

export type Server = Fastify.FastifyInstance;

export class Application {
    private static _app: Server;
    private static _database: DatabaseClient;

    public static get app(): Server {
        return this._app;
    }

    public static get database(): DatabaseClient {
        return this._database;
    }

    static async run(): Promise<void> {
        this._app = Fastify({
            logger: true
        });

        this._database = await initDatabase();
        await initMigrations(this._database);
        await initRoutes(this._app);

        this._app.listen({ port: 3020 }, (err, address) => {
            if (err) {
                this._app.log.error(err);
                process.exit(1);
            }
        });
    }
}