import { AuthUser, UserRole } from "@/types";
import { Role, User } from "@prisma/client";
export type UserWithRoles = User & {
    roles: Role[];
};
export declare function toAuthUser(user: UserWithRoles): AuthUser;
export declare function toPublicUser(user: UserWithRoles): {
    id: string;
    username: string;
    email: string;
    roles: UserRole[];
    createdAt: Date;
    updatedAt: Date;
};
//# sourceMappingURL=user.mapper.d.ts.map