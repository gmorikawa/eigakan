import type { Request } from "@application/types/request.js";
import type { Response } from "@application/types/response.js";
import { Environment } from "@application/configuration/environment.js";

import { JwtTokenGenerator } from "@infrastructure/token-generator/jwt.js";

import type { Token } from "@features/authentication/token-generator.js";
import type { LoggedUser } from "@features/user/entity.js";
import { AuthenticationError } from "@features/authentication/exceptions.js";

const publicPaths = [
    "/api/auth/first-access",
    "/api/auth/login"
];

function extractTokenFromHeader(request: Request): Token | null {
    const authHeader = request.headers["authorization"];

    if (!authHeader) {
        return null;
    }

    return authHeader as Token;
}

function extractTokenFromParams(request: Request): Token | null {
    const tokenParam = request.query["auth_token"];

    if (!tokenParam) {
        return null;
    }

    return tokenParam as Token;
}

export async function authentication(request: Request, response: Response, next: Function) {
    if (publicPaths.includes(request.url)) {
        next();
        return;
    }

    const token = extractTokenFromHeader(request) ?? extractTokenFromParams(request);

    if (!token) {
        response.statusCode = 401;
        response.send(JSON.stringify({ error: "Unauthorized" }));
        return;
    }

    try {
        const secretKey = Environment.TOKEN_SECRET_KEY;
        const tokenGenerator = new JwtTokenGenerator();
        const payload = await tokenGenerator.verify<LoggedUser>(token, secretKey);
        request.user = payload;
    } catch (error) {
        throw new AuthenticationError("Invalid or expired token");
    }

    next();
}