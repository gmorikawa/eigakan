import jwt from "jsonwebtoken";

import type { ExpireDate, SecretKey, Token, TokenGenerator } from "@features/authentication/token-generator.js";

export class JwtTokenGenerator implements TokenGenerator {

    public async issue<Payload extends Object>(payload: Payload, secretKey: SecretKey, expiresIn?: ExpireDate): Promise<string> {
        return jwt.sign(payload, secretKey, { expiresIn });
    }

    public async verify<Payload extends Object>(token: Token, secretKey: SecretKey): Promise<Payload> {
        return jwt.verify(token, secretKey) as Payload;
    }

}