import type { FastifyRequest } from "fastify";

export type Request<T extends Object = any> = FastifyRequest<T>;