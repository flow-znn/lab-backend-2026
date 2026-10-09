"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketController = void 0;
const zod_1 = require("zod");
const types_1 = require("@/types");
const ticket_service_1 = require("@/services/ticket.service");
class TicketController {
    ticketService = new ticket_service_1.TicketService();
    list = async (req, res) => {
        try {
            const isAdmin = req.user.roles.includes(types_1.UserRole.ADMIN);
            res.status(200).json(await this.ticketService.list(req.user.id, isAdmin));
        }
        catch {
            res.status(500).json({ message: "Não foi possível carregar os chamados." });
        }
    };
    getById = async (req, res) => {
        try {
            const isAdmin = req.user.roles.includes(types_1.UserRole.ADMIN);
            const ticket = await this.ticketService.getById(req.params.id, req.user.id, isAdmin);
            if (!ticket) {
                res.status(404).json({ message: "Chamado não encontrado." });
                return;
            }
            res.status(200).json(ticket);
        }
        catch {
            res.status(500).json({ message: "Não foi possível carregar o chamado." });
        }
    };
    create = async (req, res) => {
        try {
            res.status(201).json(await this.ticketService.create(req.body, req.user.id));
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(400).json({ message: error.issues[0]?.message ?? "Dados inválidos." });
                return;
            }
            res.status(500).json({ message: "Não foi possível abrir o chamado." });
        }
    };
    updateStatus = async (req, res) => {
        try {
            res.status(200).json(await this.ticketService.updateStatus(req.params.id, req.body));
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(400).json({ message: error.issues[0]?.message ?? "Status inválido." });
                return;
            }
            res.status(404).json({ message: "Chamado não encontrado." });
        }
    };
}
exports.TicketController = TicketController;
//# sourceMappingURL=ticket.controller.js.map