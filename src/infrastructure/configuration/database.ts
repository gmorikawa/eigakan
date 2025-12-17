import { Client } from "pg";
import { Environment } from "@infrastructure/configuration/environment.js";

async function createSchemas(client: Client) {
    await client.query("CREATE SCHEMA IF NOT EXISTS configuration;");
    await client.query("CREATE SCHEMA IF NOT EXISTS application;");
}

export async function initDatabase() {
    const client = new Client({
        host: Environment.DATABASE_HOST,
        port: Environment.DATABASE_PORT,
        user: Environment.DATABASE_USER,
        password: Environment.DATABASE_PASSWORD,
        database: Environment.DATABASE_NAME
    });

    await client.connect();
    await createSchemas(client);
    await client.end();
}