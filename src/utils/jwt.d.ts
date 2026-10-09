import { AuthUser, UserRole } from '../types/index';
export type JwtPayload = {
    sub: string;
    email: string;
    roles: UserRole[];
};
export declare function signToken(user: Pick<AuthUser, 'id' | 'email' | 'roles'>): string;
export declare function verifyToken(token: string): JwtPayload;
//# sourceMappingURL=jwt.d.ts.map