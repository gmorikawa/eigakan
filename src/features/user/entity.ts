import type { UUID } from "@shared/types/uuid.js";
import type { UserRole, UserStatus } from "@features/user/enums.js";

export interface User {
    id: UUID;
    username: string;
    password: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    fullname: string;
}