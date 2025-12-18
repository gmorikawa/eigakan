import { initDatabase } from "@application/configuration/database.js";
import { initMigrations } from "@application/configuration/migration.js";
import { initRoutes } from "@application/configuration/routes.js";
import type { DatabaseClient } from "@infrastructure/database/client.js";

import express from "express";
import { authentication } from "./middlewares/authentication.js";

export type Server = express.Application;

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
        this._app = express();

        this._app.use(authentication);
        this._app.use(express.json());
        this._app.use(express.urlencoded({ extended: true }));

        this._database = await initDatabase();
        await initMigrations(this._database);
        await initRoutes(this._app);

        const port = 3020;
        this._app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        });
    }
}