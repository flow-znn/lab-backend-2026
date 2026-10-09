"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketService = exports.updateTicketStatusSchema = exports.createTicketSchema = void 0;
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("@/lib/prisma"));
exports.createTicketSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(3, "O título deve ter ao menos 3 caracteres.").max(160, "O título deve ter no máximo 160 caracteres."),
    description: zod_1.z.string().trim().min(5, "A descrição deve ter ao menos 5 caracteres.").max(10000, "A descrição deve ter no máximo 10.000 caracteres."),
});
exports.updateTicketStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["OPEN", "IN_PROGRESS", "RESOLVED"]),
});
const ticketInclude = { owner: { select: { id: true, name: true, email: true } } };
class TicketService {
    list(userId, isAdmin) {
        return prisma_1.default.ticket.findMany({
            ...(isAdmin ? {} : { where: { ownerId: userId } }),
            include: ticketInclude,
            orderBy: { createdAt: "desc" },
        });
    }
    getById(id, userId, isAdmin) {
        return prisma_1.default.ticket.findFirst({
            where: { id, ...(isAdmin ? {} : { ownerId: userId }) },
            include: ticketInclude,
        });
    }
    create(input, userId) {
        const data = exports.createTicketSchema.parse(input);
        return prisma_1.default.ticket.create({ data: { ...data, ownerId: userId }, include: ticketInclude });
    }
    updateStatus(id, input) {
        const data = exports.updateTicketStatusSchema.parse(input);
        return prisma_1.default.ticket.update({ where: { id }, data, include: ticketInclude });
    }
}
exports.TicketService = TicketService;
//# sourceMappingURL=ticket.service.js.map