import { z } from "zod";
import { UserWithRoles } from "@/utils/user.mapper";
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const changePasswordSchema: z.ZodObject<{
    oldPassword: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strip>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export declare class AuthService {
    login(input: LoginInput): Promise<{
        token: string;
        user: UserWithRoles;
    }>;
    me(userId: string): Promise<UserWithRoles | null>;
}
//# sourceMappingURL=auth.service.d.ts.map