"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = exports.userSchema = void 0;
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
exports.userSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
class UserService {
    async getAllUsers(params) {
        const { page = 1, limit = 10 } = params;
        const skip = (page - 1) * limit || 0;
        const where = params.where ?
            {
                OR: Object.entries(params.where).map(([key, value]) => ({
                    [key]: { contains: value, mode: client_1.Prisma.QueryMode.insensitive },
                })),
            }
            : {};
        const orderBy = params.orderBy
            ? Object.entries(params.orderBy).map(([key, value]) => ({
                [key]: value === 'asc' ? 'asc' : 'desc',
            }))
            : { createdAt: 'desc' };
        const users = await prisma_1.default.user.findMany({
            skip,
            take: limit || 10,
            where,
            orderBy,
        });
        const usersWithoutPasswords = users.map(({ password, ...user }) => user);
        return usersWithoutPasswords;
    }
    async getUserById(id) {
        const user = await prisma_1.default.user.findUnique({
            where: { id },
        });
        return user;
    }
    async createUser(userData) {
        const parsedUserData = exports.userSchema.parse(userData);
        const newUser = await prisma_1.default.user.create({
            data: {
                ...parsedUserData,
                id: parsedUserData.id ?? (0, crypto_1.randomUUID)(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
        return newUser;
    }
    async updateUser(id, userData) {
        const updatedUser = await prisma_1.default.user.update({
            where: { id },
            data: {
                ...userData,
                updatedAt: new Date(),
            },
        });
        return updatedUser;
    }
    async deleteUser(id) {
        await prisma_1.default.user.delete({
            where: { id },
        });
        return true;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map