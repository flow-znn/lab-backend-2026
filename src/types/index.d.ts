export declare enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER",
    GUEST = "GUEST"
}
export declare const USER_ROLE_VALUES: [UserRole.ADMIN, ...UserRole[]];
export type AuthUser = {
    id: string;
    username: string;
    email: string;
    roles: UserRole[];
};
declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}
export declare class AppError extends Error {
    readonly statusCode: number;
    constructor(message: string, statusCode: number);
}
export declare function hasRole(user: Pick<AuthUser, 'roles'> | undefined, role: UserRole): boolean;
export declare function hasAnyRole(user: Pick<AuthUser, 'roles'> | undefined, roles: UserRole[]): boolean;
//# sourceMappingURL=index.d.ts.map