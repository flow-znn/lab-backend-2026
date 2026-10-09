import { Request, Response } from "express";
import { ZodError } from "zod";
import { UserRole } from "@/types";
import { TicketService } from "@/services/ticket.service";

export class TicketController {
  private readonly ticketService = new TicketService();

  list = async (req: Request, res: Response): Promise<void> => {
    try {
      const isAdmin = req.user!.roles.includes(UserRole.ADMIN);
      res.status(200).json(await this.ticketService.list(req.user!.id, isAdmin));
    } catch {
      res.status(500).json({ message: "Não foi possível carregar os chamados." });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const isAdmin = req.user!.roles.includes(UserRole.ADMIN);
      const ticket = await this.ticketService.getById(req.params.id as string, req.user!.id, isAdmin);
      if (!ticket) {
        res.status(404).json({ message: "Chamado não encontrado." });
        return;
      }
      res.status(200).json(ticket);
    } catch {
      res.status(500).json({ message: "Não foi possível carregar o chamado." });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      res.status(201).json(await this.ticketService.create(req.body, req.user!.id));
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: error.issues[0]?.message ?? "Dados inválidos." });
        return;
      }
      res.status(500).json({ message: "Não foi possível abrir o chamado." });
    }
  };

  updateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      res.status(200).json(await this.ticketService.updateStatus(req.params.id as string, req.body));
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: error.issues[0]?.message ?? "Status inválido." });
        return;
      }
      res.status(404).json({ message: "Chamado não encontrado." });
    }
  };
}
