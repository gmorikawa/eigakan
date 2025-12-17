import type { ID } from "@shared/types/id.js";
import type { UserRole, UserStatus } from "@features/user/enums.js";

export interface User {
    id: ID;
    username: string;
    password: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    fullname: string;
}

export type NewUser = Omit<User, "id">;