import type { ID } from "@shared/types/id.js";
import type { NewUser, User } from "./entity.js";

export interface UserRepository {
    getAll(): Promise<User[]>;
    getById(id: ID): Promise<User | null>;
    create(user: NewUser): Promise<User>;
    update(id: ID, user: User): Promise<User | null>;
    delete(id: ID): Promise<boolean>;
}