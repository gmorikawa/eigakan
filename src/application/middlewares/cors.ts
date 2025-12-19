import { Environment } from "@application/configuration/environment.js";
import type { Request } from "@application/types/request.js";
import type { Response } from "@application/types/response.js";

export function cors(req: Request, res: Response, next: Function) {
    res.setHeader("Access-Control-Allow-Origin", Environment.WEB_CLIENT_URL);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        res.sendStatus(204);
    } else {
        next();
    }
}