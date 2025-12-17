import { Environment } from "@infrastructure/configuration/environment.js";
import type { DatabaseClient } from "@infrastructure/database/client.js";
import { PostgresClient } from "@infrastructure/database/postgres/client.js";
import { DependencyManager } from "@infrastructure/dependency-container/manager.js";

async function createSchemas(client: PostgresClient) {
    await client.query("CREATE SCHEMA IF NOT EXISTS configuration;");
    await client.query("CREATE SCHEMA IF NOT EXISTS application;");
}

export async function initDatabase() {
    const client = new PostgresClient(
        Environment.DATABASE_HOST,
        Environment.DATABASE_PORT,
        Environment.DATABASE_USER,
        Environment.DATABASE_PASSWORD,
        Environment.DATABASE_NAME
    );

    await client.connect();
    await createSchemas(client);
    // await client.disconnect();

    DependencyManager.use<DatabaseClient>("DatabaseClient", PostgresClient, client);
}