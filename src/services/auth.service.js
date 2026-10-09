"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = exports.changePasswordSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const password_1 = require("@/utils/password");
const user_mapper_1 = require("@/utils/user.mapper");
const jwt_1 = require("@/utils/jwt");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
});
exports.changePasswordSchema = zod_1.z.object({
    oldPassword: zod_1.z.string().min(6, "Old password must be at least 6 characters long"),
    newPassword: zod_1.z.string().min(6, "New password must be at least 6 characters long"),
});
class AuthService {
    async login(input) {
        const user = await prisma_1.default.user.findUnique({
            include: { roles: true },
            where: { email: input.email },
        });
        if (!user) {
            throw new Error("Invalid email or password");
        }
        const isPasswordValid = await (0, password_1.comparePasswords)(input.password, user.password);
        console.log("isPasswordValid:", isPasswordValid); // Log the result
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }
        const authUser = (0, user_mapper_1.toAuthUser)(user);
        const token = (0, jwt_1.signToken)(authUser);
        return { token, user };
    }
    async me(userId) {
        const user = await prisma_1.default.user.findUnique({
            include: { roles: true },
            where: { id: userId },
        });
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map