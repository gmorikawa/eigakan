import "dotenv/config";
console.info("Environment variables loaded from .env file");

export const Environment = Object.freeze({
    TOKEN_SECRET_KEY: process.env.TOKEN_SECRET_KEY ?? "",

    WEB_CLIENT_URL: process.env.WEB_CLIENT_URL ?? "*",

    DATABASE_ADAPTER: process.env.DATABASE_ADAPTER ?? "postgres",
    DATABASE_HOST: process.env.DATABASE_HOST ?? "localhost",
    DATABASE_PORT: Number(process.env.DATABASE_PORT) ?? 3010,
    DATABASE_USER: process.env.DATABASE_USER ?? "",
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD ?? "",
    DATABASE_NAME: process.env.DATABASE_NAME ?? ""
});
