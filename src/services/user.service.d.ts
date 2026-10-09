import { z } from "zod";
export declare const userSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, z.core.$strip>;
export type User = z.infer<typeof userSchema>;
export declare class UserService {
    getAllUsers(params: {
        page?: number;
        limit?: number;
        where?: Partial<User>;
        orderBy?: {
            [key: string]: 'asc' | 'desc';
        };
    }): Promise<any>;
    getUserById(id: string): Promise<User | null>;
    createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
    updateUser(id: string, userData: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>): Promise<User | null>;
    deleteUser(id: string): Promise<boolean>;
}
//# sourceMappingURL=user.service.d.ts.map