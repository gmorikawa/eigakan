import type { Response } from "@application/types/response.js";
import type { Request } from "@application/types/request.js";
import { Environment } from "@application/configuration/environment.js";

import type { DatabaseClient } from "@infrastructure/database/client.js";
import { BcryptPasswordHasher } from "@infrastructure/password-hasher/bcrypt.js";
import { JwtTokenGenerator } from "@infrastructure/token-generator/jwt.js";
import { PostgresUserRepository } from "@infrastructure/database/postgres/repositories/user-repository.js";

import { AuthService } from "@features/authentication/service.js";

export class AuthController {
    private authService: AuthService;

    constructor(database: DatabaseClient) {
        const repository = new PostgresUserRepository(database);
        const passwordHasher = new BcryptPasswordHasher();
        const tokenGenerator = new JwtTokenGenerator();
        this.authService = new AuthService(repository, passwordHasher, tokenGenerator);
    }

    public async firstAccess(request: Request, response: Response) {
        const user = request.body;

        const newUser = await this.authService.createAdminUser(user);
        response.send(JSON.stringify(newUser));
    }

    public async login(request: Request, response: Response) {
        const { username, password } = request.body;

        const secretKey = Environment.TOKEN_SECRET_KEY;

        const authentication = await this.authService.authenticate(username, password, secretKey);
        response.send(JSON.stringify(authentication));
    }
}