import fs from "node:fs";
import path from "node:path";
import { Client } from "pg";
import { Environment } from "./environment.js";

const basePath = path.resolve(import.meta.dirname, "../database/postgres/migrations");

async function executeMigration(client: Client, migrationName: string) {
    const sql = fs.readFileSync(path.resolve(basePath, migrationName), 'utf8');

    const number = parseInt(migrationName.substring(0, 6));
    const name = migrationName.substring(7, migrationName.length - 4);

    const result = await client.query("SELECT * FROM configuration.migrations WHERE number = $1;", [number]);

    if (result.rows.length > 0) {
        return;
    }

    await client.query(sql);
    await client.query("INSERT INTO configuration.migrations (number, name) VALUES ($1, $2);", [number, name]);
}

async function createMigrationsTable(client: Client) {
    return client.query("CREATE TABLE IF NOT EXISTS configuration.migrations (number INT PRIMARY KEY, name TEXT NOT NULL, executed_at TIMESTAMP NOT NULL DEFAULT NOW());");
}

export async function initMigrations() {
    const migrations = fs.readdirSync(basePath);

    const client = new Client({
        host: Environment.DATABASE_HOST,
        port: Environment.DATABASE_PORT,
        user: Environment.DATABASE_USER,
        password: Environment.DATABASE_PASSWORD,
        database: Environment.DATABASE_NAME
    });

    await client.connect();

    await createMigrationsTable(client);

    for (const migration of migrations) {
        await executeMigration(client, migration);
    }

    await client.end();
}