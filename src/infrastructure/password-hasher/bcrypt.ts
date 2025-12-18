import bcrypt from "bcryptjs";

import type { PasswordHasher } from "@features/authentication/password-hasher.js";

export class BcryptPasswordHasher implements PasswordHasher {
    public async hash(password: string): Promise<string> { 
        return bcrypt.genSalt(10)
            .then((salt: string) => bcrypt.hash(password, salt));
    }

    public async compare(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}