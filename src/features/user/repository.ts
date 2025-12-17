import type { ID } from "@shared/types/id.js";
import type { NewUser, User } from "./entity.js";
import type { Repository } from "@shared/repository.js";

export interface UserRepository extends Repository<ID, User, NewUser> {
    findByUsername(username: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
}