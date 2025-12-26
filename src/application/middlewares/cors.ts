import { Environment } from "@application/configuration/environment.js";
import type { Request } from "@application/types/request.js";
import type { Response } from "@application/types/response.js";

export function cors(request: Request, response: Response, next: Function) {
    response.setHeader("Access-Control-Allow-Origin", Environment.WEB_CLIENT_URL);
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (request.method === "OPTIONS") {
        response.sendStatus(204);
    } else {
        next();
    }
}